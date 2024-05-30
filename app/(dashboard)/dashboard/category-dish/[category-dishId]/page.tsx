import BreadCrumb from '@/components/breadcrumb';
import { CateroyDishForm } from '@/components/forms/category-dish-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Categoria prato', link: '/dashboard/category-dish' },
    { title: 'Cadastrar', link: '/dashboard/category-dish/create' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CateroyDishForm
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
