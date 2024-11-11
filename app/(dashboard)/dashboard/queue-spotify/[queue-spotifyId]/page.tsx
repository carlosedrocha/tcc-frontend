import BreadCrumb from '@/components/breadcrumb';
import { ItemTypeForm } from '@/components/forms/item-type-form'; // Adjust the import to your ItemTypeForm component

//todo backend integration
export default function Page() {
  const breadcrumbItems = [
    { title: 'Fila Spotify', link: '/dashboard/queue-spotify' }
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <ItemTypeForm initialData={null} key={null} />
    </div>
  );
}
