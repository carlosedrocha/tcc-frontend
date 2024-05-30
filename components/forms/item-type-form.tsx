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
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AlertModal } from '../modal/alert-modal';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Item name must be at least 3 characters' })
});

type ItemTypeFormValues = z.infer<typeof formSchema>;

interface ItemTypeFormProps {
  initialData: any | null;
}

export const ItemTypeForm: React.FC<ItemTypeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Editar Item' : 'Criar Item';
  const description = initialData ? 'Editar Item' : 'Adicionar novo Item';
  const toastMessage = initialData ? 'Atualizado' : 'Criado';
  const action = initialData ? 'Salvar' : 'Criar';

  const defaultValues = initialData
    ? initialData
    : {
        name: ''
      };

  const form = useForm<ItemTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ItemTypeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await api.put(`item-type/${initialData.id}`, data);
      } else {
        const res = await api.post(`/item-type`, data);
        // console.log('item', res);
      }
      router.refresh();
      router.push(`/dashboard/item-type`);
      toast({
        title: 'Successo',
        description: toastMessage
      });
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
      await api.delete(`/items-type/${params.itemId}`);
      router.refresh();
      router.push(`/${params.storeId}/item-type`);
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Item</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Nome do item"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
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
