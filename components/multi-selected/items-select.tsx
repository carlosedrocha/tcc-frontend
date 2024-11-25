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

type ItemsSelectProps = {
  items: Item[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

export function ItemsSelect({ items, value, onValueChange }: ItemsSelectProps) {
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const handleItemClick = (itemId: string) => {
    const newValue = selectedValues.includes(itemId)
      ? selectedValues.filter((id) => id !== itemId)
      : [...selectedValues, itemId];

    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }

    const newNames = selectedValues.includes(itemId)
      ? selectedNames.filter(
          (name) => name !== items.find((item) => item.id === itemId)?.name
        )
      : [
          ...selectedNames,
          items.find((item) => item.id === itemId)?.name || ''
        ];

    setSelectedNames(newNames);
  };

  const selectedValues = useMemo(
    () => (value !== undefined ? value : internalValue),
    [value, internalValue]
  );

  return (
    <FormField
      name="itemsIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mr-4">Itens</FormLabel>
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
              {items.map((item) => (
                <DropdownMenuCheckboxItem
                  key={item.id}
                  checked={selectedValues.includes(item.id)}
                  onCheckedChange={() => handleItemClick(item.id)}
                >
                  {item.name}
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
