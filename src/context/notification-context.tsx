'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback, useReducer } from 'react';
import type { Message, User } from '@/lib/types';

export type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
};

type NotificationState = {
  notifications: Notification[];
};

type AddNotificationAction = {
  type: "ADD_NOTIFICATION";
  payload: Notification;
};

type RemoveNotificationAction = {
  type: "REMOVE_NOTIFICATION";
  payload: {
    id: string;
  };
};

type NotificationAction = AddNotificationAction | RemoveNotificationAction;

const NOTIFICATION_STORAGE_KEY = 'agrivision-last-read-timestamp';
const CHAT_STORAGE_KEY = 'agrivision-global-chat';
const USERS_STORAGE_KEY = 'agrivision-users';

interface NotificationContextType extends NotificationState {
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  unreadCount: number;
  mentionCount: number;
  markAsRead: () => void;
  recalculateNotifications: (messages: Message[], currentUser: User | null) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  unreadCount: 0,
  mentionCount: 0,
  markAsRead: () => {},
  recalculateNotifications: () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    (
      state: NotificationState,
      action: NotificationAction,
    ): NotificationState => {
      switch (action.type) {
        case "ADD_NOTIFICATION":
          return {
            ...state,
            notifications: [action.payload, ...state.notifications],
          };
        case "REMOVE_NOTIFICATION":
          return {
            ...state,
            notifications: state.notifications.filter(
              (notification) => notification.id !== action.payload.id,
            ),
          };
        default:
          return state;
      }
    },
    { notifications: [] },
  );

  const [unreadCount, setUnreadCount] = useState(0);
  const [mentionCount, setMentionCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    if (typeof window === 'undefined') return Date.now();
    const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : Date.now(); 
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
      setUnreadCount(0);
      setMentionCount(0);
      return;
    };

    const newUnreadMessages = messages.filter(msg => {
      // Ensure msg.id is a number and lastReadTimestamp is also a number
      const messageId = typeof msg.id === 'string' ? parseInt(msg.id, 10) : msg.id;
      return messageId > lastReadTimestamp && msg.senderId !== currentUser.email;
    });
    
    const mentions = newUnreadMessages.filter(msg => {
        const mentionString = `@[${currentUser.firstName} ${currentUser.lastName}`;
        return msg.text.includes(mentionString);
    });

    const newNotifications = newUnreadMessages
      .map(msg => ({
        id: msg.id.toString(),
        title: "New Message",
        body: msg.text,
        createdAt: msg.timestamp ? (typeof msg.timestamp === 'string' ? parseInt(msg.timestamp, 10) : msg.timestamp) : Date.now(),
      }))
      .reverse();

    // Clear existing notifications first
    state.notifications.forEach(notification => {
      dispatch({ type: "REMOVE_NOTIFICATION", payload: { id: notification.id } });
    });
    // Add new notifications
    newNotifications.forEach(notification => {
      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
    });

    setUnreadCount(newUnreadMessages.length - mentions.length);
    setMentionCount(mentions.length);
  }, [lastReadTimestamp, state.notifications]);

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
                    const lastMessage = messages[messages.length - 1];
                    // Ensure we're using a number for the timestamp
                    const newTimestamp = typeof lastMessage.id === 'string' ? parseInt(lastMessage.id, 10) : lastMessage.id;
                    localStorage.setItem(NOTIFICATION_STORAGE_KEY, newTimestamp.toString());
                    setLastReadTimestamp(newTimestamp);
                    setUnreadCount(0);
                    setMentionCount(0);
                }
            } catch (e) {
                console.error("Failed to parse chat history on markAsRead", e);
            }
        }
    }
  };

  const addNotification = (notification: Notification) => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: notification,
    });
  };

  const removeNotification = (id: string) => {
    dispatch({
      type: "REMOVE_NOTIFICATION",
      payload: { id },
    });
  };

  return (
    <NotificationContext.Provider value={{ 
      ...state, 
      addNotification, 
      removeNotification,
      unreadCount,
      mentionCount,
      markAsRead,
      recalculateNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};