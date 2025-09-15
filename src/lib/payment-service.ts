// Payment service for handling various payment methods
// This is a mock implementation for demonstration purposes

export type PaymentMethod = 'card' | 'wallet' | 'upi';

export type PaymentDetails = {
  method: PaymentMethod;
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
};

export type CardPaymentDetails = PaymentDetails & {
  method: 'card';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
};

export type WalletPaymentDetails = PaymentDetails & {
  method: 'wallet';
  walletType: 'paypal' | 'apple-pay' | 'google-pay';
};

export type UPIPaymentDetails = PaymentDetails & {
  method: 'upi';
  upiId: string;
};

export type PaymentResult = {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
};

export type Transaction = {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'p2p';
  timestamp: string;
  sender: string;
  receiver: string;
};

class P2PTransactionService {
  private transactions: Transaction[] = [];
  private static instance: P2PTransactionService;

  private constructor() {
    // Mock data
    this.transactions = [
      {
        id: "1",
        amount: 100,
        status: "completed",
        type: "p2p",
        timestamp: "2023-01-15T10:30:00Z",
        sender: "user123",
        receiver: "user456",
      },
      {
        id: "2",
        amount: 50,
        status: "pending",
        type: "p2p",
        timestamp: "2023-01-16T12:00:00Z",
        sender: "user789",
        receiver: "user123",
      },
    ];
  }

  public static getInstance(): P2PTransactionService {
    if (!P2PTransactionService.instance) {
      P2PTransactionService.instance = new P2PTransactionService();
    }
    return P2PTransactionService.instance;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    // In a real app, you'd filter transactions by userId
    console.log(`Fetching transactions for ${userId}`);
    return Promise.resolve(this.transactions);
  }

  async createTransaction(
    sender: string,
    receiver: string,
    amount: number,
  ): Promise<Transaction> {
    const newTransaction: Transaction = {
      id: (this.transactions.length + 1).toString(),
      amount,
      status: "completed",
      type: "p2p",
      timestamp: new Date().toISOString(),
      sender,
      receiver,
    };
    this.transactions.push(newTransaction);
    return Promise.resolve(newTransaction);
  }
}

export default P2PTransactionService;

export class PaymentService {
  // Mock payment processing
  static async processPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, you would:
    // 1. Validate payment details
    // 2. Communicate with payment gateway
    // 3. Handle responses and errors
    // 4. Return transaction result
    
    // For demo purposes, we'll simulate a successful payment
    const isSuccess = Math.random() > 0.1; // 90% success rate
    
    if (isSuccess) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      };
    } else {
      return {
        success: false,
        errorMessage: 'Payment processing failed. Please try again.',
      };
    }
  }
  
  // Validate card payment details
  static validateCardPayment(cardDetails: CardPaymentDetails): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Basic validation
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
      errors.push('Invalid card number');
    }
    
    if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      errors.push('Invalid expiry date format (MM/YY)');
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
      errors.push('Invalid CVV');
    }
    
    if (!cardDetails.cardholderName || cardDetails.cardholderName.trim().length === 0) {
      errors.push('Cardholder name is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  // Validate wallet payment details
  static validateWalletPayment(walletDetails: WalletPaymentDetails): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!walletDetails.walletType) {
      errors.push('Wallet type is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  // Validate UPI payment details
  static validateUPIPayment(upiDetails: UPIPaymentDetails): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!upiDetails.upiId || !/^[\w.-]+@[\w.-]+$/.test(upiDetails.upiId)) {
      errors.push('Invalid UPI ID format');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Mock payment gateways that could be integrated
export const PaymentGateways = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  RAZORPAY: 'razorpay',
  PAYTM: 'paytm',
} as const;

export type PaymentGateway = typeof PaymentGateways[keyof typeof PaymentGateways];