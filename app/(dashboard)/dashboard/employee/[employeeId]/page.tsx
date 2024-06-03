'use client';
import BreadCrumb from '@/components/breadcrumb';
import { EmployeeForm } from '@/components/forms/employee-form';

//todo backend integration
export default function Page() {
  const breadcrumbItems = [
    { title: 'Funcionários', link: '/dashboard/item' },
    { title: 'Cadastrar', link: '/dashboard/item/new' }
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <EmployeeForm initialData={null} key={null} />
    </div>
  );
}
