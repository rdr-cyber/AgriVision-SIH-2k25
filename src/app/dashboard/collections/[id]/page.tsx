'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  MapPin, 
  Weight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SampleContext } from '@/context/sample-context';
import type { HerbSample } from '@/lib/types';

export default function SampleDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { samples, updateSample } = useContext(SampleContext);
  const [sample, setSample] = useState<HerbSample | null>(null);
  const [appealReason, setAppealReason] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const foundSample = samples.find(s => s.id === params.id);
    if (foundSample) {
      setSample(foundSample);
    } else {
      // Redirect to collections page if sample not found
      router.push('/dashboard/collections');
    }
  }, [params.id, samples, router]);

  const handleAppeal = () => {
    if (!sample || !appealReason.trim()) return;
    
    updateSample(sample.id, {
      status: 'Appealed',
      appeal: {
        reason: appealReason,
        timestamp: new Date().toISOString()
      }
    });
    
    setAppealReason('');
    // Refresh the sample data
    const updatedSample = samples.find(s => s.id === params.id);
    if (updatedSample) {
      setSample(updatedSample);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Pending Review': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'Batched': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'Appealed': return <RotateCcw className="h-4 w-4 text-purple-500" />;
      default: return null;
    }
  };

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

  if (!isClient) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sample Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The sample you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push('/dashboard/collections')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/collections')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{sample.id}</h1>
          <p className="text-muted-foreground">
            Detailed view of your herb sample submission
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample Image and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Image</CardTitle>
              <CardDescription>
                High-resolution image of the herb sample
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <Image
                  src={sample.imageUrl}
                  alt={sample.aiResult?.species || 'Herb sample'}
                  width={500}
                  height={500}
                  className="object-contain w-full h-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {sample.aiResult && (
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis Results</CardTitle>
                <CardDescription>
                  Species identification and quality assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Identified Species</p>
                  <p className="text-xl font-bold">{sample.aiResult.species}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
                  <p className="text-xl font-bold">
                    {(sample.aiResult.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
                  <p className="text-xl font-bold">{sample.aiResult.qualityScore}/100</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Image Hint</p>
                  <p className="text-xl font-bold">{sample.imageHint}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* QC Review */}
          {sample.qcReview && (
            <Card>
              <CardHeader>
                <CardTitle>QC Review</CardTitle>
                <CardDescription>
                  Quality control agent assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reviewed By</p>
                    <p className="font-medium">{sample.qcReview.agentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Review Date</p>
                    <p className="font-medium">
                      {new Date(sample.qcReview.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className={getStatusColor(sample.qcReview.status)}>
                      {getStatusIcon(sample.qcReview.status)}
                      <span className="ml-1">{sample.qcReview.status}</span>
                    </Badge>
                  </div>
                  {sample.qcReview.reason && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Reason</p>
                      <p className="font-medium">{sample.qcReview.reason}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appeal Section */}
          {sample.status === 'Rejected' && (
            <Card>
              <CardHeader>
                <CardTitle>Appeal Rejection</CardTitle>
                <CardDescription>
                  If you believe this rejection was incorrect, you can appeal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Reason for Appeal
                  </label>
                  <Textarea
                    placeholder="Explain why you believe this sample was incorrectly rejected..."
                    value={appealReason}
                    onChange={(e) => setAppealReason(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleAppeal} disabled={!appealReason.trim()}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Submit Appeal
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Appeal Details */}
          {sample.appeal && (
            <Card>
              <CardHeader>
                <CardTitle>Appeal Details</CardTitle>
                <CardDescription>
                  Your appeal submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
                    <p className="font-medium">
                      {new Date(sample.appeal.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className={getStatusColor(sample.status)}>
                      {getStatusIcon(sample.status)}
                      <span className="ml-1">{sample.status}</span>
                    </Badge>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Reason</p>
                    <p className="font-medium">{sample.appeal.reason}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sample Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Details</CardTitle>
              <CardDescription>
                Collection and submission information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sample ID</p>
                <p className="font-mono">{sample.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge className={getStatusColor(sample.status)}>
                  {getStatusIcon(sample.status)}
                  <span className="ml-1">{sample.status}</span>
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Submitted By</p>
                <p className="font-medium">{sample.collectorName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Submission Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(sample.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{sample.latitude.toFixed(6)}, {sample.longitude.toFixed(6)}</span>
                </div>
              </div>
              {sample.quantity && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <span>{sample.quantity} grams</span>
                  </div>
                </div>
              )}
              {sample.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p>{sample.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Available actions for this sample
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                Download Report
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Share Sample
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Request Re-analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}