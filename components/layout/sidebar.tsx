'use client';
import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { permissions, rolePermissions } from '../../rabc/permission';

type SidebarProps = {
  className?: string;
};

const getUserRole = () => {
  const storedRole = sessionStorage.getItem('role');
  return storedRole ? storedRole.replace(/"/g, '').toLowerCase() : 'waiter';
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const user = getUserRole();

  console.log('estou aqui', user);

  const canCreate = permissions.create();
  const canEdit = permissions.edit();
  const canDelete = permissions.delete();
  const canView = permissions.view();

  console.log(`Role: ${user}`);
  console.log(`Permissões: `);
  console.log(`  - Criar: ${canCreate}`);
  console.log(`  - Editar: ${canEdit}`);
  console.log(`  - Deletar: ${canDelete}`);
  console.log(`  - Visualizar: ${canView}`);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  const filteredNavItems = getFilteredNavItems(user);

  return (
    <nav
      className={cn(
        `relative hidden h-screen border-r pt-20 md:block`,
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          !isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={filteredNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}

const getFilteredNavItems = (user: string) => {
  return navItems.filter(
    (item) =>
      permissions.view() ||
      (rolePermissions as any)[user].includes(item.label) ||
      item.label === 'Inicio' ||
      item.label === 'Logout'
  );
};
