
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Flag } from 'lucide-react';

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports & Flags</CardTitle>
        <CardDescription>
          Monitor system-flagged anomalies and user-submitted reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
          <Flag className="h-12 w-12 mb-4" />
          <p className="text-lg font-semibold">No Active Reports or Flags</p>
          <p className="text-sm">The system has not identified any anomalies that require your review.</p>
        </div>
      </CardContent>
    </Card>
  );
}
