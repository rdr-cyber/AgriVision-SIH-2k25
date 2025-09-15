
'use client';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  FlaskConical,
  List,
  UploadCloud,
  XCircle,
  Users,
  Shield,
  Boxes,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';
import { useState, useEffect, useContext } from 'react';
import { SampleContext } from '@/context/sample-context';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

type User = {
  firstName: string;
  lastName: string;
  role: string;
};

const mockActivity = [
    { id: 1, action: 'QC Approval', actor: 'QC Dave', target: 'HC-005', timestamp: new Date(new Date().setDate(new Date().getDate() - 1))},
    { id: 2, action: 'User Suspended', actor: 'Admin', target: 'USR-F03', timestamp: new Date(new Date().setHours(new Date().getHours() - 3))},
    { id: 3, action: 'New Submission', actor: 'Alice', target: 'HC-003', timestamp: new Date(new Date().setHours(new Date().getHours() - 8))},
    { id: 4, action: 'Batch Created', actor: 'MediLeaf', target: 'B-2024-00123', timestamp: new Date(new Date().setDate(new Date().getDate() - 1))},
    { id: 5, action: 'QC Rejection', actor: 'QC Dave', target: 'HC-004', timestamp: new Date(new Date().setDate(new Date().getDate() - 2))},
]

export default function AdminDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
               {isClient && user ? `Here's an overview of the system from your ${formatRole(user.role)} account.` : "Here's an overview of the entire AgriVision system."}
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
                <Link href="/admin/users">
                  <Users className="mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/admin/review">
                  <Shield className="mr-2" />
                  Review Collections
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/admin/batches">
                  <Boxes className="mr-2" />
                  Audit Batches
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
                    <Users className="h-8 w-8 mb-2 text-primary" />
                    {isClient ? <p className="text-2xl font-bold">6</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary">
                    <FlaskConical className="h-8 w-8 mb-2 text-primary" />
                    {isClient ? <p className="text-2xl font-bold">5</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-muted-foreground">Total Collections</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                    <Activity className="h-8 w-8 mb-2 text-amber-600" />
                    {isClient ? <p className="text-2xl font-bold">2</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-amber-700 dark:text-amber-400">Pending Review</p>
                </div>
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <LinkIcon className="h-8 w-8 mb-2 text-blue-600" />
                    {isClient ? <p className="text-2xl font-bold">1</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-blue-700 dark:text-blue-400">Anchors</p>
                </div>
            </CardContent>
           </Card>

        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                A log of the most recent system-wide actions.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/logs">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isClient ? mockActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                        <Badge variant={
                            activity.action.includes('Approval') ? 'default' : 
                            activity.action.includes('Reject') || activity.action.includes('Suspend') ? 'destructive' :
                            'secondary'
                        }>{activity.action}</Badge>
                    </TableCell>
                    <TableCell>
                      {activity.actor}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.target}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                )) : (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                       <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

    