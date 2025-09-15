'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  QrCode,
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
import type { Batch, HerbSample } from '@/lib/types';

export default function BatchesPage() {
  const router = useRouter();
  const { samples } = useContext(SampleContext);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'processing' | 'completed' | 'shipped'>('all');

  // Mock batch data - in a real app this would come from an API
  useEffect(() => {
    const mockBatches: Batch[] = [
      {
        id: 'BATCH-2023-001',
        manufacturerId: 'mfg1',
        manufacturerName: 'Herbal Solutions Ltd',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        sampleIds: ['SMP-2023-001', 'SMP-2023-002', 'SMP-2023-003'],
        batchHash: 'a1b2c3d4e5f',
        qrCodeUrl: '/qr-code-placeholder.png',
        blockchainAnchor: {
          txId: 'tx-abc123',
          chain: 'Ethereum',
          timestamp: new Date(Date.now() - 43200000).toISOString()
        }
      },
      {
        id: 'BATCH-2023-002',
        manufacturerId: 'mfg1',
        manufacturerName: 'Herbal Solutions Ltd',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        sampleIds: ['SMP-2023-004', 'SMP-2023-005'],
        batchHash: 'f5e4d3c2b1a',
        qrCodeUrl: '/qr-code-placeholder.png'
      },
      {
        id: 'BATCH-2023-003',
        manufacturerId: 'mfg1',
        manufacturerName: 'Herbal Solutions Ltd',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        sampleIds: ['SMP-2023-006', 'SMP-2023-007', 'SMP-2023-008', 'SMP-2023-009'],
        batchHash: '9876543210',
        qrCodeUrl: '/qr-code-placeholder.png',
        blockchainAnchor: {
          txId: 'tx-def456',
          chain: 'Polygon',
          timestamp: new Date(Date.now() - 129600000).toISOString()
        }
      }
    ];
    setBatches(mockBatches);
    setFilteredBatches(mockBatches);
  }, []);

  // Filter batches
  useEffect(() => {
    let result = [...batches];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(batch => 
        batch.id.toLowerCase().includes(query) ||
        batch.manufacturerName.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      // In a real app, this would filter by actual batch status
      // For now, we'll just filter by whether blockchainAnchor exists
      if (statusFilter === 'completed') {
        result = result.filter(batch => batch.blockchainAnchor);
      } else if (statusFilter === 'processing') {
        result = result.filter(batch => !batch.blockchainAnchor);
      }
    }
    
    setFilteredBatches(result);
  }, [batches, searchQuery, statusFilter]);

  const getStatusColor = (batch: Batch) => {
    if (batch.blockchainAnchor) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
    }
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400';
  };

  const getStatusText = (batch: Batch) => {
    if (batch.blockchainAnchor) {
      return 'Completed';
    }
    return 'Processing';
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Batch Management</h1>
          <p className="text-muted-foreground">
            Manage and track your herb sample batches
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/batches/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Batch
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by batch ID or manufacturer..."
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
                    Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('processing')}>
                    Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('shipped')}>
                    Shipped
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {filteredBatches.length} of {batches.length} batches
        </p>
      </div>

      {/* Batches Grid */}
      {filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <Card 
              key={batch.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/batches/${batch.id}`)}
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">{batch.id}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(batch)}>
                    {getStatusText(batch)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Manufacturer</p>
                    <p className="font-medium">{batch.manufacturerName}</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Samples</p>
                      <p className="font-medium">{batch.sampleIds.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Blockchain</p>
                      <p className="font-medium">
                        {batch.blockchainAnchor ? batch.blockchainAnchor.chain : 'Pending'}
                      </p>
                    </div>
                  </div>
                  {batch.blockchainAnchor && (
                    <div className="flex items-center gap-2 pt-2">
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate">
                        {batch.blockchainAnchor.txId}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No batches found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'You haven\'t created any batches yet'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => router.push('/dashboard/batches/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Batch
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}