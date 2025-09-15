
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function AppealsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Appeals</CardTitle>
        <CardDescription>
          Review and respond to farmer disputes regarding rejected collections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
          <ShieldAlert className="h-12 w-12 mb-4" />
          <p className="text-lg font-semibold">No Active Appeals</p>
          <p className="text-sm">There are currently no farmer appeals that require your attention.</p>
        </div>
      </CardContent>
    </Card>
  );
}
