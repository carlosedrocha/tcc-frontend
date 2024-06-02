import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Select from 'react-select';

type Category = {
  id: string;
  name: string;
};

type CategorySelectProps = {
  categories: Category[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

export function CategorySelect({ categories, value, onValueChange }: CategorySelectProps) {
  const [internalValue, setInternalValue] = useState<string[]>([]);

  const handleItemClick = (categoryId: string) => {
    const newValue = selectedValues.includes(categoryId)
      ? selectedValues.filter((id) => id !== categoryId)
      : [...selectedValues, categoryId];
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const selectedValues = useMemo(() => (value !== undefined ? value : internalValue), [value, internalValue]);

  return (
    <FormField
      name="categoriesIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categorias</FormLabel>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between">
                Selecione
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={selectedValues.includes(category.id)}
                  onCheckedChange={() => handleItemClick(category.id)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
