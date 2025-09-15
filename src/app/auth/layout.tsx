import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              AgriVision
            </span>
          </Link>
        </div>
      </header>
      <main className="-mt-20 flex flex-1 items-center justify-center">
        <div className="container w-full max-w-md px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
