// 'use client';
// import { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// let socket: ReturnType<typeof io> | null = null;

// export default function Page() {
//   const [connected, setConnected] = useState(false);
//   const [messages, setMessages] = useState<string[]>([]); // Lista de mensagens

//   useEffect(() => {
//     // Conectar ao WebSocket Gateway do NestJS quando o componente carregar
//     socket = io('http://localhost:3333');

//     socket.on('connect', () => {
//       setConnected(true);
//       console.log('Conectado ao servidor WebSocket');
//     });

//     // Recebe a resposta do servidor WebSocket
//     socket.on('waiterNotification', (data: string) => {
//       // Adiciona a nova mensagem à lista
//       setMessages((prevMessages) => [...prevMessages, data]);
//     });

//     // Desconectar o socket quando o componente for desmontado
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []); // O array vazio faz o efeito rodar apenas uma vez, quando o componente monta

//   return (
//     <div className="p-4">
//       <div>
//         <h1>Mesas:</h1>

//         <div className="mt-2 p-4 rounded h-64 overflow-y-auto">
//           {messages.map((message, index) => (
//             <p className='pt-3' key={index}>{message}</p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


///// falta finalizar em cima, estou colocando o código em baixo com dados mock
'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Importe os componentes de UI da Shadcn que você está usando
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

let socket: ReturnType<typeof io> | null = null;

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [tables, setTables] = useState<any[]>([]); // Lista de mesas
  const [expandedItems, setExpandedItems] = useState<string[]>([]); // Estado para itens expandidos

  useEffect(() => {
    // Conectar ao WebSocket Gateway do NestJS quando o componente carregar
    socket = io('http://localhost:3333');

    socket.on('connect', () => {
      setConnected(true);
      console.log('Conectado ao servidor WebSocket');
    });

    // Simulando as mesas abertas (substitua isso pela lógica real para obter as mesas)
    setTables([
      {
        id: '1',
        tabNumber: 1,
        customer: 'Carlos',
        status: 'Aberto',
        orders: ['Pedido 1', 'Pedido 2'], // Adicione pedidos simulados
      },
      {
        id: '2',
        tabNumber: 2,
        customer: 'Maria',
        status: 'Aberto',
        orders: ['Pedido 3', 'Pedido 4'], // Adicione pedidos simulados
      },
      {
        id: '3',
        tabNumber: 3,
        customer: 'João',
        status: 'Aberto',
        orders: [], // Mesa sem pedidos
      },
    ]);

    // Desconectar o socket quando o componente for desmontado
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // O array vazio faz o efeito rodar apenas uma vez, quando o componente monta

  const toggleAccordion = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4">
      <h1>Mesas Abertas:</h1>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className="shadow-md h-auto transition-height duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Comanda Mesa {table.tabNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Cliente: {table.customer}</CardDescription>
              <CardDescription>Status: {table.status}</CardDescription>

              {/* Accordion para mostrar os pedidos realizados */}
              <Accordion type="single" collapsible>
                <AccordionItem value={table.id}>
                  <AccordionTrigger onClick={() => toggleAccordion(table.id)}>
                    <span>Ver Pedidos</span>
                  </AccordionTrigger>
                  {expandedItems.includes(table.id) && (
                    <AccordionContent>
                      {table.orders.length > 0 ? (
                        <ul>
                          {table.orders.map((order, index) => (
                            <li key={index}>{order}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>Nenhum pedido realizado</p>
                      )}
                    </AccordionContent>
                  )}
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
