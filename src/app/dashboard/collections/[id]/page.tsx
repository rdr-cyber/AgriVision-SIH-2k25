'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  MapPin, 
  FileText, 
  Weight, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  FileQuestion,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { SampleContext } from '@/context/sample-context';
import type { HerbSample } from '@/lib/types';

export default function SampleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { samples, updateSample } = useContext(SampleContext);
  const [sample, setSample] = useState<HerbSample | null>(null);
  const [appealReason, setAppealReason] = useState('');
  const [showAppealForm, setShowAppealForm] = useState(false);

  useEffect(() => {
    const foundSample = samples.find(s => s.id === params.id);
    if (foundSample) {
      setSample(foundSample);
    } else {
      // If sample not found, redirect to collections page
      router.push('/dashboard/collections');
    }
  }, [params.id, samples, router]);

  const handleAppealSubmit = () => {
    if (!sample || !appealReason.trim()) return;
    
    updateSample(sample.id, {
      status: 'Appealed',
      appeal: {
        reason: appealReason,
        timestamp: new Date().toISOString()
      }
    });
    
    setAppealReason('');
    setShowAppealForm(false);
    
    // Refresh the sample data
    const updatedSample = samples.find(s => s.id === params.id);
    if (updatedSample) {
      setSample(updatedSample);
    }
  };

  if (!sample) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sample not found</h2>
          <p className="text-muted-foreground mb-4">The requested sample could not be found.</p>
          <Button onClick={() => router.push('/dashboard/collections')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
      case 'Pending Review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400';
      case 'Batched': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      case 'Appealed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Sample Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample Image and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {sample.id}
                    <Badge className={getStatusColor(sample.status)}>
                      {sample.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Submitted on {new Date(sample.timestamp).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {sample.status === 'Rejected' && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAppealForm(!showAppealForm)}
                    >
                      <FileQuestion className="h-4 w-4 mr-2" />
                      Appeal Decision
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Sample Image</h3>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={sample.imageUrl}
                      alt={sample.aiResult?.species || 'Herb sample'}
                      width={400}
                      height={400}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">AI Analysis Results</h3>
                    {sample.aiResult ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Identified Species</p>
                          <p className="font-medium">{sample.aiResult.species}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <p className="font-medium">
                            {(sample.aiResult.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quality Score</p>
                          <p className="font-medium">{sample.aiResult.qualityScore}/100</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No AI analysis available</p>
                    )}
                  </div>
                  
                  {sample.qcReview && (
                    <div>
                      <h3 className="font-semibold mb-2">QC Review</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {sample.qcReview.status === 'Approved' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">
                            {sample.qcReview.status} by {sample.qcReview.agentName}
                          </span>
                        </div>
                        {sample.qcReview.reason && (
                          <div>
                            <p className="text-sm text-muted-foreground">Reason</p>
                            <p>{sample.qcReview.reason}</p>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Reviewed on {new Date(sample.qcReview.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {sample.appeal && (
                    <div>
                      <h3 className="font-semibold mb-2">Appeal</h3>
                      <div className="space-y-2">
                        <p>{sample.appeal.reason}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(sample.appeal.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {showAppealForm && (
            <Card>
              <CardHeader>
                <CardTitle>Appeal Decision</CardTitle>
                <CardDescription>
                  Explain why you believe this decision should be reconsidered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Provide details for your appeal..."
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAppealSubmit}>Submit Appeal</Button>
                  <Button variant="outline" onClick={() => setShowAppealForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sample Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p>{new Date(sample.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>Lat: {sample.latitude.toFixed(6)}</p>
                  <p>Lng: {sample.longitude.toFixed(6)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Weight className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p>{sample.quantity || 'Not specified'} grams</p>
                </div>
              </div>
              
              {sample.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p>{sample.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" disabled>
                <Package className="h-4 w-4 mr-2" />
                View Batch (when available)
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}