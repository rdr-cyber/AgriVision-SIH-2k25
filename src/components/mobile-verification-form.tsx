'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle,
  Loader2,
  Smartphone,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const verificationSchema = z.object({
  contact: z.string().min(1, 'Please enter your email or mobile number'),
  method: z.enum(['email', 'mobile'], {
    required_error: 'Please select a verification method',
  }),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

export function MobileVerificationForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      contact: '',
      method: 'email',
    },
  });

  const onSubmit = (values: VerificationFormValues) => {
    setError(null);
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate sending verification code
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // In a real app, we would send the OTP to the user's email or mobile
      console.log(`Sending OTP ${otp} to ${values.contact} via ${values.method}`);
      
      // For demo purposes, we'll redirect to the OTP verification page
      const params = new URLSearchParams({
        contact: values.contact,
        method: values.method,
        otp,
      });
      
      setVerificationSent(true);
      // Redirect to OTP verification page after a short delay
      setTimeout(() => {
        router.push(`/verify-otp?${params.toString()}`);
      }, 1500);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Verify Your Account</CardTitle>
        <CardDescription>
          Choose how you'd like to receive your verification code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {verificationSent ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-center text-muted-foreground">
              Sending verification code...
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Verification Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="email" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center">
                            <Mail className="mr-2 h-4 w-4" />
                            Email Verification
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="mobile" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center">
                            <Smartphone className="mr-2 h-4 w-4" />
                            SMS Verification
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch('method') === 'email' ? 'Email Address' : 'Mobile Number'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={form.watch('method') === 'email' ? 'email' : 'tel'}
                        placeholder={form.watch('method') === 'email' ? 'name@example.com' : '+1 (555) 123-4567'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}