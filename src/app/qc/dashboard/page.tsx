
'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  List,
  Mail,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

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

import { useState, useEffect, useContext } from 'react';
import { SampleContext } from '@/context/sample-context';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

type User = {
  firstName: string;
  lastName: string;
  role: string;
};


const mockQcActivity = [
    { id: 1, action: 'Approved', target: 'HC-005', timestamp: new Date(new Date().setDate(new Date().getDate() - 1))},
    { id: 2, action: 'Rejected', target: 'HC-004', timestamp: new Date(new Date().setHours(new Date().getHours() - 3))},
    { id: 3, action: 'Approved', target: 'HC-001', timestamp: new Date(new Date().setHours(new Date().getHours() - 8))},
]

export default function QCDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const { samples } = useContext(SampleContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const qcSamples = samples.filter(s => s.status === 'Pending Review' || s.qcReview?.agentId === 'USR-Q01');
  const pending = isClient ? samples.filter(s => s.status === 'Pending Review').length : 0;
  
  const approvedToday = isClient ? samples.filter(s => 
    s.status === 'Approved' && 
    s.qcReview?.agentId === 'USR-Q01' && 
    new Date(s.qcReview?.timestamp || 0).toDateString() === new Date().toDateString()
  ).length : 0;

  const rejectedToday = isClient ? samples.filter(s => 
    s.status === 'Rejected' && 
    s.qcReview?.agentId === 'USR-Q01' && 
    new Date(s.qcReview?.timestamp || 0).toDateString() === new Date().toDateString()
  ).length : 0;
  
  const flagged = 0; // Placeholder for future flagging feature

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
              {isClient && user ? `Here's a summary of your activity as a ${formatRole(user.role)}.` : "Here's a summary of your review activity."}
            </p>
          </div>
           <Button asChild>
            <Link href="/qc/collections">
                <List className="mr-2" />
                Go to Review Queue
            </Link>
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Your Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                    <Activity className="h-8 w-8 mb-2 text-amber-600" />
                    {isClient ? <p className="text-2xl font-bold">{pending}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-amber-700 dark:text-amber-400">Pending Review</p>
                </div>
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-100 dark:bg-green-900/50">
                    <CheckCircle2 className="h-8 w-8 mb-2 text-green-600" />
                    {isClient ? <p className="text-2xl font-bold">{approvedToday}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-green-700 dark:text-green-400">Approved Today</p>
                </div>
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-red-100 dark:bg-red-900/50">
                    <XCircle className="h-8 w-8 mb-2 text-red-600" />
                    {isClient ? <p className="text-2xl font-bold">{rejectedToday}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-red-700 dark:text-red-400">Rejected Today</p>
                </div>
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary">
                    <AlertTriangle className="h-8 w-8 mb-2 text-primary" />
                    {isClient ? <p className="text-2xl font-bold">{flagged}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-muted-foreground">Flagged</p>
                </div>
            </CardContent>
           </Card>

        <div className="grid gap-4 md:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                A log of your most recent decisions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Target Sample</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isClient ? mockQcActivity.map((activity) => (
                    <TableRow key={activity.id}>
                        <TableCell>
                            <Badge variant={activity.action === 'Approved' ? 'default' : 'destructive'}>{activity.action}</Badge>
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
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                    Updates on farmer appeals and admin messages.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                        <Mail className="h-12 w-12 mx-auto mb-4" />
                        <p>No new notifications.</p>
                    </div>
                </CardContent>
             </Card>
        </div>
      </main>
    </div>
  );
}

    