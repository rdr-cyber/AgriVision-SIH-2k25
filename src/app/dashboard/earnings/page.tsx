
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockSamples } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const INCENTIVE_PER_SAMPLE = 5; // $5 incentive for each approved sample

export default function EarningsPage() {
    const farmerSamples = mockSamples.filter(s => s.collectorId === 'USR-F01' && s.status !== 'Rejected');
    const approvedSamples = farmerSamples.filter(s => s.status === 'Approved' || s.status === 'Batched');
    
    const totalEarnings = approvedSamples.length * INCENTIVE_PER_SAMPLE;

    const chartData = farmerSamples.map(sample => ({
        name: sample.id,
        earnings: (sample.status === 'Approved' || sample.status === 'Batched') ? INCENTIVE_PER_SAMPLE : 0,
        quality: sample.aiResult?.qualityScore || 0,
    }));
    
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Earnings</CardTitle>
                    <CardDescription>A summary of your incentives from approved samples.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col items-center justify-center p-8 bg-secondary rounded-lg">
                        <DollarSign className="h-12 w-12 text-primary mb-4" />
                        <p className="text-4xl font-bold">${totalEarnings.toFixed(2)}</p>
                        <p className="text-muted-foreground">Total Earnings</p>
                    </div>
                     <div className="flex flex-col items-center justify-center p-8 bg-secondary rounded-lg">
                        <p className="text-4xl font-bold">{approvedSamples.length}</p>
                        <p className="text-muted-foreground">Approved Samples</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Earnings per Collection</CardTitle>
                     <CardDescription>Visualizing incentives and quality scores for each sample.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))'
                                }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="earnings" fill="hsl(var(--primary))" name="Earnings ($)" />
                            <Bar yAxisId="right" dataKey="quality" fill="hsl(var(--accent))" name="Quality Score" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>A log of your incentive payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sample ID</TableHead>
                                <TableHead>Date Approved</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {approvedSamples.map(sample => (
                                <TableRow key={sample.id}>
                                    <TableCell>{sample.id}</TableCell>
                                    <TableCell>{format(new Date(sample.qcReview?.timestamp || sample.timestamp), 'PPP')}</TableCell>
                                    <TableCell>${INCENTIVE_PER_SAMPLE.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Processed</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {approvedSamples.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No earnings yet. Keep up the great work!</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
        </div>
    )
}
