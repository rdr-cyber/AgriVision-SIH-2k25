
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/types';

type Message = {
    id: number;
    text: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    avatarSeed: string;
    timestamp: string;
  };
  
interface ChatMessageProps {
    message: Message;
    currentUser: User | null;
}

const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0] ? name[0].toUpperCase() : '';
}

const formatRole = (role: string) => {
    switch (role) {
        case 'farmer': return 'Farmer/Collector';
        case 'qc': return 'QC Agent';
        case 'manufacturer': return 'Manufacturer/Aggregator';
        case 'admin': return 'Admin';
        case 'consumer': return 'Consumer';
        default: return 'User';
    }
}

const renderMessageText = (text: string) => {
    const parts = text.split(/(@\[[^\]]+\])/g);
    return parts.map((part, index) => {
        const match = part.match(/@\[([^\]]+)\]/);
        if (match) {
            const userNameAndRole = match[1];
            return (
                <strong key={index} className="text-accent-foreground bg-accent/30 px-1 rounded-sm">
                    @{userNameAndRole}
                </strong>
            );
        }
        return part;
    });
};

export function ChatMessage({ message, currentUser }: ChatMessageProps) {

    const isUserSender = (msg: Message) => {
        if (!currentUser) return false;
        return msg.senderId === currentUser.email;
    }

    return (
         <div
            key={message.id}
            className={`flex items-start gap-3 ${
              isUserSender(message) ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
             <Avatar className="h-9 w-9">
                <AvatarImage src={`https://picsum.photos/seed/${message.avatarSeed}/40/40`} alt={message.senderName} data-ai-hint="person face" />
                <AvatarFallback>{getInitials(message.senderName)}</AvatarFallback>
              </Avatar>
            
            <div
              className={`max-w-md rounded-lg px-4 py-2 ${
                isUserSender(message)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm font-semibold">{message.senderName} &middot; <span className="text-xs opacity-80">{formatRole(message.senderRole)}</span></p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{renderMessageText(message.text)}</p>
              <p
                className={`text-xs mt-2 ${
                  isUserSender(message)
                    ? 'text-primary-foreground/70 text-left'
                    : 'text-muted-foreground text-right'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
    )
}
