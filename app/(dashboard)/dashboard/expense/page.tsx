'use client';

import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/expense-tables/columns';
import { ExpenseTable } from '@/components/tables/expense-tables/expense-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface IExpense {
  id: string;
  expenseName: string;
  value: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

const breadcrumbExpenses = [
  { title: 'Gastos', link: '/dashboard/expense' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const Page = ({ searchParams }: paramsProps) => {
  const [data, setData] = useState<IExpense[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const search = searchParams.search || null;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const response = await api.get('/expense', {
          // params: { offset, limit: pageLimit }
        });
        const formattedData = response.data.map((expense: IExpense) => ({
          id: expense.id,
          expenseName: expense.expenseName,
          value: expense.value,
          dueDate: new Date(expense.dueDate).toLocaleDateString('pt-BR')
        }));
        setData(formattedData);
        setPageCount(Math.ceil(response.data.total / pageLimit));
      } catch (error) {
        console.error(error);
      }
    };
    getExpenses();
  }, [page, pageLimit, offset]);

  const totalExpenses = data.length;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbExpenses} />

        <div className="expenses-start flex justify-between">
          <Heading
            title={`Gastos (${totalExpenses})`}
            description="Gerencie os gastos do seu estabelecimento"
          />

          <Link
            href={'/dashboard/expense/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Link>
        </div>
        <Separator />

        <ExpenseTable
          searchKey="expenseName"
          pageNo={page}
          columns={columns}
          totalExpenses={totalExpenses}
          data={data}
          pageCount={pageCount}
        />
      </div>
    </>
  );
};

export default Page;
