'use client';

import { Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notifications } from '@/lib/data';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const unreadCount = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className="flex items-start gap-3"
          >
            <Clock className="w-4 h-4 mt-1 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{notification.title}</p>
              <p className="text-xs text-muted-foreground">
                {notification.description}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                {formatDistanceToNow(notification.date, { addSuffix: true })}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
