'use client';
import Image from 'next/image';
import { MoreHorizontal, Check, X, ShieldAlert, BadgeCheck, ShieldX, MessageSquare } from 'lucide-react';
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
  DropdownMenuSeparator,
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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminReviewPage() {
  const { samples, updateSample } = useContext(SampleContext);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDecision = (sampleId: string, newStatus: 'Approved' | 'Rejected', action: 'override' | 'uphold') => {
      const sample = samples.find(s => s.id === sampleId);
      if (!sample) return;

      const message = action === 'override' 
        ? `Overridden by Admin. Original status was ${sample.status}.` 
        : `Admin upheld original rejection.`;
      
      const qcReason = action === 'override'
        ? `Decision overridden by Admin. Original status was ${sample.status}. ${sample.qcReview?.reason || ''}`.trim()
        : `Admin upheld original rejection. Farmer appeal denied.`.trim();

      updateSample(sampleId, { 
          status: newStatus,
          qcReview: {
              ...(sample.qcReview || { agentId: 'N/A', agentName: 'N/A', timestamp: new Date().toISOString()}),
              status: newStatus,
              agentId: 'USR-A01', // Admin ID
              agentName: 'Admin Override',
              timestamp: new Date().toISOString(),
              reason: qcReason
          }
      });
      toast({
          title: 'QC Decision Processed',
          description: `Sample ${sampleId} has been set to ${newStatus}.`,
      })
  }

  const appealedSamples = isClient ? [...samples].filter(s => s.status === 'Appealed') : [];
  const otherSamples = isClient ? [...samples].filter(s => s.status !== 'Appealed').sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];

  return (
      <div className="space-y-6">
          {isClient && appealedSamples.length > 0 && (
              <Card className="border-purple-600 dark:border-purple-500/60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400"><ShieldAlert/> Farmer Appeals Queue</CardTitle>
                    <CardDescription>
                        Review farmer disputes against QC rejections. Your decision is final.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {appealedSamples.map(sample => (
                        <Card key={sample.id} className="grid md:grid-cols-[100px_1fr_auto] gap-4 p-4 items-center">
                            <Image
                                alt="Sample image"
                                className="aspect-square rounded-md object-cover hidden md:block"
                                height="64"
                                src={sample.imageUrl}
                                width="64"
                                data-ai-hint={sample.imageHint}
                            />
                            <div>
                                <p className="font-bold">{sample.id} <span className="font-normal text-muted-foreground">by {sample.collectorName}</span></p>
                                <Alert variant="destructive" className="my-2">
                                    <AlertTitle className="text-sm">QC Rejection Reason</AlertTitle>
                                    <AlertDescription className="text-xs">{sample.qcReview?.reason}</AlertDescription>
                                </Alert>
                                 <Alert className="border-purple-600/50 bg-purple-50 dark:bg-purple-900/30">
                                    <AlertTitle className="text-sm text-purple-700 dark:text-purple-400">Farmer's Appeal</AlertTitle>
                                    <AlertDescription className="text-xs italic">"{sample.appeal?.reason}"</AlertDescription>
                                </Alert>
                            </div>
                             <div className="flex flex-col gap-2">
                                <Button size="sm" onClick={() => handleDecision(sample.id, 'Approved', 'override')}>
                                    <BadgeCheck className="mr-2 h-4 w-4"/>Approve (Override)
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => handleDecision(sample.id, 'Rejected', 'uphold')}>
                                    <ShieldX className="mr-2 h-4 w-4"/>Uphold Rejection
                                </Button>
                             </div>
                        </Card>
                    ))}
                    </div>
                </CardContent>
              </Card>
          )}
    
        <Card>
        <CardHeader>
            <CardTitle>All Collections Audit</CardTitle>
            <CardDescription>
            Review, audit, and override Quality Control decisions across the entire system.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
  It&apos;s important to review all submissions and avoid using &quot;test&quot; data in production.
</p>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Sample ID</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>AI Quality</TableHead>
                <TableHead>QC Agent</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isClient && otherSamples.map((sample) => (
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
                                'border-blue-600 bg-blue-100 text-blue-700 dark:border-blue-500/60 dark:bg-blue-900/50 dark:text-blue-400'
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
                    <TableCell>{sample.qcReview?.agentName || 'N/A'}</TableCell>
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
                        <DropdownMenuLabel>QC Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleDecision(sample.id, 'Approved', 'override')}>
                            <Check className="mr-2 h-4 w-4" />
                            Force Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDecision(sample.id, 'Rejected', 'override')} className="text-destructive">
                            <X className="mr-2 h-4 w-4" />
                            Force Reject
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
    </div>
  );
}