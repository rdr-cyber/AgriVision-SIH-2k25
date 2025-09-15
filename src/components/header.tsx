'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import { NotificationContext } from '@/context/notification-context';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Home,
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AgriVisionLogo } from '@/components/agrivision-logo';

export function Header() {
  const [user, setUser] = useState<{firstName: string, lastName: string} | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const { unreadCount, mentionCount, notifications, markAsRead } = useContext(NotificationContext);
  
  const isAdmin = pathname.startsWith('/admin');
  
  const totalNotifications = unreadCount + mentionCount;

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            const storedUserRaw = localStorage.getItem('user');
            if (storedUserRaw) {
                const storedUser: { firstName: string, lastName: string } = JSON.parse(storedUserRaw);
                setUser(storedUser);
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage in header", error);
        }
    }
  }, []);

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const basePath = isAdmin ? '/admin/collections' : '/dashboard/collections';
    if (searchQuery.trim()) {
      router.push(`${basePath}?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(basePath);
    }
  }
  
  const handleOpenChange = (open: boolean) => {
    if (open && (unreadCount > 0 || mentionCount > 0)) {
        markAsRead();
    }
  }
  
  const getNotificationMessage = (notification: any) => {
      if (user && notification.body.includes(`@[${user.firstName} ${user.lastName}`)) {
          return `You were mentioned`;
      }
      return notification.title;
  }

  const getSupportPageHref = () => {
    if (pathname.startsWith('/admin')) return '/admin/support';
    if (pathname.startsWith('/qc')) return '/qc/support';
    if (pathname.startsWith('/manufacturer')) return '/manufacturer/support';
    if (pathname.startsWith('/consumer')) return '/consumer/support';
    return '/dashboard/support';
  }

  const clearAllUserData = () => {
    // Clear all user-related data from localStorage
    const keysToRemove = [
      'user',
      'tempUser',
      'agrivision-users',
      'agrivision-samples',
      'agrivision-chat',
      'agrivision-notifications'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Show confirmation
    alert('All user data has been cleared successfully!');
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2">
            <AgriVisionLogo className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">AgriVision</span>
          </Link>
          
          {!pathname.startsWith('/login') && !pathname.startsWith('/register') && (
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                href={isAdmin ? "/admin/dashboard" : "/dashboard"} 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/' || pathname === '/dashboard' || pathname === '/admin/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Home className="h-4 w-4 inline mr-1" />
                Dashboard
              </Link>
              <Link 
                href={getSupportPageHref()} 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes('/support') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Support
              </Link>
            </nav>
          )}
        </div>
        
        {!pathname.startsWith('/login') && !pathname.startsWith('/register') && (
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search collections..."
                  className="w-64 pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            <Popover onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {totalNotifications > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] text-primary-foreground items-center justify-center">
                        {totalNotifications > 9 ? '9+' : totalNotifications}
                      </span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <>
                      <div className="p-3 border-b">
                        <h4 className="font-medium">Notifications</h4>
                      </div>
                      <div className="divide-y">
                        {notifications.slice(0, 5).map((notification) => (
                          <div key={notification.id} className="p-3 hover:bg-muted">
                            <p className="text-sm font-medium">{getNotificationMessage(notification)}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.body}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      No notifications
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                    <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.firstName.toLowerCase()}.{user.lastName.toLowerCase()}@agrivision.co
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearAllUserData} className="cursor-pointer text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Clear All User Data</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}