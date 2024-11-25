'use client';

import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/stock-entry-tables/columns';
import { StockEntryTable } from '@/components/tables/stock-entry-tables/stock-entry-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define the data structure for stock entry
export interface StockEntryI {
  id: string;
  itemId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  item: {
    id: string;
    name: string;
    description: string;
    cost: number;
    measurementUnit: string;
    measurementUnitValue: number;
  };
}

const breadcrumbItems = [{ title: 'Estoque', link: '/dashboard/stock-entry' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const Page = ({ searchParams }: paramsProps) => {
  const [data, setData] = useState<StockEntryI[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const search = searchParams.search || null;
  const router = useRouter();
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  // Fetch stock entries from the API
  const getStockEntries = async () => {
    try {
      const response = await api.get('/stock', {
        params: { offset, limit: pageLimit }
      });
      console.log(response.data);
      setData(response.data);
      setPageCount(Math.ceil(response.data.total / pageLimit));
    } catch (error) {
      console.error('Erro ao buscar as entradas de estoque:', error);
    }
  };

  useEffect(() => {
    getStockEntries();
  }, [page, pageLimit]);

  const totalItems = data.length;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Estoque (${totalItems})`}
            description="Gerencie seu estoque"
          />

          <Link
            href={'/dashboard/stock/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Link>
        </div>
        <Separator />

        <StockEntryTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalItems={totalItems}
          data={data}
          pageCount={pageCount}
        />
      </div>
    </>
  );
};

export default Page;
