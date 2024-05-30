'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { CategoryDish } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellActionCategoryDish } from './cell-action-category-dish';

export const columnsCategoryDish: ColumnDef<CategoryDish>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Nome da categoria ',
    filterFn: 'includesString'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellActionCategoryDish data={row.original} />
  }
];
