'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  MapPin, 
  Weight,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for batch details
const mockBatch = {
  id: "BATCH-001",
  status: "Completed",
  createdAt: "2023-06-15",
  completedAt: "2023-06-18",
  totalSamples: 24,
  approvedSamples: 20,
  rejectedSamples: 2,
  pendingSamples: 2,
  location: "Farm A, Sector 7, Delhi",
  weight: "120 kg",
  notes: "Batch processed with high quality standards"
};

export default function BatchDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [batch, setBatch] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setBatch(mockBatch);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
      case 'Pending Review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400';
    }
  };

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/batches')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{batch.id}</h1>
          <p className="text-muted-foreground">
            Detailed view of your batch processing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch Overview</CardTitle>
              <CardDescription>
                Summary of batch processing information
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Batch ID</p>
                <p className="text-xl font-bold">{batch.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge className={getStatusColor(batch.status)}>
                  {batch.status === 'Completed' && <CheckCircle className="h-4 w-4 mr-1" />}
                  {batch.status === 'Pending Review' && <Clock className="h-4 w-4 mr-1" />}
                  {batch.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{batch.createdAt}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{batch.completedAt}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{batch.location}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Weight</p>
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span>{batch.weight}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Statistics</CardTitle>
              <CardDescription>
                Distribution of sample statuses within this batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Approved
                      </div>
                    </TableCell>
                    <TableCell>{batch.approvedSamples}</TableCell>
                    <TableCell>{((batch.approvedSamples / batch.totalSamples) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        Rejected
                      </div>
                    </TableCell>
                    <TableCell>{batch.rejectedSamples}</TableCell>
                    <TableCell>{((batch.rejectedSamples / batch.totalSamples) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-amber-500 mr-2" />
                        Pending Review
                      </div>
                    </TableCell>
                    <TableCell>{batch.pendingSamples}</TableCell>
                    <TableCell>{((batch.pendingSamples / batch.totalSamples) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">{batch.totalSamples}</TableCell>
                    <TableCell className="font-bold">100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch Notes</CardTitle>
              <CardDescription>
                Additional information about this batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p>{batch.notes}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Available actions for this batch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                Download Report
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Share Batch
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Request Re-processing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}