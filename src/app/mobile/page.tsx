'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  Camera, 
  Wifi, 
  Battery, 
  Cloud, 
  Leaf,
  QrCode,
  Bell,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MobileAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">AgriVision</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-green-700 hover:text-green-900">Features</Link>
            <Link href="#download" className="text-green-700 hover:text-green-900">Download</Link>
            <Link href="#support" className="text-green-700 hover:text-green-900">Support</Link>
          </nav>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <Badge className="mb-4" variant="secondary">Now Available</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
              AgriVision Mobile App
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Take the power of AgriVision with you wherever you go. Upload samples, track batches, 
              and connect with the community from your smartphone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Download className="mr-2 h-5 w-5" />
                Download for iOS
              </Button>
              <Button size="lg" variant="outline">
                <Download className="mr-2 h-5 w-5" />
                Download for Android
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative mx-auto w-80 h-96 bg-gray-800 rounded-3xl p-2 shadow-2xl">
              {/* Phone frame */}
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                {/* Status bar */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-white flex items-center justify-between px-4 text-xs">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    <Battery className="h-3 w-3" />
                  </div>
                </div>
                
                {/* App content */}
                <div className="pt-8 px-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-green-800">AgriVision</h2>
                    <Bell className="h-5 w-5 text-gray-600" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">Samples</span>
                        </div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-gray-500">This week</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <QrCode className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">Batches</span>
                        </div>
                        <p className="text-2xl font-bold">5</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-auto mb-4">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Camera className="mr-2 h-4 w-4" />
                      Upload Sample
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your herb cultivation and quality control on the go.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Camera className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Instantly identify herb species and assess quality with our advanced AI technology.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Cloud className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Offline Capability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Work even without internet. Data syncs automatically when you're back online.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>GPS Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automatically record collection locations with precise GPS coordinates.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <QrCode className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Batch Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create, track, and verify batches with blockchain-secured QR codes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Bell className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Real-time Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get instant updates on sample status, batch approvals, and community messages.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Leaf className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access our comprehensive herb cultivation guides and best practices anywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Get Started Today</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Download the AgriVision mobile app and transform your herb cultivation workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg py-6 px-8">
              <Download className="mr-3 h-6 w-6" />
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="text-lg py-6 px-8">
              <Download className="mr-3 h-6 w-6" />
              Download for Android
            </Button>
          </div>
          
          <div className="mt-12 max-w-4xl mx-auto">
            <Image 
              src="/mobile-screens.png" 
              alt="AgriVision mobile app screens" 
              width={800} 
              height={400} 
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Need Help?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Our support team is here to help you get the most out of AgriVision.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button variant="outline" size="lg">
              Contact Support
            </Button>
            <Button variant="outline" size="lg">
              User Guide
            </Button>
            <Button variant="outline" size="lg">
              FAQ
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Leaf className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">AgriVision</span>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-green-300">Privacy</Link>
              <Link href="/terms" className="hover:text-green-300">Terms</Link>
              <Link href="/contact" className="hover:text-green-300">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-green-300">
            <p>© 2025 AgriVision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}