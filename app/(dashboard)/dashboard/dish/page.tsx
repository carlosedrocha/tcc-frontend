'use client';

import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { DishTable } from '@/components/tables/dish-tables/dish-table';
import { columns } from '@/components/tables/dish-tables/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface ItemTypeI {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const breadcrumbItems = [{ title: 'Pratos', link: '/dashboard/dish' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const Page = ({ searchParams }: paramsProps) => {
  const [data, setData] = useState<ItemTypeI[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const search = searchParams.search || null;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  useEffect(() => {
    const getDishes = async () => {
      try {
        const response = await api.get('/dish', {
          params: { offset, limit: pageLimit }
        });

        setData(response.data);
        setPageCount(Math.ceil(response.data.total / pageLimit));
      } catch (error) {
        console.error(error);
      }
    };

    getDishes();
  }, [page, pageLimit, offset]);

  const totalItems = data.length;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Pratos (${totalItems})`} description="" />

          <Link
            href={'/dashboard/dish/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Link>
        </div>
        <Separator />

        <DishTable
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
