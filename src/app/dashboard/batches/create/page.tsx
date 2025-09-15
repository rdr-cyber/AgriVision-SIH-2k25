'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  AlertCircle,
  QrCode,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { SampleContext } from '@/context/sample-context';
import type { HerbSample, Batch } from '@/lib/types';

export default function CreateBatchPage() {
  const router = useRouter();
  const { samples } = useContext(SampleContext);
  const [selectedSamples, setSelectedSamples] = useState<string[]>([]);
  const [batchNotes, setBatchNotes] = useState('');
  const [batchId, setBatchId] = useState('');
  const [step, setStep] = useState(1); // 1: select samples, 2: review, 3: confirmation

  // Generate batch ID
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    setBatchId(`BATCH-${year}-${month}-${day}-${random}`);
  }, []);

  const approvedSamples = samples.filter(sample => 
    sample.status === 'Approved' || sample.status === 'Batched'
  );

  const toggleSampleSelection = (sampleId: string) => {
    setSelectedSamples(prev => 
      prev.includes(sampleId)
        ? prev.filter(id => id !== sampleId)
        : [...prev, sampleId]
    );
  };

  const handleCreateBatch = () => {
    // In a real app, this would send data to an API
    console.log('Creating batch:', {
      batchId,
      selectedSamples,
      batchNotes
    });
    
    // Move to confirmation step
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Batch Created</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Batch Successfully Created!</h2>
            <p className="text-muted-foreground mb-6">
              Your batch <span className="font-mono">{batchId}</span> has been created with {selectedSamples.length} samples.
            </p>
            
            <div className="bg-muted p-4 rounded-lg mb-6 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Batch ID</span>
                <span className="font-mono">{batchId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Samples</span>
                <span>{selectedSamples.length}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => router.push('/dashboard/batches')}>
                View All Batches
              </Button>
              <Button variant="outline" onClick={() => router.push(`/dashboard/batches/${batchId}`)}>
                View Batch Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create New Batch</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              1
            </div>
            <p className="text-sm mt-2">Select Samples</p>
          </div>
          <div className="h-1 w-16 bg-muted" />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              2
            </div>
            <p className="text-sm mt-2">Review</p>
          </div>
          <div className="h-1 w-16 bg-muted" />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              3
            </div>
            <p className="text-sm mt-2">Confirmation</p>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch Information</CardTitle>
              <CardDescription>
                Enter details for your new batch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batchId">Batch ID</Label>
                <Input
                  id="batchId"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  placeholder="Enter batch ID"
                />
              </div>
              <div>
                <Label htmlFor="batchNotes">Notes (Optional)</Label>
                <Textarea
                  id="batchNotes"
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  placeholder="Add any notes about this batch..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Samples</CardTitle>
              <CardDescription>
                Choose approved samples to include in this batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approvedSamples.length > 0 ? (
                <div className="space-y-4">
                  {approvedSamples.map((sample) => (
                    <div 
                      key={sample.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedSamples.includes(sample.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => toggleSampleSelection(sample.id)}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedSamples.includes(sample.id) 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {selectedSamples.includes(sample.id) && (
                          <Check className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{sample.id}</p>
                          <Badge variant={
                            sample.status === 'Approved' ? 'default' : 'secondary'
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
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No approved samples</h3>
                  <p className="text-muted-foreground mb-4">
                    There are no samples available for batching. Samples must be approved by QC before they can be added to a batch.
                  </p>
                  <Button onClick={() => router.push('/dashboard/collections')}>
                    View Collections
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={() => setStep(2)}
              disabled={selectedSamples.length === 0}
            >
              Review Batch
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Batch</CardTitle>
              <CardDescription>
                Confirm the details of your new batch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Batch Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Batch ID</p>
                    <p className="font-medium">{batchId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Samples</p>
                    <p className="font-medium">{selectedSamples.length}</p>
                  </div>
                </div>
                {batchNotes && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{batchNotes}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Selected Samples</h3>
                <div className="space-y-3">
                  {selectedSamples.map((sampleId) => {
                    const sample = samples.find(s => s.id === sampleId);
                    return sample ? (
                      <div key={sample.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="font-mono text-sm">{sample.id}</div>
                        <div className="flex-1">
                          <p className="text-sm">{sample.aiResult?.species || 'Unknown species'}</p>
                        </div>
                        <div className="text-sm">
                          Quality: {sample.aiResult?.qualityScore || 'N/A'}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleCreateBatch}>
                  Create Batch
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}