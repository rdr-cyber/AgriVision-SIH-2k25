
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Leaf,
  Home,
  UploadCloud,
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
  Truck
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

type UserRole = 'consumer' | 'farmer' | 'admin' | 'qc' | 'manufacturer' | null;

const menuItemsConfig = {
    consumer: [
        { href: '/consumer', label: 'Dashboard', icon: Home },
        { href: '/consumer/search', label: 'Search Products', icon: Search },
        { href: '/consumer/marketplace', label: 'Marketplace', icon: ShoppingCart },
        { href: '/consumer/cart', label: 'Shopping Cart', icon: ShoppingCart },
        { href: '/consumer/purchases', label: 'My Purchases', icon: ShoppingCart },
        { href: '/consumer/tracking', label: 'Track Batch', icon: Eye },
        { href: '/dashboard/forum', label: 'Community Forum', icon: MessageSquare },
        { href: '/dashboard/impact', label: 'Sustainability Impact', icon: Leaf },
    ],
    farmer: [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/dashboard/upload', label: 'Upload Sample', icon: UploadCloud },
        { href: '/dashboard/collections', label: 'My Collections', icon: ClipboardList },
        { href: '/dashboard/earnings', label: 'Earnings', icon: DollarSign },
        { href: '/dashboard/rewards', label: 'Rewards Program', icon: Award },
        { href: '/dashboard/chat', label: 'Team Chat', icon: MessageCircle },
        { href: '/dashboard/knowledge', label: 'Knowledge Base', icon: BookOpen },
        { href: '/dashboard/disease-detection', label: 'Disease Detection', icon: Leaf },
        { href: '/dashboard/iot-monitoring', label: 'IoT Monitoring', icon: Zap },
        { href: '/dashboard/financial-services', label: 'Financial Services', icon: DollarSign },
        { href: '/dashboard/supply-chain', label: 'Supply Chain', icon: Truck },
        { href: '/dashboard/docs', label: 'Documentation', icon: BookOpen },
        { href: '/dashboard/forum', label: 'Community Forum', icon: MessageSquare },
        { href: '/dashboard/impact', label: 'Sustainability Impact', icon: Leaf },
    ],
    admin: [
        { href: '/admin/dashboard', label: 'Overview', icon: Home },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/collections', label: 'Collections', icon: ClipboardList },
        { href: '/admin/review', label: 'QC Review', icon: Shield },
        { href: '/admin/batches', label: 'Batches', icon: Boxes },
        { href: '/admin/blockchain', label: 'Blockchain', icon: Database },
        { href: '/admin/logs', label: 'Logs', icon: FileText },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
        { href: '/dashboard/docs', label: 'Documentation', icon: BookOpen },
        { href: '/dashboard/forum', label: 'Community Forum', icon: MessageSquare },
        { href: '/dashboard/impact', label: 'Sustainability Impact', icon: Leaf },
    ],
    qc: [
        { href: '/qc/dashboard', label: 'Dashboard', icon: Home },
        { href: '/qc/collections', label: 'Collections', icon: ClipboardList },
        { href: '/qc/appeals', label: 'Appeals', icon: ShieldAlert },
        { href: '/qc/reports', label: 'Reports / Flags', icon: Flag },
        { href: '/dashboard/qc-dashboard', label: 'QC Dashboard', icon: TestTube2 },
        { href: '/dashboard/reports', label: 'Advanced Reports', icon: FileBarChart },
        { href: '/dashboard/docs', label: 'Documentation', icon: BookOpen },
        { href: '/dashboard/forum', label: 'Community Forum', icon: MessageSquare },
        { href: '/dashboard/impact', label: 'Sustainability Impact', icon: Leaf },
    ],
    manufacturer: [
        { href: '/manufacturer/dashboard', label: 'Dashboard', icon: Home },
        { href: '/manufacturer/collections', label: 'Approved Collections', icon: ClipboardList },
        { href: '/dashboard/batches', label: 'Batch Management', icon: Boxes },
        { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
        { href: '/dashboard/chat', label: 'Team Chat', icon: MessageCircle },
        { href: '/dashboard/docs', label: 'Documentation', icon: BookOpen },
        { href: '/dashboard/forum', label: 'Community Forum', icon: MessageSquare },
        { href: '/dashboard/impact', label: 'Sustainability Impact', icon: Leaf },
    ]
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

  const menuItems = getMenuItems();
  
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
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-headline">AgriVision</span>
        </Link>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                isActive={getIsActive(item.href)}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
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
    </nav>
  );
}
