'use client';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect, useContext } from 'react';
import { SampleContext } from '@/context/sample-context';
import { cn } from '@/lib/utils';
import type { HerbSample } from '@/lib/types';
import Link from 'next/link';

export default function AdminCollectionsPage() {
  const { samples } = useContext(SampleContext);
  const [isClient, setIsClient] = useState(false);
  const [selectedSample, setSelectedSample] = useState<HerbSample | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const allSamples = isClient
    ? [...samples].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    : [];

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedSample(null)}>
      <Card>
        <CardHeader>
          <CardTitle>All Collections</CardTitle>
          <CardDescription>
            Search, filter, and audit all herb collections in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Sample ID</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>AI Quality</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient &&
                allSamples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={sample.imageUrl}
                        width="64"
                        data-ai-hint={sample.imageHint}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>
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
                            'border-blue-600 bg-blue-100 text-blue-700 dark:border-blue-500/60 dark:bg-blue-900/50 dark:text-blue-400',
                          sample.status === 'Appealed' &&
                            'border-purple-600 bg-purple-100 text-purple-700 dark:border-purple-500/60 dark:bg-purple-900/50 dark:text-purple-400'
                        )}
                      >
                        {sample.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {sample.aiResult?.qualityScore}/100
                      </Badge>
                    </TableCell>
                    <TableCell>{sample.collectorName}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(sample.timestamp), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onClick={() => setSelectedSample(sample)}
                            >
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                           <DropdownMenuItem asChild>
                            <Link href={`/admin/users?q=${sample.collectorName}`}>
                                View Farmer
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {isClient && samples.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No samples found in the system.</p>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedSample && (
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Sample Details: {selectedSample.id}</DialogTitle>
            <DialogDescription>
              From {selectedSample.collectorName} submitted on{' '}
              {format(new Date(selectedSample.timestamp), "PPP 'at' p")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <Image
                src={selectedSample.imageUrl}
                alt={`Image of ${selectedSample.aiResult?.species}`}
                width={400}
                height={300}
                className="rounded-lg object-cover w-full aspect-video"
                data-ai-hint={selectedSample.imageHint}
              />
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Species</p>
                    <p className="font-semibold">{selectedSample.aiResult?.species}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Farmer</p>
                    <p className="font-semibold">{selectedSample.collectorName}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">AI Quality</p>
                    <p className="font-semibold">{selectedSample.aiResult?.qualityScore}/100</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                    <p className="font-semibold">{(selectedSample.aiResult?.confidence ?? 0) * 100}%</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="font-semibold">{selectedSample.status}</p>
                </div>
            </div>
            {selectedSample.qcReview && (
                 <div className="space-y-1 border-t pt-4">
                    <p className="text-sm font-medium text-muted-foreground">QC Review</p>
                    <p className="font-semibold">{selectedSample.qcReview.agentName} marked as {selectedSample.qcReview.status}</p>
                    <p className="text-sm italic text-muted-foreground">"{selectedSample.qcReview.reason}"</p>
                </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
