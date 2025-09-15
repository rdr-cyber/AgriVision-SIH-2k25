'use client';
import { MoreHorizontal, Download } from 'lucide-react';
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
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { mockBatches } from '@/lib/mock-data';

// Derived from mockBatches for demonstration
const mockAnchors = mockBatches.map(batch => ({
    id: batch.blockchainAnchor?.txId.slice(0, 12) + '...',
    resourceType: 'Batch',
    resourceId: batch.id,
    hash: batch.batchHash.slice(0, 16) + '...',
    txId: batch.blockchainAnchor?.txId,
    timestamp: batch.blockchainAnchor?.timestamp,
    status: 'Confirmed'
}));


export default function AdminBlockchainPage() {
  const [anchors, setAnchors] = useState(mockAnchors);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const exportToCsv = () => {
    const headers = ['Transaction ID', 'Resource ID', 'Resource Type', 'Chain', 'Timestamp', 'Status'];
    const rows = anchors.map(anchor => [
      anchor.txId,
      anchor.resourceId,
      anchor.resourceType,
      'Polygon Testnet',
      anchor.timestamp ? format(new Date(anchor.timestamp), 'PPP p') : 'N/A',
      anchor.status
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'blockchain-anchors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Blockchain Anchors</CardTitle>
            <CardDescription>
                View all data anchored to the blockchain.
            </CardDescription>
        </div>
        <Button variant="outline" onClick={exportToCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Resource ID</TableHead>
              <TableHead>Resource Type</TableHead>
              <TableHead>Chain</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isClient &&
              anchors.map((anchor) => (
                <TableRow key={anchor.txId}>
                  <TableCell className="font-mono truncate max-w-xs">
                    <a href="#" className="text-primary hover:underline">{anchor.txId}</a>
                  </TableCell>
                  <TableCell className="font-mono">{anchor.resourceId}</TableCell>
                   <TableCell>
                    <Badge variant="secondary">{anchor.resourceType}</Badge>
                  </TableCell>
                  <TableCell>Polygon Testnet</TableCell>
                   <TableCell>
                    {anchor.timestamp ? format(new Date(anchor.timestamp), 'PPP p') : 'N/A'}
                  </TableCell>
                  <TableCell>
                     <Badge className="border-green-600 bg-green-100 text-green-700 dark:border-green-500/60 dark:bg-green-900/50 dark:text-green-400">
                        {anchor.status}
                      </Badge>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
         {isClient && anchors.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p>No blockchain anchors found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
