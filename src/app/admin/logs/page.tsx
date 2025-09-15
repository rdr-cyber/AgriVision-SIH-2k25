'use client';
import { Download } from 'lucide-react';
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
import { useState, useEffect } from 'react';

const mockActivity = [
    { id: 1, action: 'QC Approval', actor: 'QC Dave', role: 'qc', target: 'HC-005', timestamp: new Date(new Date().setDate(new Date().getDate() - 1))},
    { id: 2, action: 'User Suspended', actor: 'Admin', role: 'admin', target: 'USR-F03', timestamp: new Date(new Date().setHours(new Date().getHours() - 3))},
    { id: 3, action: 'New Submission', actor: 'Alice', role: 'farmer', target: 'HC-003', timestamp: new Date(new Date().setHours(new Date().getHours() - 8))},
    { id: 4, action: 'Batch Created', actor: 'MediLeaf', role: 'manufacturer', target: 'B-2024-00123', timestamp: new Date(new Date().setDate(new Date().getDate() - 1))},
    { id: 5, action: 'QC Rejection', actor: 'QC Dave', role: 'qc', target: 'HC-004', timestamp: new Date(new Date().setDate(new Date().getDate() - 2))},
    { id: 6, action: 'Admin Override', actor: 'Admin', role: 'admin', target: 'HC-004', timestamp: new Date(new Date().setDate(new Date().getDate() - 1))},
    { id: 7, action: 'Login Success', actor: 'Alice', role: 'farmer', target: 'USR-F01', timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 30))},
];


export default function AdminLogsPage() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);
    
    const exportToCsv = () => {
      const headers = ['Action', 'Actor', 'Role', 'Target', 'Timestamp'];
      const rows = mockActivity.map(activity => [
        activity.action,
        activity.actor,
        activity.role,
        activity.target,
        formatDistanceToNow(activity.timestamp, { addSuffix: true })
      ].join(','));
  
      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'system-logs.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>
                An immutable record of all actions performed in the system.
            </CardDescription>
        </div>
         <Button variant="outline" onClick={exportToCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export
        </Button>
      </CardHeader>
      <CardContent>
         <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isClient && mockActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                        <Badge variant={
                            activity.action.includes('Approval') ? 'default' : 
                            activity.action.includes('Reject') || activity.action.includes('Suspend') ? 'destructive' :
                            'secondary'
                        }>{activity.action}</Badge>
                    </TableCell>
                    <TableCell>
                      {activity.actor}
                    </TableCell>
                     <TableCell>
                      <Badge variant="outline">{activity.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{activity.target}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
      </CardContent>
    </Card>
  );
}
