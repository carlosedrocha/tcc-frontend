'use client';

import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Bell, Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';

let socket: ReturnType<typeof io> | null = null;

export default function Header() {
  const [notifications, setNotifications] = useState<
    { title: string; description: string; read: boolean }[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load stored notifications
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter((n) => !n.read).length);
    }

    // Initialize WebSocket connection
    socket = io('http://localhost:3333');
    socket.on('connect', () => {
      console.log('Conectado ao servidor WebSocket');
    });

    socket.on('waiterNotification', (data: string) => {
      const newNotification = {
        title: data,
        description: 'Agora mesmo',
        read: false
      };

      setNotifications((prevNotifications) => {
        const updatedNotifications = [newNotification, ...prevNotifications];
        localStorage.setItem(
          'notifications',
          JSON.stringify(updatedNotifications)
        );
        return updatedNotifications;
      });
      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const logoClickHandler = () => {
    if (typeof window !== 'undefined') {
      const userLoggedIn = Boolean(localStorage.getItem('user'));
      window.location.href = userLoggedIn ? '/dashboard' : '/home';
    }
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true
      }))
    );
    setUnreadCount(0);
    localStorage.setItem(
      'notifications',
      JSON.stringify(
        notifications.map((notification) => ({
          ...notification,
          read: true
        }))
      )
    );
  };

  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Image
            src="https://brew-master-dev.s3.us-east-2.amazonaws.com/FundoTrasnparenteLogo.png"
            height={50}
            width={50}
            alt="company logo"
            onClick={logoClickHandler}
          />
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
          <Popover>
            <PopoverTrigger>
              <div className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="flex w-[320px] -translate-x-10 justify-center p-2">
              <CardDemo
                notifications={notifications}
                markAllAsRead={markAllAsRead}
                unreadCount={unreadCount}
              />
            </PopoverContent>
          </Popover>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}

type CardProps = {
  notifications: { title: string; description: string; read: boolean }[];
  markAllAsRead: () => void;
  unreadCount: number;
};

function CardDemo({ notifications, markAllAsRead, unreadCount }: CardProps) {
  const displayedNotifications = notifications.slice(0, 5);

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>{unreadCount} novas notificações.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {displayedNotifications.map((notification, index) => (
          <div
            key={index}
            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
          >
            <span
              className={cn(
                'flex h-2 w-2 translate-y-1 rounded-full bg-sky-500',
                notification.read && 'invisible'
              )}
            />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {notification.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={markAllAsRead}>
          <Check className="mr-2 h-4 w-4" /> Marcar todas como lidas
        </Button>
      </CardFooter>
    </Card>
  );
}
