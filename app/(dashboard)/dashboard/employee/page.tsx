'use client';

import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/employee-tables/columns';
import { EmployeeTable } from '@/components/tables/employee-tables/employee-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface IEmployee {
  id: string;
  userId: string | null;
  firstName: string;
  lastName: string | null;
  cpf: null | string;
  user: IUser | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface IUser {
  email: string;
  role: IRole;
}

export interface IRole {
  id: string;
  name: string;
}

const breadcrumbEmployees = [
  { title: 'Funcionários', link: '/dashboard/employee' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const Page = ({ searchParams }: paramsProps) => {
  const [data, setData] = useState<IEmployee[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const search = searchParams.search || null;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  useEffect(() => {
    const getEmployee = async () => {
      try {
        const response = await api.get('/employee', {
          // params: { offset, limit: pageLimit }
        });
        const formattedData = response.data.map((employee: IEmployee) => ({
          id: employee.id,
          firstName: employee.firstName,
          role: employee.user?.role.name,
          email: employee.user?.email,
          cpf: employee.cpf
        }));
        setData(formattedData);
        setPageCount(Math.ceil(response.data.total / pageLimit));
      } catch (error) {
        console.error(error);
      }
    };
    getEmployee();
  }, [page, pageLimit, offset]);

  const totalEmployees = data.length;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbEmployees} />

        <div className="employees-start flex justify-between">
          <Heading
            title={`Funcionários (${totalEmployees})`}
            description="Gerencie os funcionários do seu estabelecimento"
          />

          <Link
            href={'/dashboard/employee/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Link>
        </div>
        <Separator />

        <EmployeeTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalEmployees={totalEmployees}
          data={data}
          pageCount={pageCount}
        />
      </div>
    </>
  );
};

export default Page;
