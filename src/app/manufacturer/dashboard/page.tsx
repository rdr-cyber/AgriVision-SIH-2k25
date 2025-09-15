'use client';
import {
  Activity,
  CreditCard,
  FlaskConical,
  Boxes,
  Link as LinkIcon,
  PackagePlus,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useState, useEffect, useContext } from 'react';
import { SampleContext } from '@/context/sample-context';
import { Skeleton } from '@/components/ui/skeleton';
import { mockBatches } from '@/lib/mock-data';

type User = {
  firstName: string;
  lastName: string;
  role: string;
};

export default function ManufacturerDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { samples } = useContext(SampleContext);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const approvedCollections = samples.filter(s => s.status === 'Approved').length;
  const totalBatches = mockBatches.length;
  const pendingAudits = 0; // Hardcoded for now
  const anchorsSubmitted = mockBatches.filter(b => b.blockchainAnchor).length;

  const formatRole = (role: string) => {
    if (!role) return '';
    if (role === 'qc') return 'QC Agent';
    if (role === 'manufacturer') return 'Manufacturer';
    return role.charAt(0).toUpperCase() + role.slice(1);
  }


  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
               Welcome back, {isClient ? user?.firstName || '...' : '...'}!
            </h1>
            <p className="text-muted-foreground">
              {isClient && user ? `Here's an overview of your activity as a ${formatRole(user.role)}.` : "Here's an overview of your production activities."}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button asChild size="lg">
                <Link href="/manufacturer/collections">
                  <PackagePlus className="mr-2" />
                  Create New Batch
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/manufacturer/batches">
                  <Boxes className="mr-2" />
                  View All Batches
                </Link>
              </Button>
            </CardContent>
          </Card>
           <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>System Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary">
                    <FlaskConical className="h-8 w-8 mb-2 text-primary" />
                    {isClient ? <p className="text-2xl font-bold">{approvedCollections}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-muted-foreground">Approved Collections</p>
                </div>
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary">
                    <Boxes className="h-8 w-8 mb-2 text-primary" />
                    {isClient ? <p className="text-2xl font-bold">{totalBatches}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-muted-foreground">Total Batches</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                    <Activity className="h-8 w-8 mb-2 text-amber-600" />
                    {isClient ? <p className="text-2xl font-bold">{pendingAudits}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-amber-700 dark:text-amber-400">Pending Audits</p>
                </div>
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <LinkIcon className="h-8 w-8 mb-2 text-blue-600" />
                    {isClient ? <p className="text-2xl font-bold">{anchorsSubmitted}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-blue-700 dark:text-blue-400">Anchors</p>
                </div>
            </CardContent>
           </Card>

        </div>

      </main>
    </div>
  );
}