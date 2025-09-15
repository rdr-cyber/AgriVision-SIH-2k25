
'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Message, User } from '@/lib/types';

const NOTIFICATION_STORAGE_KEY = 'agrivision-last-read-timestamp';
const CHAT_STORAGE_KEY = 'agrivision-global-chat';
const USERS_STORAGE_KEY = 'agrivision-users';

interface NotificationContextType {
  notifications: Message[];
  unreadCount: number;
  mentionCount: number;
  markAsRead: () => void;
  recalculateNotifications: (messages: Message[], currentUser: User | null) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  mentionCount: 0,
  markAsRead: () => {},
  recalculateNotifications: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mentionCount, setMentionCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    if (typeof window === 'undefined') return Date.now();
    const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0; 
  });
  
  useEffect(() => {
     if (typeof window !== 'undefined') {
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
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage for notifications", error);
        }
    }
  }, []);

  const recalculateNotifications = useCallback((messages: Message[], currentUser: User | null) => {
    if (!currentUser || !messages || messages.length === 0) {
      setNotifications([]);
      setUnreadCount(0);
      setMentionCount(0);
      return;
    };

    const newUnreadMessages = messages.filter(msg => msg.id > lastReadTimestamp && msg.senderId !== currentUser.email);
    const mentions = newUnreadMessages.filter(msg => {
        const mentionString = `@[${currentUser.firstName} ${currentUser.lastName}`;
        return msg.text.includes(mentionString);
    });

    setNotifications(newUnreadMessages.slice().reverse()); // Show most recent first
    setUnreadCount(newUnreadMessages.length - mentions.length);
    setMentionCount(mentions.length);
  }, [lastReadTimestamp]);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      try {
        const storedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
        const parsedMessages = storedMessages ? JSON.parse(storedMessages) : [];
        recalculateNotifications(parsedMessages, currentUser);
      } catch (error) {
        console.error("Failed to parse messages from localStorage on load", error);
      }
    }
  }, [currentUser, recalculateNotifications]);
  
  const markAsRead = () => {
    if (typeof window !== 'undefined') {
        const chatHistoryRaw = localStorage.getItem(CHAT_STORAGE_KEY);
        if (chatHistoryRaw) {
            try {
                const messages: Message[] = JSON.parse(chatHistoryRaw);
                if (messages.length > 0) {
                    const newTimestamp = messages[messages.length - 1].id;
                    localStorage.setItem(NOTIFICATION_STORAGE_KEY, newTimestamp.toString());
                    setLastReadTimestamp(newTimestamp);
                    setNotifications([]);
                    setUnreadCount(0);
                    setMentionCount(0);
                }
            } catch (e) {
                console.error("Failed to parse chat history on markAsRead", e);
            }
        }
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, mentionCount, markAsRead, recalculateNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
