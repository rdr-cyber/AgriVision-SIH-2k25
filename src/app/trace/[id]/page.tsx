'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function TraceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Trace Details</h1>
          <p className="text-muted-foreground">
            Detailed trace information for batch {params.id}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trace Information</CardTitle>
          <CardDescription>
            Scan results include "as-is" data from suppliers and "verified" checkpoints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Batch ID</h3>
                <p className="text-sm text-muted-foreground">{params.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">Verified</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}