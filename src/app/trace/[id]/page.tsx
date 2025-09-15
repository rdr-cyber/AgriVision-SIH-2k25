
'use client';
import Image from 'next/image';
import {
  MapPin,
  FlaskConical,
  ShieldCheck,
  Boxes,
  Link as LinkIcon,
  Leaf,
  Calendar,
  User,
  Factory,
  ArrowUpRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockSamples, mockBatches } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';

export default function TracePage() {
  const params = useParams();
  const id = params.id as string;
  const batch = mockBatches.find(b => b.id === id);
  
  if (!batch) {
      return notFound();
  }

  // For this demo, we'll trace the first sample in the batch.
  const sample = mockSamples.find(s => s.id === batch.sampleIds[0]);

  if (!sample) {
      return notFound();
  }

  const timelineEvents = [
    {
      icon: Leaf,
      title: 'Collected',
      timestamp: sample.timestamp,
      description: `Collected by ${sample.collectorName} (ID: ${sample.collectorId})`,
      details: (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>
            {sample.latitude.toFixed(4)}, {sample.longitude.toFixed(4)}
          </span>
        </div>
      ),
    },
    {
      icon: FlaskConical,
      title: 'AI Analysis',
      timestamp: new Date(
        new Date(sample.timestamp).getTime() + 10 * 60000
      ).toISOString(),
      description: 'Sample analyzed by AgriVision AI Model v1.2.',
      details: (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <strong>Species:</strong>
          <span>{sample.aiResult?.species}</span>
          <strong>Confidence:</strong>
          <span>
            <Badge variant="secondary">
              {(sample.aiResult?.confidence ?? 0) * 100}%
            </Badge>
          </span>
          <strong>Quality Score:</strong>
          <span>
            <Badge variant="secondary">
              {sample.aiResult?.qualityScore}/100
            </Badge>
          </span>
        </div>
      ),
    },
    {
      icon: ShieldCheck,
      title: 'QC Approved',
      timestamp: sample.qcReview?.timestamp,
      description: `Approved by ${sample.qcReview?.agentName}.`,
      details: <p className="text-sm text-muted-foreground">"{sample.qcReview?.reason}"</p>,
    },
    {
      icon: LinkIcon,
      title: 'Blockchain Anchor',
      timestamp: batch.blockchainAnchor?.timestamp,
      description: `Data hash secured on ${batch.blockchainAnchor?.chain}.`,
      details: (
        <a
          href="#"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <span>Tx: {batch.blockchainAnchor?.txId}</span>
          <ArrowUpRight className="h-3 w-3" />
        </a>
      ),
    },
    {
      icon: Boxes,
      title: 'Batched for Production',
      timestamp: batch.createdAt,
      description: `Included in Batch #${batch.id} by ${batch.manufacturerName}.`,
       details: <p className="text-sm text-muted-foreground">Product is now ready for distribution.</p>,
    },
  ].filter(event => event.timestamp); // Filter out events that don't have a timestamp

  timelineEvents.sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Traceability Report</h1>
        <p className="text-muted-foreground">
          Batch ID: <span className="font-mono">{batch.id}</span>
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Herb Sample</CardTitle>
              <CardDescription>ID: {sample.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={sample.imageUrl}
                alt={`Image of ${sample.aiResult?.species}`}
                width={400}
                height={300}
                className="rounded-lg object-cover w-full"
                data-ai-hint={sample.imageHint}
              />
              <div className="mt-4 space-y-2 text-sm">
                <h3 className="font-semibold text-base">{sample.aiResult?.species}</h3>
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  Collected by {sample.collectorName}
                </div>
                 <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Collected on{' '}
                  {new Date(sample.timestamp).toLocaleDateString()}
                </div>
                 <div className="flex items-center text-muted-foreground">
                  <Factory className="mr-2 h-4 w-4" />
                  Batched by {batch.manufacturerName}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="relative pl-8">
            <div className="absolute left-0 h-full w-0.5 bg-border -translate-x-1/2 ml-4"></div>
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative mb-8">
                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-secondary -translate-x-1/2">
                  <event.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.timestamp!).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3">{event.description}</p>
                      {event.details}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
