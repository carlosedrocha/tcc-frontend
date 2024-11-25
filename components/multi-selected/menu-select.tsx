import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Menu = {
  id: string;
  name: string;
};

type MenuSelectProps = {
  menus: Menu[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

export function MenuSelect({ menus, value, onValueChange }: MenuSelectProps) {
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para o termo de busca

  const handleItemClick = (menuId: string) => {
    const newValue = selectedValues.includes(menuId)
      ? selectedValues.filter((id) => id !== menuId)
      : [...selectedValues, menuId];

    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }

    const newNames = selectedValues.includes(menuId)
      ? selectedNames.filter(
          (name) => name !== menus.find((menu) => menu.id === menuId)?.name
        )
      : [
          ...selectedNames,
          menus.find((menu) => menu.id === menuId)?.name || ''
        ];

    setSelectedNames(newNames);
  };

  const selectedValues = useMemo(
    () => (value !== undefined ? value : internalValue),
    [value, internalValue]
  );

  // Filtra os menus com base no termo de busca
  const filteredMenus = useMemo(() => {
    return menus.filter((menu) =>
      menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, menus]);

  return (
    <FormField
      name="menuIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mr-4">Menus</FormLabel>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between">
                {selectedNames.length > 0
                  ? selectedNames.join(', ')
                  : 'Selecione'}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              {/* Campo de busca */}
              <div className="p-2">
                <Input
                  placeholder="Buscar menus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Lista de menus filtrados */}
              {filteredMenus.map((menu) => (
                <DropdownMenuCheckboxItem
                  key={menu.id}
                  checked={selectedValues.includes(menu.id)}
                  onCheckedChange={() => handleItemClick(menu.id)}
                >
                  {menu.name}
                </DropdownMenuCheckboxItem>
              ))}

              {/* Mensagem caso nenhum menu seja encontrado */}
              {filteredMenus.length === 0 && (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Nenhum menu encontrado.
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
