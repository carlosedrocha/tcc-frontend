'use client';
import { Button } from '@/components/ui/button';
import api from '@/app/api';
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
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '../ui/use-toast';
export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Employee Name must be at least 3 characters' }),
});

type CategoryDishFormValues = z.infer<typeof formSchema>;



export const CateroyDishForm = () => {
  const params = useParams();
  const router = useRouter();
  const urlParams = new URLSearchParams(params).toString();
  const urlId = urlParams.split("=")[1];
  const { toast } = useToast();
  const [initialData,setinitialData] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = urlId!="new" ? 'Editar Categoria do prato' : 'Cadastrar Categoria do prato';
  const description = urlId!="new" ? 'Editar Categoria do prato.' : 'Cadastrar Nova Categoria do prato';
  const toastMessage = urlId!="new" ? 'Categoria de prato atualizada.' : 'Categoria de prato Adicionado.';
  const action = urlId!="new" ? 'Salvar alterações' : 'Cadastrar';

  const defaultValues = urlId!="new"
    ? initialData
    : {
        name: '',
      };
// console.log(defaultValues)
  const form = useForm<CategoryDishFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: CategoryDishFormValues) => {

    try {
      setLoading(true);
      if (urlId!="new") {
        try{
          const res = await api.put(`/category/${urlId}`,data);
          if(res.status===200){
            toast({
              variant: 'destructive',
              title: 'Cadastrado com sucesso.',
              description: 'Categoria do prato AtualIzado com sucesso.'
            });
            router.refresh();
            router.push(`/dashboard/category-dish`);
          }
         
        }catch(error){
          toast({
            variant: 'destructive',
            title: 'Erro ao atualizar',
            description: 'Ops. Tivemos um problema ao salvar a categoria do prato, tente novamente mais tarde.'
          });
          router.refresh();
        }
       
      } else {
        try{
          const res = await api.post(`/category`,data);
          if(res.status===200){
            toast({
              variant: 'destructive',
              title: 'Atualizado com sucesso.',
              description: 'Categoria do prato AtualIzado com sucesso.'
            });
            router.refresh();
            router.push(`/dashboard/category-dish`);
          }
        }catch(error){
          toast({
            variant: 'destructive',
            title: 'Erro ao cadastrar',
            description: 'Ops. Tivemos um problema ao salvar a categoria do prato, tente novamente mais tarde.'
          });
          router.refresh();
        }
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
      //   await axios.delete(`/api/${params.storeId}/employees/${params.employeeId}`);
      router.refresh();
      router.push(`/${params.storeId}/employees`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  useEffect(() => {
    const getCategoryDishes = async () => {
      try {
        if(urlId!="new"){
        const response = await api.get(`/category/${urlId}`, {
        //   params: { offset, limit: pageLimit }
        });
        
        setinitialData(response.data);
      }
      return
      } catch (error) {
        console.error(error);
      }
    }
    getCategoryDishes();
  }, []);
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
                      placeholder="Nome da Categoria"
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
