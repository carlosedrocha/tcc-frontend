// columnsStockEntry.ts

import { ColumnDef } from "@tanstack/react-table";
import { StockEntryI } from "@/app/(dashboard)/dashboard/stock/page";

// Definindo as colunas para a listagem de entradas de estoque
export const columns: ColumnDef<StockEntryI>[] = [
  {
    accessorKey: "item.name", // Nome do item
    header: "Nome",
    cell: ({ row }) => <div>{row.original.item.name}</div>,
  },
  {
    accessorKey: "quantity", // Quantidade
    header: "Quantidade",
    cell: ({ row }) => <div>{row.original.quantity}</div>,
  },
  {
    accessorKey: "item.measurementUnit", // Unidade de Medida
    header: "Unidade de Medida",
    cell: ({ row }) => <div>{row.original.item.measurementUnit}</div>,
  },
  {
    accessorKey: "item.cost", // Preço
    header: "Preço",
    cell: ({ row }) => <div>R$ {row.original.item.cost}</div>,
  },
];
