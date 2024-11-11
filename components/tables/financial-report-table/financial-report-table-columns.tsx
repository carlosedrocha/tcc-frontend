import { IFinancialReport } from '@/app/(dashboard)/dashboard/financial/report/page';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<IFinancialReport>[] = [
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => row.getValue('description')
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    cell: ({ row }) => row.getValue('category')
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row }) =>
      row.getValue('amount').toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => row.getValue('date').toISOString().split('T')[0]
  }
];
