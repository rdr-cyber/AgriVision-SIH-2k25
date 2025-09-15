'use client';

import { useState, useEffect } from 'react';
import { 
  Send, 
  CreditCard, 
  Wallet, 
  IndianRupee,
  User,
  Users,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/lib/types';
import { P2PTransactionService, P2PPaymentDetails } from '@/lib/p2p-transaction-service';
import { PaymentMethod } from '@/lib/payment-service';
import { AuthManager } from '@/lib/auth';

export default function P2PPaymentPage() {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientRole, setRecipientRole] = useState<UserRole>('farmer');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Get user role on component mount
  useEffect(() => {
    const role = AuthManager.getUserRole();
    setUserRole(role);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate inputs
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!recipientId) {
        throw new Error('Please enter recipient ID');
      }

      if (!description) {
        throw new Error('Please enter a description');
      }

      // Mock user data (in a real app, this would come from authentication context)
      const currentUser = {
        id: 'user_' + Math.floor(Math.random() * 1000),
        role: userRole || 'consumer',
        email: 'user@example.com',
        name: 'Current User'
      };

      // Create payment details
      const paymentDetails: P2PPaymentDetails = {
        method: paymentMethod,
        amount: parseFloat(amount),
        currency: 'INR',
        orderId: `p2p_${Date.now()}`,
        customerEmail: currentUser.email,
        customerName: currentUser.name,
        fromUserId: currentUser.id,
        fromUserRole: currentUser.role,
        toUserId: recipientId,
        toUserRole: recipientRole,
        transactionType: 'p2p_transfer',
        description: description
      };

      // Process P2P payment
      const result = await P2PTransactionService.processP2PPayment(paymentDetails);

      if (result.success) {
        setSuccess(true);
        toast({
          title: 'Payment Successful',
          description: `₹${amount} sent successfully to ${recipientRole} user.`,
        });
        // Reset form
        setAmount('');
        setRecipientId('');
        setDescription('');
      } else {
        throw new Error(result.errorMessage || 'Payment failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get allowed recipient roles based on current user role
  const getAllowedRecipientRoles = (): UserRole[] => {
    if (!userRole) return [];
    
    // Admin can send to all roles
    if (userRole === 'admin') {
      return ['consumer', 'farmer', 'qc', 'manufacturer', 'admin'];
    }
    
    // Map of allowed recipient roles for each user role
    const roleMap: Record<UserRole, UserRole[]> = {
      consumer: ['admin', 'manufacturer'],
      farmer: ['admin', 'manufacturer', 'qc'],
      qc: ['admin', 'farmer'],
      manufacturer: ['admin', 'farmer', 'qc'],
      admin: ['consumer', 'farmer', 'qc', 'manufacturer']
    };
    
    return roleMap[userRole] || [];
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Peer-to-Peer Payment</h1>
        <p className="text-muted-foreground">
          Send payments to other users in the system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Payment</CardTitle>
              <CardDescription>
                Transfer funds to another user in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Payment sent successfully!</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Credit/Debit Card
                          </div>
                        </SelectItem>
                        <SelectItem value="upi">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4" />
                            UPI
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
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recipientRole">Recipient Role</Label>
                    <Select 
                      value={recipientRole} 
                      onValueChange={(value: UserRole) => setRecipientRole(value)}
                      disabled={!userRole}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient role" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAllowedRecipientRoles().map((role) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientId">Recipient ID</Label>
                    <Input
                      id="recipientId"
                      placeholder="Enter recipient user ID"
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter payment description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !userRole}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Payment
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Rules</CardTitle>
              <CardDescription>
                Peer-to-peer payment guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Allowed Transactions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Consumer → Admin/Manufacturer</li>
                  <li>• Farmer → Admin/Manufacturer/QC</li>
                  <li>• QC → Admin/Farmer</li>
                  <li>• Manufacturer → Admin/Farmer/QC</li>
                  <li>• Admin → All roles</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Transaction Limits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Consumer: ₹1,00,000 per transaction</li>
                  <li>• Farmer: ₹5,00,000 per transaction</li>
                  <li>• QC: ₹10,00,000 per transaction</li>
                  <li>• Manufacturer: ₹20,00,000 per transaction</li>
                  <li>• Admin: ₹1,00,00,000 per transaction</li>
                </ul>
              </div>

              <Alert>
                <Users className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Make sure you have the correct recipient ID and role before sending payment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}