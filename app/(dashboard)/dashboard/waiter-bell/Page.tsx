'use client';
import { useState } from 'react';
import io from 'socket.io-client';

let socket: ReturnType<typeof io> | null = null;

export default function SocketComponent() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Conectar ao WebSocket Gateway do NestJS
  const handleConnect = () => {
    if (!socket) {
      socket = io('http://localhost:3333');

      socket.on('connect', () => {
        setConnected(true);
        console.log('Conectado ao servidor WebSocket');
      });

      // Recebe a resposta do servidor WebSocket
      socket.on('waiterNotification', (data: Object) => {
        console.log(data)
      });
    }
  };

  // Envia a mensagem para o servidor WebSocket
  const sendMessageToGPT = () => {
    if (socket && inputMessage.trim()) {
      socket.emit('callWaiter', inputMessage);
      setMessages((prevMessages) => [...prevMessages, 'Você: ' + inputMessage]);
      setInputMessage('');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleConnect}
        disabled={connected}
        className="rounded bg-blue-500 p-2 text-white"
      >
        {connected ? 'Conectado' : 'Conectar ao Socket'}
      </button>
      <div className="mt-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Digite sua mensagem"
          className="mr-2 border p-2"
        />
        <button
          onClick={sendMessageToGPT}
          disabled={!connected}
          className="rounded bg-green-500 p-2 text-white"
        >
          Enviar Mensagem
        </button>
      </div>
      <div className="mt-4">
        <h3>Mensagens:</h3>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
