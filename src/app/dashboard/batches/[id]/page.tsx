'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  QrCode, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SampleContext } from '@/context/sample-context';
import type { Batch, HerbSample } from '@/lib/types';

export default function BatchDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { samples } = useContext(SampleContext);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [batchSamples, setBatchSamples] = useState<HerbSample[]>([]);

  // Find batch and associated samples
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockBatch: Batch = {
      id: params.id,
      manufacturerId: 'mfg1',
      manufacturerName: 'Herbal Solutions Ltd',
      createdAt: new Date().toISOString(),
      sampleIds: ['SMP-2023-001', 'SMP-2023-002', 'SMP-2023-003'],
      batchHash: 'a1b2c3d4e5f',
      qrCodeUrl: '/qr-code-placeholder.png',
      blockchainAnchor: {
        txId: 'tx-abc123',
        chain: 'Ethereum',
        timestamp: new Date().toISOString()
      }
    };
    
    setBatch(mockBatch);
    
    // Get samples for this batch
    const batchSamples = samples.filter(sample => 
      mockBatch.sampleIds.includes(sample.id)
    );
    setBatchSamples(batchSamples);
  }, [params.id, samples]);

  if (!batch) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Batch not found</h2>
          <p className="text-muted-foreground mb-4">The requested batch could not be found.</p>
          <Button onClick={() => router.push('/dashboard/batches')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Batches
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (batch.blockchainAnchor) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
    }
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400';
  };

  const getStatusText = () => {
    if (batch.blockchainAnchor) {
      return 'Completed';
    }
    return 'Processing';
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Batch Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {batch.id}
                    <Badge className={getStatusColor()}>
                      {getStatusText()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Created on {new Date(batch.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Batch Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Manufacturer</p>
                      <p className="font-medium">{batch.manufacturerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(batch.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Samples</p>
                      <p className="font-medium">{batch.sampleIds.length}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Blockchain Verification</h3>
                  {batch.blockchainAnchor ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Chain</p>
                        <p className="font-medium">{batch.blockchainAnchor.chain}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction ID</p>
                        <p className="font-mono text-sm break-all">{batch.blockchainAnchor.txId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timestamp</p>
                        <p className="font-medium">
                          {new Date(batch.blockchainAnchor.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify on Blockchain
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                      <p className="text-sm text-amber-600">
                        This batch has not been anchored to the blockchain yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Included Samples</CardTitle>
              <CardDescription>
                Samples that are part of this batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batchSamples.length > 0 ? (
                <div className="space-y-4">
                  {batchSamples.map((sample) => (
                    <div 
                      key={sample.id} 
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/collections/${sample.id}`)}
                    >
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={sample.imageUrl}
                          alt={sample.aiResult?.species || 'Herb sample'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{sample.id}</p>
                          <Badge variant={
                            sample.status === 'Approved' ? 'default' :
                            sample.status === 'Batched' ? 'secondary' : 'outline'
                          }>
                            {sample.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sample.aiResult?.species || 'Unknown species'} • 
                          Quality: {sample.aiResult?.qualityScore || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No samples found</h3>
                  <p className="text-muted-foreground">
                    There are no samples associated with this batch.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* QR Code and Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch QR Code</CardTitle>
              <CardDescription>
                Scan to verify batch authenticity
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-4">
                <div className="bg-muted border-2 border-dashed rounded-xl w-48 h-48 flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground mb-4">
                This QR code can be scanned to verify the authenticity and details of this batch.
              </p>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Batch
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button className="w-full" variant="outline" disabled>
                <CheckCircle className="h-4 w-4 mr-2" />
                Anchor to Blockchain
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}