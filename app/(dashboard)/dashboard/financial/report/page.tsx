'use client';

import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { FinancialReportTable } from '@/components/tables/financial-report-table/financial-report-table';
import { columns } from '@/components/tables/financial-report-table/financial-report-table-columns';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Enum Definitions
export enum TransactionType {
  EXPENSE = 'Saída',
  INCOME = 'Entrada'
}

export enum TransactionPaymentMethod {
  CASH = 'Dinheiro',
  CREDIT_CARD = 'Cartão de Crédito',
  DEBIT_CARD = 'Cartão de Débito',
  PIX = 'PIX',
  TRANSFER = 'Transferência'
}

export enum MovementType {
  ENTRY = 'Entrada',
  EXIT = 'Saída',
  ADJUSTMENT = 'Ajuste'
}

export enum TransactionCategory {
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
  [TransactionCategory.FOOD]: 'FOOD',
  [TransactionCategory.SALARY]: 'SALARY',
  [TransactionCategory.STOCK]: 'STOCK',
  [TransactionCategory.BILLS]: 'BILLS',
  [TransactionCategory.MAINTENANCE]: 'maintenance',
  [TransactionCategory.OTHER]: 'OTHER'
};

const typeMapping: { [key in TransactionType]: string } = {
  [TransactionType.SALE]: 'SALE',
  [TransactionType.EXPENSE]: 'EXPENSE',
  [TransactionType.INCOME]: 'INCOME',
  [TransactionType.PAYMENT]: 'PAYMENT'
};

const paymentMethodMapping: { [key in TransactionPaymentMethod]: string } = {
  [TransactionPaymentMethod.CASH]: 'CASH',
  [TransactionPaymentMethod.CREDIT_CARD]: 'CREDIT_CARD',
  [TransactionPaymentMethod.DEBIT_CARD]: 'DEBIT_CARD',
  [TransactionPaymentMethod.PIX]: 'PIX',
  [TransactionPaymentMethod.TRANSFER]: 'TRANSFER'
};

const movementTypeMapping: { [key in MovementType]: string } = {
  [MovementType.ENTRY]: 'ENTRY',
  [MovementType.EXIT]: 'EXIT',
  [MovementType.ADJUSTMENT]: 'ADJUSTMENT'
};

const statusMapping: { [key in TransactionStatus]: string } = {
  [TransactionStatus.PENDING]: 'PENDING',
  [TransactionStatus.PAID]: 'PAID',
  [TransactionStatus.CANCELED]: 'CANCELED'
};

export interface IFinancialReport {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  movementType: string;
  paymentMethod: string;
  transactionType: string;
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
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleFilterChange = () => {
    onFilterChange({
      search,
      category,
      type,
      paymentMethod,
      movementType,
      startDate,
      endDate,
      status
    });
  };

  return (
    <div className="flex space-x-4">
      {/* <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por título"
        className="input"
      /> */}
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
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Data Inicial"
        className="input"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="Data Final"
        className="input"
      />
      {/* <select
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
        </select> */}
      {/* <select
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
      </select> */}
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
            transactionType: typeMapping[filters.type as TransactionType],
            paymentMethod:
              paymentMethodMapping[
                filters.paymentMethod as TransactionPaymentMethod
              ],
            movementType:
              movementTypeMapping[filters.movementType as MovementType],
            status: statusMapping[filters.status as TransactionStatus],
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        });
        const formattedData = response.data.map((report: IFinancialReport) => ({
          id: report.id,
          title: report.title,
          amount: report.amount,
          date: report.createdAt,
          category: report.category,
          transactionType: report.transactionType,
          movementType: report.movementType,
          paymentMethod: report.paymentMethod,
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

  // Função para exportar CSV
  const handleExportCSV = () => {
    if (data.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    // Formatar os dados para exportação
    const csvData = data.map((item) => ({
      ID: item.id,
      Título: item.title,
      Valor: item.amount,
      Data: new Date(item.date).toLocaleDateString('pt-BR'),
      Categoria: item.category,
      'Tipo de Transacao': item.transactionType,
      'Metodo de Pagamento': item.paymentMethod,
      Descricao: item.description
    }));

    // Gerar o CSV
    const csv = Papa.unparse(csvData);

    // Salvar o arquivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const fileName = `relatorio_${date}.csv`;
    saveAs(blob, fileName);
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
      <div className="mt-4 flex justify-between">
        <Button onClick={handleExportCSV} className={cn(buttonVariants())}>
          Exportar
        </Button>
        <div className="pagination flex items-center justify-center space-x-4">
          <Button disabled={page <= 1}>Anterior</Button>
          <span className="text-lg font-semibold">{page}</span>
          <Button disabled={page >= pageCount}>Próximo</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
