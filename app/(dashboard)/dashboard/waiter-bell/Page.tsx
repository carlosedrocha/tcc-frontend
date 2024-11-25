'use client';
import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket: ReturnType<typeof io> | null = null;
const breadcrumbItems = [{ title: 'Campainha', link: '/dashboard/campainha' }];

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<
    { title: string; description: string; read: boolean }[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0); // Contador de novas notificações
  const [role, setRole] = useState<string | null>(null); // Armazena a role
  const fetchUserId = async () => {
    const userID = sessionStorage.getItem('userId');
    if (!userID) {
      try {
        const response = await api.get(`/tab/user/${userID}`);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    let storedRole = sessionStorage.getItem('role');
    if (storedRole?.startsWith('"') && storedRole.endsWith('"')) {
      storedRole = storedRole.slice(1, -1); // Remove aspas extras
    }
    setRole(storedRole);

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
    console.log(storedRole);
    // Lógica específica para role "client"
    if (storedRole === 'client') {
      console.log('entrei');
      socket.on('clientNotification', (data: string) => {
        const newNotification = {
          title: data,
          description: 'Notificação para cliente',
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
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const markAllAsRead = () => {

    if (role === 'client' && socket) {
      socket.emit('callWaiter', { message: 'Cliente chamou o garçom' });
      console.log('Chamando o garçom via WebSocket');
    }

    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('notifications');
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title={role === 'client' ? 'Campainha' : 'Campainha'}
          description={
            role === 'client'
              ? 'Clique no botão para chamar o garçom'
              : 'Veja as mesas que estão solicitando atendimento'
          }
        />
      </div>

      <CardDemo
        notifications={notifications}
        markAllAsRead={markAllAsRead}
        unreadCount={unreadCount}
        role={role}
      />
    </div>
  );
}

type CardProps = React.ComponentProps<typeof Card> & {
  notifications: { title: string; description: string; read: boolean }[];
  markAllAsRead: () => void;
  unreadCount: number;
  role: string | null;
};

function CardDemo({
  className,
  notifications,
  markAllAsRead,
  unreadCount,
  role,
  ...props
}: CardProps) {
  const displayedNotifications = notifications.slice(0, 5);

  return (
    <Card className={cn('w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle>
          {role === 'client'
            ? 'Aguarde o garçom ao clicar no botão'
            : 'Notificações'}
        </CardTitle>
        <CardDescription>
          {role === 'client' ? `` : `${unreadCount} novas notificações.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {displayedNotifications.map((notification, index) => (
            <div
              key={index}
              className={cn(
                'mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0',
                role === 'client' && 'rounded-lg bg-blue-100 p-2' // Estilo extra para client
              )}
            >
              <span
                className={cn(
                  'flex h-2 w-2 translate-y-1 rounded-full bg-sky-500',
                  notification.read && 'invisible'
                )}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {role === 'client'
                    ? `Cliente: ${notification.title}`
                    : notification.title}
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
        <Button
          className="w-full"
          onClick={markAllAsRead}
          variant={role === 'client' ? 'destructive' : 'default'}
        >
          <Check className="mr-2 h-4 w-4" />
          {role === 'client' ? 'Chamar o garçom' : 'Marcar todas como lidas'}
        </Button>
      </CardFooter>
    </Card>
  );
}
