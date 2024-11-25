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

type Section = {
  id: string;
  name: string;
};

type SectionSelectProps = {
  sections: Section[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

export function SectionSelect({
  sections,
  value,
  onValueChange
}: SectionSelectProps) {
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const handleItemClick = (sectionId: string) => {
    const newValue = selectedValues.includes(sectionId)
      ? selectedValues.filter((id) => id !== sectionId)
      : [...selectedValues, sectionId];
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }

    const newNames = selectedValues.includes(sectionId)
      ? selectedNames.filter(
          (name) =>
            name !== sections.find((section) => section.id === sectionId)?.name
        )
      : [
          ...selectedNames,
          sections.find((section) => section.id === sectionId)?.name || ''
        ];

    setSelectedNames(newNames);
  };

  const selectedValues = useMemo(
    () => (value !== undefined ? value : internalValue),
    [value, internalValue]
  );

  return (
    <FormField
      name="sectionIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mr-4">Seções</FormLabel>
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
              {sections.map((section) => (
                <DropdownMenuCheckboxItem
                  key={section.id}
                  checked={selectedValues.includes(section.id)}
                  onCheckedChange={() => handleItemClick(section.id)}
                >
                  {section.name}
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
