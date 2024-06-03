'use client';
import { Button } from '@/components/ui/button';
import { numericPattern } from '@/constants/data';
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
import api from '@/app/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// import FileUpload from "@/components/FileUpload";
import FileUpload from '../file-upload';
import { useToast } from '../ui/use-toast';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome do item precisa ter no mínimo 3 caracteres' }),
  description: z.string().min(0, { message: '' }),
  measurementUnit: z
    .string()
    .min(1, { message: 'Unidade de medida é obrigatória' }),
  measurementUnitValue: z
    .string()
    .min(1, { message: 'Unidade de medida é obrigatória' })
    .refine((value) => numericPattern.test(value), {
      message:
        'Por favor, insira apenas números ou números com ponto ou vírgula.'
    }),
  price: z
    .string()
    .min(1, { message: 'Custo é obrigatório' })
    .refine((value) => numericPattern.test(value), {
      message:
        'Por favor, insira apenas números ou números com ponto ou vírgula.'
    }),
  typeId: z.string().min(1, { message: 'Por favor selecione uma categoria' })
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ItemForm {
  initialData: any | null;
}

export const ItemForm: React.FC<ItemForm> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const urlId = params['itemId'];
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = urlId != 'new' ? 'Editar Item' : 'Cadastrar Item';
  const description = urlId != 'new' ? 'Editar o Item' : 'Adicionar novo item';
  const toastMessage =
    urlId != 'new'
      ? 'Item atualizado com sucesso'
      : 'Item cadastrado com sucesso';
  const action = urlId != 'new' ? 'Salvar alterações' : 'Cadastrar';
  const [itemsType, setitemsType] = useState([]);

  const defaultValues =
    // = urlId!="new" ? {} :
    {
      name: '',
      description: '',
      measurementUnit: '',
      measurementUnitValue: '',
      price: '',
      typeId: '',
      itemType: []
    };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  useEffect(() => {
    const fetchItemType = async () => {
      try {
        const response = await api.get('item-type');
        setitemsType(response.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível buscar tipos de item.',
          description:
            'Tivemos problemas ao buscar os tipos de item, tente novamente mais tarde.'
        });
      }
    };
    fetchItemType();
  }, []);

  function reloadPage() {
    router.refresh();
    router.push(`/dashboard/item`);
  }
  const onSubmit = async (data: ProductFormValues) => {
    try {
      const fomatedData = {
        name: data.name,
        description: data.description,
        measurementUnit: data.measurementUnit,
        measurementUnitValue: parseFloat(
          data.measurementUnitValue.replace(',', '.')
        ),
        cost: parseFloat(data.price.replace(',', '.')),
        typeId: data.typeId
      };
      setLoading(true);
      try {
        if (urlId != 'new') {
          const response = await api.put(`/item/${urlId}`, fomatedData);
          if (response.status === 200) {
            toast({
              variant: 'primary',
              title: 'Alteração relizada com sucesso',
              description: 'Item foi atualizado com sucesso.'
            });

            reloadPage();
          }
        } else {
          const response = await api.post(`/item`, fomatedData);
          if (response.status === 201) {
            toast({
              variant: 'primary',
              title: 'Cadastro relizado com sucesso',
              description: 'Item foi cadastrado com sucesso.'
            });

            reloadPage();
          }
        }
      } catch (error) {
        console.log(error);
        toast({
          variant: 'destructive',
          title: 'Erro ao salvar o item',
          description: 'Tente novamente mais tarde.'
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      reloadPage();
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
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
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Exemplo: Pão"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipos de item</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecione uma categoria"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {itemsType.map((itemType) => (
                        <SelectItem key={itemType.id} value={itemType.id}>
                          {itemType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={loading}
                      placeholder="R$: 35,00"
                      value={field.value ?? ''} // Usando o operador de coalescência nula para garantir que o valor seja definido
                      onChange={field.onChange} // Passando a função onChange diretamente
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="measurementUnitValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={loading}
                      placeholder="Exemplo: 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="measurementUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade de Medida</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={loading}
                      placeholder="Exemplo: kg,g,l,ml"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="gap-8 md:grid md:grid-cols-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrições</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Descrição do item"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
