import { AuthForm } from '@/components/auth-form';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm mode="login" />
    </Suspense>
  );
}