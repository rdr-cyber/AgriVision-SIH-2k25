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
  MessageCircle,
  Leaf,
  ShoppingCart,
  BarChart2,
  Users,
  BookOpen,
  Gift,
  Zap,
  Truck,
  CreditCard
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
import type { User } from '@/lib/types';

const USERS_STORAGE_KEY = 'agrivision-users';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const { samples } = useContext(SampleContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const storedUserRaw = localStorage.getItem('user');
        if (storedUserRaw) {
          const storedUser: { firstName: string, lastName: string, role: User['role']} = JSON.parse(storedUserRaw);
          const allUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
          const users: User[] = allUsersRaw ? JSON.parse(allUsersRaw) : [];
          
          const fullCurrentUser = users.find(u => 
              u.firstName === storedUser.firstName && 
              u.lastName === storedUser.lastName &&
              u.role === storedUser.role
          );
          if (fullCurrentUser) {
            setUser(fullCurrentUser);
          }
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, []);

  const farmerSamples = user
    ? samples.filter((s) => s.collectorId === user.id)
    : [];
    
  const totalSubmissions = farmerSamples.length;
  const approved = farmerSamples.filter((s) => s.status === 'Approved' || s.status === 'Batched').length;
  const rejected = farmerSamples.filter((s) => s.status === 'Rejected').length;
  const pending = farmerSamples.filter(
    (s) => s.status === 'Pending Review'
  ).length;

  const formatRole = (role: string) => {
    if (!role) return '';
    if (role === 'qc') return 'QC Agent';
    if (role === 'manufacturer') return 'Manufacturer';
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  // Get role-specific dashboard links
  const getRoleDashboardLinks = () => {
    switch (user?.role) {
      case 'farmer':
        return [
          { href: '/dashboard/upload', label: 'Upload Sample', icon: UploadCloud },
          { href: '/dashboard/collections', label: 'My Collections', icon: List },
          { href: '/dashboard/earnings', label: 'Check Earnings', icon: DollarSign },
          { href: '/dashboard/rewards', label: 'Rewards Program', icon: Gift },
          { href: '/dashboard/disease-detection', label: 'Disease Detection', icon: Leaf },
          { href: '/dashboard/iot-monitoring', label: 'IoT Monitoring', icon: Zap },
          { href: '/dashboard/chat', label: 'Team Chat', icon: MessageCircle },
        ];
      case 'consumer':
        return [
          { href: '/dashboard/search', label: 'Search Products', icon: FlaskConical },
          { href: '/dashboard/marketplace', label: 'Marketplace', icon: ShoppingCart },
          { href: '/dashboard/cart', label: 'Shopping Cart', icon: ShoppingCart },
          { href: '/dashboard/purchases', label: 'My Purchases', icon: DollarSign },
          { href: '/dashboard/tracking', label: 'Track Batch', icon: Activity },
          { href: '/dashboard/forum', label: 'Community Forum', icon: Users },
        ];
      case 'qc':
        return [
          { href: '/dashboard/qc-dashboard', label: 'QC Dashboard', icon: FlaskConical },
          { href: '/dashboard/reports', label: 'Advanced Reports', icon: BarChart2 },
          { href: '/qc/collections', label: 'Review Samples', icon: List },
          { href: '/dashboard/chat', label: 'Team Chat', icon: MessageCircle },
          { href: '/dashboard/forum', label: 'Community Forum', icon: Users },
          { href: '/dashboard/docs', label: 'Documentation', icon: BookOpen },
        ];
      case 'manufacturer':
        return [
          { href: '/dashboard/batches', label: 'Batch Management', icon: List },
          { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
          { href: '/manufacturer/collections', label: 'Approved Samples', icon: FlaskConical },
          { href: '/dashboard/supply-chain', label: 'Supply Chain', icon: Truck },
          { href: '/dashboard/chat', label: 'Team Chat', icon: MessageCircle },
          { href: '/dashboard/docs', label: 'Documentation', icon: BookOpen },
        ];
      case 'admin':
        return [
          { href: '/admin/users', label: 'User Management', icon: Users },
          { href: '/admin/collections', label: 'All Collections', icon: List },
          { href: '/admin/review', label: 'QC Review', icon: FlaskConical },
          { href: '/admin/batches', label: 'Batch Management', icon: List },
          { href: '/admin/analytics', label: 'System Analytics', icon: BarChart2 },
          { href: '/dashboard/financial-services', label: 'Financial Services', icon: CreditCard },
        ];
      default:
        return [
          { href: '/dashboard/upload', label: 'Upload Sample', icon: UploadCloud },
          { href: '/dashboard/collections', label: 'My Collections', icon: List },
          { href: '/dashboard/earnings', label: 'Check Earnings', icon: DollarSign },
        ];
    }
  };

  const roleDashboardLinks = getRoleDashboardLinks();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {isClient ? user?.firstName || '...' : '...'}!
            </h1>
            <p className="text-muted-foreground">
              {isClient && user ? `Here's a summary of your activity as a ${formatRole(user.role)}.` : "Here's a summary of your activity."}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {roleDashboardLinks.slice(0, 3).map((link, index) => (
                <Button asChild key={index} size="lg" variant={index === 0 ? "default" : "secondary"}>
                  <Link href={link.href}>
                    <link.icon className="mr-2" />
                    {link.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Additional Tools</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {roleDashboardLinks.slice(3).map((link, index) => (
                <Button asChild key={index} size="lg" variant="secondary">
                  <Link href={link.href}>
                    <link.icon className="mr-2" />
                    {link.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
           <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Submission Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary">
                    <FlaskConical className="h-8 w-8 mb-2 text-primary" />
                    {isClient ? <p className="text-2xl font-bold">{totalSubmissions}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-muted-foreground">Total</p>
                </div>
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-100 dark:bg-green-900/50">
                    <CheckCircle2 className="h-8 w-8 mb-2 text-green-600" />
                    {isClient ? <p className="text-2xl font-bold">{approved}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-green-700 dark:text-green-400">Approved</p>
                </div>
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-red-100 dark:bg-red-900/50">
                    <XCircle className="h-8 w-8 mb-2 text-red-600" />
                    {isClient ? <p className="text-2xl font-bold">{rejected}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-red-700 dark:text-red-400">Rejected</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                    <Activity className="h-8 w-8 mb-2 text-amber-600" />
                    {isClient ? <p className="text-2xl font-bold">{pending}</p> : <Skeleton className="h-8 w-8" />}
                    <p className="text-sm text-amber-700 dark:text-amber-400">Pending</p>
                </div>
            </CardContent>
           </Card>

        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>
                Discover all the tools available to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Team Chat</p>
                    <p className="text-xs text-muted-foreground">Communicate with other users</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Knowledge Base</p>
                    <p className="text-xs text-muted-foreground">Learn about herb cultivation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Advanced Analytics</p>
                    <p className="text-xs text-muted-foreground">Detailed reporting tools</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Sustainability Impact</p>
                    <p className="text-xs text-muted-foreground">Track environmental benefits</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">IoT Monitoring</p>
                    <p className="text-xs text-muted-foreground">Smart farming sensors</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Supply Chain</p>
                    <p className="text-xs text-muted-foreground">Track batches in real-time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>
                  A log of your most recent herb samples.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/collections">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample</TableHead>
                    <TableHead className="hidden md:table-cell">Species (AI)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Quality Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isClient ? farmerSamples.slice(0, 3).map((sample) => (
                    <TableRow key={sample.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Image
                            src={sample.imageUrl}
                            alt={sample.aiResult?.species || 'Herb sample'}
                            width={48}
                            height={48}
                            className="rounded-md object-cover"
                            data-ai-hint={sample.imageHint}
                          />
                          <div className="font-medium text-sm">{sample.id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {sample.aiResult?.species || 'N/A'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            sample.status === 'Approved' &&
                              'border-green-600 bg-green-100 text-green-700 dark:border-green-500/60 dark:bg-green-900/50 dark:text-green-400',
                            sample.status === 'Pending Review' &&
                              'border-amber-600 bg-amber-100 text-amber-700 dark:border-amber-500/60 dark:bg-amber-900/50 dark:text-amber-400',
                            sample.status === 'Rejected' &&
                              'border-red-600 bg-red-100 text-red-700 dark:border-red-500/60 dark:bg-red-900/50 dark:text-red-400',
                            sample.status === 'Batched' &&
                              'border-blue-600 bg-blue-100 text-blue-700 dark:border-blue-500/60 dark:bg-blue-900/50 dark:text-blue-400'
                          )}
                        >
                          {sample.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {sample.aiResult?.qualityScore || 'N/A'}
                      </TableCell>
                    </TableRow>
                  )) : (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell className="flex items-center gap-4">
                           <Skeleton className="h-12 w-12 rounded-md" />
                           <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-6 w-20 mx-auto" />
                        </TableCell>
                         <TableCell className="text-right hidden md:table-cell">
                           <Skeleton className="h-4 w-12 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-6 md:px-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>AgriVision Platform v1.0</p>
          <p className="mt-1">Developed by Team 404 Not Found for Smart India Hackathon 2025</p>
        </div>
      </footer>
    </div>
  );
}