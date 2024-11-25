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
import { ICategory, IDish } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import FileUpload from '../file-upload';
import { CategorySelect } from '../multi-select/category-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

const ImgSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  fileSize: z.number(),
  size: z.number(),
  fileKey: z.string(),
  key: z.string(),
  fileUrl: z.string(),
  url: z.string()
});

export const IMG_MAX_LIMIT = 3;

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Dish Name must be at least 3 characters' }),
  description: z
    .string()
    .min(3, { message: 'Dish description must be at least 3 characters' }),
  price: z.coerce.number(),
  disabled: z.boolean().optional(),
  photoUrl: z.string().url().optional(),
  categoriesIds: z.array(z.string().uuid()),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.coerce
        .number()
        .min(1, { message: 'Quantity must be at least 1' })
    })
  ),
  preparationMethod: z
    .string()
    .min(1, { message: 'O modo de preparo é obrigatório' }) // Adiciona o campo preparationMethod aqui
});

type DishFormValues = z.infer<typeof formSchema>;

interface DishFormProps {
  initialData: any | null;
  // categories: any;
}
// todo edit render previous image
export const DishForm: React.FC<DishFormProps> = ({
  initialData
  // categories
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [items, setItems] = useState<any[]>([]);

  let id: string | null | string[] = params['dishId'];
  const changeNewToNullId = () => {
    if (id === 'new') {
      id = null;
    }
  };
  changeNewToNullId();
  let currentDish: IDish | null = null;
  useEffect(() => {
    const fetchCurrentDish = async () => {
      try {
        if (!id) {
          return;
        }
        const response = await api.get(`dish/${id}`);
        const data = response.data;

        currentDish = data;
        initialData = {
          ...data, // mantém os demais campos
          preparationMethod: data.recipe // mapeia recipe para preparationMethod
        };

        console.log('eu sou esse ', initialData);
        form.reset(initialData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar pratos.',
          description: ''
        });
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('category');
        setCategories(response.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar as categorias.',
          description: ''
        });
      }
    };

    const fetchItems = async () => {
      try {
        const response = await api.get('item');
        setItems(response.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar os items.',
          description:
            'There was a problem fetching items, please try again later.'
        });
      }
    };

    fetchCategories();
    fetchItems();
    fetchCurrentDish();
  }, [toast]);

  const title = id !== 'new' ? 'Editar Prato' : 'Adicionar Prato';
  const description = id !== 'new' ? 'Editar Prato' : 'Adicionar Prato';
  const toastMessage = id !== 'new' ? 'Prato Atualizado' : 'Prato Criado';
  const action = id !== 'new' ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        description: '',
        price: 0,
        // imgUrl: [],
        photoUrl: '',
        categoriesIds: [],
        items: [{ id: '', quantity: 1 }]
      };

  const form = useForm<DishFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  const handleUploadSuccess = (url: string) => {
    form.setValue('photoUrl', url);
  };

  const onSubmit = async (data: DishFormValues) => {
    try {
      console.log('fui atulizado', data);
      setLoading(true);
      if (id) {
        await api.put(`/dish/${id}`, {
          categoriesIds: data.categoriesIds,
          name: data.name,
          description: data.description,
          price: parseFloat(data.price.toString()),
          disabled: data.disabled,
          // imgUrl: data.imgUrl,
          photoUrl: data.photoUrl ?? null,
          items: data.items,
          recipe: data.preparationMethod // Inclui o método de preparo aqui
        });
        router.refresh();
        router.push(`/dashboard/dish`);
        toast({
          variant: 'primary',
          title: 'Prato Alterado com sucesso.'
        });
      } else {
        await api.post(`/dish`, {
          categoriesIds: data.categoriesIds,
          name: data.name,
          description: data.description,
          price: parseFloat(data.price.toString()),
          // imgUrl: data.imgUrl,
          photoUrl: data.photoUrl ?? null,
          items: data.items.map((item) => ({
            id: item.id,
            quantity: parseInt(item.quantity.toString())
          })),
          recipe: data.preparationMethod // Inclui o método de preparo aqui
        });
        router.refresh();
        router.push(`/dashboard/dish`);
        toast({
          variant: 'primary',
          title: 'Prato Adicionado com sucesso.'
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
      //   await axios.delete(`/api/${params.storeId}/dishs/${params.dishId}`);
      router.refresh();
      router.push(`/${params.storeId}/dish`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const triggerImgUrlValidation = () => form.trigger('imgUrl');

  function formatCurrency(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  function parseCurrency(value: string): number {
    // Remove caracteres inválidos e converte para número
    return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.') || '0');
  }

  return (
    <>
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
          <FileUpload onUploadSuccess={handleUploadSuccess} />

          <FormField control={form.control} name="disabled" />

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
                      placeholder="Macarrão..."
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Macarrão ao molho..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      value={`R$ ${field.value.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`} // Exibe o valor formatado
                      onChange={(e) => {
                        // Remove tudo que não é número ou vírgula
                        const input = e.target.value.replace(/[^\d,]/g, '');

                        // Substitui vírgula por ponto e converte para número
                        const numericValue =
                          parseFloat(input.replace(',', '.')) || 0;

                        // Atualiza o valor numérico no formulário
                        field.onChange(numericValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="categoriesIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria do Prato</FormLabel>
                  <Select
                     categories={categories}
                     value={field.value}
                     onValueChange={(value) => {
                       field.onChange(value);
                     }}
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
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="categoriesIds"
              render={({ field }) => (
                <CategorySelect
                  categories={categories}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
            <FormField
              control={form.control}
              name="preparationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modo de preparo</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Escreva qual o passo a passo para fazer o prato. ATENÇÃO: só será visivel para funcionários."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Items Form Field */}
            <div className="space-y-4 ">
              <FormLabel>Items</FormLabel>
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <FormControl>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Selecione um item"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={loading}
                            placeholder="Quantidade"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="default"
                onClick={() => append({ id: '', quantity: 1 })}
              >
                Adicionar Item
              </Button>
            </div>
          </div>
          {/* aqui todo check why button*/}
          {/* <Button className="ml-auto" type="submit">
            {action}
          </Button> */}
          <Button
            className="ml-auto"
            type="submit"
            // onClick={() => {
            //   console.log(form.getValues());
            //   console.log(form.getValues().name);
            //   // onSubmit(form.getValues());
            // }}
          >
            Enviar
          </Button>
        </form>
      </Form>
    </>
  );
};
