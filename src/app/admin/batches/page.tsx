'use client';
import { MoreHorizontal, Download, FileCheck2, Loader2 } from 'lucide-react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useState, useEffect, useTransition } from 'react';
import { mockBatches } from '@/lib/mock-data';
import type { Batch } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import QRCode from 'qrcode';

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [auditReason, setAuditReason] = useState('');
  const [isAuditing, startAuditTransition] = useTransition();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const generateQrCodeDataUrl = async (batchId: string): Promise<string> => {
    try {
      const traceUrl = `${window.location.origin}/trace/${batchId}`;
      return await QRCode.toDataURL(traceUrl, { 
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  const handleDownloadQr = async (batch: Batch) => {
    toast({
        title: 'Generating QR Code...',
        description: `Please wait while we create a unique QR code for batch ${batch.id}.`,
    });
    
    const qrDataUrl = await generateQrCodeDataUrl(batch.id);
    
    if (!qrDataUrl) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: `Could not generate a QR code for batch ${batch.id}.`,
      });
      return;
    }

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `batch-${batch.id}-qrcode.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'QR Code Downloading',
      description: `The unique QR code for batch ${batch.id} has started downloading.`,
    });
  };

  const handleAudit = (batch: Batch) => {
    setSelectedBatch(batch);
  };
  
  const submitAudit = () => {
    if (!selectedBatch) return;

    startAuditTransition(async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log({
            batchId: selectedBatch.id,
            action: 'Audit Submitted',
            reason: auditReason || 'Integrity confirmed.',
        });

        toast({
            title: "Audit Submitted",
            description: `Audit for batch ${selectedBatch.id} has been recorded.`
        });
        
        setAuditReason('');
        setSelectedBatch(null);
    })
  }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedBatch(null)}>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Batches</CardTitle>
            <CardDescription>
              Review and audit manufacturer batches.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Collections</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Anchor TX</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient &&
                batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono">{batch.id}</TableCell>
                    <TableCell>{batch.manufacturerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{batch.sampleIds.length}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(batch.createdAt), 'PPP')}
                    </TableCell>
                    <TableCell className="font-mono truncate max-w-xs">
                      {batch.blockchainAnchor?.txId}
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
                          <DropdownMenuItem
                            onClick={() => handleDownloadQr(batch)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download QR
                          </DropdownMenuItem>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => handleAudit(batch)}>
                              <FileCheck2 className="mr-2 h-4 w-4" />
                              Audit Batch
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {isClient && batches.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p>No batches found in the system.</p>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedBatch && (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Audit Batch: {selectedBatch.id}</DialogTitle>
                <DialogDescription>
                    Verify the integrity of this batch and its collections. Confirm that all data is consistent with the blockchain anchor.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <p className="text-sm font-medium">Collections ({selectedBatch.sampleIds.length}): <span className="font-mono text-muted-foreground">{selectedBatch.sampleIds.join(', ')}</span></p>
                <p className="text-sm font-medium">Data Hash: <span className="font-mono text-muted-foreground">{selectedBatch.batchHash}</span></p>
                 <div className="space-y-2">
                    <Label htmlFor="audit-reason">Audit Notes / Inconsistency Reason</Label>
                    <Textarea 
                        id="audit-reason"
                        placeholder="Leave blank to confirm integrity, or describe any inconsistencies found..."
                        value={auditReason}
                        onChange={(e) => setAuditReason(e.target.value)}
                    />
                 </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={submitAudit} disabled={isAuditing}>
                    {isAuditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Audit
                </Button>
            </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
