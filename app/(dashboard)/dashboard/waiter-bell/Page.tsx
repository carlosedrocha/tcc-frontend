'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket: ReturnType<typeof io> | null = null;

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]); // Lista de mensagens

  useEffect(() => {
    // Conectar ao WebSocket Gateway do NestJS quando o componente carregar
    socket = io('http://localhost:3333');

    socket.on('connect', () => {
      setConnected(true);
      console.log('Conectado ao servidor WebSocket');
    });

    // Recebe a resposta do servidor WebSocket
    socket.on('waiterNotification', (data: string) => {
      // Adiciona a nova mensagem à lista
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Desconectar o socket quando o componente for desmontado
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // O array vazio faz o efeito rodar apenas uma vez, quando o componente monta

  return (
    <div className="p-4">
      <div>
        <h1>Mesas:</h1>

        <div className="mt-2 p-4 rounded h-64 overflow-y-auto">
          {messages.map((message, index) => (
            <p className='pt-3' key={index}>{message}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
