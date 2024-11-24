// components/TransactionChart.tsx
'use client';

import api from '@/app/api';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { Bar, BarChart } from 'recharts';
export async function fetchTransactions() {
  try {
    const response = await api.get('/transactions'); // Adjust this URL to your endpoint
    if (!response) {
      throw new Error('Error fetching transactions');
    }
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function transformTransactionData(transactions: any) {
  const chartData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleString('default', {
      month: 'long'
    });
    const category = transaction.category;
    if (!acc[month]) {
      acc[month] = { month };
    }
    acc[month][category] = (acc[month][category] || 0) + transaction.amount;
    return acc;
  }, {});

  return Object.values(chartData);
}

const chartConfig: ChartConfig = {
  FOOD: { label: 'Food', color: '#2563eb' },
  SALARY: { label: 'Salary', color: '#60a5fa' },
  STOCK: { label: 'Stock', color: '#34d399' },
  BILLS: { label: 'Bills', color: '#f87171' },
  MAINTENANCE: { label: 'Maintenance', color: '#fbbf24' },
  OTHER: { label: 'Other', color: '#a78bfa' }
};

export function TransactionChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const transactions = await fetchTransactions();
      const data = transformTransactionData(transactions);
      setChartData(data);
    }
    loadData();
  }, []);

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart data={chartData} accessibilityLayer>
        {Object.keys(chartConfig).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={chartConfig[key].color}
            radius={4}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
