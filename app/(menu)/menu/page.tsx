'use client';
import api from '@/app/api';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@radix-ui/react-accordion';
import { ScrollArea } from '@radix-ui/react-scroll-area';
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

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [filter, setFilter] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  const filteredSections = menu
    ? menu.sections.filter(
        (section) =>
          section.name.toLowerCase().includes(filter.toLowerCase()) ||
          section.dishes.some((dish) =>
            dish.name.toLowerCase().includes(filter.toLowerCase())
          )
      )
    : [];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu/current/active');
        console.log('Cardápio: ', response);
        setMenu(response.data);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar o menu'
        });
      }
    };
    fetchMenu();

    const userId = sessionStorage.getItem('userId');
    setIsLogged(!!userId); // Define isLogged como true se userId existir
  }, []);

  return (
    <>
      <div className="h-full">
        <Header />
        <ScrollArea className="mt-16 h-full">
          <div className="flex h-full flex-1 flex-col space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold">Cardápio</h1>
              <p className="text-sm text-gray-500">Visualize o cardápio!</p>
            </div>
            {isLogged && (
              <div className="mt-4 flex justify-end">
                <Button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                  Campainha
                </Button>
              </div>
            )}

            {menu && (
              <>
                <h2 className="mb-4 text-xl font-semibold">{menu.name}</h2>
                <p className="mb-6 text-gray-600">{menu.description}</p>
                <Accordion
                  type="multiple"
                  defaultValue={filteredSections.map((section) => section.id)} // Todos os itens abertos
                >
                  {filteredSections.map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger>
                        <h3 className="text-xl font-bold">{section.name}</h3>
                      </AccordionTrigger>
                      <AccordionContent>
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
                                  {(item.price || item.cost)?.toLocaleString(
                                    'pt-BR',
                                    {
                                      style: 'currency',
                                      currency: 'BRL'
                                    }
                                  )}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
