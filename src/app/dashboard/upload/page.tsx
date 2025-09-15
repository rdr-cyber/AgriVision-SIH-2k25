import { SampleUploadForm } from '@/components/sample-upload-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UploadPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Analyze New Herb Sample
          </CardTitle>
          <CardDescription>
            Upload a high-quality image of the herb sample. Our AI will analyze
            it for species and quality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SampleUploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
