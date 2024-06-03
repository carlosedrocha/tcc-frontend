'use client';
import { translatedRolesEnum } from '@/components/forms/employee-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Employee>[] = [
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
    accessorKey: 'firstName',
    header: 'NOME'
  },
  //TODO not accessing lastName properly
  // {
  //   accessorKey: 'lastName',
  //   header: 'SOBRENOME'
  // },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },

  {
    accessorKey: 'cpf',
    header: 'CPF'
  },
  {
    accessorKey: 'role',
    header: 'CARGO',
    cell: ({ row }) =>
      translatedRolesEnum[row.original.role] || row.original.role
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
