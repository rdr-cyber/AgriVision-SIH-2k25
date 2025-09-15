// Peer-to-Peer Transaction Service for RBAC user roles
import { PaymentMethod, PaymentDetails, PaymentResult, PaymentService } from '@/lib/payment-service';
import { UserRole } from '@/lib/types';

// Define transaction types for peer-to-peer payments
export type TransactionType = 'p2p_transfer' | 'loan' | 'commission' | 'refund' | 'subscription';

// P2P Transaction model
export type P2PTransaction = {
  id: string;
  fromUserId: string;
  fromUserRole: UserRole;
  toUserId: string;
  toUserRole: UserRole;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: PaymentMethod;
  transactionId?: string; // Reference to actual payment transaction
  fee?: number; // Transaction fee if applicable
};

// P2P Payment details extending base payment details
export type P2PPaymentDetails = PaymentDetails & {
  fromUserId: string;
  fromUserRole: UserRole;
  toUserId: string;
  toUserRole: UserRole;
  transactionType: TransactionType;
  description: string;
  fee?: number;
};

// Role-based transaction limits (per transaction)
const TRANSACTION_LIMITS: Record<UserRole, number> = {
  consumer: 100000,    // ₹1,00,000
  farmer: 500000,      // ₹5,00,000
  qc: 1000000,         // ₹10,00,000
  manufacturer: 2000000, // ₹20,00,000
  admin: 10000000      // ₹1,00,00,000
};

// Role-based daily transaction limits
const DAILY_LIMITS: Record<UserRole, number> = {
  consumer: 500000,    // ₹5,00,000
  farmer: 2000000,     // ₹20,00,000
  qc: 5000000,         // ₹50,00,000
  manufacturer: 10000000, // ₹1,00,00,000
  admin: 100000000     // ₹10,00,00,000
};

// Allowed transaction types between roles
const ALLOWED_TRANSACTIONS: Record<UserRole, UserRole[]> = {
  consumer: ['admin', 'manufacturer'], // Consumer can pay admin and manufacturer
  farmer: ['admin', 'manufacturer', 'qc'], // Farmer can pay admin, manufacturer, and QC
  qc: ['admin', 'farmer'], // QC can pay admin and farmer
  manufacturer: ['admin', 'farmer', 'qc'], // Manufacturer can pay admin, farmer, and QC
  admin: ['consumer', 'farmer', 'qc', 'manufacturer'] // Admin can pay all roles
};

export class P2PTransactionService {
  // Mock storage for transactions (in a real app, this would be a database)
  private static transactions: P2PTransaction[] = [];
  
  // Mock storage for daily transaction amounts
  private static dailyTransactions: Record<string, number> = {};

  // Check if a transaction is allowed between roles
  static isTransactionAllowed(fromRole: UserRole, toRole: UserRole): boolean {
    // Admin can send to any role
    if (fromRole === 'admin') return true;
    
    // Check if the 'to' role is in the allowed list for the 'from' role
    return ALLOWED_TRANSACTIONS[fromRole]?.includes(toRole) || false;
  }

  // Check if the transaction amount is within limits
  static isWithinLimits(userRole: UserRole, amount: number): boolean {
    // Check per transaction limit
    if (amount > TRANSACTION_LIMITS[userRole]) {
      return false;
    }
    
    // Check daily limit
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const dailyKey = `${userRole}-${today}`;
    const currentDaily = this.dailyTransactions[dailyKey] || 0;
    
    if (currentDaily + amount > DAILY_LIMITS[userRole]) {
      return false;
    }
    
    return true;
  }

  // Process a peer-to-peer payment
  static async processP2PPayment(paymentDetails: P2PPaymentDetails): Promise<PaymentResult & { transaction?: P2PTransaction }> {
    try {
      // Validate roles
      if (!this.isTransactionAllowed(paymentDetails.fromUserRole, paymentDetails.toUserRole)) {
        return {
          success: false,
          errorMessage: `Transaction not allowed from ${paymentDetails.fromUserRole} to ${paymentDetails.toUserRole}`
        };
      }
      
      // Validate amount limits
      if (!this.isWithinLimits(paymentDetails.fromUserRole, paymentDetails.amount)) {
        return {
          success: false,
          errorMessage: 'Transaction amount exceeds allowed limits'
        };
      }
      
      // Process the actual payment
      const paymentResult = await PaymentService.processPayment(paymentDetails);
      
      // Create P2P transaction record
      const transaction: P2PTransaction = {
        id: `p2p_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        fromUserId: paymentDetails.fromUserId,
        fromUserRole: paymentDetails.fromUserRole,
        toUserId: paymentDetails.toUserId,
        toUserRole: paymentDetails.toUserRole,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        transactionType: paymentDetails.transactionType,
        description: paymentDetails.description,
        timestamp: new Date().toISOString(),
        status: paymentResult.success ? 'completed' : 'failed',
        paymentMethod: paymentDetails.method,
        transactionId: paymentResult.transactionId,
        fee: paymentDetails.fee
      };
      
      // Add to transaction storage
      this.transactions.push(transaction);
      
      // Update daily transaction amount
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const dailyKey = `${paymentDetails.fromUserRole}-${today}`;
      this.dailyTransactions[dailyKey] = (this.dailyTransactions[dailyKey] || 0) + paymentDetails.amount;
      
      return {
        ...paymentResult,
        transaction
      };
    } catch (error) {
      console.error('Error processing P2P payment:', error);
      return {
        success: false,
        errorMessage: 'Failed to process peer-to-peer payment'
      };
    }
  }
  
  // Get transaction history for a user
  static getUserTransactions(userId: string): P2PTransaction[] {
    return this.transactions.filter(
      txn => txn.fromUserId === userId || txn.toUserId === userId
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  // Get sent transactions for a user
  static getSentTransactions(userId: string): P2PTransaction[] {
    return this.transactions
      .filter(txn => txn.fromUserId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  // Get received transactions for a user
  static getReceivedTransactions(userId: string): P2PTransaction[] {
    return this.transactions
      .filter(txn => txn.toUserId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  // Get transaction by ID
  static getTransactionById(transactionId: string): P2PTransaction | undefined {
    return this.transactions.find(txn => txn.id === transactionId);
  }
  
  // Cancel a pending transaction
  static async cancelTransaction(transactionId: string): Promise<boolean> {
    const transaction = this.getTransactionById(transactionId);
    if (!transaction) return false;
    
    if (transaction.status !== 'pending') {
      return false;
    }
    
    transaction.status = 'cancelled';
    return true;
  }
  
  // Get transaction statistics for a user
  static getUserTransactionStats(userId: string): {
    totalSent: number;
    totalReceived: number;
    totalTransactions: number;
    pendingTransactions: number;
  } {
    const userTransactions = this.getUserTransactions(userId);
    
    const sentTransactions = userTransactions.filter(txn => txn.fromUserId === userId);
    const receivedTransactions = userTransactions.filter(txn => txn.toUserId === userId);
    const pendingTransactions = userTransactions.filter(txn => txn.status === 'pending');
    
    const totalSent = sentTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalReceived = receivedTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    
    return {
      totalSent,
      totalReceived,
      totalTransactions: userTransactions.length,
      pendingTransactions: pendingTransactions.length
    };
  }
  
  // Get all transactions (admin only)
  static getAllTransactions(): P2PTransaction[] {
    return [...this.transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}