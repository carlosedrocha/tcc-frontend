'use client';
import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
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
import { MenuForm } from '@/components/forms/menu-form';
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

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [filter, setFilter] = useState('');
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

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
          <Link
            href={'/dashboard/menu/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar novo cardápio
          </Link>
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
                <AccordionTrigger onClick={() => toggleAccordion(menu.id)}>
                  {menu.name}
                </AccordionTrigger>
                <AccordionContent>
                  {menu.dishes.map((dish) => (
                    <Card key={dish.id} className="mb-4 w-full">
                      {dish.photoUrl && (
                        <img src={dish.photoUrl} alt={dish.name} />
                      )}
                      <CardHeader>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardDescription>
                          Descrição: {dish.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Preço:{' '}
                          {dish.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </ScrollArea>
  );
}
