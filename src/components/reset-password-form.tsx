'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle,
  Loader2,
  KeyRound,
  CheckCircle,
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

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const formSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const newPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
type FormValues = z.infer<typeof formSchema>;
type NewPasswordValues = z.infer<typeof newPasswordSchema>;
type ResetPayload = { password: string; token: string };
type ResetResponse = { ok: boolean; message?: string };

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const newPasswordForm = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const onSubmitRequest = (values: ResetPasswordValues) => {
    setError(null);
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate checking if user exists
      const USERS_STORAGE_KEY = 'agrivision-users';
      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      
      const userExists = storedUsers.some((user: any) => 
        user.email && values.email && user.email.toLowerCase() === values.email.toLowerCase()
      );
      
      if (userExists) {
        // In a real app, we would send a password reset email
        // For this demo, we'll just proceed to the next step
        setEmail(values.email);
        setStep('reset');
      } else {
        setError('No account found with this email address.');
      }
    });
  };

  const onSubmitNewPassword = (values: NewPasswordValues) => {
    setError(null);
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update password in localStorage
      const USERS_STORAGE_KEY = 'agrivision-users';
      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      
      const updatedUsers = storedUsers.map((user: any) => {
        if (user.email && email && user.email.toLowerCase() === email.toLowerCase()) {
          return { ...user, password: values.password };
        }
        return user;
      });
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 2000);
    });
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been reset successfully. Redirecting to login...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-center text-muted-foreground">
              You will be redirected to the login page shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {step === 'request' ? 'Reset Password' : 'Set New Password'}
        </CardTitle>
        <CardDescription>
          {step === 'request' 
            ? 'Enter your email address and we will send you a link to reset your password.'
            : 'Enter your new password below.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'request' ? (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onSubmitRequest)} className="space-y-4">
              <FormField
                control={resetForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
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
                  'Send Reset Link'
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                <Button 
                  variant="link" 
                  onClick={() => router.push('/login')}
                  className="p-0 h-auto"
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...newPasswordForm}>
            <form onSubmit={newPasswordForm.handleSubmit(onSubmitNewPassword)} className="space-y-4">
              <FormField
                control={newPasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={newPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
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
                  <KeyRound className="mr-2" />
                )}
                Reset Password
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}