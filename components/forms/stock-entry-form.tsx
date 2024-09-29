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
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '../ui/use-toast';

// Define the new schema for stock entry
const formSchema = z.object({
  quantity: z.number().min(1, { message: 'Quantidade é obrigatória' }),
  transaction: z.object({
    type: z.enum(['SALE', 'EXPENSE', 'INCOME', 'PAYMENT'], { required_error: 'Tipo de transação é obrigatório' }),
    description: z.string().min(1, { message: 'Descrição é obrigatória' }),
    amount: z.number().min(0, { message: 'Valor deve ser maior ou igual a zero' }),
    category: z.enum(['FOOD', 'SALARY', 'STOCK', 'BILLS', 'MAINTENANCE', 'OTHER'], { required_error: 'Categoria é obrigatória' }),
    status: z.enum(['PENDING', 'PAID', 'CANCELED'], { required_error: 'Status é obrigatório' }),
    paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'TRANSFER'], { required_error: 'Método de pagamento é obrigatório' }),
  }),
  movementType: z.enum(['ENTRY', 'EXIT', 'ADJUSTMENT'], { required_error: 'Tipo de movimentação é obrigatório' }),
  description: z.string().min(1, { message: 'Descrição da entrada é obrigatória' }),
});

type StockEntryFormValues = z.infer<typeof formSchema>;

interface StockEntryFormProps {
  initialData: any | null;
}

const useStockEntryData = (id) => {
  const { toast } = useToast();
  const [stockEntryData, setStockEntryData] = useState();
  const initialDataRef = useRef(null);

  useEffect(() => {
    const fetchCurrentStockEntry = async () => {
      try {
        if (!id) {
          return;
        }
        const response = await api.get(`/stock-entry/${id}`);
        const data = response.data;
        initialDataRef.current = {
          quantity: data.quantity || 0,
          transaction: {
            type: data.transaction.type || 'SALE',
            description: data.transaction.description || '',
            amount: data.transaction.amount || 0,
            category: data.transaction.category || 'OTHER',
            status: data.transaction.status || 'PENDING',
            paymentMethod: data.transaction.paymentMethod || 'CASH',
          },
          movementType: data.movementType || 'ENTRY',
          description: data.description || '',
        };
        setStockEntryData(initialDataRef.current);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar dados da entrada de estoque',
          description: 'Houve um problema ao buscar os dados, tente novamente mais tarde.',
        });
      }
    };

    fetchCurrentStockEntry();
  }, [id, toast]);

  return { stockEntryData };
};

export const StockEntryForm: React.FC<StockEntryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const id = params['stockEntryId'] === 'new' ? null : params['stockEntryId'];

  const { stockEntryData } = useStockEntryData(id);
  initialData = stockEntryData ? stockEntryData : initialData;

  const title = initialData ? 'Editar Entrada de Estoque' : 'Adicionar Entrada de Estoque';
  const toastMessage = initialData ? 'Entrada de Estoque Atualizada.' : 'Entrada de Estoque Criada.';
  const action = initialData ? 'Salvar' : 'Criar';

  const defaultValues = initialData ? initialData : {
    quantity: 1,
    transaction: {
      type: 'SALE',
      description: '',
      amount: 0,
      category: 'OTHER',
      status: 'PENDING',
      paymentMethod: 'CASH',
    },
    movementType: 'ENTRY',
    description: '',
  };

  const form = useForm<StockEntryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (stockEntryData) {
      form.reset(stockEntryData);
    }
  }, [stockEntryData, form]);

  const onSubmit = async (data: StockEntryFormValues) => {
    try {
      setLoading(true);
      if (id) {
        await api.put(`/stock-entry/${id}`, data);
      } else {
        await api.post(`/stock-entry`, data);
      }
      router.refresh();
      router.push('/dashboard/stock-entry');
      toast({ title: toastMessage });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado',
        description: 'Houve um problema com a solicitação, tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={title} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {/* Aqui você pode implementar a lógica de exclusão se necessário */}}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transaction.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Transação</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? 'SALE'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SALE">Vendas</SelectItem>
                      <SelectItem value="EXPENSE">Despesas</SelectItem>
                      <SelectItem value="INCOME">Recebimentos</SelectItem>
                      <SelectItem value="PAYMENT">Pagamentos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="transaction.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Descrição da transação"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transaction.amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transaction.category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? 'OTHER'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FOOD">Alimentação</SelectItem>
                      <SelectItem value="SALARY">Salário</SelectItem>
                      <SelectItem value="STOCK">Estoque</SelectItem>
                      <SelectItem value="BILLS">Contas</SelectItem>
                      <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                      <SelectItem value="OTHER">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="transaction.status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? 'PENDING'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="PAID">Pago</SelectItem>
                      <SelectItem value="CANCELED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transaction.paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? 'CASH'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">Dinheiro</SelectItem>
                      <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                      <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="TRANSFER">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="movementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Movimentação</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? 'ENTRY'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ENTRY">Entrada</SelectItem>
                      <SelectItem value="EXIT">Saída</SelectItem>
                      <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição da Entrada</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Descrição detalhada"
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
