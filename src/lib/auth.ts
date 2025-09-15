// Authentication and authorization utilities
import type { UserRole } from '@/lib/types';

// Define role hierarchies and permissions
const ROLE_HIERARCHY: Record<UserRole, number> = {
  consumer: 1,
  farmer: 2,
  qc: 3,
  manufacturer: 4,
  admin: 5
};

// Define which roles can access which resources
const ROLE_PERMISSIONS: Record<string, UserRole[]> = {
  // Admin-only resources
  '/admin': ['admin'],
  '/admin/users': ['admin'],
  '/admin/blockchain': ['admin'],
  '/admin/logs': ['admin'],
  
  // QC resources
  '/qc': ['qc', 'admin'],
  '/qc/appeals': ['qc', 'admin'],
  
  // Manufacturer resources
  '/manufacturer': ['manufacturer', 'admin'],
  '/manufacturer/batches': ['manufacturer', 'admin'],
  
  // Consumer resources
  '/consumer': ['consumer', 'admin'],
  '/consumer/cart': ['consumer', 'admin'],
  '/consumer/checkout': ['consumer', 'admin'],
  '/consumer/purchases': ['consumer', 'admin'],
  
  // Shared resources
  '/dashboard': ['farmer', 'admin'],
  '/dashboard/upload': ['farmer', 'admin'],
  '/dashboard/chat': ['farmer', 'qc', 'manufacturer', 'admin'],
  '/dashboard/forum': ['consumer', 'farmer', 'qc', 'manufacturer', 'admin'],
};

export class AuthManager {
  // Check if user has sufficient role level
  static hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
  }

  // Check if user has permission to access a resource
  static hasPermission(userRole: UserRole, resourcePath: string): boolean {
    // If no specific permissions defined for this path, allow access
    if (!ROLE_PERMISSIONS[resourcePath]) {
      return true;
    }
    
    // Check if user's role is in the allowed roles for this resource
    return ROLE_PERMISSIONS[resourcePath].includes(userRole);
  }

  // Get user role from localStorage
  static getUserRole(): UserRole | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        return user.role;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    return null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getUserRole() !== null;
  }

  // Prevent escalation of privilege by ensuring user role matches expected role
  static preventEoP(expectedRole: UserRole): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    
    // Admin can access all roles' resources
    if (userRole === 'admin') return true;
    
    // Check if user role matches expected role
    return userRole === expectedRole;
  }

  // Validate role change attempts
  static validateRoleChange(currentRole: UserRole, newRole: UserRole): boolean {
    // Only admin can change roles to admin
    if (newRole === 'admin' && currentRole !== 'admin') {
      return false;
    }
    
    // Prevent users from escalating to higher roles
    if (ROLE_HIERARCHY[newRole] > ROLE_HIERARCHY[currentRole] && currentRole !== 'admin') {
      return false;
    }
    
    return true;
  }
}