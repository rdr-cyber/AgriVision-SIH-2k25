'use client';

import { useState } from 'react';
import { 
  MapPin, 
  CreditCard, 
  Wallet, 
  Truck, 
  CheckCircle, 
  ArrowLeft,
  Lock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';
import { PaymentService, type CardPaymentDetails, type UPIPaymentDetails, type WalletPaymentDetails } from '@/lib/payment-service';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    walletType: 'paypal',
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      let result;
      
      switch (selectedPaymentMethod) {
        case 'card':
          // Validate card payment details
          const cardPaymentDetails: CardPaymentDetails = {
            method: 'card',
            amount: getTotalPrice(),
            currency: 'USD',
            orderId: `ORD-${Date.now()}`,
            customerEmail: 'customer@example.com',
            customerName: shippingInfo.fullName,
            cardNumber: paymentInfo.cardNumber,
            expiryDate: paymentInfo.expiryDate,
            cvv: paymentInfo.cvv,
            cardholderName: paymentInfo.cardName,
          };
          
          const cardValidation = PaymentService.validateCardPayment(cardPaymentDetails);
          
          if (!cardValidation.isValid) {
            toast({
              title: "Payment Error",
              description: cardValidation.errors.join(', '),
              variant: "destructive",
            });
            setIsProcessing(false);
            return;
          }
          
          result = await PaymentService.processPayment(cardPaymentDetails);
          break;
          
        case 'upi':
          // Validate UPI payment details
          const upiPaymentDetails: UPIPaymentDetails = {
            method: 'upi',
            amount: getTotalPrice(),
            currency: 'USD',
            orderId: `ORD-${Date.now()}`,
            customerEmail: 'customer@example.com',
            customerName: shippingInfo.fullName,
            upiId: paymentInfo.upiId,
          };
          
          const upiValidation = PaymentService.validateUPIPayment(upiPaymentDetails);
          
          if (!upiValidation.isValid) {
            toast({
              title: "Payment Error",
              description: upiValidation.errors.join(', '),
              variant: "destructive",
            });
            setIsProcessing(false);
            return;
          }
          
          result = await PaymentService.processPayment(upiPaymentDetails);
          break;
          
        case 'wallet':
          // Validate wallet payment details
          const walletPaymentDetails: WalletPaymentDetails = {
            method: 'wallet',
            amount: getTotalPrice(),
            currency: 'USD',
            orderId: `ORD-${Date.now()}`,
            customerEmail: 'customer@example.com',
            customerName: shippingInfo.fullName,
            walletType: paymentInfo.walletType as 'paypal' | 'apple-pay' | 'google-pay',
          };
          
          const walletValidation = PaymentService.validateWalletPayment(walletPaymentDetails);
          
          if (!walletValidation.isValid) {
            toast({
              title: "Payment Error",
              description: walletValidation.errors.join(', '),
              variant: "destructive",
            });
            setIsProcessing(false);
            return;
          }
          
          result = await PaymentService.processPayment(walletPaymentDetails);
          break;
          
        default:
          toast({
            title: "Payment Error",
            description: "Invalid payment method selected",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
      }
      
      if (result.success) {
        // In a real application, this would process the payment
        // For demo purposes, we'll just simulate a successful order
        setOrderPlaced(true);
        clearCart();
        
        toast({
          title: "Order Placed",
          description: "Your order has been placed successfully!",
        });
      } else {
        toast({
          title: "Payment Failed",
          description: result.errorMessage || "Payment processing failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <div className="bg-muted rounded-lg p-6 w-full max-w-md">
          <h3 className="font-bold mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Order Number</span>
              <span className="font-mono">ORD-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={() => router.push('/consumer')}>
            Back to Home
          </Button>
          <Button onClick={() => router.push('/consumer/purchases')}>
            View Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your purchase
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'shipping' ? 'bg-primary text-primary-foreground' : 
                    currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-500 text-white' : 'bg-muted'
                  }`}>
                    1
                  </div>
                  <span className={currentStep === 'shipping' ? 'font-bold' : ''}>Shipping</span>
                </div>
                <div className="flex-1 h-px bg-muted"></div>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'payment' ? 'bg-primary text-primary-foreground' : 
                    currentStep === 'confirmation' ? 'bg-green-500 text-white' : 
                    currentStep === 'shipping' ? 'bg-muted' : 'bg-muted'
                  }`}>
                    2
                  </div>
                  <span className={currentStep === 'payment' ? 'font-bold' : ''}>Payment</span>
                </div>
                <div className="flex-1 h-px bg-muted"></div>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'confirmation' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    3
                  </div>
                  <span className={currentStep === 'confirmation' ? 'font-bold' : ''}>Confirmation</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentStep === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingChange}
                          placeholder="Enter your street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingChange}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleShippingChange}
                          placeholder="Enter your state"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleShippingChange}
                          placeholder="Enter your ZIP code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleShippingChange}
                          placeholder="Enter your country"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </h2>
                    <div className="space-y-4">
                      {/* Credit/Debit Card Option */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="radio"
                            id="card-payment"
                            name="payment-method"
                            checked={selectedPaymentMethod === 'card'}
                            onChange={() => setSelectedPaymentMethod('card')}
                            className="h-4 w-4"
                          />
                          <CreditCard className="h-5 w-5" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </div>
                        
                        {selectedPaymentMethod === 'card' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                value={paymentInfo.cardNumber}
                                onChange={handlePaymentChange}
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                name="expiryDate"
                                value={paymentInfo.expiryDate}
                                onChange={handlePaymentChange}
                                placeholder="MM/YY"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                name="cvv"
                                value={paymentInfo.cvv}
                                onChange={handlePaymentChange}
                                placeholder="123"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="cardName">Name on Card</Label>
                              <Input
                                id="cardName"
                                name="cardName"
                                value={paymentInfo.cardName}
                                onChange={handlePaymentChange}
                                placeholder="Enter name as it appears on card"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Digital Wallet Option */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="radio"
                            id="wallet-payment"
                            name="payment-method"
                            checked={selectedPaymentMethod === 'wallet'}
                            onChange={() => setSelectedPaymentMethod('wallet')}
                            className="h-4 w-4"
                          />
                          <Wallet className="h-5 w-5" />
                          <span className="font-medium">Digital Wallet</span>
                        </div>
                        
                        {selectedPaymentMethod === 'wallet' && (
                          <div className="space-y-4 ml-6">
                            <div className="space-y-2">
                              <Label htmlFor="walletType">Select Wallet</Label>
                              <select
                                id="walletType"
                                name="walletType"
                                value={paymentInfo.walletType}
                                onChange={handlePaymentChange}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="paypal">PayPal</option>
                                <option value="apple-pay">Apple Pay</option>
                                <option value="google-pay">Google Pay</option>
                              </select>
                            </div>
                            <Button className="mt-2">
                              Pay with {paymentInfo.walletType.replace('-', ' ')}
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* UPI Option */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="radio"
                            id="upi-payment"
                            name="payment-method"
                            checked={selectedPaymentMethod === 'upi'}
                            onChange={() => setSelectedPaymentMethod('upi')}
                            className="h-4 w-4"
                          />
                          <div className="font-bold text-lg">UPI</div>
                          <span className="font-medium">Unified Payments Interface</span>
                        </div>
                        
                        {selectedPaymentMethod === 'upi' && (
                          <div className="space-y-4 ml-6">
                            <div className="space-y-2">
                              <Label htmlFor="upiId">UPI ID</Label>
                              <Input
                                id="upiId"
                                name="upiId"
                                value={paymentInfo.upiId}
                                onChange={handlePaymentChange}
                                placeholder="yourname@upi"
                              />
                            </div>
                            <Button className="mt-2">
                              Pay with UPI
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'confirmation' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Order Review</h2>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="bg-muted rounded-md w-16 h-16 flex items-center justify-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.manufacturer}</p>
                          </div>
                          <div className="text-right">
                            <p>${item.price.toFixed(2)} × {item.quantity}</p>
                            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h3 className="font-bold mb-3">Shipping Address</h3>
                      <p>{shippingInfo.fullName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.country}</p>
                      <p>Phone: {shippingInfo.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {currentStep === 'shipping' && (
                <Button variant="outline" disabled>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep === 'shipping' && (
                <Button onClick={() => setCurrentStep('payment')}>
                  Continue to Payment
                </Button>
              )}
              
              {currentStep === 'payment' && (
                <Button variant="outline" onClick={() => setCurrentStep('shipping')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep === 'payment' && (
                <Button onClick={() => setCurrentStep('confirmation')}>
                  Review Order
                </Button>
              )}
              
              {currentStep === 'confirmation' && (
                <Button variant="outline" onClick={() => setCurrentStep('payment')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep === 'confirmation' && (
                <Button onClick={handlePlaceOrder} disabled={isProcessing} className="flex items-center gap-2">
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Place Order
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on orders over $50</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}