'use client';
import BreadCrumb from '@/components/breadcrumb';
import { ExpenseForm } from '@/components/forms/expense-form';

// Todo: backend integration
export default function Page() {
  const breadcrumbItems = [
    { title: 'Gastos', link: '/dashboard/expense' },
    { title: 'Cadastrar', link: '/dashboard/expense/new' }
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <ExpenseForm initialData={null} key={null} />
    </div>
  );
}
