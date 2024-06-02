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

type Dishes = {
  id: string;
  name: string;
};

type DishesSelectSelectProps = {
  dishes: Dishes[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

export function DishesSelect({ dishes, value, onValueChange }: DishesSelectSelectProps) {
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
          <FormLabel>Pratos</FormLabel>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between">
                Selecione
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              {dishes.map((dish) => (
                <DropdownMenuCheckboxItem
                  key={dish.id}
                  checked={selectedValues.includes(dish.id)}
                  onCheckedChange={() => handleItemClick(dish.id)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {dish.name}
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