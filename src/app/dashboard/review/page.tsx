'use client';
import Image from 'next/image';
import { MoreHorizontal, Check, X } from 'lucide-react';
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
import { mockSamples } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { HerbSample } from '@/lib/types';

export default function ReviewPage() {
  const [pendingReviewSamples, setPendingReviewSamples] = useState<HerbSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<HerbSample | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Filter samples that are pending review
    const pendingSamples = mockSamples.filter(sample => sample.status === 'Pending Review');
    setPendingReviewSamples(pendingSamples);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Control Review Queue</CardTitle>
        <CardDescription>
          Approve or reject samples based on AI analysis and visual
          inspection.
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
              <TableHead>AI Species</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Quality Score</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isClient && pendingReviewSamples.map((sample) => (
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
                <TableCell>{sample.aiResult?.species}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {(sample.aiResult?.confidence ?? 0) * 100}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {sample.aiResult?.qualityScore}/100
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(sample.timestamp), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {isClient && pendingReviewSamples.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No samples are currently awaiting review.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}