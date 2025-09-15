'use client';

import { AgriVisionLogo } from '@/components/agrivision-logo';
import { AgriVisionLogoLarge } from '@/components/agrivision-logo-large';

export default function LogoTestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <h1 className="text-3xl font-bold">Logo Test Page</h1>
      
      <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold">Standard Logo</h2>
        <AgriVisionLogo className="h-16 w-16 text-primary" />
        <p>Standard AgriVision Logo</p>
      </div>
      
      <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold">Large Logo</h2>
        <AgriVisionLogoLarge className="h-32 w-32" />
        <p>Large AgriVision Logo</p>
      </div>
      
      <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold">Colored Logos</h2>
        <div className="flex gap-4">
          <AgriVisionLogo className="h-12 w-12 text-red-500" />
          <AgriVisionLogo className="h-12 w-12 text-green-500" />
          <AgriVisionLogo className="h-12 w-12 text-blue-500" />
        </div>
        <p>Logos with different colors</p>
      </div>
    </div>
  );
}