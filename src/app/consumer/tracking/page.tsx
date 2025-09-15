'use client';

import { useState, useRef, useEffect } from 'react';
import { Eye, QrCode, Search, Leaf, MapPin, Calendar, User, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import jsQR from 'jsqr';

export default function ConsumerTrackingPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock data for batch tracking
  const batchInfo = {
    id: 'BATCH-001',
    productName: 'Organic Turmeric Powder',
    manufacturer: 'MediLeaf Pharmaceuticals',
    harvestDate: '2025-08-15',
    processingDate: '2025-08-20',
    packagingDate: '2025-08-25',
    expiryDate: '2026-08-25',
    origin: 'Kerala, India',
    certifications: ['Organic', 'Non-GMO', 'Fair Trade'],
  };

  const trackingSteps = [
    {
      id: 1,
      title: 'Harvested',
      description: 'Collected from farm in Kerala',
      date: '2025-08-15',
      completed: true,
      actor: 'Farmer: Alice Johnson',
    },
    {
      id: 2,
      title: 'Quality Checked',
      description: 'Passed QC inspection',
      date: '2025-08-18',
      completed: true,
      actor: 'QC Agent: Dave Wilson',
    },
    {
      id: 3,
      title: 'Processed',
      description: 'Processed and dried',
      date: '2025-08-20',
      completed: true,
      actor: 'Manufacturer: MediLeaf Pharmaceuticals',
    },
    {
      id: 4,
      title: 'Packaged',
      description: 'Sealed and labeled',
      date: '2025-08-25',
      completed: true,
      actor: 'Manufacturer: MediLeaf Pharmaceuticals',
    },
    {
      id: 5,
      title: 'Shipped',
      description: 'In transit to distribution center',
      date: '2025-08-27',
      completed: true,
      actor: 'Logistics: FastShip Express',
    },
    {
      id: 6,
      title: 'Delivered',
      description: 'Delivered to your address',
      date: '2025-09-01',
      completed: true,
      actor: 'Courier: FastShip Express',
    },
  ];

  // Start QR code scanning
  const startScanning = async () => {
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanFrame();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsScanning(false);
      alert('Could not access camera. Please ensure you have granted camera permissions.');
    }
  };

  // Stop QR code scanning
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Scan frame for QR code
  const scanFrame = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setScanResult(code.data);
          stopScanning();
          return;
        }
      }
    }
    
    requestAnimationFrame(scanFrame);
  };

  // Handle scan result
  useEffect(() => {
    if (scanResult) {
      // In a real app, you would process the scan result here
      // For now, we'll just show an alert
      alert(`Scanned QR Code: ${scanResult}`);
      // You could also automatically search for the batch using the scan result
      // handleSearch(scanResult);
    }
  }, [scanResult]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Track Batch</h1>
        <p className="text-muted-foreground">
          Verify the authenticity and trace the journey of your herbal products
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter batch ID or scan QR code"
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={startScanning}>
          <QrCode className="mr-2 h-4 w-4" />
          Scan QR Code
        </Button>
      </div>

      {/* QR Scanner Modal */}
      <Dialog open={isScanning} onOpenChange={(open) => !open && stopScanning()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Scan QR Code
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-white rounded-lg w-64 h-64 animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Point your camera at a QR code to scan it
            </p>
            <Button 
              variant="outline" 
              onClick={stopScanning}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Scan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            {batchInfo.productName}
          </CardTitle>
          <CardDescription>
            Manufactured by {batchInfo.manufacturer}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Batch Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch ID:</span>
                  <span className="font-medium">{batchInfo.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harvest Date:</span>
                  <span className="font-medium">{batchInfo.harvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Date:</span>
                  <span className="font-medium">{batchInfo.processingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Packaging Date:</span>
                  <span className="font-medium">{batchInfo.packagingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span className="font-medium">{batchInfo.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Origin:</span>
                  <span className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {batchInfo.origin}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {batchInfo.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Supply Chain Journey
          </CardTitle>
          <CardDescription>
            Track the complete journey of this batch from farm to shelf
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted transform translate-x-1/2"></div>
            
            <div className="space-y-6 pl-12">
              {trackingSteps.map((step) => (
                <div key={step.id} className="relative">
                  {/* Status indicator */}
                  <div className="absolute -left-12 top-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-primary-foreground"></div>
                    )}
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h3 className="font-semibold">{step.title}</h3>
                      <Badge variant={step.completed ? "default" : "secondary"}>
                        {step.date}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <User className="h-3 w-3" />
                      {step.actor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}