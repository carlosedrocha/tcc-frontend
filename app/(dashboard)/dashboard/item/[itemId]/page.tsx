'use client';
import BreadCrumb from '@/components/breadcrumb';
import { ItemForm } from '@/components/forms/item-form'; // Adjust the import to your ItemTypeForm component
import { useSearchParams } from 'next/navigation';

//todo backend integration
export default function Page() {

  const breadcrumbItems = [
    { title: 'Tipo de Item', link: '/dashboard/item' },
    { title: 'Cadastrar' , link: '/dashboard/item/new' }
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <ItemForm
        initialData={null}
        categories={null}
        key={null}
      />
    </div>
  );
}
