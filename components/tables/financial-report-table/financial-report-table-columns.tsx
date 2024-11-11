import header from '@/components/layout/header';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<IFinancialReport>[] = [
  {
    accessorKey: 'title',
    header: 'Título',
    cell: ({ row }) => row.getValue('title')
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row }) => row.getValue('amount')
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => row.getValue('date')
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    cell: ({ row }) => row.getValue('category')
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => row.getValue('description')
  }
];
