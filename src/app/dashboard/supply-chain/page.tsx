'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Truck, 
  Package, 
  Calendar, 
  Thermometer, 
  Droplets,
  Leaf,
  QrCode,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for supply chain tracking
const mockSupplyChainData = [
  {
    id: 'BATCH-001',
    product: 'Organic Basil',
    origin: 'Farm A, Maharashtra',
    destination: 'Processing Unit B, Pune',
    status: 'In Transit',
    temperature: '22°C',
    humidity: '65%',
    lastUpdate: '2025-09-15 14:30',
    estimatedArrival: '2025-09-16 09:00',
    checkpoints: [
      { location: 'Farm A', timestamp: '2025-09-14 08:00', status: 'Harvested' },
      { location: 'Cold Storage', timestamp: '2025-09-14 12:00', status: 'Stored' },
      { location: 'Transport Hub', timestamp: '2025-09-15 06:00', status: 'Dispatched' },
      { location: 'In Transit', timestamp: '2025-09-15 14:30', status: 'Current Location' },
    ]
  },
  {
    id: 'BATCH-002',
    product: 'Fresh Mint',
    origin: 'Farm C, Kerala',
    destination: 'Distribution Center D, Bangalore',
    status: 'Delivered',
    temperature: '18°C',
    humidity: '70%',
    lastUpdate: '2025-09-14 16:45',
    estimatedArrival: '2025-09-14 16:30',
    checkpoints: [
      { location: 'Farm C', timestamp: '2025-09-12 07:30', status: 'Harvested' },
      { location: 'Cold Storage', timestamp: '2025-09-12 11:00', status: 'Stored' },
      { location: 'Transport Hub', timestamp: '2025-09-13 05:00', status: 'Dispatched' },
      { location: 'Distribution Center D', timestamp: '2025-09-14 16:45', status: 'Delivered' },
    ]
  },
  {
    id: 'BATCH-003',
    product: 'Premium Rosemary',
    origin: 'Farm E, Himachal Pradesh',
    destination: 'Export Facility F, Mumbai',
    status: 'Processing',
    temperature: '20°C',
    humidity: '60%',
    lastUpdate: '2025-09-15 10:15',
    estimatedArrival: '2025-09-17 12:00',
    checkpoints: [
      { location: 'Farm E', timestamp: '2025-09-13 09:00', status: 'Harvested' },
      { location: 'Processing Unit', timestamp: '2025-09-14 14:00', status: 'Processed' },
      { location: 'Quality Check', timestamp: '2025-09-15 10:15', status: 'Approved' },
    ]
  }
];

// Mock temperature data for chart
const temperatureData = [
  { time: '00:00', temp: 20 },
  { time: '04:00', temp: 19 },
  { time: '08:00', temp: 21 },
  { time: '12:00', temp: 23 },
  { time: '16:00', temp: 22 },
  { time: '20:00', temp: 21 },
];

export default function SupplyChainPage() {
  const [selectedBatch, setSelectedBatch] = useState(mockSupplyChainData[0]);
  const [timeRange, setTimeRange] = useState('24h');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Transit':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'Processing':
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'In Transit':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Transit</Badge>;
      case 'Processing':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Supply Chain Tracking</h1>
        <p className="text-muted-foreground">
          Monitor the journey of herb batches from farm to consumer with real-time updates.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently moving</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transit Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32h</div>
            <p className="text-xs text-muted-foreground">-2h from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Batch Tracking</CardTitle>
            <CardDescription>
              Select a batch to view detailed tracking information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Select onValueChange={(value) => {
                  const batch = mockSupplyChainData.find(b => b.id === value);
                  if (batch) setSelectedBatch(batch);
                }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSupplyChainData.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.id} - {batch.product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-2" />
                    Scan QR
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{selectedBatch.product}</h3>
                    <p className="text-sm text-muted-foreground">{selectedBatch.id}</p>
                  </div>
                  {getStatusBadge(selectedBatch.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Origin</p>
                      <p className="text-sm text-muted-foreground">{selectedBatch.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm text-muted-foreground">{selectedBatch.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Temperature</p>
                      <p className="text-sm text-muted-foreground">{selectedBatch.temperature}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Humidity</p>
                      <p className="text-sm text-muted-foreground">{selectedBatch.humidity}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-sm font-medium">Last Update</p>
                    <p className="text-sm text-muted-foreground">{selectedBatch.lastUpdate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Est. Arrival</p>
                    <p className="text-sm text-muted-foreground">{selectedBatch.estimatedArrival}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Tracking History</h4>
                <div className="space-y-3">
                  {selectedBatch.checkpoints.map((checkpoint, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      </div>
                      <div className="flex-1 pb-3 border-l pl-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{checkpoint.location}</span>
                          {checkpoint.status === 'Current Location' && (
                            <Badge variant="outline" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{checkpoint.timestamp}</p>
                        <p className="text-sm">{checkpoint.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Monitoring</CardTitle>
              <CardDescription>
                Real-time temperature and humidity data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24h</SelectItem>
                      <SelectItem value="7d">Last 7d</SelectItem>
                      <SelectItem value="30d">Last 30d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span>Temperature (°C)</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Batches</CardTitle>
              <CardDescription>
                Overview of all active batches in the supply chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Destination</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSupplyChainData.map((batch) => (
                    <TableRow 
                      key={batch.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedBatch(batch)}
                    >
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell>{batch.product}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(batch.status)}
                          {getStatusBadge(batch.status)}
                        </div>
                      </TableCell>
                      <TableCell>{batch.destination}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}