'use client';
import {
    ColumnDef,
    PaginationState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from '@tanstack/react-table';
import React from 'react';

import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey: string;
    pageNo: number;
    totalExpenses: number;
    pageSizeOptions?: number[];
    pageCount: number;
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}

export function ExpenseTable<TData, TValue>({
    columns,
    data,
    pageNo,
    searchKey,
    totalExpenses,
    pageCount,
    pageSizeOptions = [10, 20, 30, 40, 50]
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const page = searchParams?.get('page') ?? '1';
    const pageAsNumber = Number(page);
    const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    const per_page = searchParams?.get('limit') ?? '10';
    const perPageAsNumber = Number(per_page);
    const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

    const createQueryString = React.useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams?.toString());

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            }

            return newSearchParams.toString();
        },
        [searchParams]
    );

    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: fallbackPage - 1,
        pageSize: fallbackPerPage
    });

    React.useEffect(() => {
        router.push(
            `${pathname}?${createQueryString({ page: pageIndex + 1, limit: pageSize })}`,
            { scroll: false }
        );
    }, [pageIndex, pageSize]);

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount ?? -1,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination: { pageIndex, pageSize }
        },
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualFiltering: true
    });

    const searchValue = table.getColumn(searchKey)?.getFilterValue() as string;
    return (
        <>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filtrar gastos..."
                    value={searchValue ?? ''}
                    onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <ScrollArea>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Sem resultados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex w-32 items-center justify-center text-sm font-medium">
                    Página {pageNo} de {pageCount}
                </div>
                <button
                    className="hidden h-8 w-8 items-center justify-center rounded-md border p-0 transition-colors hover:bg-muted disabled:opacity-50 disabled:pointer-events-none md:flex"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                    className="hidden h-8 w-8 items-center justify-center rounded-md border p-0 transition-colors hover:bg-muted disabled:opacity-50 disabled:pointer-events-none md:flex"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            </div>
        </>
    );
}
