'use client';
import BreadCrumb from '@/components/breadcrumb';
import { StockEntryForm } from '@/components/forms/stock-entry-form';

//todo backend integration
export default function Page() {
  const breadcrumbItems = [
    { title: 'Entradas de Estoque', link: '/dashboard/stock-entry' },
    { title: 'Cadastrar', link: '/dashboard/stock-entry/new' }
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <StockEntryForm initialData={null} key={null} />
    </div>
  );
}
