'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SendHorizonal, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MentionInput } from '@/components/mention-input';
import { ChatMessage } from '@/components/chat-message';
import { useToast } from '@/hooks/use-toast';
import { NotificationContext } from '@/context/notification-context';
import type { Message, User } from '@/lib/types';
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const CHAT_STORAGE_KEY = 'agrivision-global-chat';
const USERS_STORAGE_KEY = 'agrivision-users';

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { recalculateNotifications } = useContext(NotificationContext);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // toast({
    //   title: "Message Sent",
    //   description: "We've received your message and will get back to you soon.",
    // });
    console.log("Form submitted", { subject, message });
    setSubject("");
    setMessage("");
  };

  // Load current user and all users
  useEffect(() => {
    setIsClient(true);
    try {
      const storedUserRaw = localStorage.getItem('user');
      const allUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      
      if (storedUserRaw && allUsersRaw) {
        const storedUser: { firstName: string, lastName: string, role: User['role']} = JSON.parse(storedUserRaw);
        const users: any[] = JSON.parse(allUsersRaw);
        
        const fullCurrentUser = users.find(u => 
            u.firstName === storedUser.firstName && 
            u.lastName === storedUser.lastName &&
            u.role === storedUser.role
        );
        setCurrentUser(fullCurrentUser);
        setAllUsers(users.map((u, i) => ({ ...u, id: u.id || `user-${i}`})));
      } else {
        console.log("User data not found in localStorage.");
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
    }
  }, []);

  // Load chat messages
  useEffect(() => {
    if (isClient) {
      try {
        const storedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
        setMessages(storedMessages ? JSON.parse(storedMessages) : []);
      } catch (error) {
        console.error("Failed to parse messages from localStorage", error);
        setMessages([]);
      }
    }
  }, [isClient]);

  // Save messages, scroll, and update notifications
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      recalculateNotifications(messages, currentUser);
    }
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isClient, currentUser, recalculateNotifications]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !isClient || !currentUser) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      senderId: currentUser.email,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`,
      senderRole: currentUser.role,
      avatarSeed: currentUser.firstName,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
  };

  const handleClearHistory = () => {
    // Non-admins can only clear their view, not the global history
    setMessages([]);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Support Center</CardTitle>
            <CardDescription>
             A global chat for all AgriVision users.
            </CardDescription>
          </div>
          {currentUser?.role === 'farmer' && (
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear My View
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear your local view of the chat history. Other users will still see the full history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory} className="bg-destructive hover:bg-destructive/90">
                    Yes, clear my view
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {isClient && messages.length > 0 && messages.map((message) => (
          <ChatMessage key={message.id} message={message} currentUser={currentUser} />
        ))}
         {isClient && messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {!isClient && <p>Loading chat...</p>}
      </CardContent>
      <CardFooter className="border-t p-4">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center space-x-2"
        >
          <MentionInput
            value={newMessage}
            onChange={setNewMessage}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                 const popoverOpen = document.querySelector('[data-radix-popper-content-wrapper]');
                 if (!popoverOpen) {
                    e.preventDefault();
                    handleSendMessage(e);
                 }
              }
            }}
            users={allUsers}
            disabled={!isClient || !currentUser}
          />
          <Button type="submit" size="icon" disabled={!isClient || !newMessage.trim() || !currentUser}>
            <SendHorizonal className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
