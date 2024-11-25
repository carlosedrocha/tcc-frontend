import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];
export type Item = {
  id: string;
  name: string;
  description: string;
  measurementUnit: string;
  measurementUnitValue: number;
  cost: number;
  typeId: string;
  typeName: string;
};

export type CategoryDish = {
  id: string;
  name: string;
};

export interface ISection {
  id: string; // ID único para a seção
  name: string; // Nome da seção, obrigatório
  menuIds?: string[]; // IDs dos menus associados, opcional
  dishIds?: string[]; // IDs dos pratos associados, opcional
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
  deletedAt?: Date; // Data de exclusão (caso a seção tenha sido deletada)
}

export interface IDish {
  id: string;
  name: string;
  description: string;
  price: number;
  photoUrl: null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  dishIngredients: IDishIngredient[];
  categories: ICategory[];
}

export interface ICategory {
  id: string;
  name: string;
  description: null;
  observation: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface IDishIngredient {
  id: string;
  quantity: number;
  item: Item;
}

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

//Utilizar em regex de inputs para aceitar somente numero
export const numericPattern = /^[0-9]+([,.][0-9]+)?$/;

export const navItems: NavItem[] = [
  {
    title: 'Inicio',
    href: '/dashboard',
    icon: 'home',
    label: 'home',
    permission: '' // Sem necessidade de permissão específica
  },
  {
    title: 'Tipo de Item',
    href: '/dashboard/item-type',
    icon: 'clipboardList',
    label: 'clipboardList',
    permission: 'itemType:read'
  },
  {
    title: 'Item',
    href: '/dashboard/item',
    icon: 'beef',
    label: 'beef',
    permission: 'item:read'
  },
  {
    title: 'Categoria de Pratos',
    href: '/dashboard/category-dish',
    icon: 'scrollText',
    label: 'scrollText',
    permission: 'category:read'
  },
  {
    title: 'Pratos',
    href: '/dashboard/dish',
    icon: 'utensils',
    label: 'utensils',
    permission: 'dish:read'
  },
  {
    title: 'Seção',
    href: '/dashboard/section',
    icon: 'menu',
    label: 'sandwich'
  },

  {
    title: 'Cardápio',
    href: '/dashboard/menu',
    icon: 'menu',
    label: 'sandwich',
    permission: 'menu:read'
  },
  {
    title: 'Comandas',
    href: '/dashboard/tabs',
    icon: 'tab',
    label: 'tab',
    permission: 'tab:read'
  },
  {
    title: 'Funcionários',
    href: '/dashboard/employee',
    icon: 'employee',
    label: 'employee',
    permission: 'employee:read'
  },
  {
    title: 'Estoque',
    href: '/dashboard/stock',
    icon: 'sandwich',
    label: 'sandwich',
    permission: 'stock:read' // Sem uma permissão correspondente no retorno
  },
  {
    title: 'Kanban',
    href: '/dashboard/kanban',
    icon: 'kanban',
    label: 'kanban',
    permission: 'kanban:read' // Sem uma permissão correspondente no retorno
  },
  {
    title: 'Campainha',
    href: '/dashboard/waiter-bell',
    icon: 'conciergeBell',
    label: 'bell',
    permission: 'waiter-bell:read' // Sem uma permissão correspondente no retorno
  },
  {
    title: 'Financeiro - Relatório',
    href: '/dashboard/financial/report',
    icon: 'conciergeBell',
    label: 'bell',
    permission: 'financial-report:read' // Sem uma permissão correspondente no retorno
  },
  {
    title: 'Financeiro - Dashboard',
    href: '/dashboard/financial/dashboard',
    icon: 'conciergeBell',
    label: 'bell',
    permission: 'financial-dashboard:read' // Sem uma permissão correspondente no retorno
  },
  {
    title: 'Spotify',
    href: '/dashboard/queue-spotify',
    icon: 'song',
    label: 'song',
    permission: 'spotify:read'
  },
  {
    title: 'Logout',
    href: '/',
    icon: 'logout',
    label: 'logout',
    permission: '' // Sem necessidade de permissão específica
  }
];

export type ItemTypeT = {
  name: string;
};

export const itemTypes: ItemTypeT[] = [
  {
    name: 'tipo de item 1'
  },
  {
    name: 'tipo de item 2'
  }
];
