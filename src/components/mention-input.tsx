'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
} from '@/components/ui/popover';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/lib/types';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  users: User[];
  disabled: boolean;
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


export function MentionInput({ value, onChange, onKeyDown, users, disabled }: MentionInputProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const lastWord = value.split(/\s+/).pop() || '';
    if (lastWord.startsWith('@')) {
      setPopoverOpen(true);
      const query = lastWord.substring(1).toLowerCase();
      setMentionQuery(query);
      const filtered = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
      setActiveIndex(0);
    } else {
      setPopoverOpen(false);
    }
  }, [value, users]);

  const handleSelectUser = (user: User) => {
    const userString = `${user.firstName} ${user.lastName} · ${formatRole(user.role)}`;
    const textParts = value.split(/\s+/);
    textParts.pop(); // remove the @mention part
    const newValue = `${textParts.join(' ')} @[${userString}] `;
    onChange(newValue);
    setPopoverOpen(false);
  };
  
  const handleKeyDownPopover = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (popoverOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredUsers.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (filteredUsers.length > 0) {
          e.preventDefault();
          handleSelectUser(filteredUsers[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setPopoverOpen(false);
      }
    }
    onKeyDown(e);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverAnchor asChild>
        <Textarea
          placeholder="Type your message... use '@' to mention a user."
          className="flex-1 resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDownPopover}
          disabled={disabled}
        />
      </PopoverAnchor>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[300px] p-0"
      >
        <Card>
          <ScrollArea className="h-48">
            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`flex items-center gap-2 p-2 cursor-pointer ${
                  index === activeIndex ? 'bg-muted' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://picsum.photos/seed/${user.firstName}/40/40`} />
                  <AvatarFallback>{getInitials(`${user.firstName} ${user.lastName}`)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{formatRole(user.role)}</p>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                    No users found
                </div>
            )}
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  );
}