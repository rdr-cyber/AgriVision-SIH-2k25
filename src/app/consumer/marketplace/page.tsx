'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Leaf, 
  MapPin, 
  Award, 
  Heart,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

// Mock data for herb products
const products = [
  {
    id: 'prod-001',
    name: 'Organic Tulsi Tea',
    farmer: 'Green Valley Farms',
    location: 'Kerala, India',
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.8,
    reviews: 124,
    image: '/placeholder.svg',
    category: 'Tea',
    certifications: ['Organic', 'Fair Trade'],
    description: 'Premium organic tulsi leaves for a refreshing and healthy tea experience.',
    inStock: true,
    featured: true
  },
  {
    id: 'prod-002',
    name: 'Neem Leaf Powder',
    farmer: 'Herbal Wellness Co.',
    location: 'Maharashtra, India',
    price: 199,
    originalPrice: 249,
    discount: 20,
    rating: 4.6,
    reviews: 89,
    image: '/placeholder.svg',
    category: 'Powder',
    certifications: ['Organic'],
    description: '100% pure neem leaf powder for skin and health benefits.',
    inStock: true,
    featured: false
  },
  {
    id: 'prod-003',
    name: 'Ashwagandha Capsules',
    farmer: 'Ayurvedic Roots',
    location: 'Rajasthan, India',
    price: 599,
    originalPrice: 699,
    discount: 14,
    rating: 4.9,
    reviews: 215,
    image: '/placeholder.svg',
    category: 'Supplements',
    certifications: ['Organic', 'Ayurvedic'],
    description: 'Standardized ashwagandha extract in vegetarian capsules.',
    inStock: true,
    featured: true
  },
  {
    id: 'prod-004',
    name: 'Turmeric Golden Milk Mix',
    farmer: 'Spice Masters',
    location: 'Karnataka, India',
    price: 349,
    originalPrice: 399,
    discount: 13,
    rating: 4.7,
    reviews: 156,
    image: '/placeholder.svg',
    category: 'Mixes',
    certifications: ['Organic'],
    description: 'Ready-to-make golden milk blend with turmeric, ginger, and spices.',
    inStock: false,
    featured: false
  },
  {
    id: 'prod-005',
    name: 'Brahmi Hair Oil',
    farmer: 'Natural Care',
    location: 'Tamil Nadu, India',
    price: 449,
    originalPrice: 499,
    discount: 10,
    rating: 4.5,
    reviews: 78,
    image: '/placeholder.svg',
    category: 'Oils',
    certifications: ['Ayurvedic'],
    description: 'Traditional brahmi-infused hair oil for stronger, healthier hair.',
    inStock: true,
    featured: false
  },
  {
    id: 'prod-006',
    name: 'Moringa Leaf Powder',
    farmer: 'Superfood Farms',
    location: 'Uttar Pradesh, India',
    price: 279,
    originalPrice: 329,
    discount: 15,
    rating: 4.8,
    reviews: 92,
    image: '/placeholder.svg',
    category: 'Powder',
    certifications: ['Organic'],
    description: 'Nutrient-dense moringa leaf powder, a natural multivitamin.',
    inStock: true,
    featured: true
  }
];

export default function ConsumerMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    // Default sort by featured
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      manufacturer: product.farmer,
      image: product.image,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setCategoryFilter(e.target.value);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Herb Marketplace</h1>
        <p className="text-muted-foreground">
          Discover and purchase high-quality herb products from verified farmers
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Products</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, farmers, or categories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Category: {categoryFilter === 'all' ? 'All' : categoryFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                    All Categories
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {categories.map(category => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by: {sortBy === 'featured' ? 'Featured' : 
                              sortBy === 'price-low' ? 'Price: Low to High' :
                              sortBy === 'price-high' ? 'Price: High to Low' :
                              'Top Rated'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSortBy('featured')}>
                    Featured
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-low')}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-high')}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('rating')}>
                    Top Rated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-0 relative">
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Award className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(product.id) 
                          ? 'fill-red-500 text-red-500' 
                          : ''
                      }`} 
                    />
                  </Button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg py-2 px-4">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {product.farmer} • {product.location}
                    </CardDescription>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">₹{product.price}</span>
                      {product.discount > 0 && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice}
                          </span>
                          <Badge variant="destructive">
                            {product.discount}% off
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/consumer/marketplace/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}