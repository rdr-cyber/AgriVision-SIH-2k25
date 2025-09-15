'use client';

import { useState, useEffect, useContext } from 'react';
import { Bell, CheckCircle, XCircle, AlertTriangle, Package, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SampleContext } from '@/context/sample-context';
import type { HerbSample } from '@/lib/types';

type NotificationPayload = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

export default function NotificationsPage() {
  const { samples } = useContext(SampleContext);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Generate notifications based on sample status changes
    const generatedNotifications = samples.map(sample => {
      const timeAgo = getTimeAgo(sample.timestamp);
      
      switch (sample.status) {
        case 'Approved':
          return {
            id: `notif-${sample.id}-approved`,
            type: 'approval',
            title: 'Sample Approved',
            message: `Your sample ${sample.id} has been approved by QC.`,
            timestamp: timeAgo,
            sampleId: sample.id,
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            status: 'approved'
          };
        case 'Rejected':
          return {
            id: `notif-${sample.id}-rejected`,
            type: 'rejection',
            title: 'Sample Rejected',
            message: `Your sample ${sample.id} has been rejected. ${sample.qcReview?.reason || 'No reason provided.'}`,
            timestamp: timeAgo,
            sampleId: sample.id,
            icon: <XCircle className="h-5 w-5 text-red-500" />,
            status: 'rejected'
          };
        case 'Batched':
          return {
            id: `notif-${sample.id}-batched`,
            type: 'batch',
            title: 'Sample Batched',
            message: `Your sample ${sample.id} has been added to a batch for processing.`,
            timestamp: timeAgo,
            sampleId: sample.id,
            icon: <Package className="h-5 w-5 text-blue-500" />,
            status: 'batched'
          };
        case 'Appealed':
          return {
            id: `notif-${sample.id}-appealed`,
            type: 'appeal',
            title: 'Appeal Submitted',
            message: `Your appeal for sample ${sample.id} has been submitted.`,
            timestamp: timeAgo,
            sampleId: sample.id,
            icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
            status: 'appealed'
          };
        default:
          return {
            id: `notif-${sample.id}-pending`,
            type: 'submission',
            title: 'Sample Submitted',
            message: `Your sample ${sample.id} has been submitted for review.`,
            timestamp: timeAgo,
            sampleId: sample.id,
            icon: <FileText className="h-5 w-5 text-gray-500" />,
            status: 'submitted'
          };
      }
    });
    
    setNotifications(generatedNotifications);
  }, [samples]);

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const sampleTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - sampleTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'batched': return 'secondary';
      case 'appealed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest activities on your samples
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                {notifications.length} notifications
              </CardDescription>
            </div>
            <Button variant="outline">Mark all as read</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50">
                <div className="mt-1">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <Badge variant={getBadgeVariant(notification.status)}>
                      {notification.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You'll see updates here when there are changes to your samples.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}