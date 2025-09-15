'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle,
  Loader2,
  LogIn,
  UserPlus,
  CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from './ui/alert';
import type { User } from '@/lib/types';

const authSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['consumer', 'farmer', 'qc', 'manufacturer', 'admin'], {
    required_error: 'You must select a role.',
  }),
});

type AuthFormValues = z.infer<typeof authSchema>;

type AuthFormProps = {
  mode: 'login' | 'register';
};

const USERS_STORAGE_KEY = 'agrivision-users';

// Initialize with default users if no users exist
const initializeUsers = () => {    
    if (typeof window !== 'undefined') {
        const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
        if (!storedUsersRaw) {
            const defaultUsers: User[] = [
              {
                id: 'USR-A01',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@agrivision.co',
                password: 'password123',
                role: 'admin',
                status: 'active',
                createdAt: new Date().toISOString()
              },
              {
                id: 'USR-M01',
                firstName: 'MediLeaf',
                lastName: 'Pharmaceuticals',
                email: 'contact@medileaf.co',
                password: 'password123',
                role: 'manufacturer',
                status: 'active',
                createdAt: new Date().toISOString()
              },
               {
                id: 'USR-Q01',
                firstName: 'QC',
                lastName: 'Dave',
                email: 'dave@qlabs.co',
                password: 'password123',
                role: 'qc',
                status: 'active',
                createdAt: new Date().toISOString(),
              },
               {
                id: 'USR-F01',
                firstName: 'Alice',
                lastName: 'Farmer',
                email: 'alice@farm.co',
                password: 'password123',
                role: 'farmer',
                status: 'active',
                createdAt: new Date().toISOString(),
              },
               {
                id: 'USR-F02',
                firstName: 'Bob',
                lastName: 'Fields',
                email: 'bob@fields.co',
                password: 'password123',
                role: 'farmer',
                status: 'active',
                createdAt: new Date().toISOString(),
              },
               {
                id: 'USR-F03',
                firstName: 'Charlie',
                lastName: 'Cultivator',
                email: 'charlie@cultivator.co',
                password: 'password123',
                role: 'farmer',
                status: 'active',
                createdAt: new Date().toISOString(),
              }
            ];
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
        }
    }
};

export function AuthForm({ mode }: AuthFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const isLogin = mode === 'login';
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    setIsClient(true);
    initializeUsers();
    if (searchParams.get('registered') === 'true') {
      setShowSuccess(true);
    }
  }, [searchParams]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { 
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '', 
        role: 'consumer' 
    },
  });
  
  const onSubmit = (values: AuthFormValues) => {
    setError(null);
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!isClient) return;

      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      if (isLogin) {
        // Handle forgot password flow
        if (showForgotPassword) {
          const user = storedUsers.find(user => 
            user.email && values.email && user.email.toLowerCase() === values.email.toLowerCase()
          );
          
          if (user) {
            // In a real app, we would send an email with a reset link
            // For this demo, we'll just show a success message
            setShowSuccess(true);
            setError(null);
            // Reset form
            form.reset();
            // Hide forgot password form after 3 seconds
            setTimeout(() => {
              setShowForgotPassword(false);
              setShowSuccess(false);
            }, 3000);
          } else {
            setError('No account found with this email address.');
          }
          return;
        }
        
        // Normal login flow
        const user = storedUsers.find(user => 
            user.email && values.email && user.email.toLowerCase() === values.email.toLowerCase() &&
            user.firstName && values.firstName && user.firstName.toLowerCase() === values.firstName.toLowerCase() &&
            user.lastName && values.lastName && user.lastName.toLowerCase() === values.lastName.toLowerCase() &&
            user.password === values.password &&
            user.role === values.role
        );

        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const params = new URLSearchParams({
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              otp,
            });
            router.push(`/verify-otp?${params.toString()}`);
        } else {
          setError('Invalid credentials. Please check all fields and try again.');
        }

      } else { // Register
        const userAlreadyExists = storedUsers.some(user => user.email.toLowerCase() === values.email.toLowerCase());
        
        if (userAlreadyExists) {
          setError('A user with this email address already exists.');
          return;
        }

        const newUser: User = {
          ...values,
          id: `USR-${Date.now().toString().slice(-6)}`,
          status: 'active',
          createdAt: new Date().toISOString()
        }

        const newUsers = [...storedUsers, newUser];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
        router.push('/login?registered=true');
      }
    });
  };

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? 'Enter your credentials to access your dashboard.'
              : 'Fill out the form to get started.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {showForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create an Account'}
        </CardTitle>
        <CardDescription>
          {showForgotPassword 
            ? 'Enter your email address and we will send you a link to reset your password.'
            : isLogin
              ? 'Enter your credentials to access your dashboard.'
              : 'Fill out the form to get started.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showSuccess && !isLogin && (
          <Alert className="mb-4 border-green-500 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-950 dark:text-green-300">
            <CheckCircle className="h-4 w-4 !text-green-500" />
            <AlertDescription>
              Registration successful! Please sign in to continue.
            </AlertDescription>
          </Alert>
        )}
        {showSuccess && isLogin && showForgotPassword && (
          <Alert className="mb-4 border-green-500 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-950 dark:text-green-300">
            <CheckCircle className="h-4 w-4 !text-green-500" />
            <AlertDescription>
              If an account exists with this email, we have sent password reset instructions.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!showForgotPassword && (
              <div className="grid grid-cols-2 gap-4">
                  <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                          <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                          <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
              </div>
            )}
            
            <FormField
              control={form.control}
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
            
            {!showForgotPassword && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a...</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="consumer">Consumer</SelectItem>
                          <SelectItem value="farmer">Farmer / Collector</SelectItem>
                          <SelectItem value="qc">QC Agent</SelectItem>
                          <SelectItem value="manufacturer">Manufacturer / Aggregator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : showForgotPassword ? (
                'Send Reset Link'
              ) : isLogin ? (
                <LogIn className="mr-2" />
              ) : (
                <UserPlus className="mr-2" />
              )}
              {showForgotPassword ? '' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? (
            showForgotPassword ? (
              <>
                Remember your password?{' '}
                <Button variant="link" onClick={() => setShowForgotPassword(false)}>
                  Sign In
                </Button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Button variant="link" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
                {' | '}
                <Button variant="link" onClick={() => setShowForgotPassword(true)}>
                  Forgot Password?
                </Button>
              </>
            )
          ) : (
            <>
              Already have an account?{' '}
              <Button variant="link" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}