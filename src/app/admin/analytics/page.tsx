'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Users, FlaskConical, CheckCircle, XCircle } from 'lucide-react';

const submissionData = [
  { name: 'Jan', submissions: 30 },
  { name: 'Feb', submissions: 45 },
  { name: 'Mar', submissions: 60 },
  { name: 'Apr', submissions: 50 },
  { name: 'May', submissions: 70 },
  { name: 'Jun', submissions: 90 },
];

const qcData = [
  { name: 'Approved', value: 400 },
  { name: 'Rejected', value: 80 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

const incentiveData = [
  { farmer: 'Alice', payout: 400 },
  { farmer: 'Bob', payout: 250 },
  { farmer: 'Charlie', payout: 100 },
  { farmer: 'Diana', payout: 500 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>
            Insights into AI performance, user adoption, and system metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">AI Model Accuracy</CardTitle>
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-2">96.3%</p>
                <p className="text-xs text-muted-foreground">+1.2% from last month</p>
            </div>
             <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-2">142</p>
                <p className="text-xs text-muted-foreground">+15 new this month</p>
            </div>
             <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                    <FlaskConical className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-2">1,204</p>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
            </div>
             <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Anchors Confirmed</CardTitle>
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-2">312</p>
                <p className="text-xs text-muted-foreground">All batches anchored</p>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Submissions Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={submissionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                        <Legend />
                        <Line type="monotone" dataKey="submissions" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>QC Approvals vs. Rejections</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={qcData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {qcData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Farmer Incentive Payouts</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={incentiveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="farmer" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                        <Legend />
                        <Bar dataKey="payout" fill="hsl(var(--primary))" name="Payout ($)"/>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

    </div>
  );
}
