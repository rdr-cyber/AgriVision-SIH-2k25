'use client';

import { useState, useEffect, useContext } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SampleContext } from '@/context/sample-context';
import type { HerbSample } from '@/lib/types';

type SeriesPoint = { label: string; value: number };
type ChartData = {
  weekly: SeriesPoint[];
  monthly: SeriesPoint[];
  yearly: SeriesPoint[];
};

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

export default function AnalyticsPage() {
  const { samples } = useContext(SampleContext);
  const [chartData, setChartData] = useState<any>(null);
  const [qualityData, setQualityData] = useState<any>(null);
  const [speciesData, setSpeciesData] = useState<any>(null);

  useEffect(() => {
    if (samples.length > 0) {
      // Prepare data for submissions over time chart
      const submissionsByDate = samples.reduce((acc: any, sample) => {
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

      // Prepare data for quality score distribution
      const qualityScores = samples
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

      // Prepare data for species distribution
      const speciesCount = samples.reduce((acc: any, sample) => {
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
    }
  }, [samples]);

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

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Insights into your herb sample submissions and quality metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Submissions</CardDescription>
            <CardTitle className="text-3xl">{totalSubmissions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approval Rate</CardDescription>
            <CardTitle className="text-3xl">{approvalRate.toFixed(1)}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Quality Score</CardDescription>
            <CardTitle className="text-3xl">{avgQualityScore.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl">{pendingSamples}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submissions Over Time</CardTitle>
            <CardDescription>Your sample submission trend</CardDescription>
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

        <Card className="lg:col-span-2">
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
      </div>

      {/* Recent Samples Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Samples</CardTitle>
          <CardDescription>Your most recent submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Sample ID</th>
                  <th className="text-left py-2">Species</th>
                  <th className="text-left py-2">Quality Score</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {samples.slice(0, 5).map((sample) => (
                  <tr key={sample.id} className="border-b">
                    <td className="py-2 font-mono">{sample.id}</td>
                    <td className="py-2">{sample.aiResult?.species || 'N/A'}</td>
                    <td className="py-2">{sample.aiResult?.qualityScore || 'N/A'}</td>
                    <td className="py-2">
                      <Badge variant={
                        sample.status === 'Approved' ? 'default' :
                        sample.status === 'Rejected' ? 'destructive' :
                        sample.status === 'Batched' ? 'secondary' : 'outline'
                      }>
                        {sample.status}
                      </Badge>
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