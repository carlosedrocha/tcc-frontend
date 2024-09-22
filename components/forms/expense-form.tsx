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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '../ui/use-toast';

// Define the new schema
const formSchema = z.object({
  expenseName: z.string().min(1, { message: 'Nome do gasto é obrigatório' }),
  value: z.number().positive({ message: 'Valor deve ser positivo' }),
  dueDate: z.string().min(1, { message: 'Data de pagamento é obrigatória' })
});

type ExpenseFormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  initialData: any | null;
}

const useExpenseData = (id) => {
  const { toast } = useToast();
  const [expenseData, setExpenseData] = useState();
  
  useEffect(() => {
    const fetchCurrentExpense = async () => {
      try {
        if (!id) return;
        const response = await api.get(`expense/${id}`);
        const data = response.data;
        setExpenseData({
          expenseName: data.expenseName || '',
          value: data.value || 0,
          dueDate: data.dueDate || ''
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar dados do gasto',
          description: 'Houve um problema ao buscar os dados, tente novamente mais tarde.'
        });
      }
    };

    fetchCurrentExpense();
  }, [id, toast]);

  return { expenseData };
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const id = params['expenseId'] === 'new' ? null : params['expenseId'];
  const { expenseData } = useExpenseData(id);
  initialData = expenseData ? expenseData : initialData;

  const title = initialData ? 'Editar Gasto' : 'Adicionar Gasto';
  const description = initialData ? 'Editar o gasto.' : 'Adicionar novo gasto';
  const toastMessage = initialData ? 'Gasto Atualizado.' : 'Gasto Criado.';
  const action = initialData ? 'Salvar' : 'Criar';

  const defaultValues = initialData
    ? initialData
    : {
        expenseName: '',
        value: 0,
        dueDate: ''
      };

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (expenseData) {
      form.reset(expenseData);
    }
  }, [expenseData, form]);

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      setLoading(true);
      if (id) {
        await api.put(`/expense/${id}`, data);
      } else {
        await api.post(`/expense`, data);
      }
      router.refresh();
      router.push(`/dashboard/expense`);
      toast({
        title: toastMessage
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado',
        description: 'Houve um problema com a solicitação, tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/expense/${id}`);
      router.refresh();
      router.push(`/dashboard/expense`);
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={onDelete}
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
              name="expenseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Gasto</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nome do Gasto"
                      defaultValue={field.value}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={loading}
                      placeholder="Valor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data a ser Pago</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={loading}
                      placeholder="Data de Pagamento"
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
