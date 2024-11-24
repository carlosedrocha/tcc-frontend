import {
  IFinancialReport,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType
} from '@/app/(dashboard)/dashboard/financial/report/page';
import { ColumnDef } from '@tanstack/react-table';


// Funções para traduzir os valores com base nos enums
const translateTransactionType = (value: string) => {
  return TransactionType[value as keyof typeof TransactionType] || value;
};

const translatePaymentMethod = (value: string) => {
  return (
    TransactionPaymentMethod[value as keyof typeof TransactionPaymentMethod] ||
    value
  );
};

const translateTransactionCategory = (value: string) => {
  return (
    TransactionCategory[value as keyof typeof TransactionCategory] || value
  );
};

// const translateTransactionStatus = (value: string) => {
//   return TransactionStatus[value as keyof typeof TransactionStatus] || value;
// };

// const translateMovementType = (value: string) => {
//   return MovementType[value as keyof typeof MovementType] || value;
// };

// Configuração da tabela com traduções
export const columns: ColumnDef<IFinancialReport>[] = [
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => row.getValue('description')
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    cell: ({ row }) =>
      translateTransactionCategory(row.getValue<string>('category'))
  },
  {
    accessorKey: 'transactionType',
    header: 'Tipo de Transação',
    cell: ({ row }) =>
      translateTransactionType(row.getValue<string>('transactionType'))
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Método de Pagamento',
    cell: ({ row }) =>
      translatePaymentMethod(row.getValue<string>('paymentMethod'))
  },
  // {
  //   accessorKey: 'status',
  //   header: 'Status',
  //   cell: ({ row }) =>
  //     translateTransactionStatus(row.getValue<string>('status'))
  // },
  // {
  //   accessorKey: 'movementType',
  //   header: 'Tipo de Movimento',
  //   cell: ({ row }) =>
  //     translateMovementType(row.getValue<string>('movementType'))
  // },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row }) =>
      row.getValue<number>('amount').toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      const dateValue = row.getValue<string>('date');
      return dateValue
        ? new Intl.DateTimeFormat('pt-BR').format(new Date(dateValue))
        : '';
    }
  }
];
