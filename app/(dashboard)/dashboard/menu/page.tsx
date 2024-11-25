'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DishData {
  id: string;
  name: string;
  description: string;
  price: number;
  photoUrl: string | null;
}

interface ItemData {
  id: string;
  name: string;
  description: string;
  cost: number;
}

interface SectionData {
  id: string;
  name: string;
  dishes: DishData[];
  items: ItemData[];
}

interface MenuData {
  id: string;
  name: string;
  description: string;
  sections: SectionData[];
}
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'dish' | 'item'; // Indica se é um prato ou um item
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabId = searchParams.get('tabId');
  const comandNumber = searchParams.get('tabNumber');
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [filter, setFilter] = useState('');
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [orderCart, setOrderCart] = useState<OrderItem[]>([]);
  const [deletingMenuId, setDeletingMenuId] = useState<string | null>(null);
  const [previousOrders, setPreviousOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');
        setMenus(response.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar menus'
        });
      }
    };

    const fetchOrder = async () => {
      try {
        const response = await api.get(`/order/${tabId}`);
        console.log(response.data); // Mostra a resposta da API para debug

        const transformedOrders = response.data.map((order) => {
          const dishes = order.dishesOrder.map((dishOrder) => ({
            name: dishOrder.dish.name,
            photoUrl: dishOrder.dish.photoUrl,
            price: dishOrder.dish.price,
            quantity: dishOrder.quantity
          }));

          const items = order.itemsOrder.map((itemOrder) => ({
            name: itemOrder.item.name,
            description: itemOrder.item.description,
            cost: itemOrder.item.cost,
            quantity: itemOrder.quantity
          }));

          return {
            id: order.id,
            tabId: order.tabId,
            dishes,
            items
          };
        });

        setPreviousOrders(transformedOrders); // Atualiza o estado
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar pedidos'
        });
      }
    };

    fetchMenu();
    fetchOrder();
  }, [tabId]);

  // Adicione um useEffect para monitorar o estado previousOrders
  useEffect(() => {
    console.log(previousOrders); // Aqui você pode ver se previousOrders foi atualizado corretamente
  }, [previousOrders]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleQuantityChange = (itemId: string, value: number) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [itemId]: value
    }));
  };
  const handleAddToOrder = (item: DishData | ItemData) => {
    const itemPrice = (item as DishData).price || (item as ItemData).cost;
    const itemQuantity = quantity[item.id] || 1;
    const itemType = (item as DishData).price ? 'dish' : 'item'; // Determina o tipo do item

    setOrderCart((prevOrderCart) => {
      const existingItem = prevOrderCart.find(
        (orderItem) => orderItem.id === item.id
      );
      if (existingItem) {
        return prevOrderCart.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + itemQuantity }
            : orderItem
        );
      }

      return [
        ...prevOrderCart,
        {
          id: item.id,
          name: item.name,
          price: itemPrice,
          quantity: itemQuantity,
          type: itemType // Adiciona o tipo
        }
      ];
    });
  };

  const handleFinalizeOrder = async () => {
    if (!tabId) return; // Apenas finalize pedidos com um `tabId`

    try {
      const formattedData = {
        tabId,
        dishes: orderCart
          .filter((item) => item.type === 'dish') // Filtrar pratos
          .map((item) => ({
            id: item.id,
            quantity: item.quantity
          })),
        items: orderCart
          .filter((item) => item.type === 'item') // Filtrar itens
          .map((item) => ({
            id: item.id,
            quantity: item.quantity
          }))
      };

      const response = await api.post('/order', formattedData);

      if (response.status === 201) {
        toast({
          title: 'Pedido finalizado com sucesso!'
        });
        router.push(`/dashboard/tabs`);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao finalizar pedido'
      });
    }
  };

  const totalPrice = orderCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const filteredMenus = menus.filter(
    (menu) =>
      menu.name.toLowerCase().includes(filter.toLowerCase()) ||
      menu.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <AlertModal
        isOpen={!!deletingMenuId}
        onClose={() => setDeletingMenuId(null)}
        onConfirm={() => {}}
        loading={false}
      />
      <ScrollArea className="h-full">
        <div className="flex h-full flex-1 flex-col space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-start justify-between">
            <Heading
              title={
                tabId
                  ? `Editar Pedido da comanda ${comandNumber}`
                  : 'Adicionar Novo Cardápio'
              }
              description={
                tabId
                  ? `Gerenciar pedidos da comanda ${comandNumber}`
                  : 'Adicione novos cardápios e gerencie os já existentes'
              }
            />
            {!tabId && (
              <>
                <Link
                  href={'/dashboard/menu/new'}
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar novo cardápio
                </Link>
              </>
            )}
          </div>
          <Accordion type="multiple">
            {filteredMenus.map((menu) => (
              <AccordionItem key={menu.id} value={menu.id}>
                <AccordionTrigger>
                  <h1 className="text-2xl font-bold">{menu.name}</h1>
                </AccordionTrigger>
                <AccordionContent>
                  {menu.sections.map((section) => (
                    <div key={section.id}>
                      <h3 className="mb-3 text-xl">{section.name}</h3>
                      <ul>
                        {[...section.dishes, ...section.items].map((item) => (
                          <li
                            key={item.id}
                            className="mb-4 flex items-start space-x-4 pl-2"
                          >
                            {item.photoUrl && (
                              <img
                                src={item.photoUrl}
                                alt={item.name}
                                className="h-24 w-24 rounded object-cover"
                              />
                            )}
                            <div>
                              <h3 className="text-lg">{item.name}</h3>
                              <p className="text-sm">{item.description}</p>
                              <p className="text-base">
                                {(item.price || item.cost).toLocaleString(
                                  'pt-BR',
                                  {
                                    style: 'currency',
                                    currency: 'BRL'
                                  }
                                )}
                              </p>
                              {tabId && (
                                <div className="mt-2 flex items-center">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={quantity[item.id] || 1}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        item.id,
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="mr-2 w-20"
                                  />
                                  <Button
                                    onClick={() => handleAddToOrder(item)}
                                  >
                                    Adicionar ao Pedido
                                  </Button>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {tabId && orderCart.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h2 className="mb-4 text-lg font-bold">Itens no Pedido:</h2>
              <ul>
                {orderCart.map((item) => (
                  <li
                    key={item.id}
                    className="mb-2 flex justify-between border-b pb-2"
                  >
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>
                      {(item.price * item.quantity).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {totalPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="destructive">Cancelar Pedido</Button>
                <Button onClick={handleFinalizeOrder}>Finalizar Pedido</Button>
              </div>
            </div>
          )}
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>

          {previousOrders.length > 0 ? (
            <div className="mt-10 border-t pt-4">
              <h2 className="mb-4 text-lg font-bold">Pedidos Anteriores:</h2>
              <div>
                {previousOrders.map((order) => {
                  // Calcular o total de cada pedido
                  const orderTotal = [
                    ...order.dishes.map((dish) => dish.price * dish.quantity),
                    ...order.items.map((item) => item.cost * item.quantity)
                  ].reduce((acc, cur) => acc + cur, 0);

                  return (
                    <div key={order.id} className="mb-4 border-b pb-4">
                      {/* Renderizar apenas se houver pratos */}
                      {order.dishes.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-lg font-semibold">Pratos:</h4>
                          <ul>
                            {order.dishes.map((dish, index) => (
                              <li
                                key={index}
                                className="mb-2 flex justify-between"
                              >
                                <span>
                                  {dish.name} (x{dish.quantity})
                                </span>
                                <span>
                                  {(dish.price * dish.quantity).toLocaleString(
                                    'pt-BR',
                                    {
                                      style: 'currency',
                                      currency: 'BRL'
                                    }
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Renderizar apenas se houver itens */}
                      {order.items.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-lg font-semibold">Itens:</h4>
                          <ul>
                            {order.items.map((item, index) => (
                              <li
                                key={index}
                                className="mb-2 flex justify-between"
                              >
                                <span>
                                  {item.name} (x{item.quantity})
                                </span>
                                <span>
                                  {(item.cost * item.quantity).toLocaleString(
                                    'pt-BR',
                                    {
                                      style: 'currency',
                                      currency: 'BRL'
                                    }
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4 flex justify-between font-bold">
                        <span>Total do Pedido:</span>
                        <span>
                          {orderTotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Calcular o total geral */}
                <div className="mt-6 flex justify-between font-bold">
                  <span>Total Geral:</span>
                  <span>
                    {previousOrders
                      .map((order) => {
                        return [
                          ...order.dishes.map(
                            (dish) => dish.price * dish.quantity
                          ),
                          ...order.items.map(
                            (item) => item.cost * item.quantity
                          )
                        ];
                      })
                      .flat()
                      .reduce((acc, cur) => acc + cur, 0)
                      .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center"></div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
