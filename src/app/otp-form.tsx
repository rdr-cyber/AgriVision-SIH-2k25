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
  Mail,
  Smartphone,
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

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

export function OtpForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const simulatedOtp = searchParams.get('otp');
  const contact = searchParams.get('contact');
  const method = searchParams.get('method');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const role = searchParams.get('role');

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
        if (firstName && lastName && role) {
          // Original flow from login
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
            case 'farmer':
              router.push('/dashboard');
              break;
            case 'consumer':
              router.push('/consumer/dashboard');
              break;
            default:
              router.push('/dashboard');
              break;
          }
        } else {
          // Check if we have temporary user data
          const tempUserRaw = localStorage.getItem('tempUser');
          if (tempUserRaw) {
            const tempUser = JSON.parse(tempUserRaw);
            localStorage.setItem('user', JSON.stringify(tempUser));
            localStorage.removeItem('tempUser'); // Clean up temporary data
            
            // Redirect based on user role
            switch(tempUser.role) {
              case 'admin':
                router.push('/admin/dashboard');
                break;
              case 'qc':
                router.push('/qc/dashboard');
                break;
              case 'manufacturer':
                router.push('/manufacturer/dashboard');
                break;
              case 'farmer':
                router.push('/dashboard');
                break;
              case 'consumer':
                router.push('/consumer/dashboard');
                break;
              default:
                router.push('/dashboard');
                break;
            }
          } else {
            // New flow from mobile verification
            // For demo purposes, redirect to consumer dashboard
            // In a real app, you would determine the user's role
            router.push('/consumer/dashboard');
          }
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    });
  };

  const handleResend = () => {
    // In a real app, you would resend the OTP
    // For demo, we'll just show an alert
    alert(`OTP resent to ${contact || 'your email'}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Verify Your Account</CardTitle>
        <CardDescription className="flex items-center">
          {method === 'mobile' ? (
            <>
              <Smartphone className="mr-2 h-4 w-4" />
              SMS code sent to {contact}
            </>
          ) : contact ? (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Verification code sent to {contact}
            </>
          ) : firstName && lastName ? (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Verification code sent to your email
            </>
          ) : (
            <>
              <KeyRound className="mr-2 h-4 w-4" />
              Enter verification code
            </>
          )}
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
                  <FormLabel>Verification Code</FormLabel>
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
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn&apos;t receive a code? Check your spam folder or request again.</p>
              <Button variant="link" className="p-0 h-auto" onClick={handleResend}>
                Resend Code
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}