import BreadCrumb from '@/components/breadcrumb';
import { DishForm } from '@/components/forms/dish-form'; // Adjust the import to your ItemTypeForm component

//todo backend integration
export default function Page() {
  const breadcrumbItems = [
    { title: 'Prato', link: '/dashboard/dish' },
    { title: 'Criar', link: '/dashboard/dish/create' }
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <DishForm initialData={null} key={null} />
    </div>
  );
}
