'use client';
import BreadCrumb from '@/components/breadcrumb';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import NewTaskDialog from '@/components/kanban/new-task-dialog';
import { Heading } from '@/components/ui/heading';
import { useEffect, useState } from 'react';
import api from '@/app/api';

const breadcrumbItems = [{ title: 'Kanban', link: '/dashboard/kanban' }];
export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getTabOrders = async () => {
      try {
        const response = await api.get('/kanban');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching Kanban data:', error);
      }
    };

    getTabOrders();
  }, []);
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Kanban`} description="Manage tasks by dnd" />
          <NewTaskDialog />
        </div>
        <KanbanBoard data={data} />
      </div>
    </>
  );
}
