'use client';

import { useState } from 'react';
import { 
  Send, 
  User, 
  IndianRupee, 
  CreditCard, 
  Wallet,
  ArrowUpDown
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Input } from '@/components/ui/input';
import { 
  Textarea } from '@/components/ui/textarea';
import { 
  Button } from '@/components/ui/button';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { 
  Badge } from '@/components/ui/badge';

type UserRole = 'consumer' | 'farmer' | 'qc' | 'manufacturer' | 'admin';

const userRoles: { value: UserRole; label: string }[] = [
  { value: 'consumer', label: 'Consumer' },
  { value: 'farmer', label: 'Farmer/Collector' },
  { value: 'qc', label: 'QC Agent' },
  { value: 'manufacturer', label: 'Manufacturer/Aggregator' },
  { value: 'admin', label: 'Admin' },
];

export default function P2PPaymentPage() {
  const [fromRole, setFromRole] = useState<UserRole>('admin');
  const [toRole, setToRole] = useState<UserRole>('farmer');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setIsSubmitting(false);
      return;
    }
    
    if (!description.trim()) {
      setError('Please enter a description');
      setIsSubmitting(false);
      return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form
      setAmount('');
      setDescription('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1500);
  };

  const handleSwapRoles = () => {
    setFromRole(toRole);
    setToRole(fromRole);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Peer-to-Peer Payment</h1>
        <p className="text-muted-foreground">
          Send payments between different user roles in the AgriVision ecosystem
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Payment</CardTitle>
              <CardDescription>
                Transfer funds between different roles in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess && (
                <Alert className="mb-6">
                  <Send className="h-4 w-4" />
                  <AlertTitle>Payment Sent Successfully</AlertTitle>
                  <AlertDescription>
                    Your payment of ₹{amount} from {fromRole} to {toRole} has been processed.
                  </AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <Select value={fromRole} onValueChange={(value) => setFromRole(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSwapRoles}
                      className="w-full md:w-auto"
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Swap Roles
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <Select value={toRole} onValueChange={(value) => setToRole(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          UPI
                        </div>
                      </SelectItem>
                      <SelectItem value="card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Credit/Debit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="wallet">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          Digital Wallet
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Enter payment description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Payment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Details about P2P transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Send className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Cross-Role Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Send payments between any roles in the AgriVision ecosystem
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Role-Based Limits</h3>
                  <p className="text-sm text-muted-foreground">
                    Different roles have different transaction limits for security
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IndianRupee className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Multiple Payment Methods</h3>
                  <p className="text-sm text-muted-foreground">
                    Supports UPI, Credit/Debit Cards, and Digital Wallets
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Transaction Limits</CardTitle>
              <CardDescription>
                Current role-based limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Admin</span>
                <Badge variant="secondary">Unlimited</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Manufacturer</span>
                <Badge variant="secondary">₹5,00,000/day</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Farmer</span>
                <Badge variant="secondary">₹50,000/day</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">QC Agent</span>
                <Badge variant="secondary">₹1,00,000/day</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Consumer</span>
                <Badge variant="secondary">₹10,000/day</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}