import BreadCrumb from '@/components/breadcrumb';
// Adjust the import to your ItemTypeForm component
import { SectionForm } from '@/components/forms/section-form';

//todo backend integration
export default function Page() {
  const breadcrumbItems = [
    { title: 'Seção de Cardapio', link: '/dashboard/section' }
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <SectionForm initialData={null} key={null} />
    </div>
  );
}
