'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Leaf,
  Home,
  Upload,
  ClipboardList,
  History,
  Boxes,
  Settings,
  LifeBuoy,
  DollarSign,
  Shield,
  Users,
  Database,
  BarChart2,
  FileText,
  Factory,
  TestTube2,
  ShieldAlert,
  Flag,
  PackagePlus,
  ShoppingCart,
  Search,
  Eye,
  MessageCircle,
  Package,
  FileBarChart,
  QrCode,
  BookOpen,
  MessageSquare,
  Award,
  Zap,
  Truck,
  CreditCard,
  Send,
  FileCheck,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { useState, useEffect, useContext } from 'react';
import { NotificationContext } from '@/context/notification-context';
import { AgriVisionLogo } from '@/components/agrivision-logo';

type UserRole = 'consumer' | 'farmer' | 'admin' | 'qc' | 'manufacturer' | null;

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};

const consumerItems = [
  {
    title: "Dashboard",
    href: "/consumer",
    icon: Home,
  },
  {
    title: "My Purchases",
    href: "/consumer/purchases",
    icon: Package,
  },
  {
    title: "Cart",
    href: "/consumer/cart",
    icon: ShoppingCart,
  },
  {
    title: "Checkout",
    href: "/consumer/checkout",
    icon: CreditCard,
  },
  {
    title: "Payment History",
    href: "/dashboard/payment-history",
    icon: History,
  },
  {
    title: "Send Payment",
    href: "/dashboard/p2p-payment",
    icon: Send,
  },
];

const farmerItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Upload Samples",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    title: "My Samples",
    href: "/dashboard/samples",
    icon: FileText,
  },
  {
    title: "Payment History",
    href: "/dashboard/payment-history",
    icon: History,
  },
  {
    title: "Send Payment",
    href: "/dashboard/p2p-payment",
    icon: Send,
  },
];

const qcItems = [
  {
    title: "Dashboard",
    href: "/qc",
    icon: Home,
  },
  {
    title: "Review Samples",
    href: "/qc/review",
    icon: FileCheck,
  },
  {
    title: "Appeals",
    href: "/qc/appeals",
    icon: AlertCircle,
  },
  {
    title: "Payment History",
    href: "/dashboard/payment-history",
    icon: History,
  },
  {
    title: "Send Payment",
    href: "/dashboard/p2p-payment",
    icon: Send,
  },
];

const manufacturerItems = [
  {
    title: "Dashboard",
    href: "/manufacturer",
    icon: Home,
  },
  {
    title: "My Batches",
    href: "/manufacturer/batches",
    icon: Package,
  },
  {
    title: "Create Batch",
    href: "/manufacturer/create-batch",
    icon: PlusCircle,
  },
  {
    title: "Payment History",
    href: "/dashboard/payment-history",
    icon: History,
  },
  {
    title: "Send Payment",
    href: "/dashboard/p2p-payment",
    icon: Send,
  },
];

const adminItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Blockchain",
    href: "/admin/blockchain",
    icon: Database,
  },
  {
    title: "System Logs",
    href: "/admin/logs",
    icon: FileText,
  },
  {
    title: "Payment History",
    href: "/admin/payment-history",
    icon: History,
  },
  {
    title: "Send Payment",
    href: "/admin/p2p-payment",
    icon: Send,
  },
];

function buildMap(items: NavItem[]): Record<string, NavItem> {
  return items.reduce<Record<string, NavItem>>((acc, cur) => {
    acc[cur.href] = cur;
    return acc;
  }, {});
}

const menuItemsConfig = {
  consumer: consumerItems,
  farmer: farmerItems,
  qc: qcItems,
  manufacturer: manufacturerItems,
  admin: adminItems,
};

export function Nav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const { unreadCount, mentionCount } = useContext(NotificationContext);
  const totalNotifications = unreadCount + mentionCount;

  const footerMenuItems = [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { 
      href: '/dashboard/support', 
      label: 'Support', 
      icon: LifeBuoy,
      notifications: {
        total: totalNotifications,
        mentions: mentionCount,
      }
    },
]
  
  useEffect(() => {
      if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
              const user = JSON.parse(storedUser);
              setUserRole(user.role);
          } else {
              // Fallback role detection based on URL path
              if (pathname.startsWith('/admin')) setUserRole('admin');
              else if (pathname.startsWith('/qc')) setUserRole('qc');
              else if (pathname.startsWith('/manufacturer')) setUserRole('manufacturer');
              else setUserRole('farmer');
          }
      }
  }, [pathname]);

  const getDashboardLink = () => {
      if (userRole === 'admin') return '/admin/dashboard';
      if (userRole === 'qc') return '/qc/dashboard';
      if (userRole === 'manufacturer') return '/manufacturer/dashboard';
      return '/dashboard';
  }
  
  const getMenuItems = () => {
      if (userRole && menuItemsConfig[userRole]) {
          return menuItemsConfig[userRole];
      }
      return menuItemsConfig.farmer; // Default to farmer menu
  }

  const menuItems: any = getMenuItems();
  
  const getIsActive = (itemHref: string) => {
    // Exact match for dashboard home pages
    if (itemHref.endsWith('/dashboard') || itemHref.endsWith('/review') || itemHref.endsWith('/collections') || itemHref.endsWith('/appeals') || itemHref.endsWith('/reports') || itemHref.endsWith('/batches') || itemHref.endsWith('/analytics')) {
        return pathname === itemHref;
    }
    // Starts with for all other pages
    return pathname.startsWith(itemHref);
  }
  
  const getFooterItemHref = (baseHref: string) => {
      if (userRole === 'admin') return baseHref.replace('/dashboard', '/admin');
      if (userRole === 'qc') return baseHref.replace('/dashboard', '/qc');
      if (userRole === 'manufacturer') return baseHref.replace('/dashboard', '/manufacturer');
      return baseHref;
  }

  return (
    <nav className="flex flex-col h-full">
      <SidebarHeader>
        <Link
          href={getDashboardLink()}
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <AgriVisionLogo className="h-7 w-7 text-primary" />
          <span className="font-headline">AgriVision</span>
        </Link>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        {menuItems.map((item: any) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                isActive={getIsActive(item.href)}
                tooltip={item.title}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarSeparator />
      <SidebarFooter className='p-2'>
         {footerMenuItems.map((item) => {
            const finalHref = getFooterItemHref(item.href);
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={finalHref} passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(finalHref)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                     {item.notifications && item.notifications.total > 0 && (
                      <SidebarMenuBadge>
                        {item.notifications.total}
                      </SidebarMenuBadge>
                    )}
                     {item.notifications && item.notifications.mentions > 0 && (
                      <SidebarMenuBadge className="bg-destructive text-destructive-foreground right-8">
                        @{item.notifications.mentions}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
        })}
      </SidebarFooter>
      <div className="p-4 text-center text-xs text-muted-foreground border-t">
        <p>AgriVision v1.0</p>
        <p className="mt-1">by Team 404 Not Found</p>
      </div>
    </nav>
  );
}
