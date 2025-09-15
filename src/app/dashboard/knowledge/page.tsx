'use client';

import { useState } from 'react';
import { Search, Leaf, Info, Star, Calendar, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const herbDatabase = [
  {
    id: 1,
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum tenuiflorum',
    description: 'A sacred plant in Hinduism, known for its medicinal properties. Used to treat respiratory issues, fever, and stress.',
    benefits: ['Respiratory health', 'Stress relief', 'Immune support'],
    growingConditions: 'Tropical and subtropical climates, well-drained soil, full sun to partial shade',
    harvesting: 'Best harvested in the morning before flowering. Leaves can be picked individually or stems cut.',
    qualityIndicators: 'Look for vibrant green leaves without spots. The plant should have a strong, sweet aroma.',
    image: '/placeholder.svg',
    popularity: 5
  },
  {
    id: 2,
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    description: 'Known as the "village pharmacy" in India. Used for its antibacterial, antiviral, and antifungal properties.',
    benefits: ['Skin health', 'Dental care', 'Blood purification'],
    growingConditions: 'Thrives in tropical and semi-arid regions, drought-resistant, prefers well-drained soil',
    harvesting: 'Leaves can be harvested year-round. Bark is best collected during the summer months.',
    qualityIndicators: 'Fresh green leaves with a bitter taste. Bark should be light brown to grey.',
    image: '/placeholder.svg',
    popularity: 4
  },
  {
    id: 3,
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    description: 'An adaptogenic herb used to reduce stress, increase energy levels, and improve concentration.',
    benefits: ['Stress reduction', 'Energy boost', 'Cognitive enhancement'],
    growingConditions: 'Grows in dry regions, well-drained sandy soil, full sun exposure',
    harvesting: 'Roots are harvested after 1-2 years. Best collected in the fall when the plant dies back.',
    qualityIndicators: 'Roots should be cream-colored inside with minimal woody core. Should have a horse-like smell.',
    image: '/placeholder.svg',
    popularity: 5
  },
  {
    id: 4,
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    description: 'A golden spice with powerful anti-inflammatory and antioxidant properties.',
    benefits: ['Anti-inflammatory', 'Digestive health', 'Joint support'],
    growingConditions: 'Tropical climate, rich organic soil, warm and humid conditions',
    harvesting: 'Harvested 8-10 months after planting when leaves turn yellow and dry.',
    qualityIndicators: 'Rhizomes should be deep orange inside with a strong aroma. Avoid those with dark spots.',
    image: '/placeholder.svg',
    popularity: 5
  },
  {
    id: 5,
    name: 'Brahmi (Water Hyssop)',
    scientificName: 'Bacopa monnieri',
    description: 'Used in Ayurveda to enhance memory and cognitive function.',
    benefits: ['Memory enhancement', 'Anxiety relief', 'Neuroprotection'],
    growingConditions: 'Aquatic or semi-aquatic conditions, moist soil, partial shade',
    harvesting: 'Can be harvested year-round. Best to collect when the plant is actively growing.',
    qualityIndicators: 'Look for succulent, bright green leaves. Avoid yellowing or wilted specimens.',
    image: '/placeholder.svg',
    popularity: 4
  },
  {
    id: 6,
    name: 'Moringa',
    scientificName: 'Moringa oleifera',
    description: 'Known as the "miracle tree" for its nutritional value and medicinal properties.',
    benefits: ['Nutritional supplement', 'Anti-inflammatory', 'Blood sugar regulation'],
    growingConditions: 'Drought-resistant, thrives in tropical and subtropical areas, well-drained soil',
    harvesting: 'Leaves can be harvested every 2-3 months. Pods are picked when young and tender.',
    qualityIndicators: 'Fresh green leaves without yellow spots. Pods should be tender and not fibrous.',
    image: '/placeholder.svg',
    popularity: 5
  }
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHerb, setSelectedHerb] = useState<typeof herbDatabase[0] | null>(null);

  const filteredHerbs = herbDatabase.filter(herb => 
    herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    herb.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    herb.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Herb Knowledge Base</h1>
        <p className="text-muted-foreground">
          Learn about different herb species, their benefits, and cultivation practices
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Herbs</CardTitle>
          <CardDescription>
            Find information about specific herb species
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by herb name, scientific name, or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Herb Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHerbs.map((herb) => (
          <Card 
            key={herb.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedHerb(herb)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{herb.name}</CardTitle>
                  <CardDescription>{herb.scientificName}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {herb.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < herb.popularity
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Herb Detail Modal */}
      {selectedHerb && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-primary" />
                    {selectedHerb.name}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {selectedHerb.scientificName}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedHerb(null)}
                  className="text-2xl"
                >
                  &times;
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                {selectedHerb.description}
              </p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Key Benefits
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedHerb.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Accordion type="single" collapsible>
                <AccordionItem value="growing">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Growing Conditions
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="pt-2">{selectedHerb.growingConditions}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="harvesting">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      Harvesting Guidelines
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="pt-2">{selectedHerb.harvesting}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="quality">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Quality Indicators
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="pt-2">{selectedHerb.qualityIndicators}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex justify-end">
                <Button onClick={() => setSelectedHerb(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}