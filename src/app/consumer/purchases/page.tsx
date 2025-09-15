'use client';

import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ConsumerPurchasesPage() {
  // Mock data for purchases
  const purchases = [
    {
      id: 'ORDER-001',
      date: '2025-09-10',
      total: 49.98,
      status: 'Delivered',
      items: [
        {
          id: 'BATCH-001',
          name: 'Organic Turmeric Powder',
          quantity: 1,
          price: 24.99,
        },
        {
          id: 'BATCH-002',
          name: 'Ashwagandha Capsules',
          quantity: 1,
          price: 19.99,
        },
      ],
    },
    {
      id: 'ORDER-002',
      date: '2025-09-05',
      total: 29.99,
      status: 'In Transit',
      items: [
        {
          id: 'BATCH-003',
          name: 'Brahmi Oil',
          quantity: 1,
          price: 29.99,
        },
      ],
    },
    {
      id: 'ORDER-003',
      date: '2025-09-01',
      total: 16.99,
      status: 'Processing',
      items: [
        {
          id: 'BATCH-004',
          name: 'Triphala Tablets',
          quantity: 1,
          price: 16.99,
        },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Transit':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'Processing':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'default';
      case 'In Transit':
        return 'secondary';
      case 'Processing':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Purchases</h1>
        <p className="text-muted-foreground">
          View your order history and track shipments
        </p>
      </div>

      <div className="grid gap-6">
        {purchases.map((purchase) => (
          <Card key={purchase.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order #{purchase.id}
                  </CardTitle>
                  <CardDescription>Placed on {purchase.date}</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusVariant(purchase.status)} className="flex items-center gap-1">
                    {getStatusIcon(purchase.status)}
                    {purchase.status}
                  </Badge>
                  <p className="text-lg font-bold">${purchase.total.toFixed(2)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Batch ID</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}