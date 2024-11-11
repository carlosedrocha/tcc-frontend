'use client';

import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { FinancialReportTable } from '@/components/tables/financial-report-table/financial-report-table';
import { columns } from '@/components/tables/financial-report-table/financial-report-table-columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Enum Definitions
enum TransactionType {
  SALE = 'Vendas',
  EXPENSE = 'Despesas',
  INCOME = 'Recebimentos',
  PAYMENT = 'Pagamentos'
}

enum TransactionPaymentMethod {
  CASH = 'Dinheiro',
  CREDIT_CARD = 'Cartão de Crédito',
  DEBIT_CARD = 'Cartão de Débito',
  PIX = 'PIX',
  TRANSFER = 'Transferência'
}

enum MovementType {
  ENTRY = 'Entrada',
  EXIT = 'Saída',
  ADJUSTMENT = 'Ajuste'
}

enum TransactionCategory {
  FOOD = 'Alimentos',
  SALARY = 'Salário',
  STOCK = 'Estoque',
  BILLS = 'Contas',
  MAINTENANCE = 'Manutenção',
  OTHER = 'Outro'
}

enum TransactionStatus {
  PENDING = 'Pendente',
  PAID = 'Pago',
  CANCELED = 'Cancelado'
}

// Create a mapping for each enum to lowercase keys
const categoryMapping: { [key in TransactionCategory]: string } = {
  [TransactionCategory.FOOD]: 'food',
  [TransactionCategory.SALARY]: 'SALARY',
  [TransactionCategory.STOCK]: 'STOCK',
  [TransactionCategory.BILLS]: 'bills',
  [TransactionCategory.MAINTENANCE]: 'maintenance',
  [TransactionCategory.OTHER]: 'other'
};

const typeMapping: { [key in TransactionType]: string } = {
  [TransactionType.SALE]: 'sale',
  [TransactionType.EXPENSE]: 'expense',
  [TransactionType.INCOME]: 'income',
  [TransactionType.PAYMENT]: 'payment'
};

const paymentMethodMapping: { [key in TransactionPaymentMethod]: string } = {
  [TransactionPaymentMethod.CASH]: 'cash',
  [TransactionPaymentMethod.CREDIT_CARD]: 'credit_card',
  [TransactionPaymentMethod.DEBIT_CARD]: 'debit_card',
  [TransactionPaymentMethod.PIX]: 'pix',
  [TransactionPaymentMethod.TRANSFER]: 'transfer'
};

const movementTypeMapping: { [key in MovementType]: string } = {
  [MovementType.ENTRY]: 'entry',
  [MovementType.EXIT]: 'exit',
  [MovementType.ADJUSTMENT]: 'adjustment'
};

const statusMapping: { [key in TransactionStatus]: string } = {
  [TransactionStatus.PENDING]: 'pending',
  [TransactionStatus.PAID]: 'paid',
  [TransactionStatus.CANCELED]: 'canceled'
};

export interface IFinancialReport {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const breadcrumbReports = [
  { title: 'Relatórios Financeiros', link: '/dashboard/financial-report' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

// Filters Component
const Filters = ({
  onFilterChange
}: {
  onFilterChange: (filters: any) => void;
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<TransactionType | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<
    TransactionPaymentMethod | ''
  >('');
  const [movementType, setMovementType] = useState<MovementType | ''>('');
  const [status, setStatus] = useState<TransactionStatus | ''>('');

  const handleFilterChange = () => {
    onFilterChange({
      search,
      category,
      type,
      paymentMethod,
      movementType,
      status
    });
  };

  return (
    <div className="flex space-x-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por título"
        className="input"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input"
      >
        <option value="">Categoria</option>
        {Object.values(TransactionCategory).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as TransactionType)}
        className="input"
      >
        <option value="">Tipo de Transação</option>
        {Object.values(TransactionType).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select
        value={paymentMethod}
        onChange={(e) =>
          setPaymentMethod(e.target.value as TransactionPaymentMethod)
        }
        className="input"
      >
        <option value="">Método de Pagamento</option>
        {Object.values(TransactionPaymentMethod).map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
      <select
        value={movementType}
        onChange={(e) => setMovementType(e.target.value as MovementType)}
        className="input"
      >
        <option value="">Tipo de Movimento</option>
        {Object.values(MovementType).map((movement) => (
          <option key={movement} value={movement}>
            {movement}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TransactionStatus)}
        className="input"
      >
        <option value="">Status</option>
        {Object.values(TransactionStatus).map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusOption}
          </option>
        ))}
      </select>
      <button
        onClick={handleFilterChange}
        className={cn(buttonVariants({ variant: 'default' }))}
      >
        Filtrar
      </button>
    </div>
  );
};

const Page = ({ searchParams }: paramsProps) => {
  const [data, setData] = useState<IFinancialReport[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    paymentMethod: '',
    movementType: '',
    status: ''
  });

  const search = searchParams.search || filters.search || null;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  useEffect(() => {
    const getReports = async () => {
      try {
        const response = await api.get('/transactions/list', {
          params: {
            offset,
            limit: pageLimit,
            search,
            category: categoryMapping[filters.category as TransactionCategory],
            type: typeMapping[filters.type as TransactionType],
            paymentMethod:
              paymentMethodMapping[
                filters.paymentMethod as TransactionPaymentMethod
              ],
            movementType:
              movementTypeMapping[filters.movementType as MovementType],
            status: statusMapping[filters.status as TransactionStatus]
          }
        });
        const formattedData = response.data.map((report: IFinancialReport) => ({
          id: report.id,
          title: report.title,
          amount: report.amount,
          date: report.createdAt,
          category: report.category,
          description: report.description
        }));
        setData(formattedData);
        setPageCount(Math.ceil(response.data.total / pageLimit));
      } catch (error) {
        console.error(error);
      }
    };
    getReports();
  }, [page, pageLimit, offset, filters]);

  const totalReports = data.length;

  const handleFilterChange = (newFilters: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  return (
    <div className="container py-6">
      <BreadCrumb items={breadcrumbReports} />
      <Heading size="lg" className="mb-4">
        Relatórios Financeiros
      </Heading>
      <Filters onFilterChange={handleFilterChange} />
      <Separator className="my-4" />
      <FinancialReportTable columns={columns} data={data} />
      <div className="pagination">
        <button disabled={page <= 1}>Anterior</button>
        <span>{page}</span>
        <button disabled={page >= pageCount}>Próximo</button>
      </div>
    </div>
  );
};

export default Page;
