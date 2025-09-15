
'use client';

import { useState, useTransition, useEffect, useContext } from 'react';
import Image from 'next/image';
import {
  FlaskConical,
  UploadCloud,
  Loader2,
  CheckCircle,
  AlertTriangle,
  FileImage,
  MapPin,
  FileText,
  Weight,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  analyzeHerbSample,
  type AnalyzeHerbSampleOutput,
} from '@/ai/flows/ai-species-and-quality-analysis';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SampleContext } from '@/context/sample-context';
import type { HerbSample, User } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/mock-data';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const formSchema = z.object({
  herbImage: z
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  notes: z.string().optional(),
  quantity: z.coerce.number().positive('Quantity must be positive.'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export function SampleUploadForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeHerbSampleOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { addSample } = useContext(SampleContext);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        notes: "",
        quantity: 10,
        latitude: 0,
        longitude: 0,
    }
  });

   useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        const allUsers = localStorage.getItem('agrivision-users');
        if (storedUser && allUsers) {
            const user: {firstName: string, lastName: string, role: string} = JSON.parse(storedUser);
            const usersList: User[] = JSON.parse(allUsers);
            const fullUser = usersList.find(u => 
                u.firstName === user.firstName && 
                u.lastName === user.lastName && 
                u.role === user.role
            );
            if (fullUser) {
                setCurrentUser(fullUser);
            }
        }
    }
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude);
          form.setValue('longitude', position.coords.longitude);
        },
        () => {
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description:
              'Could not fetch location. Please enter manually.',
          });
        }
      );
    }
  }, [form, toast]);


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setResult(null);

    const file = data.herbImage[0];
    if (!file || !currentUser) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not identify the current user. Please log in again.'
        });
        return;
    }

    startTransition(async () => {
      try {
        toast({ title: 'Syncing...', description: 'Uploading image to server.' });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        toast({ title: 'Syncing...', description: 'Queued for AI analysis.' });
        const photoDataUri = await toDataURL(file);
        const analysisResult = await analyzeHerbSample({ photoDataUri });
        setResult(analysisResult);
        
        toast({ title: 'Syncing...', description: 'AI analysis complete. Awaiting review.' });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const newSample: HerbSample = {
          id: `HC-${String(Date.now()).slice(-5)}`,
          collectorId: currentUser.id,
          collectorName: `${currentUser.firstName} ${currentUser.lastName}`,
          timestamp: new Date().toISOString(),
          latitude: data.latitude,
          longitude: data.longitude,
          imageUrl: photoDataUri,
          imageHint: analysisResult.species.split(' ')[0],
          notes: data.notes,
          quantity: data.quantity,
          status: 'Pending Review',
          aiResult: analysisResult,
        };

        addSample(newSample);

        toast({
          title: 'Submission Complete',
          description: 'Your sample is now pending review by a QC agent.',
          variant: 'default',
        });
        
        form.reset({ notes: "", quantity: 10, herbImage: undefined, latitude: form.getValues('latitude'), longitude: form.getValues('longitude') });
        setPreview(null);
        const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
      } catch (e) {
        console.error(e);
        setError('An error occurred during analysis. Please try again.');
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: 'An error occurred during analysis. Please try again.'
        });
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      form.setValue('herbImage', event.target.files, { shouldValidate: true });
      form.clearErrors('herbImage');
    } else {
      setPreview(null);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="herbImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Herb Image (Required)</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted"
                    >
                      {preview ? (
                        <Image
                          src={preview}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="object-contain h-full w-full p-2"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, or WEBP (MAX. 5MB)
                          </p>
                        </div>
                      )}
                      <Input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        onChange={handleFileChange}
                        // Omit `field` props to handle file input manually
                      />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="grid md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2"><Weight/>Approx. Quantity (grams)</FormLabel>
                    <FormControl>
                    <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-2">
                 <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><MapPin/>Latitude</FormLabel>
                        <FormControl>
                        <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                        <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>

        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
            <FormItem>
                <FormLabel className="flex items-center gap-2"><FileText/>Notes (Optional)</FormLabel>
                <FormControl>
                <Textarea placeholder="e.g. Found in a shady area, strong aroma." {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />


          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FlaskConical className="mr-2 h-4 w-4" />
            )}
            Submit for Analysis
          </Button>
        </form>
      </Form>

      {isPending && (
        <div className="w-full text-center mt-6">
          <p className="text-muted-foreground animate-pulse">
            Syncing submission...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {result && !isPending && (
        <Card className="mt-6 bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-primary" />
              Analysis Complete (Awaiting Review)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-lg">{result.species}</p>
              <p className="text-sm text-muted-foreground">Identified Species</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-lg">
                  {(result.confidence * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <Progress
                  value={result.confidence * 100}
                  className="h-2 mt-1"
                />
              </div>
              <div>
                <p className="font-semibold text-lg">{result.qualityScore}/100</p>
                <p className="text-sm text-muted-foreground">Quality Score</p>
                <Progress value={result.qualityScore} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
