
'use client';
import Image from 'next/image';
import { PackagePlus, Check } from 'lucide-react';
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
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect, useContext } from 'react';
import { SampleContext } from '@/context/sample-context';
import type { HerbSample } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function ManufacturerCollectionsPage() {
  const { samples } = useContext(SampleContext);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [selectedSamples, setSelectedSamples] = useState<string[]>([]);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSelect = (sampleId: string) => {
    setSelectedSamples(prev => 
      prev.includes(sampleId) 
        ? prev.filter(id => id !== sampleId) 
        : [...prev, sampleId]
    );
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSamples(approvedSamples.map(s => s.id));
    } else {
      setSelectedSamples([]);
    }
  }
  
  const handleCreateBatch = () => {
    toast({
        title: 'Batch Creation Initialized',
        description: `${selectedSamples.length} samples have been added to a new batch.`
    })
  }

  const approvedSamples: HerbSample[] = isClient ? samples.filter(s => s.status === 'Approved' || s.status === 'Batched') : [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Approved Collections</CardTitle>
            <CardDescription>
            Select approved collections to group them into a new batch.
            </CardDescription>
        </div>
        <Button onClick={handleCreateBatch} disabled={selectedSamples.length === 0}>
            <PackagePlus className="mr-2 h-4 w-4" />
            Create Batch ({selectedSamples.length})
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  checked={selectedSamples.length === approvedSamples.length && approvedSamples.length > 0}
                />
              </TableHead>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Sample ID</TableHead>
              <TableHead>AI Quality</TableHead>
              <TableHead>Farmer</TableHead>
              <TableHead>Approved On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isClient && approvedSamples.map((sample) => (
              <TableRow key={sample.id} data-state={selectedSamples.includes(sample.id) && 'selected'}>
                <TableCell>
                  <Checkbox 
                    onCheckedChange={() => handleSelect(sample.id)}
                    checked={selectedSamples.includes(sample.id)}
                  />
                </TableCell>
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
                  <Badge variant="outline">
                    {sample.aiResult?.qualityScore}/100
                  </Badge>
                </TableCell>
                <TableCell>{sample.collectorName}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(sample.qcReview?.timestamp || sample.timestamp), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {isClient && approvedSamples.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No approved samples available for batching.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
