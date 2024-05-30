'use client';
import BreadCrumb from '@/components/breadcrumb';
import { ItemTypeForm } from '@/components/forms/item-type-form'; // Adjust the import to your ItemTypeForm component
import { useSearchParams } from 'next/navigation';

//todo backend integration
export default function Page() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  console.log('teste name:', name);

  const breadcrumbItems = [
    { title: 'Tipo de Item', link: '/dashboard/item-type' },
    { title: `Criar ${name} `, link: '/dashboard/item-type/create' }
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <ItemTypeForm
        initialData={{
          name: name as string
        }}
        key={null}
      />
    </div>
  );
}
