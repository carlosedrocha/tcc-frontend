import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { CellAction } from './cell-action';
import { ISection } from '@/constants/data'; // Atualize o caminho para o tipo correto

export const columns: ColumnDef<ISection>[] = [
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
    header: 'NOME',
    cell: ({ row }) => row.original.name
  },
  {
    accessorKey: 'menuIds',
    header: 'Menus Associados',
    cell: ({ row }) => {
      const menus = row.original.menu;
      return menus && menus.length > 0
        ? menus.map((menu) => menu.name).join(', ') // Exibe os IDs dos menus associados
        : 'Nenhum menu associado';
    }
  },
  {
    accessorKey: 'dishes',
    header: 'Pratos Associados',
    cell: ({ row }) => {
      // Obtém o array de pratos
      const dishes = row.original.dishes;

      // Retorna os nomes dos pratos ou uma mensagem padrão
      return dishes && dishes.length > 0
        ? dishes.map((dish) => dish.name).join(', ') // Exibe os nomes dos pratos associados
        : 'Nenhum prato associado';
    }
  },
  {
    accessorKey: 'items',
    header: 'Itens Associados',
    cell: ({ row }) => {
      const items = row.original.items; // Assume que `items` está disponível em `row.original`
      return items && items.length > 0
        ? items.map((item) => item.name).join(', ')
        : 'Nenhum item associado';
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
