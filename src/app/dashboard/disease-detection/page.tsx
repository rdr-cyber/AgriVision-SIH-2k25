'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  Scan, 
  Leaf, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function DiseaseDetectionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // In a real implementation, this would call your AI service
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated result - in a real app, this would come from your AI service
      const mockResult = {
        disease: "Powdery Mildew",
        confidence: 92,
        severity: "Moderate",
        recommendations: [
          "Apply sulfur-based fungicide immediately",
          "Improve air circulation around plants",
          "Remove and dispose of infected leaves",
          "Avoid overhead watering"
        ],
        prevention: [
          "Space plants adequately for better airflow",
          "Water at soil level, not on leaves",
          "Choose resistant varieties when possible",
          "Regularly inspect plants for early signs"
        ]
      };
      
      setResult(mockResult);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Disease Detection</h1>
        <p className="text-muted-foreground">
          Upload an image of your herb plant to detect diseases using AI-powered analysis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Take a clear photo of the affected plant part for best results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={triggerFileInput}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {image ? (
                <div className="relative h-64 w-full">
                  <Image 
                    src={image} 
                    alt="Uploaded plant" 
                    fill 
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <>
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-medium">Click to upload an image</p>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop an image here
                  </p>
                  <Button variant="secondary" className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Select Image
                  </Button>
                </>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={analyzeImage} 
                disabled={isAnalyzing || !image}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-4 w-4" />
                    Analyze for Diseases
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setImage(null);
                  setResult(null);
                  setError(null);
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered disease detection and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{result.disease}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">
                        Confidence: {result.confidence}%
                      </Badge>
                      <Badge 
                        variant={
                          result.severity === "Severe" ? "destructive" : 
                          result.severity === "Moderate" ? "default" : "secondary"
                        }
                      >
                        {result.severity}
                      </Badge>
                    </div>
                  </div>
                  <Leaf className="h-12 w-12 text-green-600" />
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
                    Treatment Recommendations
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Prevention Tips
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.prevention.map((tip: string, index: number) => (
                      <li key={index} className="text-sm">{tip}</li>
                    ))}
                  </ul>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    This analysis is provided for informational purposes only. 
                    For serious plant health issues, consult with a local agricultural extension service.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Scan className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-1">No Analysis Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload an image and click "Analyze for Diseases" to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">1. Upload Image</h3>
              <p className="text-sm text-muted-foreground">
                Take a clear photo of the affected plant part
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Scan className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">2. AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our AI examines the image for signs of disease
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">3. Get Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Receive treatment and prevention advice
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}