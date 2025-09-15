'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowRight } from 'lucide-react';
import { AgriVisionLogo } from '@/components/agrivision-logo';
import { AgriVisionLogoLarge } from '@/components/agrivision-logo-large';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [year, setYear] = useState(new Date().getFullYear());
  const router = useRouter();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const clearAllUserData = () => {
    // Clear all user-related data from localStorage
    const keysToRemove = [
      'user',
      'tempUser',
      'agrivision-users',
      'agrivision-samples',
      'agrivision-chat',
      'agrivision-notifications'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Show confirmation
    alert('All user data has been cleared successfully!');
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <AgriVisionLogo className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            AgriVision
          </span>
        </Link>
        <Button onClick={clearAllUserData} variant="outline" size="sm">
          Clear All User Data
        </Button>
      </header>
      <main className="flex-1">
        <section className="relative py-20 md:py-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 top-0 h-full w-full bg-background"
          >
            <Image
              src="https://picsum.photos/seed/herb-bg/1920/1080"
              alt="Background image of lush herbs"
              fill
              className="object-cover opacity-10"
              data-ai-hint="herb background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <AgriVisionLogoLarge className="h-24 w-24 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground">
              Trust in Every Leaf
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              AI-Powered Quality Analysis & Blockchain Traceability for the
              Global Herb Supply Chain.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="py-20 md:py-24 bg-card border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-headline">How It Works</h2>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                A simple, transparent, and secure process from farm to pharmacy.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-secondary mx-auto">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">1. Upload Sample</h3>
                <p className="mt-1 text-muted-foreground">
                  Collectors upload herb photos with geotags for provenance.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-secondary mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="m10 13-1.5 1.5 1.5 1.5" />
                    <path d="m14 13 1.5 1.5-1.5 1.5" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">2. AI Analysis</h3>
                <p className="mt-1 text-muted-foreground">
                  Our model identifies species and assesses quality instantly.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-secondary mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M21 7.5v2.9A5.8 5.8 0 0 1 18.2 16a5.8 5.8 0 0 1-5.7-5.6" />
                    <path d="M12 16v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" />
                    <path d="M21 12.8V7.5L14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4.5" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M4 12h6" />
                    <path d="M4 16h6" />
                    <path d="M4 8h2" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  3. Blockchain Anchor
                </h3>
                <p className="mt-1 text-muted-foreground">
                  A tamper-proof record of the analysis is secured on-chain.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-secondary mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M3 3h2l.4 2M7 13h10" />
                    <path d="M18.8 3.5a2.5 2.5 0 0 1 0 3.5l-8.4 8.4a2.5 2.5 0 0 1-3.5 0l-.4-.4a2.5 2.5 0 0 1 0-3.5l8.4-8.4a2.5 2.5 0 0 1 3.5 0Z" />
                    <path d="M12.5 6.5 6.5 12.5" />
                    <path d="m14 17-5-5" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">4. Consumer Scan</h3>
                <p className="mt-1 text-muted-foreground">
                  Scan a QR code on the final product to view its full journey.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; {year} AgriVision. All rights reserved.</p>
          <p className="mt-2 text-sm">Developed by Team 404 Not Found</p>
        </div>
      </footer>
    </div>
  );
}