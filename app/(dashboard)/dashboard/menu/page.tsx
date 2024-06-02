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

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabId = searchParams.get('tabId');
  const nameClient = searchParams.get('name');
  const [showModal, setShowModal] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [filter, setFilter] = useState('');
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [orderCart, setOrderCart] = useState<OrderItem[]>([]);
  const [quantity, setQuantity] = useState<Record<string, number>>({});

  const fetchMenu = async () => {
    const response = await api.get('/menu');
    setMenus(response.data); // Assuming response.data contains the menus with dishes
  };

  // Carregar dados salvos ao iniciar
  useEffect(() => {
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
  const handleRemoveFromOrder = (index: number) => {
    setOrderCart((prevOrderCart) =>
      prevOrderCart.filter((_, i) => i !== index)
    );
  };

  const handleAddToOrder = (dish: DishData) => {
    const dishQuantity = quantity[dish.id] || 1;
    setOrderCart((prevOrderCart) => [
      ...prevOrderCart,
      { dish, quantity: dishQuantity }
    ]);
  };

  const filteredMenus = menus.filter(
    (menu) =>
      menu.name.toLowerCase().includes(filter.toLowerCase()) ||
      menu.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <ScrollArea className="h-full">
      <div className="flex h-full flex-1 flex-col space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-start justify-between">
          <Heading
            title="Adicionar Novo Cardápio"
            description="Adicione novos cardápios e gerencie os já existentes"
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {tabId && orderCart.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <h2 className="text-2xl font-bold">Carrinho de Pedidos</h2>
            <ul className="mt-6">
              {orderCart.map((item, index) => (
                <li
                  key={index}
                  className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2"
                >
                  <div>
                    <h3 className="text-xl">{item.dish.name}</h3>
                    <p>
                      Preço:{' '}
                      {item.dish.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-8">Quantidade: {item.quantity}</span>
                    <span className="mr-8">
                      Total:{' '}
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
                      onClick={() => handleRemoveFromOrder(index)}
                    >
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
