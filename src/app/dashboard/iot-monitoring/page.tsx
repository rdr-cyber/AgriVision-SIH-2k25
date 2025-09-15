'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  Zap, 
  Wifi, 
  Battery, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Leaf
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for IoT sensors
const soilMoistureData = [
  { time: '00:00', moisture: 45 },
  { time: '04:00', moisture: 42 },
  { time: '08:00', moisture: 38 },
  { time: '12:00', moisture: 35 },
  { time: '16:00', moisture: 40 },
  { time: '20:00', moisture: 44 },
];

const temperatureData = [
  { time: '00:00', temp: 22 },
  { time: '04:00', temp: 20 },
  { time: '08:00', temp: 24 },
  { time: '12:00', temp: 28 },
  { time: '16:00', temp: 30 },
  { time: '20:00', temp: 26 },
];

const humidityData = [
  { time: '00:00', humidity: 65 },
  { time: '04:00', humidity: 68 },
  { time: '08:00', humidity: 70 },
  { time: '12:00', humidity: 62 },
  { time: '16:00', humidity: 58 },
  { time: '20:00', humidity: 63 },
];

const lightData = [
  { time: '00:00', light: 0 },
  { time: '04:00', light: 5 },
  { time: '08:00', light: 80 },
  { time: '12:00', light: 100 },
  { time: '16:00', light: 90 },
  { time: '20:00', light: 20 },
];

const deviceStatusData = [
  { name: 'Online', value: 12 },
  { name: 'Offline', value: 2 },
  { name: 'Maintenance', value: 1 },
];

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

const mockDevices = [
  {
    id: 'SENSOR-001',
    name: 'Soil Moisture Sensor',
    type: 'Soil Sensor',
    location: 'Field A - Zone 1',
    status: 'online',
    lastUpdate: '2025-09-15 14:45',
    battery: 85,
    signal: 92
  },
  {
    id: 'SENSOR-002',
    name: 'Weather Station',
    type: 'Weather Sensor',
    location: 'Farm Center',
    status: 'online',
    lastUpdate: '2025-09-15 14:42',
    battery: 95,
    signal: 88
  },
  {
    id: 'SENSOR-003',
    name: 'Irrigation Controller',
    type: 'Actuator',
    location: 'Field B - Zone 3',
    status: 'maintenance',
    lastUpdate: '2025-09-15 10:30',
    battery: 75,
    signal: 95
  },
  {
    id: 'SENSOR-004',
    name: 'Greenhouse Monitor',
    type: 'Multi-Sensor',
    location: 'Greenhouse 1',
    status: 'offline',
    lastUpdate: '2025-09-15 08:15',
    battery: 45,
    signal: 0
  }
];

export default function IoTMonitoringPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [devices, setDevices] = useState(mockDevices);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'maintenance':
        return <RefreshCw className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>;
      case 'offline':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Offline</Badge>;
      case 'maintenance':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const refreshData = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IoT Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time data from your smart farming equipment and sensors.
          </p>
        </div>
        <Button onClick={refreshData} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Soil Moisture</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">
              {soilMoistureData[soilMoistureData.length - 1].moisture > 45 ? 'Above optimal' : 'Optimal range'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25.3°C</div>
            <p className="text-xs text-muted-foreground">Ideal for herb growth</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Humidity</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64%</div>
            <p className="text-xs text-muted-foreground">Comfortable conditions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Light Intensity</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">Sufficient for photosynthesis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Soil Moisture Over Time</CardTitle>
            <CardDescription>
              Moisture levels in your fields throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={soilMoistureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[30, 50]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="moisture" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temperature & Humidity</CardTitle>
            <CardDescription>
              Ambient conditions in your growing areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="temp" 
                    data={temperatureData}
                    name="Temperature (°C)"
                    stroke="#ef4444" 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="humidity" 
                    data={humidityData}
                    name="Humidity (%)"
                    stroke="#06b6d4" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Light Exposure</CardTitle>
            <CardDescription>
              Photosynthetically active radiation throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="light" fill="#f59e0b" name="Light Intensity (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
            <CardDescription>
              Health of your IoT devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
          <CardDescription>
            Status of all IoT devices in your network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {devices.map((device) => (
              <div key={device.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{device.name}</h3>
                    <p className="text-sm text-muted-foreground">{device.type}</p>
                  </div>
                  {getStatusIcon(device.status)}
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Location</span>
                    <span className="text-sm font-medium">{device.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    {getStatusBadge(device.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Battery</span>
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4" />
                      <span className="text-sm font-medium">{device.battery}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Signal</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      <span className="text-sm font-medium">{device.signal}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Update</span>
                    <span className="text-sm">{device.lastUpdate}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  {device.status === 'maintenance' && (
                    <Button size="sm">Complete Maintenance</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}