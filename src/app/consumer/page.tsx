'use client';

import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Package,
  Search,
  ShoppingCart,
  Leaf,
  Award,
  BarChart2,
  MessageCircle,
  BookOpen
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

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { useCart } from '@/context/cart-context';

const USERS_STORAGE_KEY = 'agrivision-users';

export default function ConsumerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { getTotalItems } = useCart();

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

  // Mock data for consumer dashboard
  const recentPurchases = [
    {
      id: 'BATCH-001',
      productName: 'Organic Turmeric Powder',
      manufacturer: 'MediLeaf Pharmaceuticals',
      date: '2025-09-10',
      status: 'Delivered',
    },
    {
      id: 'BATCH-002',
      productName: 'Ashwagandha Capsules',
      manufacturer: 'Herbal Wellness Co.',
      date: '2025-09-05',
      status: 'In Transit',
    },
    {
      id: 'BATCH-003',
      productName: 'Triphala Tablets',
      manufacturer: 'Ayurveda Naturals',
      date: '2025-09-01',
      status: 'Processing',
    },
  ];

  const cartItemsCount = getTotalItems();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {isClient ? user?.firstName || 'Consumer' : 'Consumer'}!
            </h1>
            <p className="text-muted-foreground">
              Explore, purchase, and track authentic herbal products.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button asChild size="lg">
                <Link href="/consumer/marketplace">
                  <ShoppingCart className="mr-2" />
                  Marketplace
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/consumer/search">
                  <Search className="mr-2" />
                  Search Products
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/consumer/cart">
                  <ShoppingCart className="mr-2" />
                  Shopping Cart {cartItemsCount > 0 && (
                    <Badge className="ml-2">{cartItemsCount}</Badge>
                  )}
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Additional Tools</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/consumer/purchases">
                  <ShoppingCart className="mr-2" />
                  My Purchases
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/consumer/tracking">
                  <Eye className="mr-2" />
                  Track Batch
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/dashboard/forum">
                  <MessageCircle className="mr-2" />
                  Community Forum
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Product Verification</CardTitle>
              <CardDescription>
                Scan QR codes or enter batch IDs to verify product authenticity
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="bg-muted rounded-lg p-8 w-full max-w-md">
                <div className="flex flex-col items-center gap-4">
                  <Package className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Verify Product Authenticity</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Enter a batch ID or scan a QR code to verify the authenticity of your herbal product
                  </p>
                  <div className="w-full flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter batch ID"
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                    />
                    <Button>Verify</Button>
                  </div>
                </div>
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
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Sustainability Impact</p>
                    <p className="text-xs text-muted-foreground">Track environmental benefits</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Knowledge Base</p>
                    <p className="text-xs text-muted-foreground">Learn about herbs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Product Analytics</p>
                    <p className="text-xs text-muted-foreground">View detailed reports</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Certifications</p>
                    <p className="text-xs text-muted-foreground">Verified quality standards</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent Purchases</CardTitle>
                <CardDescription>
                  Your most recent herbal product purchases
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/purchases">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.id}</TableCell>
                      <TableCell>{purchase.productName}</TableCell>
                      <TableCell>{purchase.manufacturer}</TableCell>
                      <TableCell className="hidden md:table-cell">{purchase.date}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            purchase.status === 'Delivered' &&
                              'border-green-600 bg-green-100 text-green-700 dark:border-green-500/60 dark:bg-green-900/50 dark:text-green-400',
                            purchase.status === 'In Transit' &&
                              'border-blue-600 bg-blue-100 text-blue-700 dark:border-blue-500/60 dark:bg-blue-900/50 dark:text-blue-400',
                            purchase.status === 'Processing' &&
                              'border-amber-600 bg-amber-100 text-amber-700 dark:border-amber-500/60 dark:bg-amber-900/50 dark:text-amber-400'
                          )}
                        >
                          {purchase.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}