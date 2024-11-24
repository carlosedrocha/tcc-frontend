'use client';

import { useEffect, useState } from 'react';
import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/item-table/columns';
import { ItemTable } from '@/components/tables/item-table/itemTable';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Item } from '@/constants/data';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export interface ItemTypeI {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const breadcrumbItems = [{ title: 'Itens', link: '/dashboard/item' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const Page = ({ searchParams }: paramsProps) => {
  const [data, setData] = useState<Item[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const search = searchParams.search || null;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  useEffect(() => {
    const getItem = async () => {
      try {
        const response = await api.get('/item');
        const formattedData = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          measurementUnit: item.measurementUnit,
          measurementUnitValue: item.measurementUnitValue,
          cost: formatCurrency(item.cost), // Formatação do custo como moeda
          typeId: item.itemTypeId,
          typeName: item.type.name
        }));
        setData(formattedData);
        setPageCount(Math.ceil(response.data.total / pageLimit));
      } catch (error) {
        console.error(error);
      }
    };
    getItem();
  }, [page, pageLimit, offset]);

  const totalItems = data.length;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Itens (${totalItems})`}
            description="Gerencie os items do seu estabelecimento"
          />

          <Link
            href={'/dashboard/item/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Link>
        </div>
        <Separator />

        <ItemTable
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
