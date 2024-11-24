'use client';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

export function BalanceChart({ chartData }: { chartData: ChartData[] }) {
  const chartConfig = {
    expense: {
      label: 'Despesa',
      color: '#2563eb'
    },
    income: {
      label: 'Receita',
      color: '#60a5fa'
    }
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            new Date(0, new Date(`${value} 1, 2024`).getMonth())
              .toLocaleString('pt-BR', { month: 'long' })
              .toUpperCase()
          }
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="income" fill={chartConfig.income.color} radius={4} />
        <Bar dataKey="expense" fill={chartConfig.expense.color} radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
