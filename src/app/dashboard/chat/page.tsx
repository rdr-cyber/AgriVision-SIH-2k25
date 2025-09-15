'use client';

import { useState, useEffect } from "react";
import { Send, User, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message, User as UserType } from '@/lib/types';
import { generateAvatarSeed } from '@/lib/utils';

export default function ChatPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load user from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
  }, []);

  // Simulate loading messages
  useEffect(() => {
    // In a real app, this would connect to a WebSocket or API
    const mockMessages: Message[] = [
      {
        id: 1,
        text: 'Hello team, I have a question about sample #SMP-2023-001',
        senderId: 'user1',
        senderName: 'Farmer John',
        senderRole: 'farmer',
        avatarSeed: 'farmer1',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        text: 'Hi John, what would you like to know about that sample?',
        senderId: 'user2',
        senderName: 'QC Agent Sarah',
        senderRole: 'qc',
        avatarSeed: 'qc1',
        timestamp: new Date(Date.now() - 3500000).toISOString()
      },
      {
        id: 3,
        text: 'I noticed the quality score seems lower than expected. Can you explain the reasoning?',
        senderId: 'user1',
        senderName: 'Farmer John',
        senderRole: 'farmer',
        avatarSeed: 'farmer1',
        timestamp: new Date(Date.now() - 3400000).toISOString()
      },
      {
        id: 4,
        text: 'The sample had some contamination issues that affected the quality score. I can provide more details if needed.',
        senderId: 'user2',
        senderName: 'QC Agent Sarah',
        senderRole: 'qc',
        avatarSeed: 'qc1',
        timestamp: new Date(Date.now() - 3300000).toISOString()
      }
    ];
    setMessages(mockMessages);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      senderRole: user.role,
      avatarSeed: generateAvatarSeed(user.id),
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredMessages = messages.filter(message => {
    if (activeChat === 'all') return true;
    return message.senderId === activeChat || message.senderId === user?.id;
  });

  const chatParticipants = Array.from(
    new Set(messages.map(m => `${m.senderName}|${m.senderRole}|${m.avatarSeed}`))
  ).map(participant => {
    const [name, role, avatarSeed] = participant.split('|');
    return { name, role, avatarSeed };
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Team Chat</h1>
        <p className="text-muted-foreground">
          Communicate with other members of the Agrivision platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Chat with team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <button
                className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${
                  activeChat === 'all' 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setActiveChat('all')}
              >
                <div className="relative">
                  <Users className="h-8 w-8 p-1.5 bg-primary/10 rounded-full text-primary" />
                </div>
                <div>
                  <p className="font-medium">General Chat</p>
                  <p className="text-xs text-muted-foreground">All team members</p>
                </div>
              </button>
              
              {chatParticipants.map((participant, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${
                    activeChat === participant.name 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveChat(participant.name)}
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{participant.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {activeChat === 'all' ? 'General Chat' : `Chat with ${activeChat}`}
            </CardTitle>
            <CardDescription>
              {activeChat === 'all' 
                ? 'Conversation with all team members' 
                : `Private conversation with ${activeChat}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-[600px]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.senderId === user?.id ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {message.senderName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[75%] ${
                        message.senderId === user?.id 
                          ? 'text-right' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.senderName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 capitalize">
                        {message.senderRole}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
