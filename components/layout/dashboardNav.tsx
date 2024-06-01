import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
type NavItemProps = {
  item: NavItem;
};

function NavItemComponent({ item }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={handleToggle} className="cursor-pointer flex items-center justify-between">
        <span>{item.title}</span>
        {item.children && (
          <span>{isOpen ? '-' : '+'}</span>
        )}
      </div>
      {isOpen && item.children && (
        <div className="ml-4">
          {item.children.map((child, index) => (
            <div key={index} className="py-1">
              <a href={child.href} className="flex items-center">
                <span>{child.title}</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type DashboardNavProps = {
  items: NavItem[];
};

export function DashboardNav({ items }: DashboardNavProps) {
  return (
    <div>
      {items.map((item, index) => (
        <NavItemComponent key={index} item={item} />
      ))}
    </div>
  );
}
