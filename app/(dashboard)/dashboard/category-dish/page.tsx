'use client';
import { CategoryDishTable } from '@/components/tables/category-dish-table/categoryDishTable';
import api from '@/app/api';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { columnsCategoryDish } from '@/components/tables/category-dish-table/columnsDish';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };  
};

const breadcrumbItems = [{ title: 'Categoria Prato', link: '/category-dish' }];

export default function Page({ searchParams }: ParamsProps) {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  useEffect(() => {
    const getCategoryDishes = async () => {
      try {
        const response = await api.get('/category', {
        //   params: { offset, limit: pageLimit }
        });
        console.log(response.data)
        setData(response.data);
        setPageCount(0);
      } catch (error) {
        console.error(error);
      }
    };

    getCategoryDishes();
  }, [page, pageLimit, offset]);
const totalItems = data.length;
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Cadastrar categoria de prato`}
          description="Cadastro da categoria do prato"
        />

        <Link
          href={'/dashboard/category-dish/new'}
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Link>
      </div>
      <Separator />

      <CategoryDishTable
        searchKey="name"
        pageNo={page}
        columns={columnsCategoryDish}
        totalItems={totalItems}
        data={data}
        pageCount={pageCount}
      />
    </div>
  );
}
