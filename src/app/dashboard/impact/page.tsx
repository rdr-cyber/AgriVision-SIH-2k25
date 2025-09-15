'use client';

import { useState, useEffect } from 'react';
import { 
  Leaf, 
  TrendingUp, 
  Users, 
  MapPin, 
  Award, 
  TreePine, 
  Droplets,
  Sun,
  Wind,
  CloudRain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SustainabilityImpactPage() {
  // Mock data for impact metrics
  const [impactData, setImpactData] = useState({
    treesSaved: 12500,
    waterConserved: 250000, // in liters
    co2Reduced: 45000, // in kg
    farmersSupported: 320,
    communitiesImpacted: 45,
    productsVerified: 8900
  });

  // Mock data for environmental impact over time
  const [impactTrend, setImpactTrend] = useState([
    { month: 'Jan', trees: 800, water: 15000, co2: 3000 },
    { month: 'Feb', trees: 950, water: 18000, co2: 3500 },
    { month: 'Mar', trees: 1100, water: 22000, co2: 4000 },
    { month: 'Apr', trees: 1300, water: 26000, co2: 4800 },
    { month: 'May', trees: 1500, water: 30000, co2: 5500 },
    { month: 'Jun', trees: 1700, water: 35000, co2: 6200 }
  ]);

  // Mock data for featured sustainable farms
  const sustainableFarms = [
    {
      id: 1,
      name: 'Green Valley Organic Farm',
      location: 'Kerala, India',
      practices: ['Organic Farming', 'Water Conservation', 'Biodiversity'],
      impact: 'Reduced water usage by 40% through drip irrigation',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Solar Herb Gardens',
      location: 'Rajasthan, India',
      practices: ['Solar Energy', 'Zero Waste', 'Composting'],
      impact: '100% renewable energy powered operations',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Rainwater Harvesters',
      location: 'Maharashtra, India',
      practices: ['Rainwater Harvesting', 'Soil Conservation', 'Native Species'],
      impact: 'Collected 2 million liters of rainwater annually',
      image: '/placeholder.svg'
    }
  ];

  // Mock data for sustainability certifications
  const certifications = [
    {
      id: 1,
      name: 'Organic Certification',
      awarded: 124,
      icon: Leaf
    },
    {
      id: 2,
      name: 'Fair Trade Certified',
      awarded: 89,
      icon: Award
    },
    {
      id: 3,
      name: 'Carbon Neutral',
      awarded: 67,
      icon: Wind
    },
    {
      id: 4,
      name: 'Water Stewardship',
      awarded: 45,
      icon: Droplets
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Sustainability Impact</h1>
        <p className="text-muted-foreground">
          Measuring our positive environmental and social impact
        </p>
      </div>

      {/* Impact Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-500" />
              Trees Preserved
            </CardDescription>
            <CardTitle className="text-3xl">{impactData.treesSaved.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Through sustainable wild harvesting practices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Water Conserved (L)
            </CardDescription>
            <CardTitle className="text-3xl">{impactData.waterConserved.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Through efficient irrigation and conservation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-gray-500" />
              CO2 Reduced (kg)
            </CardDescription>
            <CardTitle className="text-3xl">{impactData.co2Reduced.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Through carbon-neutral supply chains
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Farmers Supported
            </CardDescription>
            <CardTitle className="text-3xl">{impactData.farmersSupported}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Providing sustainable livelihoods
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Communities Impacted
            </CardDescription>
            <CardTitle className="text-3xl">{impactData.communitiesImpacted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Across rural regions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Products Verified
            </CardDescription>
            <CardTitle className="text-3xl">{impactData.productsVerified.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Authenticated sustainable products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Impact Trend Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Over Time</CardTitle>
          <CardDescription>
            Tracking our sustainability progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {impactTrend.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  <div 
                    className="w-full bg-green-500 rounded-t-md mb-1 transition-all duration-500"
                    style={{ height: `${(data.trees / 2000) * 100}%` }}
                  ></div>
                  <div 
                    className="w-full bg-blue-500 rounded-t-md mb-1 transition-all duration-500"
                    style={{ height: `${(data.water / 50000) * 100}%` }}
                  ></div>
                  <div 
                    className="w-full bg-gray-500 rounded-t-md transition-all duration-500"
                    style={{ height: `${(data.co2 / 8000) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">Trees Preserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">Water Conserved (scaled)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span className="text-sm">CO2 Reduced (scaled)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Sustainable Farms */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Featured Sustainable Farms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sustainableFarms.map((farm) => (
            <Card key={farm.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  {farm.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {farm.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Sustainable Practices</p>
                    <div className="flex flex-wrap gap-1">
                      {farm.practices.map((practice, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {practice}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Environmental Impact</p>
                    <p className="text-sm text-muted-foreground">{farm.impact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Certifications and Standards */}
      <Card>
        <CardHeader>
          <CardTitle>Sustainability Certifications</CardTitle>
          <CardDescription>
            Recognizing our commitment to environmental and social responsibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex flex-col items-center p-4 border rounded-lg">
                <cert.icon className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium text-center">{cert.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {cert.awarded} farms certified
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}