// config/permissions.ts

interface Role {
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
}

interface RolePermissions {
  [key: string]: string[];
}

const roles: { [key: string]: Role } = {
  admin: {
    create: true,
    edit: true,
    delete: true,
    view: true
  },
  waiter: {
    create: false,
    edit: false,
    delete: false,
    view: true
  },
  moderator: {
    create: false,
    edit: true,
    delete: true,
    view: true
  }
};

const rolePermissions = {
  admin: [
    'Inicio',
    'Tipo de Item',
    'Item',
    'Categoria de Pratos',
    'Pratos',
    'Cardápio',
    'Comandas',
    'Funcionários',
    'Gastos',
    'Entrada Estoque',
    'Kanban',
    'Campainha',
    'Logout'
  ],
  waiter: [
    'Inicio',
    'Item',
    'Categoria de Pratos',
    'Pratos',
    'Cardápio',
    'Comandas',
    'Logout'
  ],
  moderator: [
    'Inicio',
    'Item',
    'Categoria de Pratos',
    'Pratos',
    'Cardápio',
    'Comandas',
    'Funcionários',
    'Gastos',
    'Entrada Estoque',
    'Kanban',
    'Campainha',
    'Logout'
  ]
};

const getUserRole = () => {
  const storedRole = sessionStorage.getItem('role');
  return storedRole ? storedRole.replace(/"/g, '').toLowerCase() : 'waiter';
};

const permissions = {
  create: () => roles[getUserRole()]?.create,
  edit: () => roles[getUserRole()]?.edit,
  delete: () => roles[getUserRole()]?.delete,
  view: () => roles[getUserRole()]?.view
};

export { roles, rolePermissions, permissions };
