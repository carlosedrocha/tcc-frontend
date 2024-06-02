import BreadCrumb from '@/components/breadcrumb';
import { CateroyDishForm } from '@/components/forms/category-dish-form';
import { MenuForm } from '@/components/forms/menu-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Cardápio', link: '/dashboard/menu' },
    { title: 'Criar', link: '/dashboard/menu/new' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <MenuForm initialData={null}></MenuForm>
      </div>
    </ScrollArea>
  );
}
