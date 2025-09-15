# Peer-to-Peer Payment System Documentation

## Overview
This document describes the implementation of the Peer-to-Peer (P2P) payment system for the AgriVision platform, enabling transactions between all RBAC user roles: Consumer, Farmer, QC Agent, Manufacturer/Aggregator, and Admin.

## System Architecture

### Core Components

1. **P2P Transaction Service** (`src/lib/p2p-transaction-service.ts`)
   - Handles all P2P transaction logic
   - Manages transaction validation and processing
   - Stores transaction records
   - Enforces role-based transaction rules

2. **P2P Payment Page** (`src/app/dashboard/p2p-payment/page.tsx`)
   - User interface for sending P2P payments
   - Form validation and submission handling
   - Real-time feedback and error handling

3. **Payment History Page** (`src/app/dashboard/payment-history/page.tsx`)
   - Displays both regular and P2P transactions
   - Filtering capabilities for different transaction types
   - Detailed transaction information

## Role-Based Transaction Rules

### Allowed Transactions
- **Consumer** → Admin, Manufacturer
- **Farmer** → Admin, Manufacturer, QC
- **QC Agent** → Admin, Farmer
- **Manufacturer** → Admin, Farmer, QC
- **Admin** → All roles (Consumer, Farmer, QC, Manufacturer)

### Transaction Limits
- **Consumer**: ₹1,00,000 per transaction
- **Farmer**: ₹5,00,000 per transaction
- **QC Agent**: ₹10,00,000 per transaction
- **Manufacturer**: ₹20,00,000 per transaction
- **Admin**: ₹1,00,00,000 per transaction

### Daily Limits
- **Consumer**: ₹5,00,000
- **Farmer**: ₹20,00,000
- **QC Agent**: ₹50,00,000
- **Manufacturer**: ₹1,00,00,000
- **Admin**: ₹10,00,00,000

## Implementation Details

### Transaction Flow
1. User navigates to the P2P Payment page
2. Selects recipient role and enters recipient ID
3. Enters payment amount and description
4. Chooses payment method (Card, UPI, Wallet)
5. System validates transaction rules and limits
6. Processes payment through existing payment service
7. Records transaction in P2P transaction storage
8. Updates daily transaction limits
9. Displays success/failure feedback to user

### Data Models

#### P2PTransaction
```typescript
type P2PTransaction = {
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
  transactionId?: string;
  fee?: number;
};
```

#### P2PPaymentDetails
```typescript
type P2PPaymentDetails = PaymentDetails & {
  fromUserId: string;
  fromUserRole: UserRole;
  toUserId: string;
  toUserRole: UserRole;
  transactionType: TransactionType;
  description: string;
  fee?: number;
};
```

## Security Considerations

1. **Role Validation**: All transactions are validated against allowed role mappings
2. **Amount Limits**: Per-transaction and daily limits prevent abuse
3. **Escalation Prevention**: Lower roles cannot send payments to higher roles (except as allowed)
4. **Data Integrity**: All transactions are recorded with timestamps and user details

## Integration Points

1. **Authentication System**: Uses existing AuthManager for role verification
2. **Payment Service**: Integrates with existing PaymentService for actual payment processing
3. **Navigation**: Added to sidebar menus for all user roles
4. **Transaction History**: Integrated into existing payment history page

## Future Enhancements

1. **Real-time Notifications**: Notify recipients of incoming payments
2. **Refund System**: Allow reversal of transactions under certain conditions
3. **Scheduled Payments**: Enable recurring or future-dated payments
4. **Transaction Analytics**: Provide detailed reports and insights
5. **Multi-currency Support**: Expand beyond INR to support international transactions

## Testing

The system has been tested for:
- Role-based transaction validation
- Amount limit enforcement
- Payment method processing
- User interface functionality
- Error handling and edge cases

## Deployment

No special deployment steps are required. The system integrates with existing components and follows the same deployment process as the rest of the application.