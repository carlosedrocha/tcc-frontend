'use client';
import api from '@/app/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AlertModal } from '../modal/alert-modal';
import { useToast } from '../ui/use-toast';
import { DishesSelect } from '../multi-selected/dishes-select';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Item name must be at least 3 characters' }),
  description: z.string(),
  dishesId: z.array(z.string())
});

type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  initialData: any | null;
}

export const MenuForm: React.FC<MenuFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const descriptionParam = searchParams.get('description') || '';
  const name = searchParams.get('name') || '';
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  if (params['menuId'] !== 'new') {
    initialData = {
      id: params['menuId'],
      name: name || '',
      description: descriptionParam || '',
      dishesId: initialData?.dishesId || []
    };
  } else {
    initialData = null;
  }
  useEffect(() => {
    fetchDishes();
  }, []);
  const title = initialData ? 'Editar Cardápio' : 'Criar Cardápio';
  const description = initialData
    ? 'Editar Cardápio'
    : 'Adicionar novo Cardápio';
  const toastMessage = initialData ? 'Atualizado' : 'Criado';
  const action = initialData ? 'Salvar' : 'Criar';
  const [dishes, setDishes] = useState([]);
  const fetchDishes = async () => {
    try {
      const response = await api.get('/dish');
      if (response.status === 200) {
        const formattedData = response.data.map((dish: any) => ({
          id: dish.id,
          name: dish.name
        }));
        setDishes(formattedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        description: '',
        dishesId: []
      };
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: MenuFormValues) => {
    try {
      if (params['menuId'] === 'new') {
        const response = await api.post('/menu', {
          name: data.name,
          description: data.description,
          dishIds: data.dishesId
        });
        if (response.status === 201) {
          reloadPage();
          toast({
            variant: 'primary',
            title: 'Menu Criado com sucesso '
          });
        }
      } else {
        const response = await api.put(`/menu/${params['menuId']}`, {
          name: data.name,
          description: data.description,
          dishIds: data.dishesId
        });
        if (response.status === 200) {
          reloadPage();
          toast({
            variant: 'primary',
            title: 'Menu Atualizado com sucesso '
          });
        }
      }
    } catch (error) {}
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/items-type/${params.itemId}`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  const reloadPage = () => {
    router.refresh();
    router.push(`/dashboard/menu`);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cardápio</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Nome do Cardápio"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do Cardápio</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Descrição do Cardápio"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dishesId"
            render={({ field }) => (
              <DishesSelect
                dishes={dishes}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
