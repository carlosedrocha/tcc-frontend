'use client';

import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/section-table/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SectionTable } from '@/components/tables/section-table/section-table';

export interface SectionI {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  dishes: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    photoUrl: string | null;
    disabled: boolean;
    recipe: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  }>;
  menu: Array<{
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  }>;
}

const breadcrumbSections = [{ title: 'Seção', link: '/dashboard/section' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const Page = ({ searchParams }: paramsProps) => {
  const [data, setData] = useState<SectionI[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const search = searchParams.search || null;
  const router = useRouter();
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  const getSections = async () => {
    try {
      const response = await api.get('/section', {
        params: { offset, limit: pageLimit }
      });
      setData(response.data);
      setPageCount(Math.ceil(response.data.total / pageLimit));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSections();
  }, [page, pageLimit]);
  const totalItems = data.length;
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbSections} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Seções de cardapio`}
          description="Gerencie seções do cardápio"
        />

        <Link
          href={'/dashboard/section/new'}
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Link>
      </div>
      <Separator />

      {/* Integrando o ItemTypeTable aqui */}

      <SectionTable
        searchKey="name"
        pageNo={page}
        columns={columns}
        totalItems={totalItems}
        data={data}
        pageCount={pageCount}
      />
    </div>
  );
};

export default Page;
