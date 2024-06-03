'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Plus } from 'lucide-react';
import api from '@/app/api';
import { toast } from '@/components/ui/use-toast';

interface DishData {
  id: string;
  name: string;
  description: string;
  price: number;
  photoUrl: string | null;
}

interface MenuData {
  id: string;
  name: string;
  description: string;
  dishes: DishData[];
}
interface OrderItem {
  dish: DishData;
  quantity: number;
}
interface OldOrder {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabId = searchParams.get('tabId');
  const comandNumber = searchParams.get('tabNumber');
  const [showModal, setShowModal] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [filter, setFilter] = useState('');
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [orderCart, setOrderCart] = useState<OrderItem[]>([]);
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [oldOrder, setOldOrder] = useState<OldOrder[]>([]);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [orderId, setOrderId] = useState('');
  const fetchMenu = async () => {
    try {
      const response = await api.get('/menu');
      setMenus(response.data); // Assuming response.data contains the menus with dishes
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar menus'
      });
    }
  };
  const fetchTabById = async () => {
    try {
      const response = await api.get(`/tab/${tabId}`);
      const ordersData = response.data.orders;
      console.log(ordersData);
      ordersData[0] === undefined
        ? setOrderId('')
        : setOrderId(ordersData[0].id);
      // Obtém os dados dos pratos e junta em uma única array
      const dishsData = ordersData.flatMap((order: any) =>
        order.dishesOrder.map((dishOrder: any) => ({
          id: dishOrder.dish.id,
          name: dishOrder.dish.name,
          price: dishOrder.dish.price,
          quantity: dishOrder.quantity
        }))
      );

      // Consolida os itens com IDs iguais e soma as quantidades
      const consolidatedDishes = dishsData.reduce((acc: any, dish: any) => {
        if (acc[dish.id]) {
          acc[dish.id].quantity += dish.quantity;
        } else {
          acc[dish.id] = { ...dish };
        }
        return acc;
      }, {});

      // Converte o objeto de volta para uma array
      const consolidatedDishesArray = Object.values(consolidatedDishes);

      if (consolidatedDishesArray.length > 0) {
        setOldOrder(consolidatedDishesArray); // Define oldOrder com os dados consolidados dos pratos
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar comanda'
      });
    }
  };

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    if (tabId) {
      fetchTabById();
    }
    fetchMenu();
  }, []);

  const handleMenuNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMenuName(event.target.value);
  };

  const handleMenuDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMenuDescription(event.target.value);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordions((openAccordions) =>
      openAccordions.includes(id)
        ? openAccordions.filter((accordionId) => accordionId !== id)
        : [...openAccordions, id]
    );
  };
  const handleQuantityChange = (dishId: string, value: number) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [dishId]: value
    }));
  };
  const calculateTotalNew = () => {
    let total = 0;

    orderCart.forEach((item) => {
      total += item.dish.price * item.quantity;
    });
    return total;
  };
  const calculateTotal = () => {
    let total = 0;

    oldOrder.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const handleAddToOrder = (dish: DishData) => {
    const dishQuantity = quantity[dish.id] || 1;
    setOrderCart((prevOrderCart) => [
      ...prevOrderCart,
      { dish, quantity: dishQuantity }
    ]);
  };

  const handleTeste = async () => {
    try {
      console.log(orderId);
      if (!orderId) {
        const promises = orderCart.map(async (item) => {
          return { id: item.dish.id, quantity: item.quantity };
        });

        const result = await Promise.all(promises);
        const formatedData = {
          tabId: tabId,
          dishes: result
        };
        const response = await api.post('/order', formatedData);
        if (response.status === 201) {
          router.refresh();
          router.push(`/dashboard/tabs`);
        }
      } else {
        const combinedOrders = [...oldOrder];

        orderCart.forEach((newOrderItem) => {
          const existingOrderItem = combinedOrders.find(
            (item) => item.id === newOrderItem.dish.id
          );

          if (existingOrderItem) {
            // Se o prato já existe no pedido antigo, soma as quantidades
            existingOrderItem.quantity += newOrderItem.quantity;
          } else {
            // Se o prato não existe no pedido antigo, adiciona ao combinado
            combinedOrders.push({
              id: newOrderItem.dish.id,
              name: newOrderItem.dish.name,
              price: newOrderItem.dish.price,
              quantity: newOrderItem.quantity
            });
          }
        });
        console.log(combinedOrders);

        // Formate os dados para enviar para o backend
        const formattedData = {
          tabId: tabId,
          dishes: combinedOrders.map((item) => ({
            id: item.id,
            quantity: item.quantity
          }))
        };

        const response = await api.put(`/order/${orderId}`, formattedData);
        if (response.status === 200) {
          router.refresh();
          router.push(`/dashboard/tabs`);
        }
      }

      // Aqui você pode enviar o resultado para o backend
    } catch (error) {
      console.error(error);
    }
  };
  const handleRemoveFromNewOrder = (index: number) => {
    setOrderCart((prevOrderCart) =>
      prevOrderCart.filter((_, i) => i !== index)
    );
  };
  const handleRemoveFromOrder = (index: number) => {
    // Cria uma cópia do carrinho de pedidos
    const updateOldOrderCart = [...oldOrder];

    // Reduz a quantidade do item no índice especificado em 1
    updateOldOrderCart[index].quantity -= 1;

    // Se a quantidade for 0, remove completamente o item do carrinho de pedidos
    if (updateOldOrderCart[index].quantity === 0) {
      updateOldOrderCart.splice(index, 1);
    }

    // Atualiza o estado com o novo carrinho de pedidos
    setOldOrder(updateOldOrderCart);
    setShowUpdateButton(true);
    calculateTotal();
  };
  const filteredMenus = menus.filter(
    (menu) =>
      menu.name.toLowerCase().includes(filter.toLowerCase()) ||
      menu.description.toLowerCase().includes(filter.toLowerCase())
  );
  const handlePutOldOrder = async () => {
    const obj = oldOrder.map(async (item) => {
      return { id: item.id, quantity: item.quantity };
    });
    const result = await Promise.all(obj);
    const formatedData = {
      tabId: tabId,
      dishes: result
    };
    const response = await api.put(`/order/${orderId}`, formatedData);
    if (response.status === 200) {
      router.refresh();
      router.push(`/dashboard/tabs`);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex h-full flex-1 flex-col space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-start justify-between">
          <Heading
            title={
              !tabId
                ? 'Adicionar Novo Cardápio'
                : `Editar Pedido da comanda ${comandNumber}`
            }
            description={
              !tabId
                ? 'Adicione novos cardápios e gerencie os já existentes'
                : `Gerenciar pedidos da comanda ${comandNumber}`
            }
          />
          {!tabId && (
            <Link
              href={'/dashboard/menu/new'}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar novo cardápio
            </Link>
          )}
        </div>
        <div className="mb-4 flex items-center space-x-4">
          <Input
            placeholder="Procure cardápio pelo nome ou descrição..."
            value={filter}
            onChange={handleFilterChange}
            className="w-full md:max-w-sm"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Accordion type="multiple">
            {filteredMenus.map((menu) => (
              <AccordionItem key={menu.id} value={menu.id}>
                <AccordionTrigger
                  onClick={() => toggleAccordion(menu.id)}
                  className="text-xl"
                >
                  {menu.name}
                </AccordionTrigger>
                <AccordionContent>
                  <ul>
                    {menu.dishes.map((dish) => (
                      <li key={dish.id} className="mb-4">
                        {dish.photoUrl && (
                          <img
                            src={dish.photoUrl}
                            alt={dish.name}
                            style={{ width: '200px', borderRadius: '15px' }}
                            className="mb-5 mt-5 rounded"
                          />
                        )}
                        <div>
                          <h3 className="text-base">{dish.name}</h3>
                          <p>Descrição: {dish.description}</p>
                          <p>
                            Preço:{' '}
                            {dish.price.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })}
                          </p>
                          {tabId && (
                            <div className="mt-2 flex items-center">
                              <Input
                                type="number"
                                min="1"
                                value={quantity[dish.id] || 1}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    dish.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                className="mr-2 w-20"
                              />
                              <Button onClick={() => handleAddToOrder(dish)}>
                                Adicionar ao Pedido
                              </Button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {!tabId && (
                    <div className="flex justify-end pr-4">
                      <Link
                        href={`/dashboard/menu/${menu.id}`}
                        className={cn(buttonVariants({ variant: 'default' }))}
                        style={{ marginBottom: '15px;' }}
                      >
                        Editar Menu
                      </Link>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {tabId && orderCart.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <h2 className="text-2xl font-bold">Pedido Novo</h2>
            <ul className="mt-6">
              {orderCart.map((item, index) => (
                <li
                  key={index}
                  className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2"
                >
                  <div>
                    <h4 className="text-xl">{item.dish.name}</h4>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-8">Quantidade: {item.quantity}</span>
                    <span className="mr-8">
                      Preço:{' '}
                      {(item.dish.price * item.quantity).toLocaleString(
                        'pt-BR',
                        {
                          style: 'currency',
                          currency: 'BRL'
                        }
                      )}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFromNewOrder(index)}
                    >
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <p>
                Total:{' '}
                {calculateTotalNew().toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
              <Button className="mt-4" onClick={handleTeste}>
                Registrar pedido
              </Button>
            </div>
          </div>
        )}
        {tabId && oldOrder.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <h2 className="text-2xl font-bold">Pedido</h2>
            <ul className="mt-6">
              {oldOrder.map(
                (item, index) => (
                  console.log(item),
                  (
                    <li
                      key={item.id} // Use o id como chave única
                      className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2"
                    >
                      <div>
                        <h4 className="text-xl">{item.name}</h4>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-8">
                          Quantidade: {item.quantity}
                        </span>
                        <span className="mr-8">
                          Preço:{' '}
                          {item.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFromOrder(index)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </li>
                  )
                )
              )}
            </ul>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              {/* Calcula o total somando o total de cada prato */}
              <p>
                Total:{' '}
                {calculateTotal().toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
              {showUpdateButton && (
                <Button className="mt-4" onClick={handlePutOldOrder}>
                  Alterar Pedido
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
