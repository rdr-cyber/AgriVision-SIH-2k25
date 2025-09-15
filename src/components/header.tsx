
'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { NotificationContext } from '@/context/notification-context';
import type { Message, User } from '@/lib/types';


const USERS_STORAGE_KEY = 'agrivision-users';

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
  
  const getNotificationMessage = (notification: Message) => {
      if (user && notification.text.includes(`@[${user.firstName} ${user.lastName}`)) {
          return `You were mentioned by ${notification.senderName}`;
      }
      return `New message from ${notification.senderName}`;
  }

  const getSupportPageHref = () => {
    if (pathname.startsWith('/admin')) return '/admin/support';
    if (pathname.startsWith('/qc')) return '/qc/support';
    if (pathname.startsWith('/manufacturer')) return '/manufacturer/support';
    if (pathname.startsWith('/consumer')) return '/consumer/support';
    return '/dashboard/support';
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="shrink-0 md:hidden" />
      <div className="w-full flex-1">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={isAdmin ? "Search collections, users, batches..." : "Search your collections..."}
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
       <DropdownMenu onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            {totalNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{totalNotifications}</Badge>
            )}
            {mentionCount > 0 && (
                 <Badge variant="destructive" className="absolute top-5 -right-2 text-xs h-5 w-5 justify-center p-0">@{mentionCount}</Badge>
            )}
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[350px]">
           <DropdownMenuLabel>Notifications</DropdownMenuLabel>
           <DropdownMenuSeparator/>
           {notifications.length > 0 ? (
                notifications.map(notif => (
                     <DropdownMenuItem key={notif.id} asChild>
                        <Link href={getSupportPageHref()} className="flex flex-col items-start">
                            <span className="font-semibold">{getNotificationMessage(notif)}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-full">"{notif.text}"</span>
                        </Link>
                   </DropdownMenuItem>
                ))
           ) : (
                <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
           )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={`https://picsum.photos/seed/${user?.firstName}/40/40`} />
              <AvatarFallback>
                {user ? getInitials(user.firstName, user.lastName) : 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user ? `${user.firstName} ${user.lastName}` : 'User'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={isAdmin ? '/admin/settings' : (pathname.startsWith('/qc') ? '/qc/settings' : pathname.startsWith('/manufacturer') ? '/manufacturer/settings' : pathname.startsWith('/consumer') ? '/consumer/settings' : '/dashboard/settings')}>Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
             <Link href={getSupportPageHref()}>Support</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

    