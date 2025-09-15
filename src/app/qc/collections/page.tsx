
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
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect, useContext } from 'react';
import { SampleContext } from '@/context/sample-context';
import { useToast } from '@/hooks/use-toast';

export default function QCCollectionsPage() {
  const { samples, updateSample } = useContext(SampleContext);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDecision = (sampleId: string, newStatus: 'Approved' | 'Rejected') => {
      const qcAgentName = 'QC Dave'; // Logged-in QC agent
      const reason = newStatus === 'Approved' ? 'Sample meets quality standards.' : 'Sample does not meet quality standards.';
      
      updateSample(sampleId, { 
          status: newStatus,
          qcReview: {
              status: newStatus,
              agentId: 'USR-Q01',
              agentName: qcAgentName,
              timestamp: new Date().toISOString(),
              reason: reason,
          }
      });

      toast({
          title: `Sample ${newStatus}`,
          description: `Sample ${sampleId} has been ${newStatus.toLowerCase()}.`,
      });
  };

  const pendingReviewSamples = isClient ? samples.filter(s => s.status === 'Pending Review') : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collections Review Queue</CardTitle>
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
                    {((sample.aiResult?.confidence ?? 0) * 100).toFixed(0)}%
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
                      <DropdownMenuItem onClick={() => handleDecision(sample.id, 'Approved')}>
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDecision(sample.id, 'Rejected')} className="text-destructive">
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
