
'use client';
import { MoreHorizontal, UserPlus, Check, X, UserCog, Loader2 } from 'lucide-react';
import { AuthManager } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const USERS_STORAGE_KEY = 'agrivision-users';

type Role = 'consumer' | 'farmer' | 'admin' | 'qc' | 'manufacturer';
type Status = 'active' | 'suspended';

type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    status: Status;
    createdAt: string;
    password?: string;
};

const userFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  role: z.enum(['consumer', 'farmer', 'qc', 'manufacturer', 'admin']),
});

// This function now robustly initializes users with guaranteed unique IDs.
const initializeUsers = (): User[] => {    
    if (typeof window === 'undefined') {
        return [];
    }
    
    const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsersRaw) {
        try {
            // Ensure all users parsed from storage have an ID.
            const users = JSON.parse(storedUsersRaw) as User[];
            return users.map(u => ({ ...u, id: u.id || `USR-${Math.random().toString(36).substr(2, 9)}` }));
        } catch {
            // If parsing fails, fall back to default.
        }
    }

    const defaultUsers: User[] = [
      {
        id: 'USR-A01',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@agrivision.co',
        password: 'password123',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'USR-M01',
        firstName: 'MediLeaf',
        lastName: 'Pharmaceuticals',
        email: 'contact@medileaf.co',
        password: 'password123',
        role: 'manufacturer',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
       {
        id: 'USR-Q01',
        firstName: 'QC',
        lastName: 'Dave',
        email: 'dave@qlabs.co',
        password: 'password123',
        role: 'qc',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'USR-F01',
        firstName: 'Alice',
        lastName: 'Farmer',
        email: 'alice@farm.co',
        password: 'password123',
        role: 'farmer',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
       {
        id: 'USR-F02',
        firstName: 'Bob',
        lastName: 'Fields',
        email: 'bob@fields.co',
        password: 'password123',
        role: 'farmer',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
       {
        id: 'USR-F03',
        firstName: 'Charlie',
        lastName: 'Cultivator',
        email: 'charlie@cultivator.co',
        password: 'password123',
        role: 'farmer',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'USR-C01',
        firstName: 'Carol',
        lastName: 'Consumer',
        email: 'carol@consumer.co',
        password: 'password123',
        role: 'consumer',
        status: 'active',
        createdAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
};


export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAddUserOpen, setAddUserOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    setUsers(initializeUsers());
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "farmer",
    },
  });
  
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, users]);

  const updateUserInStorage = (updatedUsers: User[]) => {
      setUsers(updatedUsers);
      if (typeof window !== 'undefined') {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      }
  }

  const handleStatusChange = (userId: string, newStatus: Status) => {
      const newUsers = users.map(u => u.id === userId ? { ...u, status: newStatus } : u);
      updateUserInStorage(newUsers);
      const user = users.find(u => u.id === userId);
      toast({
          title: 'User Status Updated',
          description: `User ${user?.firstName} ${user?.lastName} has been ${newStatus}.`
      })
  }
  
  const handleRoleChange = (userId: string, newRole: Role) => {
      // Get current user role for EoP validation
      const currentUserRole = AuthManager.getUserRole();
      
      // Validate role change to prevent escalation of privilege
      if (currentUserRole && !AuthManager.validateRoleChange(currentUserRole, newRole)) {
          toast({
              title: 'Permission Denied',
              description: 'You do not have permission to assign this role.',
              variant: 'destructive',
          });
          return;
      }
      
      const newUsers = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
      updateUserInStorage(newUsers);
      const user = users.find(u => u.id === userId);
       toast({
          title: 'User Role Updated',
          description: `User ${user?.firstName} ${user?.lastName} has been assigned the role of ${newRole}.`
      })
  }
  
  const handleAddUser = (values: z.infer<typeof userFormSchema>) => {
    startTransition(() => {
        const newUser: User = {
            id: `USR-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            role: values.role as Role,
            status: 'active',
            createdAt: new Date().toISOString(),
            password: 'password123', // Default password
        };
        const newUsers = [...users, newUser];
        updateUserInStorage(newUsers);

        toast({
            title: "User Created",
            description: `${values.firstName} ${values.lastName} has been added as a ${values.role}.`,
        });
        setAddUserOpen(false);
        form.reset();
    })
  }

  return (
    <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
        <Card>
        <CardHeader className='flex-row items-center justify-between'>
            <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                {searchQuery ? `Showing results for "${searchQuery}"` : 'Oversee, manage, and moderate all user accounts in the system.'}
                </CardDescription>
            </div>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4"/>
                    Add User
                </Button>
            </DialogTrigger>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isClient && filteredUsers.map((user) => (
                <TableRow key={user.id}>
                    <TableCell className="font-mono">{user.id}</TableCell>
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} 
                            className={cn(user.status === 'active' && 'border-green-600 text-green-700 dark:border-green-500/60 dark:bg-green-900/50 dark:text-green-400')}>
                        {user.status}
                        </Badge>
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {user.status === 'active' ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'suspended')} className="text-destructive">
                                    <X className="mr-2 h-4 w-4" /> Suspend
                            </DropdownMenuItem>
                        ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                    <Check className="mr-2 h-4 w-4" /> Reactivate
                                </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                            <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <UserCog className="mr-2 h-4 w-4" />
                                <span>Change Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'farmer')}>
                                        <span>Farmer</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'qc')}>
                                        <span>QC Agent</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'manufacturer')}>
                                        <span>Manufacturer</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                                        <span>Admin</span>
                                </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
            {isClient && filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                <p>No users found.</p>
            </div>
            )}
        </CardContent>
        </Card>

        <DialogContent>
            <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
                Create a new user account and assign them a role. They will receive an invitation to set their password.
            </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="name@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="consumer">Consumer</SelectItem>
                                    <SelectItem value="farmer">Farmer</SelectItem>
                                    <SelectItem value="qc">QC Agent</SelectItem>
                                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
