'use client';

import { useState, useEffect, useContext } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  Download, 
  Calendar, 
  Filter, 
  FileText,
  TrendingUp,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SampleContext } from '@/context/sample-context';
import type { HerbSample } from '@/lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ReportsPage() {
  const { samples } = useContext(SampleContext);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [chartData, setChartData] = useState<any>(null);
  const [qualityData, setQualityData] = useState<any>(null);
  const [speciesData, setSpeciesData] = useState<any>(null);
  const [statusData, setStatusData] = useState<any>(null);

  // Prepare chart data based on time range
  useEffect(() => {
    if (samples.length > 0) {
      // Filter samples by time range
      const now = new Date();
      const filteredSamples = samples.filter(sample => {
        const sampleDate = new Date(sample.timestamp);
        switch (timeRange) {
          case '7d':
            return (now.getTime() - sampleDate.getTime()) / (1000 * 60 * 60 * 24) <= 7;
          case '30d':
            return (now.getTime() - sampleDate.getTime()) / (1000 * 60 * 60 * 24) <= 30;
          case '90d':
            return (now.getTime() - sampleDate.getTime()) / (1000 * 60 * 60 * 24) <= 90;
          case '1y':
            return (now.getTime() - sampleDate.getTime()) / (1000 * 60 * 60 * 24) <= 365;
          default:
            return true;
        }
      });

      // Submissions over time
      const submissionsByDate = filteredSamples.reduce((acc: any, sample) => {
        const date = new Date(sample.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const dates = Object.keys(submissionsByDate);
      const counts = Object.values(submissionsByDate);

      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'Submissions',
            data: counts,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
          },
        ],
      });

      // Quality score distribution
      const qualityScores = filteredSamples
        .filter(sample => sample.aiResult?.qualityScore !== undefined)
        .map(sample => sample.aiResult!.qualityScore);

      if (qualityScores.length > 0) {
        const qualityRanges = [
          { range: '0-20', count: qualityScores.filter(score => score <= 20).length },
          { range: '21-40', count: qualityScores.filter(score => score > 20 && score <= 40).length },
          { range: '41-60', count: qualityScores.filter(score => score > 40 && score <= 60).length },
          { range: '61-80', count: qualityScores.filter(score => score > 60 && score <= 80).length },
          { range: '81-100', count: qualityScores.filter(score => score > 80).length },
        ];

        setQualityData({
          labels: qualityRanges.map(r => r.range),
          datasets: [
            {
              label: 'Quality Score Distribution',
              data: qualityRanges.map(r => r.count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
              ],
              borderWidth: 1,
            },
          ],
        });
      }

      // Species distribution
      const speciesCount = filteredSamples.reduce((acc: any, sample) => {
        const species = sample.aiResult?.species || 'Unknown';
        acc[species] = (acc[species] || 0) + 1;
        return acc;
      }, {});

      const speciesLabels = Object.keys(speciesCount);
      const speciesValues = Object.values(speciesCount);

      if (speciesLabels.length > 0) {
        setSpeciesData({
          labels: speciesLabels,
          datasets: [
            {
              label: 'Species Distribution',
              data: speciesValues,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
              ],
              borderWidth: 1,
            },
          ],
        });
      }

      // Status distribution
      const statusCount = filteredSamples.reduce((acc: any, sample) => {
        acc[sample.status] = (acc[sample.status] || 0) + 1;
        return acc;
      }, {});

      const statusLabels = Object.keys(statusCount);
      const statusValues = Object.values(statusCount);

      if (statusLabels.length > 0) {
        setStatusData({
          labels: statusLabels,
          datasets: [
            {
              label: 'Status Distribution',
              data: statusValues,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
              ],
              borderWidth: 1,
            },
          ],
        });
      }
    }
  }, [samples, timeRange]);

  // Calculate statistics
  const totalSubmissions = samples.length;
  const approvedSamples = samples.filter(s => s.status === 'Approved' || s.status === 'Batched').length;
  const rejectedSamples = samples.filter(s => s.status === 'Rejected').length;
  const pendingSamples = samples.filter(s => s.status === 'Pending Review').length;
  
  const avgQualityScore = samples
    .filter(s => s.aiResult?.qualityScore !== undefined)
    .reduce((sum, s) => sum + (s.aiResult?.qualityScore || 0), 0) / 
    samples.filter(s => s.aiResult?.qualityScore !== undefined).length || 0;

  const approvalRate = totalSubmissions > 0 ? (approvedSamples / totalSubmissions) * 100 : 0;

  const handleExport = (format: 'pdf' | 'csv' | 'xlsx') => {
    // In a real app, this would export the report data
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advanced Reports</h1>
          <p className="text-muted-foreground">
            Detailed analytics and insights on herb sample submissions
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {timeRange === '7d' && 'Last 7 Days'}
                {timeRange === '30d' && 'Last 30 Days'}
                {timeRange === '90d' && 'Last 90 Days'}
                {timeRange === '1y' && 'Last Year'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTimeRange('7d')}>
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('30d')}>
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('90d')}>
                Last 90 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('1y')}>
                Last Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                CSV Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                Excel Spreadsheet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Submissions</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-500" />
              {totalSubmissions}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approval Rate</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
              {approvalRate.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Quality Score</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-500" />
              {avgQualityScore.toFixed(1)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              {pendingSamples}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submissions Over Time</CardTitle>
            <CardDescription>Sample submission trend</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData ? (
              <Line data={chartData} options={{ responsive: true }} />
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Not enough data to display chart
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Score Distribution</CardTitle>
            <CardDescription>Distribution of quality scores</CardDescription>
          </CardHeader>
          <CardContent>
            {qualityData ? (
              <Bar data={qualityData} options={{ responsive: true }} />
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Not enough data to display chart
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Species Distribution</CardTitle>
            <CardDescription>Breakdown of identified species</CardDescription>
          </CardHeader>
          <CardContent>
            {speciesData ? (
              <div className="h-64">
                <Pie data={speciesData} options={{ responsive: true }} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Not enough data to display chart
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Distribution of sample statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData ? (
              <div className="h-64">
                <Doughnut data={statusData} options={{ responsive: true }} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Not enough data to display chart
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Sample Data</CardTitle>
          <CardDescription>Comprehensive view of all samples</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Sample ID</th>
                  <th className="text-left py-2">Collector</th>
                  <th className="text-left py-2">Species</th>
                  <th className="text-left py-2">Quality Score</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample) => (
                  <tr key={sample.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 font-mono">{sample.id}</td>
                    <td className="py-2">{sample.collectorName}</td>
                    <td className="py-2">{sample.aiResult?.species || 'N/A'}</td>
                    <td className="py-2">{sample.aiResult?.qualityScore || 'N/A'}</td>
                    <td className="py-2">
                      <span className="capitalize">{sample.status.toLowerCase()}</span>
                    </td>
                    <td className="py-2">
                      {new Date(sample.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}