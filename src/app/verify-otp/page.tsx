'use client';

import { OtpForm } from '@/components/otp-form';
import { Suspense } from 'react';

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpForm />
    </Suspense>
  );
}