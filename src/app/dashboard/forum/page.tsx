'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Calendar, 
  ThumbsUp, 
  MessageCircle,
  Award,
  Leaf
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Post } from '@/lib/types';

// Mock data for forum posts
const forumPosts = [
  {
    id: 1,
    title: 'Best practices for organic tulsi cultivation?',
    author: 'Farmer Rajesh',
    role: 'farmer',
    timestamp: '2023-06-15T10:30:00Z',
    content: 'I\'m looking to expand my tulsi farm organically. What are the best practices for soil preparation and pest management without using chemicals?',
    category: 'Cultivation',
    likes: 24,
    replies: 8,
    isResolved: true,
    tags: ['Organic', 'Tulsi', 'Pest Management']
  },
  {
    id: 2,
    title: 'Understanding quality scores for herb samples',
    author: 'QC Agent Priya',
    role: 'qc',
    timestamp: '2023-06-14T14:15:00Z',
    content: 'Several farmers have been asking about how quality scores are determined. Can we create a detailed guide explaining the criteria?',
    category: 'Quality Control',
    likes: 18,
    replies: 12,
    isResolved: false,
    tags: ['Quality Score', 'Guidelines', 'FAQ']
  },
  {
    id: 3,
    title: 'New blockchain verification feature feedback',
    author: 'Admin Team',
    role: 'admin',
    timestamp: '2023-06-12T09:45:00Z',
    content: 'We\'ve rolled out the new blockchain verification feature. Please share your feedback and report any issues you encounter.',
    category: 'Platform Updates',
    likes: 32,
    replies: 15,
    isResolved: false,
    tags: ['Blockchain', 'Feedback', 'New Feature']
  },
  {
    id: 4,
    title: 'Herbal supplement dosage recommendations',
    author: 'Consumer Anjali',
    role: 'consumer',
    timestamp: '2023-06-10T16:20:00Z',
    content: 'I\'m new to herbal supplements. What are the recommended dosages for common herbs like ashwagandha and turmeric?',
    category: 'Health & Wellness',
    likes: 15,
    replies: 6,
    isResolved: false,
    tags: ['Dosage', 'Supplements', 'Health']
  },
  {
    id: 5,
    title: 'Batch processing delays - explanation needed',
    author: 'Manufacturer Deepak',
    role: 'manufacturer',
    timestamp: '2023-06-08T11:30:00Z',
    content: 'We\'ve noticed delays in batch processing this week. Can the admin team provide an update on what\'s causing this?',
    category: 'Operations',
    likes: 9,
    replies: 4,
    isResolved: false,
    tags: ['Batch Processing', 'Delay', 'Operations']
  }
];

// Mock data for categories
const categories = [
  { name: 'All Categories', count: 25 },
  { name: 'Cultivation', count: 8 },
  { name: 'Quality Control', count: 5 },
  { name: 'Platform Updates', count: 3 },
  { name: 'Health & Wellness', count: 6 },
  { name: 'Operations', count: 3 }
];

export default function CommunityForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('latest');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.likes + b.replies - (a.likes + a.replies);
    if (sortBy === 'latest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    return 0;
  });

  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      // In a real app, this would submit to an API
      console.log('Creating new post:', { title: newPostTitle, content: newPostContent });
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPostForm(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'farmer': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Farmer</Badge>;
      case 'qc': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">QC Agent</Badge>;
      case 'admin': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>;
      case 'manufacturer': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Manufacturer</Badge>;
      case 'consumer': return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">Consumer</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">User</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">
            Connect, discuss, and share knowledge with the Agrivision community
          </p>
        </div>
        <Button onClick={() => setShowNewPostForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>
              Share your question, idea, or discussion with the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="post-title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="post-title"
                placeholder="Enter a descriptive title for your post"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="post-content" className="block text-sm font-medium mb-1">
                Content
              </label>
              <textarea
                id="post-content"
                placeholder="Describe your question or topic in detail..."
                className="w-full min-h-[120px] p-3 border rounded-md bg-background"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                Create Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Discussions</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
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
                    Category: {selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category.name} 
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name} {category.name !== 'All Categories' && `(${category.count})`}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by: {sortBy === 'latest' ? 'Latest' : 'Popular'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSortBy('latest')}>
                    Latest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('popular')}>
                    Popular
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Forum Posts */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {post.title}
                      {post.isResolved && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {post.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{post.author}</span>
                        {getRoleBadge(post.role)}
                      </div>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatTimeAgo(post.timestamp)}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.replies} replies</span>
                    </button>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Join Discussion
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}