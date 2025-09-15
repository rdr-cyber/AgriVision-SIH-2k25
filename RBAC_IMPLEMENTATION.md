# Role-Based Access Control (RBAC) Implementation

This document describes the implementation of Role-Based Access Control (RBAC) for the 5 user roles in the system:

1. Consumer
2. Admin
3. QC Agent
4. Manufacturer/Aggregator
5. Farmer

## User Roles and Permissions

### 1. Consumer
**Purpose**: End users who purchase and consume herbal products

**Permissions**:
- Search and browse products
- Purchase products
- Track batch authenticity
- View purchase history
- Access consumer dashboard

**Navigation Menu**:
- Dashboard
- Search Products
- My Purchases
- Track Batch

### 2. Farmer/Collector
**Purpose**: Individuals who collect and submit herb samples

**Permissions**:
- Upload herb samples
- View collection history
- Check earnings
- Access farmer dashboard

**Navigation Menu**:
- Dashboard
- Upload Sample
- My Collections
- Earnings

### 3. QC Agent
**Purpose**: Quality control personnel who review and verify herb samples

**Permissions**:
- Review submitted samples
- Approve or reject samples
- Handle appeals
- Generate reports
- Access QC dashboard

**Navigation Menu**:
- Dashboard
- Collections
- Appeals
- Reports / Flags

### 4. Manufacturer/Aggregator
**Purpose**: Companies that process approved herb samples into products

**Permissions**:
- View approved collections
- Manage batch creation
- Access analytics
- Access manufacturer dashboard

**Navigation Menu**:
- Dashboard
- Approved Collections
- Batch Management
- Analytics

### 5. Admin
**Purpose**: System administrators with full access

**Permissions**:
- Manage all users
- Oversee all collections
- Review QC processes
- Manage batches
- Access blockchain data
- View system logs
- Access analytics
- Access admin dashboard

**Navigation Menu**:
- Overview
- Users
- Collections
- QC Review
- Batches
- Blockchain
- Logs
- Analytics

## Implementation Details

### Type Definitions
The user roles are defined in [src/lib/types.ts](file:///C:/Users/rajde/OneDrive/Desktop/Smart_India_Hackathon_2025_Project/src/lib/types.ts):
```typescript
export type UserRole = 'consumer' | 'farmer' | 'admin' | 'qc' | 'manufacturer';

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
    status: 'active' | 'suspended';
    createdAt: string;
    password?: string;
};
```

### Authentication
The authentication form in [src/components/auth-form.tsx](file:///C:/Users/rajde/OneDrive/Desktop/Smart_India_Hackathon_2025_Project/src/components/auth-form.tsx) allows users to select their role during registration.

### Navigation
The navigation component in [src/components/nav.tsx](file:///C:/Users/rajde/OneDrive/Desktop/Smart_India_Hackathon_2025_Project/src/components/nav.tsx) dynamically shows menu items based on the user's role.

### User Management
The admin user management page in [src/app/admin/users/page.tsx](file:///C:/Users/rajde/OneDrive/Desktop/Smart_India_Hackathon_2025_Project/src/app/admin/users/page.tsx) allows admins to:
- View all users
- Change user roles
- Suspend/reactivate users

## Consumer-Specific Pages

### Dashboard
Located at [src/app/consumer/page.tsx](file:///C:/Users/rajde/OneDrive/Desktop/Smart_India_Hackathon_2025_Project/src/app/consumer/page.tsx)
- Overview of recent purchases
- Quick actions for searching products, viewing purchases, and tracking batches

### Search Products
Located at [src/app/consumer/search/page.tsx](file:///C:/Users/rajde/OneDrive/Desktop/Smart_India_Hackathon_2025_Project/src/app/consumer/search/page.tsx)
- Search functionality for herbal products
- Product listings with certifications and ratings

### My Purchases
Located at [src/app/consumer/purchases/page.tsx](file:///C:/Users/rajde/OneDrive/Desktop/Smart_India_Hackathon_2025_Project/src/app/consumer/purchases/page.tsx)
- Order history with status tracking
- Detailed view of purchased items

### Track Batch
Located at [src/app/consumer/tracking/page.tsx](file:///C:/Users/rajde/OneDrive/Desktop/Smart_India_Hackathon_2025_Project/src/app/consumer/tracking/page.tsx)
- Batch verification by ID or QR code
- Complete supply chain journey tracking
- Product certifications and information

## Security Considerations

1. Role-based navigation ensures users only see relevant menu items
2. Each role has a dedicated layout and dashboard
3. User roles are stored securely in localStorage
4. Role changes require admin privileges
5. All authentication is handled client-side with localStorage

## Future Enhancements

1. Server-side role validation
2. Role-based API access control
3. Permission-based access control (PBAC) for more granular permissions
4. Audit logging for role changes
5. Multi-factor authentication for admin users