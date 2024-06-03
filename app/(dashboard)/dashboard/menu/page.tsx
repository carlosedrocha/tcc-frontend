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
import { AlertModal } from '@/components/modal/alert-modal';

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
  const [oldOrders, setOldOrders] = useState<any[]>([]); // Alterado para uma lista de pedidos
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [menuId, setMenuId] = useState('');
  const [open, setOpen] = useState(false);
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
      setOldOrders(ordersData);
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

  const isValidOrder = (order) =>
    order.dishesOrder.some((item) => item.deletedAt === null);

  // Função para calcular o total de um pedido
  const calculateTotal = (order: any) => {
    let total = 0;
    order.dishesOrder.forEach((item: any) => {
      total += item.dish.price * item.quantity;
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

  const handleRemoveItemFromOrder = (orderIndex: number, dishIndex: number) => {
    const updatedOldOrders = [...oldOrders];
    const dishQuantity =
      updatedOldOrders[orderIndex].dishesOrder[dishIndex].quantity;
    if (dishQuantity > 0) {
      updatedOldOrders[orderIndex].dishesOrder[dishIndex].quantity -= 1;
      setOldOrders(updatedOldOrders);
    }
    setShowUpdateButton(true); // Mantenha o botão de "Alterar Pedido" visível
  };

  const filteredMenus = menus.filter(
    (menu) =>
      menu.name.toLowerCase().includes(filter.toLowerCase()) ||
      menu.description.toLowerCase().includes(filter.toLowerCase())
  );

  const handlePutOldOrder = async (orderIndex) => {
    const obj = oldOrders[orderIndex].dishesOrder.map(async (order) => {
      return { id: order.dish.id, quantity: order.quantity };
    });

    const result = await Promise.all(obj);
    const formatedData = {
      tabId: tabId,
      dishes: result
    };

    const response = await api.put(
      `/order/${oldOrders[orderIndex].id}`,
      formatedData
    );
    if (response.status === 200) {
      toast({
        variant: 'primary',
        title: 'Pedido Atualizado com sucesso'
      });
      router.refresh();
      router.push(`/dashboard/tabs`);
    }
  };
  const handleDeleteMenu = async () => {
    console.log(menuId);
    try {
      const res = await api.delete(`/menu/${menuId}`);
      if (res.status === 200) {
        toast({
          variant: 'primary',
          title: 'Menu deletado com sucesso.'
        });
      }
      router.refresh();
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar o menu.'
      });
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteMenu}
        loading={false}
      />
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
                        <Button
                          variant="destructive"
                          className="ml-3"
                          onClick={() => {
                            setMenuId(menu.id);
                            setOpen(true);
                          }}
                        >
                          Excluir Menu
                        </Button>
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
          {oldOrders.map(
            (order, orderIndex) =>
              isValidOrder(order) && (
                <div key={orderIndex} className="mt-10">
                  <h2 className="text-2xl font-bold">
                    Pedido {orderIndex + 1}
                  </h2>
                  {order.dishesOrder.map(
                    (item, dishIndex) =>
                      item.quantity > 0 &&
                      item.deletedAt === null && (
                        <li
                          key={dishIndex}
                          className="mb-4 mt-4 flex items-center justify-between border-b border-gray-100 pb-2"
                        >
                          <div>
                            <h4 className="text-xl">{item.dish.name}</h4>
                            <p>Descrição: {item.dish.description}</p>
                            <p>
                              Preço:{' '}
                              {item.dish.price.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleRemoveItemFromOrder(orderIndex, dishIndex)
                            }
                          >
                            Excluir Item
                          </Button>
                        </li>
                      )
                  )}
                  {/* Renderizar botão de "Alterar Pedido" apenas se houver pedidos válidos */}
                  {isValidOrder(order) && (
                    <div className="flex justify-end">
                      <Button onClick={() => handlePutOldOrder(orderIndex)}>
                        Alterar Pedido
                      </Button>
                    </div>
                  )}
                  <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <p>
                      Total:{' '}
                      {calculateTotal(order).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      </ScrollArea>
    </>
  );
}
