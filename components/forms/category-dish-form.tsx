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
import { useParams, useRouter, useSearchParams  } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '../ui/use-toast';
import { AlertModal } from '../modal/alert-modal';
export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Employee Name must be at least 3 characters' }),
});

type CategoryDishFormValues = z.infer<typeof formSchema>;
interface CategoryDishFormProps {
  initialData: any | null;
}


export const CateroyDishForm : React.FC<CategoryDishFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const { toast } = useToast();
  
  initialData =params['category-dishId']!=="new" ?{
    id: params['category-dishId'],
    name: name,
  }:null
  console.log(initialData)
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Editar Categoria do prato' : 'Cadastrar Categoria do prato';
  const description = initialData ? 'Editar Categoria do prato.' : 'Cadastrar Nova Categoria do prato';
  const toastMessage = initialData ? 'Categoria de prato atualizada.' : 'Categoria de prato Adicionado.';
  const action = initialData ? 'Salvar alterações' : 'Cadastrar';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
      };
// console.log(defaultValues)
  const form = useForm<CategoryDishFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const reloadPage = ()=>{
    router.refresh();
    router.push(`/dashboard/category-dish`);
  }
  const onSubmit = async (data: CategoryDishFormValues) => {

    try {
      setLoading(true);
      if (initialData) {
        try{
          const res = await api.put(`/category/${initialData.id}`,data);
          if(res.status===200){
            toast({
              variant: 'destructive',
              title: 'Cadastrado com sucesso.',
              description: 'Categoria do prato AtualIzado com sucesso.'
            });
            reloadPage();
          }
         
        }catch(error){
          toast({
            variant: 'destructive',
            title: 'Erro ao atualizar',
            description: 'Ops. Tivemos um problema ao salvar a categoria do prato, tente novamente mais tarde.'
          });
          reloadPage();
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
            reloadPage();
          }
        }catch(error){
          toast({
            variant: 'destructive',
            title: 'Erro ao cadastrar',
            description: 'Ops. Tivemos um problema ao salvar a categoria do prato, tente novamente mais tarde.'
          });
          reloadPage();
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
      try{
        console.log(initialData)
        const response = await api.delete(`/category/${initialData.id}`);
        if(response.status===200){
          toast({
            variant: 'destructive',
            title: 'Deletado com sucesso.',
            description: 'Categoria do prato Deletado com sucesso.'
          });
          reloadPage();
        }
      }catch(error){
        toast({
          variant: 'destructive',
          title: 'Erro ao deletar',
          description: 'Não foi possível deletar a categoria do prato'
        });
      }
      reloadPage();
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
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
