'use client';

import { Search, Filter, ShoppingCart, Star, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

export default function ConsumerSearchPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Mock data for products
  const products = [
    {
      id: 'PROD-001',
      name: 'Organic Turmeric Powder',
      manufacturer: 'MediLeaf Pharmaceuticals',
      price: 24.99,
      rating: 4.8,
      image: '/placeholder.svg',
      certifications: ['Organic', 'Non-GMO'],
      description: 'Premium quality turmeric powder with high curcumin content',
    },
    {
      id: 'PROD-002',
      name: 'Ashwagandha Capsules',
      manufacturer: 'Herbal Wellness Co.',
      price: 19.99,
      rating: 4.6,
      image: '/placeholder.svg',
      certifications: ['Organic', 'Vegan'],
      description: 'Standardized ashwagandha extract for stress relief',
    },
    {
      id: 'PROD-003',
      name: 'Triphala Tablets',
      manufacturer: 'Ayurveda Naturals',
      price: 16.99,
      rating: 4.7,
      image: '/placeholder.svg',
      certifications: ['Organic'],
      description: 'Traditional Ayurvedic blend for digestive health',
    },
    {
      id: 'PROD-004',
      name: 'Brahmi Oil',
      manufacturer: 'Ancient Remedies',
      price: 29.99,
      rating: 4.9,
      image: '/placeholder.svg',
      certifications: ['Organic', 'Cold-Pressed'],
      description: 'Pure brahmi oil for hair and scalp health',
    },
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      manufacturer: product.manufacturer,
      image: product.image,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Search Products</h1>
        <p className="text-muted-foreground">
          Find authentic herbal products from verified manufacturers
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for herbs, products, or manufacturers..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.manufacturer}</CardDescription>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {product.rating}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center">
                <Leaf className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {product.certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center">
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              <Button size="sm" onClick={() => handleAddToCart(product)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}