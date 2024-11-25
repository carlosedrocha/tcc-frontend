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
import { MenuSelect } from '../multi-selected/menu-select';
import { ItemsSelect } from '../multi-selected/items-select';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome da seção deve ter pelo menos 3 caracteres' }),
  description: z.string(),
  dishesId: z.array(z.string()).optional(),
  menusId: z.array(z.string()).optional(),
  itemsId: z.array(z.string()).optional()
});

type SectionFormValues = z.infer<typeof formSchema>;

interface SectionFormProps {
  initialData: any | null;
}

export const SectionForm: React.FC<SectionFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const descriptionParam = searchParams.get('description') || '';
  const name = searchParams.get('name') || '';
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  if (params['sectionId'] !== 'new') {
    initialData = {
      id: params['sectionId'],
      name: name || '',
      description: descriptionParam || '',
      dishesId: initialData?.dishesId || [],
      menusId: initialData?.menusId || [],
      itemId: initialData?.itemsId || []
    };
  } else {
    initialData = null;
  }
  useEffect(() => {
    fetchDishes();
    fetchMenus();
    fetchItems();
    if (params['sectionId'] !== 'new') {
      getSectionById();
    }
  }, []);
  const title = initialData ? 'Editar Seção' : 'Criar Seção';
  const description = initialData ? 'Editar Seção' : 'Adicionar nova Seção';
  const toastMessage = initialData ? 'Atualizado' : 'Criado';
  const action = initialData ? 'Salvar' : 'Criar';
  const [sectionName, setSectionName] = useState('');
  const [dishes, setDishes] = useState([]);
  const [menus, setMenus] = useState([]);
  const [items, setItems] = useState([]);
  const fetchItems = async () => {
    try {
      const response = await api.get('/item');
      if (response.status === 200) {
        const formattedData = response.data.map((menu: any) => ({
          id: menu.id,
          name: menu.name
        }));
        setItems(formattedData);
      }
    } catch (error) {}
  };

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menu');
      if (response.status === 200) {
        const formattedData = response.data.map((menu: any) => ({
          id: menu.id,
          name: menu.name
        }));
        setMenus(formattedData);
      }
    } catch (error) {}
  };
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
  const defaultValues = initialData || {
    name: '',
    description: '',
    dishesId: [],
    menusId: [],
    itemsId: []
  };

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: SectionFormValues) => {
    try {
      if (params['sectionId'] === 'new') {
        const response = await api.post('/section', {
          name: data.name,
          description: data.description,
          dishIds: data.dishesId,
          menuIds: data.menusId,
          itemIds: data.itemsId
        });
        if (response.status === 201) {
          reloadPage();
          toast({
            variant: 'primary',
            title: 'Seção Criada com sucesso '
          });
        }
      } else {
        const response = await api.put(`/section/${params['sectionId']}`, {
          name: data.name,
          description: data.description,
          dishIds: data.dishesId,
          itemIds: data.itemsId
        });
        if (response.status === 200) {
          reloadPage();
          toast({
            variant: 'primary',
            title: 'Seção Atualizada com sucesso '
          });
        }
      }
    } catch (error) {}
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/section/${params.sectionId}`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  const reloadPage = () => {
    router.refresh();
    router.push(`/dashboard/section`);
  };
  const getSectionById = async () => {
    try {
      const id = params['sectionId'];
      const response = await api.get(`/section/${id}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
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
                <FormLabel>Nome da Seção</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Nome da Seção"
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
                <FormLabel>Descrição da Seção</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Descrição da Seção"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
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
            <FormField
              control={form.control}
              name="menusId"
              render={({ field }) => (
                <MenuSelect
                  menus={menus}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
            <FormField
              control={form.control}
              name="itemsId"
              render={({ field }) => (
                <ItemsSelect
                  items={items}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
