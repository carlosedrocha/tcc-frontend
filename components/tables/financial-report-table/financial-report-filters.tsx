import { Input } from '@/components/ui/input'; // Assuming you have a UI component for input
import { Select, SelectOption } from '@/components/ui/select'; // Assuming you have a Select component
import React, { useEffect, useState } from 'react';

// Enum values for dropdowns
const transactionCategories = [
  'FOOD',
  'SALARY',
  'STOCK',
  'BILLS',
  'MAINTENANCE',
  'OTHER'
];

const transactionStatuses = ['PENDING', 'PAID', 'CANCELED'];

const transactionTypes = ['SALE', 'EXPENSE', 'INCOME', 'PAYMENT'];

const FinancialReportFilters = ({
  onFilterChange
}: {
  onFilterChange: (filter: any) => void;
}) => {
  const [filter, setFilter] = useState({
    category: '',
    status: '',
    transactionType: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value
    }));
  };

  useEffect(() => {
    // Notify parent component whenever the filter changes
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  return (
    <form className="space-y-4">
      <div className="flex space-x-4">
        <Select
          name="category"
          value={filter.category}
          onChange={handleChange}
          label="Category"
        >
          {transactionCategories.map((category) => (
            <SelectOption key={category} value={category}>
              {category}
            </SelectOption>
          ))}
        </Select>

        <Select
          name="status"
          value={filter.status}
          onChange={handleChange}
          label="Status"
        >
          {transactionStatuses.map((status) => (
            <SelectOption key={status} value={status}>
              {status}
            </SelectOption>
          ))}
        </Select>

        <Select
          name="transactionType"
          value={filter.transactionType}
          onChange={handleChange}
          label="Transaction Type"
        >
          {transactionTypes.map((type) => (
            <SelectOption key={type} value={type}>
              {type}
            </SelectOption>
          ))}
        </Select>
      </div>

      <div className="flex space-x-4">
        <Input
          type="date"
          name="startDate"
          value={filter.startDate}
          onChange={handleChange}
          label="Start Date"
        />
        <Input
          type="date"
          name="endDate"
          value={filter.endDate}
          onChange={handleChange}
          label="End Date"
        />
      </div>
    </form>
  );
};

export default FinancialReportFilters;
