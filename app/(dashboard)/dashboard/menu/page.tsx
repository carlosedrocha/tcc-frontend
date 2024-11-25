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

interface ItemData {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface SectionData {
  id: string;
  name: string;
  dishes: DishData[];
  items: ItemData[]; // Novo campo
}

interface MenuData {
  id: string;
  name: string;
  description: string;
  sections: SectionData[];
}

interface OrderItem {
  dish: DishData;
  quantity: number;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabId = searchParams.get('tabId'); // Verifica se está no contexto de um pedido
  const comandNumber = searchParams.get('tabNumber');
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [filter, setFilter] = useState('');
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [orderCart, setOrderCart] = useState<OrderItem[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [deletingMenuId, setDeletingMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');
        console.log(response.data);
        setMenus(response.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar menus'
        });
      }
    };

    fetchMenu();
  }, []);

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

  const handleAddToOrder = (dish: DishData) => {
    const dishQuantity = quantity[dish.id] || 1;
    setOrderCart((prevOrderCart) => [
      ...prevOrderCart,
      { dish, quantity: dishQuantity }
    ]);
  };

  const handleFinalizeOrder = async () => {
    if (!tabId) return; // Apenas finalize pedidos com um `tabId`

    try {
      const formattedData = orderCart.map((item) => ({
        id: item.dish.id,
        quantity: item.quantity
      }));

      const response = await api.post('/order', {
        tabId,
        dishes: formattedData
      });

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

  const handleDeleteMenu = async () => {
    if (!deletingMenuId) return;

    try {
      const response = await api.delete(`/menu/${deletingMenuId}`);
      if (response.status === 200) {
        toast({
          title: 'Cardápio excluído com sucesso!'
        });
        setMenus(menus.filter((menu) => menu.id !== deletingMenuId));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir cardápio'
      });
    } finally {
      setDeletingMenuId(null); // Resetar após a exclusão
    }
  };

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
        onConfirm={handleDeleteMenu}
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

          <div className="mb-4 flex items-center space-x-4">
            <Input
              placeholder="Procure cardápio pelo nome ou descrição..."
              value={filter}
              onChange={handleFilterChange}
              className="w-full md:max-w-sm"
            />
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
                        {section.dishes.map((dish) => (
                          <li
                            key={dish.id}
                            className="mb-4 flex items-start space-x-4 pl-2"
                          >
                            {/* Foto do prato */}
                            {dish.photoUrl && (
                              <img
                                src={dish.photoUrl}
                                alt={dish.name}
                                className="h-24 w-24 rounded object-cover"
                              />
                            )}
                            {/* Informações do prato */}
                            <div>
                              <h3 className="text-lg ">{dish.name}</h3>
                              <p className="0 text-sm">{dish.description}</p>
                              <p className="f text-base">
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
                                  <Button
                                    onClick={() => handleAddToOrder(dish)}
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
                  {!tabId && (
                    <Button
                      variant="destructive"
                      onClick={() => setDeletingMenuId(menu.id)} // Passando o id do menu atual
                    >
                      Excluir Cardápio
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {tabId && (
            <div className="flex justify-end space-x-2">
              <Button variant="destructive" onClick={() => setOpen(true)}>
                Cancelar Pedido
              </Button>
              <Button onClick={handleFinalizeOrder}>Finalizar Pedido</Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
