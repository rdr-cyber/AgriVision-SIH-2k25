'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Leaf
} from 'lucide-react';
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
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for financial services
const loanProducts = [
  {
    id: 'LOAN-001',
    name: 'Seasonal Crop Loan',
    interestRate: '8.5%',
    maxAmount: '₹50,000',
    term: '6 months',
    description: 'For purchasing seeds, fertilizers, and equipment for seasonal crops'
  },
  {
    id: 'LOAN-002',
    name: 'Equipment Financing',
    interestRate: '10.0%',
    maxAmount: '₹2,00,000',
    term: '24 months',
    description: 'For purchasing farming equipment and machinery'
  },
  {
    id: 'LOAN-003',
    name: 'Working Capital Loan',
    interestRate: '9.0%',
    maxAmount: '₹1,00,000',
    term: '12 months',
    description: 'For day-to-day operational expenses'
  }
];

const insuranceProducts = [
  {
    id: 'INS-001',
    name: 'Crop Insurance',
    coverage: 'Up to ₹2,00,000',
    premium: '2.5% of coverage',
    description: 'Protection against crop failure due to natural disasters'
  },
  {
    id: 'INS-002',
    name: 'Equipment Insurance',
    coverage: 'Up to ₹5,00,000',
    premium: '1.8% of coverage',
    description: 'Protection for farming equipment against damage or theft'
  },
  {
    id: 'INS-003',
    name: 'Livestock Insurance',
    coverage: 'Up to ₹1,00,000',
    premium: '3.0% of coverage',
    description: 'Protection for livestock against disease or death'
  }
];

const mockFinancialData = [
  { month: 'Jan', income: 4000, expenses: 2400 },
  { month: 'Feb', income: 3000, expenses: 1398 },
  { month: 'Mar', income: 2000, expenses: 1800 },
  { month: 'Apr', income: 2780, expenses: 2000 },
  { month: 'May', income: 1890, expenses: 1500 },
  { month: 'Jun', income: 2390, expenses: 1900 },
];

const mockLoanData = [
  { name: 'Pending', value: 12 },
  { name: 'Approved', value: 8 },
  { name: 'Rejected', value: 3 },
  { name: 'Repaid', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function FinancialServicesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLoan, setSelectedLoan] = useState(loanProducts[0]);
  const [selectedInsurance, setSelectedInsurance] = useState(insuranceProducts[0]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Services</h1>
        <p className="text-muted-foreground">
          Access micro-lending and insurance products tailored for farmers.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,45,000</div>
            <p className="text-xs text-muted-foreground">+12% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">₹8,20,000 outstanding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">₹3,50,000 coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Balance</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,200</div>
            <p className="text-xs text-muted-foreground">+5% interest earned</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>
              Your income and expenses over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockFinancialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of your loan applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockLoanData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockLoanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Products</CardTitle>
            <CardDescription>
              Available micro-lending options for farmers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={(value) => {
                const loan = loanProducts.find(l => l.id === value);
                if (loan) setSelectedLoan(loan);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a loan product" />
                </SelectTrigger>
                <SelectContent>
                  {loanProducts.map((loan) => (
                    <SelectItem key={loan.id} value={loan.id}>
                      {loan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-bold text-lg">{selectedLoan.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedLoan.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm font-medium">Interest Rate</p>
                    <p className="text-lg font-bold">{selectedLoan.interestRate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Max Amount</p>
                    <p className="text-lg font-bold">{selectedLoan.maxAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Term</p>
                    <p className="text-lg font-bold">{selectedLoan.term}</p>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  Apply for Loan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insurance Products</CardTitle>
            <CardDescription>
              Protection for your crops and equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={(value) => {
                const insurance = insuranceProducts.find(i => i.id === value);
                if (insurance) setSelectedInsurance(insurance);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an insurance product" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProducts.map((insurance) => (
                    <SelectItem key={insurance.id} value={insurance.id}>
                      {insurance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-bold text-lg">{selectedInsurance.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedInsurance.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm font-medium">Coverage</p>
                    <p className="text-lg font-bold">{selectedInsurance.coverage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Premium</p>
                    <p className="text-lg font-bold">{selectedInsurance.premium}</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  Get Quote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest financial activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2025-09-10</TableCell>
                <TableCell>Seasonal Crop Loan Disbursement</TableCell>
                <TableCell>Loan</TableCell>
                <TableCell className="text-right">+₹50,000</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2025-09-05</TableCell>
                <TableCell>Crop Insurance Premium</TableCell>
                <TableCell>Insurance</TableCell>
                <TableCell className="text-right">-₹5,000</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Processing
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2025-09-01</TableCell>
                <TableCell>Equipment Financing Application</TableCell>
                <TableCell>Loan</TableCell>
                <TableCell className="text-right">₹2,00,000</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2025-08-25</TableCell>
                <TableCell>Monthly Savings Interest</TableCell>
                <TableCell>Savings</TableCell>
                <TableCell className="text-right">+₹1,200</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}