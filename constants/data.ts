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
    label: 'home'
  },
  {
    title: 'Tipo de Item',
    href: '/dashboard/item-type',
    icon: 'clipboardList',
    label: 'clipboardList'
  },
  {
    title: 'Item',
    href: '/dashboard/item',
    icon: 'beef',
    label: 'beef'
  },
  {
    title: 'Categoria de Pratos',
    href: '/dashboard/category-dish',
    icon: 'scrollText',
    label: 'scrollText'
  },
  {
    title: 'Pratos',
    href: '/dashboard/dish',
    icon: 'utensils',
    label: 'utensils'
  },
  {
    title: 'Cardápio',
    href: '/dashboard/menu',
    icon: 'menu',
    label: 'sandwich'
  },
  {
    title: 'Comandas',
    href: '/dashboard/tabs',
    icon: 'tab',
    label: 'tab'
  },
  {
    title: 'Funcionários',
    href: '/dashboard/employee',
    icon: 'employee',
    label: 'employee'
  },
  {
    title: 'Gastos',
    href: '/dashboard/expense',
    icon: 'employee',
    label: 'employee'
  },
  {
    title: 'Entrada Estoque',
    href: '/dashboard/stock',
    icon: 'sandwich',
    label: 'sandwich'
  },
  // {
  //   title: 'Mudar o',
  //   href: '/dashboard/profile',
  //   icon: 'profile',
  //   label: 'profile'
  // },
  {
    title: 'Kanban',
    href: '/dashboard/kanban',
    icon: 'kanban',
    label: 'kanban'
  },
  {
    title: 'Campainha',
    href: '/dashboard/waiter-bell',
    icon: 'conciergeBell',
    label: 'bell'
  },
  {
    title: 'Logout',
    href: '/',
    icon: 'logout',
    label: 'logout'
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
