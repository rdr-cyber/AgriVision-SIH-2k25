'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Video, 
  Download, 
  FileText, 
  HelpCircle, 
  MessageCircle,
  ExternalLink,
  Leaf,
  LifeBuoy,
  Truck
} from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
  const docs = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using the Agrivision platform',
      icon: BookOpen,
      link: '#getting-started',
      type: 'guide'
    },
    {
      title: 'Sample Submission',
      description: 'How to properly collect and submit herb samples',
      icon: FileText,
      link: '#sample-submission',
      type: 'guide'
    },
    {
      title: 'Quality Standards',
      description: 'Understanding quality scores and approval criteria',
      icon: HelpCircle,
      link: '#quality-standards',
      type: 'guide'
    },
    {
      title: 'Batch Management',
      description: 'Creating and managing herb sample batches',
      icon: Download,
      link: '#batch-management',
      type: 'guide'
    },
    {
      title: 'Platform Tutorial',
      description: 'Video walkthrough of key platform features',
      icon: Video,
      link: '#tutorial',
      type: 'video'
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions and answers',
      icon: HelpCircle,
      link: '#faq',
      type: 'guide'
    },
    {
      title: 'Advanced Features',
      description: 'Documentation for mobile app, disease detection, and IoT monitoring',
      icon: Leaf,
      link: '/dashboard/docs/advanced-features',
      type: 'guide'
    }
  ];

  const resources = [
    {
      title: 'User Manual',
      description: 'Complete guide to all platform features',
      icon: FileText,
      link: '#',
      type: 'pdf'
    },
    {
      title: 'Best Practices',
      description: 'Tips for maximizing your success on the platform',
      icon: BookOpen,
      link: '#',
      type: 'pdf'
    },
    {
      title: 'Technical Specifications',
      description: 'Detailed technical information about the platform',
      icon: FileText,
      link: '#',
      type: 'pdf'
    }
  ];

  const features = [
    {
      title: 'Disease Detection',
      description: 'AI-powered disease detection for your herb samples',
      icon: Leaf,
      link: '/dashboard/disease-detection'
    },
    {
      title: 'Financial Services',
      description: 'Access loans and financial tools for your business',
      icon: LifeBuoy,
      link: '/dashboard/financial-services'
    },
    {
      title: 'Supply Chain',
      description: 'Track your products from farm to consumer',
      icon: Truck,
      link: '/dashboard/supply-chain'
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Documentation & Resources</h1>
        <p className="text-muted-foreground">
          Find guides, tutorials, and resources to help you use the Agrivision platform effectively
        </p>
        <p className="text-sm text-muted-foreground">
          It&apos;s easy to get started, and you&apos;ll be up and running in no time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <doc.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href={doc.link}>
                  {doc.type === 'video' ? 'Watch Video' : 'Read Guide'}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Downloadable Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <resource.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-md">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={resource.link}>
                    Download PDF
                    <Download className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Need Help?
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Our support team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link href="/dashboard/support">
                Contact Support
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/chat">
                Chat with Team
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}