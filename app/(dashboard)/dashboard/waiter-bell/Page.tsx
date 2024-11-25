'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { BellRing, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';

let socket: ReturnType<typeof io> | null = null;
const breadcrumbItems = [{ title: 'Campainha', link: '/dashboard/campainha' }];

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<
    { title: string; description: string; read: boolean }[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0); // Estado para o contador de novas notificações

  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter((n: any) => !n.read).length);
    }

    socket = io('http://localhost:3333');

    socket.on('connect', () => {
      setConnected(true);
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

  const markAllAsRead = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('notifications');
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title={`Campainha`}
          description="Veja as mesas que estão solicitando atendimento"
        />
      </div>

      <CardDemo
        notifications={notifications}
        markAllAsRead={markAllAsRead}
        unreadCount={unreadCount}
      />
    </div>
  );
}

type CardProps = React.ComponentProps<typeof Card> & {
  notifications: { title: string; description: string; read: boolean }[];
  markAllAsRead: () => void;
  unreadCount: number;
};

function CardDemo({
  className,
  notifications,
  markAllAsRead,
  unreadCount,
  ...props
}: CardProps) {
  const displayedNotifications = notifications.slice(0, 5);

  return (
    <Card className={cn('w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>{unreadCount} novas notificações.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
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
        </div>
      </CardContent>
      <CardFooter>
        
        <Button className="w-full" onClick={markAllAsRead}>
          <Check className="mr-2 h-4 w-4" /> Marcar todas como lidas
        </Button>
      </CardFooter>
    </Card>
  );
}
