'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { IDish } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

// Helper function to render object as children
const renderObjectAsChildren = (obj: Record<string, any>) => {
  let itemNameDisplayed = false; // Flag to ensure item name is displayed only once
  return Object.entries(obj).map(([key, val]) => (
    <div key={key}>
      {key === 'quantity' ? <strong>Quantidade:</strong> : null}
      {key === 'quantity' ? ` ${val}` : null}
      {key === 'item' && !itemNameDisplayed ? (
        <strong>Nome do Item:</strong>
      ) : null}
      {key === 'item' ? ` ${val.name}` : null}
      {key === 'item' && !itemNameDisplayed
        ? (itemNameDisplayed = true)
        : null}{' '}
      {/* Set flag to true after displaying item name */}
    </div>
  ));
};

export const columns: ColumnDef<IDish>[] = [
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
    header: 'NOME'
  },
  {
    accessorKey: 'dishIngredients',
    header: 'Lista de Ingredientes',
    cell: ({ row }) => {
      const value = row.original.dishIngredients;
      return Array.isArray(value) ? (
        <Accordion type="single" collapsible className="w-full">
          {value.map((ingredient, index) => (
            <AccordionItem key={index} value={`ingredient-${index}`}>
              <AccordionTrigger>{`Abrir`}</AccordionTrigger>
              {/* <AccordionTrigger>{`Lista de Ingredientes ${index + 1}`}</AccordionTrigger> */}
              <AccordionContent>
                {typeof ingredient === 'object'
                  ? renderObjectAsChildren(ingredient)
                  : ingredient}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        value
      );
    }
  },
  {
    accessorKey: 'price',
    header: 'Preço'
  },
  {
    accessorKey: 'photoUrl',
    header: 'IMAGEM'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
