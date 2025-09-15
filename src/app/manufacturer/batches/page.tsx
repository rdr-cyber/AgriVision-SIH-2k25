
'use client';
import { MoreHorizontal, Download, FileCheck2, Loader2, PackagePlus } from 'lucide-react';
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
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { mockBatches } from '@/lib/mock-data';
import type { Batch } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import Link from 'next/link';

export default function ManufacturerBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>(mockBatches.filter(b => b.manufacturerId === 'USR-M01'));
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

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

  return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Batch Management</CardTitle>
            <CardDescription>
              Review your created batches and their statuses.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/manufacturer/collections">
                <PackagePlus className="mr-2 h-4 w-4" />
                Create New Batch
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Collections</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
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
                    <TableCell>
                      <Badge variant="outline">{batch.sampleIds.length}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(batch.createdAt), 'PPP')}
                    </TableCell>
                     <TableCell>
                        <Badge variant="secondary">Pending Audit</Badge>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {isClient && batches.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p>No batches created yet.</p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/manufacturer/collections">Create your first batch</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
  );
}
