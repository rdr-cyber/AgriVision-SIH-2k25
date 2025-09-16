'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  IndianRupee, 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Clock,
  Send,
  User
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Define types for transactions
type BaseTransaction = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
  description: string;
};

type RegularTransaction = BaseTransaction & {
  orderId: string;
};

type P2PTransaction = BaseTransaction & {
  fromRole: string;
  toRole: string;
};

type Transaction = RegularTransaction | P2PTransaction;

// Mock regular transactions
const mockPaymentHistory: RegularTransaction[] = [
  {
    id: 'TXN-001',
    date: '2025-09-15',
    amount: 2500,
    method: 'card',
    status: 'Completed',
    description: 'Herb sample purchase',
    orderId: 'ORD-001'
  },
  {
    id: 'TXN-002',
    date: '2025-09-10',
    amount: 7500,
    method: 'upi',
    status: 'Completed',
    description: 'Equipment purchase',
    orderId: 'ORD-002'
  },
  {
    id: 'TXN-003',
    date: '2025-09-01',
    amount: 10000,
    method: 'wallet',
    status: 'Processing',
    description: 'Loan disbursement',
    orderId: 'LOAN-001'
  },
  {
    id: 'TXN-004',
    date: '2025-08-25',
    amount: 5000,
    method: 'card',
    status: 'Failed',
    description: 'Insurance premium',
    orderId: 'INS-001'
  },
];

// Mock P2P transactions
const mockP2PTransactions: P2PTransaction[] = [
  {
    id: 'P2P-001',
    date: '2025-09-12',
    amount: 5000,
    method: 'upi',
    status: 'Completed',
    description: 'Payment to Farmer',
    fromRole: 'manufacturer',
    toRole: 'farmer'
  },
  {
    id: 'P2P-002',
    date: '2025-09-08',
    amount: 20000,
    method: 'card',
    status: 'Completed',
    description: 'Commission payment',
    fromRole: 'admin',
    toRole: 'manufacturer'
  },
  {
    id: 'P2P-003',
    date: '2025-09-05',
    amount: 15000,
    method: 'wallet',
    status: 'Completed',
    description: 'Quality control payment',
    fromRole: 'admin',
    toRole: 'qc'
  },
  {
    id: 'P2P-004',
    date: '2025-09-01',
    amount: 30000,
    method: 'upi',
    status: 'Completed',
    description: 'Farmer subsidy',
    fromRole: 'admin',
    toRole: 'farmer'
  },
];

export default function PaymentHistoryPage() {
  const [filter, setFilter] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Combine mock transactions
    const allTransactions = [...mockPaymentHistory, ...mockP2PTransactions];
    setTransactions(allTransactions);
    setFilteredTransactions(allTransactions);
  }, []);

  useEffect(() => {
    let filtered = transactions;
    
    if (filter === 'card') {
      filtered = transactions.filter(txn => txn.method === 'card');
    } else if (filter === 'upi') {
      filtered = transactions.filter(txn => txn.method === 'upi');
    } else if (filter === 'wallet') {
      filtered = transactions.filter(txn => txn.method === 'wallet');
    } else if (filter === 'p2p') {
      filtered = transactions.filter(txn => 'fromRole' in txn);
    }
    
    setFilteredTransactions(filtered);
  }, [filter, transactions]);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'upi':
        return <IndianRupee className="h-4 w-4" />;
      case 'wallet':
        return <Wallet className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Processing':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Processing':
        return 'secondary';
      case 'Failed':
        return 'destructive';
      default:
        return 'destructive';
    }
  };

  const isP2PTransaction = (transaction: Transaction): transaction is P2PTransaction => {
    return 'fromRole' in transaction;
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">
          View all transaction history across the AgriVision platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All payment transactions across the platform
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter by method:</span>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                  <SelectItem value="p2p">Peer-to-Peer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isP2PTransaction(transaction) && (
                        <Send className="h-4 w-4 text-blue-500" />
                      )}
                      {transaction.description}
                      {isP2PTransaction(transaction) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {transaction.fromRole} → {transaction.toRole}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMethodIcon(transaction.method)}
                      <span className="capitalize">
                        {transaction.method === 'upi' ? 'UPI' : 
                         transaction.method === 'wallet' ? 'Digital Wallet' : 
                         'Credit/Debit Card'}
                        {isP2PTransaction(transaction) && ' (P2P)'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">₹{transaction.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(transaction.status)} className="flex items-center gap-1">
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <p className="text-xs text-muted-foreground">Across the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">Across all transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredTransactions.filter(txn => txn.status === 'Completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending/Failed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredTransactions.filter(txn => txn.status !== 'Completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Processing or failed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}