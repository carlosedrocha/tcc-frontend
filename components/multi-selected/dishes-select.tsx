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

type Dishes = {
  id: string;
  name: string;
};

type DishesSelectProps = {
  dishes: Dishes[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

export function DishesSelect({
  dishes,
  value,
  onValueChange
}: DishesSelectProps) {
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const handleItemClick = (dishId: string) => {
    const newValue = selectedValues.includes(dishId)
      ? selectedValues.filter((id) => id !== dishId)
      : [...selectedValues, dishId];
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }

    const newNames = selectedValues.includes(dishId)
      ? selectedNames.filter(
          (name) => name !== dishes.find((dish) => dish.id === dishId)?.name
        )
      : [
          ...selectedNames,
          dishes.find((dish) => dish.id === dishId)?.name || ''
        ];

    setSelectedNames(newNames);
  };

  const selectedValues = useMemo(
    () => (value !== undefined ? value : internalValue),
    [value, internalValue]
  );

  return (
    <FormField
      name="dishesIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mr-4">Pratos</FormLabel>
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
              {dishes.map((dish) => (
                <DropdownMenuCheckboxItem
                  key={dish.id}
                  checked={selectedValues.includes(dish.id)}
                  onCheckedChange={() => handleItemClick(dish.id)}
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
