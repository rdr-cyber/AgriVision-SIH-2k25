'use client';

import { useState, useEffect, useContext, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  FileText
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

function CollectionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { samples } = useContext(SampleContext);
  const [filteredSamples, setFilteredSamples] = useState<HerbSample[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HerbSampleStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'quality' | 'species'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Get search query from URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Filter and sort samples
  useEffect(() => {
    let result = [...samples];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sample => 
        sample.id.toLowerCase().includes(query) ||
        sample.aiResult?.species.toLowerCase().includes(query) ||
        sample.notes?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(sample => sample.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'quality':
          const qualityA = a.aiResult?.qualityScore || 0;
          const qualityB = b.aiResult?.qualityScore || 0;
          comparison = qualityA - qualityB;
          break;
        case 'species':
          const speciesA = a.aiResult?.species || '';
          const speciesB = b.aiResult?.species || '';
          comparison = speciesA.localeCompare(speciesB);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    setFilteredSamples(result);
  }, [samples, searchQuery, statusFilter, sortBy, sortOrder]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    router.push(`/dashboard/collections?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Collections</h1>
        <p className="text-muted-foreground">
          View and manage all your herb sample submissions
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, species, or notes..."
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by: {sortBy} {sortOrder === 'desc' ? '↓' : '↑'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSortBy('date')}>
                    Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('quality')}>
                    Quality Score {sortBy === 'quality' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('species')}>
                    Species {sortBy === 'species' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOrder('desc')}>
                    Descending {sortOrder === 'desc' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('asc')}>
                    Ascending {sortOrder === 'asc' && '✓'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {filteredSamples.length} of {samples.length} samples
        </p>
      </div>

      {/* Samples Grid */}
      {filteredSamples.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSamples.map((sample) => (
            <Card 
              key={sample.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/collections/${sample.id}`)}
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">{sample.id}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(sample.timestamp).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(sample.status)}>
                    {sample.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {sample.aiResult?.species && (
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{sample.aiResult.species}</span>
                  </div>
                )}
                <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2">
                  <Image
                    src={sample.imageUrl}
                    alt={sample.aiResult?.species || 'Herb sample'}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Quality: {sample.aiResult?.qualityScore || 'N/A'}/100
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No samples found</h3>
          <p className="mt-1 text-muted-foreground">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by submitting your first herb sample.'}
          </p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/dashboard/submit')}
          >
            Submit Sample
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionsPageContent />
    </Suspense>
  );
}