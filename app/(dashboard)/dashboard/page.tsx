'use client';
import HeroComponent from '@/components/home/hero/hero-component';
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
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket: ReturnType<typeof io> | null = null;

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<
    { title: string; description: string; read: boolean }[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0); // Estado para o contador de novas notificações

  useEffect(() => {
    // Carregar notificações do localStorage ao montar o componente
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter((n: any) => !n.read).length); // Atualiza o contador de novas notificações
    }

    // Conectar ao WebSocket Gateway do NestJS quando o componente carregar
    socket = io('http://localhost:3333');

    socket.on('connect', () => {
      setConnected(true);
      console.log('Conectado ao servidor WebSocket');
    });

    // Receber notificações do WebSocket
    socket.on('waiterNotification', (data: string) => {
      const newNotification = {
        title: data,
        description: 'Agora mesmo', // Tempo mock, você pode adaptar para tempo real
        read: false // Nova notificação começa como não lida
      };

      // Adiciona a nova notificação no início da lista
      setNotifications((prevNotifications) => {
        const updatedNotifications = [newNotification, ...prevNotifications];
        localStorage.setItem(
          'notifications',
          JSON.stringify(updatedNotifications)
        ); // Salva as notificações no localStorage
        return updatedNotifications;
      });
      setUnreadCount((prevCount) => prevCount + 1); // Incrementa o contador de novas notificações
    });

    // Desconectar o socket quando o componente for desmontado
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const markAllAsRead = () => {
    // Limpa as notificações na tela
    setNotifications([]);
    setUnreadCount(0); // Reseta o contador de novas notificações

    // Limpa as notificações do localStorage
    localStorage.removeItem('notifications');
  };

  return (
    <div className="p-4">
      <HeroComponent />
      {/* <h1>Mesas Abertas:</h1>
      <br /> */}
      {/* <CardDemo
        notifications={notifications}
        markAllAsRead={markAllAsRead}
        unreadCount={unreadCount}
      /> */}
    </div>
  );
}

type CardProps = React.ComponentProps<typeof Card> & {
  notifications: { title: string; description: string; read: boolean }[];
  markAllAsRead: () => void;
  unreadCount: number; // Adicionado o contador de novas notificações
};

function CardDemo({
  className,
  notifications,
  markAllAsRead,
  unreadCount,
  ...props
}: CardProps) {
  // Limita o número de notificações exibidas
  const displayedNotifications = notifications.slice(0, 5); // Exibe apenas as 5 notificações mais recentes

  return (
    <Card className={cn('w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          {unreadCount} novas notificações.
        </CardDescription>{' '}
        {/* Exibe o contador de novas notificações */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {displayedNotifications.map((notification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              {/* A bola azul só é exibida se a notificação não foi lida */}
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
