
'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle,
  Loader2,
  KeyRound,
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
import { Alert, AlertDescription } from './ui/alert';

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});


export function OtpForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const simulatedOtp = searchParams.get('otp');

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = (values: z.infer<typeof otpSchema>) => {
    setError(null);
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (values.otp === simulatedOtp) {
        // Store user details in localStorage
        const firstName = searchParams.get('firstName');
        const lastName = searchParams.get('lastName');
        const role = searchParams.get('role');
        if (firstName && lastName && role) {
          localStorage.setItem('user', JSON.stringify({ firstName, lastName, role }));
          
          switch(role) {
            case 'admin':
              router.push('/admin/dashboard');
              break;
            case 'qc':
              router.push('/qc/dashboard');
              break;
            case 'manufacturer':
              router.push('/manufacturer/dashboard');
              break;
            default:
              router.push('/dashboard');
              break;
          }

        } else {
           // This case handles registration flow where we don't pass user details in URL
           router.push('/login?registered=true');
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Verify Your Account</CardTitle>
        <CardDescription>
          An OTP has been sent to your email. Please enter it below. (Hint: it's {simulatedOtp})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••"
                      {...field}
                      maxLength={6}
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <KeyRound className="mr-2" />
              )}
              Verify
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
