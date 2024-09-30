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

// Definição do schema para validação dos campos
const formSchema = z.object({
  quantity: z.number().min(1, { message: 'Quantidade é obrigatória' }),
  itemId: z.string().min(1, { message: 'Item é obrigatório' }), // Campo itemId
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

// Hook para buscar dados da entrada de estoque
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
        const response = await api.get(`/stock-movement/entry/${id}`);
        const data = response.data;
        initialDataRef.current = {
          quantity: data.quantity || 0,
          itemId: data.itemId || '',
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

// Hook para buscar os itens de estoque
const useStockItems = () => {
  const { toast } = useToast();
  const [stockItems, setStockItems] = useState([]);

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await api.get('/stock');
        setStockItems(response.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar itens de estoque',
          description: 'Houve um problema ao buscar os itens, tente novamente mais tarde.',
        });
      }
    };

    fetchStockItems();
  }, [toast]);

  return stockItems;
};

export const StockEntryForm: React.FC<StockEntryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const id = params['stockEntryId'] === 'new' ? null : params['stockEntryId'];

  const { stockEntryData } = useStockEntryData(id);
  initialData = stockEntryData ? stockEntryData : initialData;

  const stockItems = useStockItems(); // Itens de estoque

  const title = initialData ? 'Editar Entrada de Estoque' : 'Adicionar Entrada de Estoque';
  const toastMessage = initialData ? 'Entrada de Estoque Atualizada.' : 'Entrada de Estoque Criada.';
  const action = initialData ? 'Salvar' : 'Criar';

  const defaultValues = initialData ? initialData : {
    quantity: 1,
    itemId: '',
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
      console.log(data)
      const payload = {
        quantity: Number(data.quantity),
        transaction: {
          type: data.transaction.type,
          description: data.transaction.description,
          amount: Number(data.transaction.amount),
          category: data.transaction.category,
          status: data.transaction.status,
          paymentMethod: data.transaction.paymentMethod,
        },
        movementType: data.movementType,
        description: data.description,
        id: data.itemId,
      };

      await api.post(`/stock-movement/entry/${data.itemId}`, payload);
      
      router.refresh();
      router.push('/dashboard/stock');
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
            onClick={() => {/* Lógica de exclusão */}}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="gap-8 md:grid md:grid-cols-3">
            {/* Campo para selecionar o item */}
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecione um Item</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecione um item" />
                      </SelectTrigger>
                      <SelectContent>
                        {stockItems.map((stockEntry) => (
                          <SelectItem key={stockEntry.id} value={stockEntry.id}>
                            {stockEntry.item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Quantidade */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} // Converter para número
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <Heading title="Informações da Transação" description="Detalhes da transação financeira" />
          {/* Campos da transação */}
          <div className="gap-8 md:grid md:grid-cols-3">
            {/* Tipo de transação */}
            <FormField
              control={form.control}
              name="transaction.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Transação</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SALE">Venda</SelectItem>
                        <SelectItem value="EXPENSE">Despesa</SelectItem>
                        <SelectItem value="INCOME">Receita</SelectItem>
                        <SelectItem value="PAYMENT">Pagamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Descrição da transação */}
            <FormField
              control={form.control}
              name="transaction.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Transação</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Descrição"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Valor */}
            <FormField
              control={form.control}
              name="transaction.amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Categoria */}
            <FormField
              control={form.control}
              name="transaction.category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FOOD">Alimentação</SelectItem>
                        <SelectItem value="SALARY">Salário</SelectItem>
                        <SelectItem value="STOCK">Estoque</SelectItem>
                        <SelectItem value="BILLS">Contas</SelectItem>
                        <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                        <SelectItem value="OTHER">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Status */}
            <FormField
              control={form.control}
              name="transaction.status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="PAID">Pago</SelectItem>
                        <SelectItem value="CANCELED">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Método de Pagamento */}
            <FormField
              control={form.control}
              name="transaction.paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Dinheiro</SelectItem>
                        <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                        <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="TRANSFER">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <Heading title="Movimentação de Estoque" description="Detalhes da movimentação" />
          {/* Movimento de Estoque */}
          <div className="gap-8 md:grid md:grid-cols-3">
            {/* Tipo de Movimentação */}
            <FormField
              control={form.control}
              name="movementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Movimentação</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de movimentação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENTRY">Entrada</SelectItem>
                        <SelectItem value="EXIT">Saída</SelectItem>
                        <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Descrição da movimentação */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Movimentação</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Descrição"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
