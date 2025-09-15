'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FlaskConical, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SampleContext } from '@/context/sample-context';
import type { HerbSample, HerbSampleStatus } from '@/lib/types';

export default function QCDashboardPage() {
  const router = useRouter();
  const { samples, updateSample } = useContext(SampleContext);
  const [filteredSamples, setFilteredSamples] = useState<HerbSample[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HerbSampleStatus | 'all'>('Pending Review');

  // Filter samples
  useEffect(() => {
    let result = [...samples];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sample => 
        sample.id.toLowerCase().includes(query) ||
        sample.aiResult?.species.toLowerCase().includes(query) ||
        sample.collectorName.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(sample => sample.status === statusFilter);
    }
    
    setFilteredSamples(result);
  }, [samples, searchQuery, statusFilter]);

  const handleApprove = (sampleId: string) => {
    updateSample(sampleId, {
      status: 'Approved',
      qcReview: {
        status: 'Approved',
        agentId: 'current-agent-id', // In real app, get from auth context
        agentName: 'QC Agent', // In real app, get from auth context
        timestamp: new Date().toISOString()
      }
    });
  };

  const handleReject = (sampleId: string, reason: string) => {
    updateSample(sampleId, {
      status: 'Rejected',
      qcReview: {
        status: 'Rejected',
        agentId: 'current-agent-id', // In real app, get from auth context
        agentName: 'QC Agent', // In real app, get from auth context
        timestamp: new Date().toISOString(),
        reason
      }
    });
  };

  const pendingReview = samples.filter(s => s.status === 'Pending Review').length;
  const approvedToday = samples.filter(s => 
    s.status === 'Approved' && 
    new Date(s.qcReview?.timestamp || '').toDateString() === new Date().toDateString()
  ).length;
  const rejectedToday = samples.filter(s => 
    s.status === 'Rejected' && 
    new Date(s.qcReview?.timestamp || '').toDateString() === new Date().toDateString()
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
      case 'Pending Review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400';
      case 'Batched': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      case 'Appealed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Quality Control Dashboard</h1>
        <p className="text-muted-foreground">
          Review and manage herb sample submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Activity className="h-6 w-6 text-amber-500" />
              {pendingReview}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved Today</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              {approvedToday}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected Today</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              {rejectedToday}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Samples</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, species, or collector..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('Pending Review')}>
                    Pending Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Approved')}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Rejected')}>
                    Rejected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Batched')}>
                    Batched
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Appealed')}>
                    Appealed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Samples Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Submissions</CardTitle>
          <CardDescription>
            Review and manage herb samples submitted by farmers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSamples.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Sample</th>
                    <th className="text-left py-2">Collector</th>
                    <th className="text-left py-2 hidden md:table-cell">Species (AI)</th>
                    <th className="text-left py-2">Quality Score</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSamples.map((sample) => (
                    <tr key={sample.id} className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden">
                            <Image
                              src={sample.imageUrl}
                              alt={sample.aiResult?.species || 'Herb sample'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{sample.id}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(sample.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-full">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{sample.collectorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 hidden md:table-cell">
                        {sample.aiResult?.species || 'N/A'}
                      </td>
                      <td className="py-3">
                        {sample.aiResult?.qualityScore || 'N/A'}
                      </td>
                      <td className="py-3">
                        <Badge className={getStatusColor(sample.status)}>
                          {sample.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          {sample.status === 'Pending Review' ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleApprove(sample.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => {
                                  const reason = prompt('Enter rejection reason:');
                                  if (reason) handleReject(sample.id, reason);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => router.push(`/dashboard/collections/${sample.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No samples found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'There are no samples matching your current filters'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}