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
import { SectionSelect } from '../multi-selected/section-select';
import { MenuSelect } from '../multi-selected/menu-select';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Item name must be at least 3 characters' }),
  description: z.string(),
  sectionId: z.array(z.string())
});

type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  initialData: any | null;
}

export const MenuForm: React.FC<MenuFormProps> = ({ initialData }) => {
  const [menuData, setMenuData] = useState<MenuFormValues | null>(null);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const descriptionParam = searchParams.get('description') || '';
  const name = searchParams.get('name') || '';
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState([]);

  // Definir valores iniciais dependendo do menuId
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

  // Efeito para buscar os pratos ao carregar a página
  useEffect(() => {
    fetchDishes();
  }, []);
  const title = initialData ? 'Editar Cardápio' : 'Criar Cardápio';
  const description = initialData
    ? 'Editar Cardápio'
    : 'Adicionar novo Cardápio';
  const toastMessage = initialData ? 'Atualizado' : 'Criado';
  const action = initialData ? 'Salvar' : 'Criar';
  const [sections, setSections] = useState([]);

  const fetchDishes = async () => {
    try {
      const response = await api.get('/section');
      if (response.status === 200) {
        const formattedData = response.data.map((dish: any) => ({
          id: dish.id,
          name: dish.name
        }));
        setSections(formattedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Função para buscar os dados do menu
  const fetchMenuData = async (menuId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/menu/${menuId}`); // Requisição para o endpoint de obter menu pelo ID
      if (response.status === 200) {
        setMenuData(response.data); // Armazena os dados do menu no estado
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch menu data', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os valores do formulário com os dados do menu, se disponíveis
  const defaultValues = menuData
    ? {
        name: menuData.name,
        description: menuData.description,
        dishesId: menuData.dishesId || []
      }
    : {
        name: '',
        description: '',
        dishesId: []
      };

  // Inicializa o form com os valores padrão
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  useEffect(() => {
    if (menuData) {
      // Preenche os campos com os dados retornados da API
      form.setValue('name', menuData.name); // Preenche o campo "name"
      form.setValue('description', menuData.description); // Preenche o campo "description"
      form.setValue(
        'dishesId',
        menuData.dishes.map((dish: any) => dish.id)
      ); // Preenche os pratos
    }
  }, [menuData, form]);

  // Função de envio do formulário
  const onSubmit = async (data: MenuFormValues) => {
    try {
      if (params['menuId'] === 'new') {
        const response = await api.post('/menu', {
          name: data.name,
          description: data.description,
          sections: data.sectionId.map((sectionId: string) => ({
            id: [sectionId] // Envia cada sectionId dentro de um array, como esperado pelo backend
          }))
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
          sections: data.sectionId
        });
        if (response.status === 200) {
          reloadPage();
          toast({
            variant: 'primary',
            title: 'Menu Atualizado com sucesso '
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Função de exclusão do menu
  const onDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/items-type/${params.itemId}`);
    } catch (error: any) {
      console.error(error);
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
        <Heading
          title={
            params['menuId'] === 'new' ? 'Criar Cardápio' : 'Editar Cardápio'
          }
          description={
            params['menuId'] === 'new'
              ? 'Adicionar novo Cardápio'
              : 'Editar Cardápio'
          }
        />
        {menuData && (
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
            name="sectionId"
            render={({ field }) => (
              <SectionSelect
                sections={sections}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
            )}
          />

          <Button disabled={loading} className="ml-auto" type="submit">
            {params['menuId'] === 'new' ? 'Criar' : 'Salvar'}
          </Button>
        </form>
      </Form>
    </>
  );
};
