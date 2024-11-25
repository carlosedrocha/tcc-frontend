'use client';

import api from '@/app/api';
import { BalanceChart } from '@/components/dashboard/balance-chart/balance-chart';
import FinancialCard from '@/components/dashboard/card/financial-card';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

// Interface para definir a estrutura dos dados dos cards
interface CardData {
  title: string;
  description: string;
  value: number;
  icon: string;
}

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

export default function Page() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);

  const mock = [
    {
      month: 'June',
      income: 4500,
      expense: 1200
    },
    {
      month: 'July',
      income: 5300,
      expense: 1500
    },
    {
      month: 'August',
      income: 4800,
      expense: 1100
    },
    {
      month: 'September',
      income: 5100,
      expense: 1600
    },
    {
      month: 'October',
      income: 3200,
      expense: 900
    },
    {
      month: 'November',
      income: 3300,
      expense: 1500
    }
  ];

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data } = await api.get('/dashboard/main-data');
        setChartData(data.chartData); // Define os dados do gráfico
        setCards(Object.values(data.cards)); // Transforma o objeto dos cards em uma array para mapeamento
      } catch (error) {
        console.error('Erro ao buscar os dados do dashboard:', error);
        // Caso ocorra erro, podemos usar o mock como fallback
        setChartData(mock);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="h-screen p-2 ">
        <div className="bg-gray-100">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {cards.map((card, index) => (
                <FinancialCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  value={card.value}
                  icon={card.icon}
                />
              ))}
            </div>
          </main>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
              <Card x-chunk="dashboard-01-chunk-0" className="p-4">
                {/* <div className="p-4"> */}
                <CardTitle> Overview </CardTitle>
                <CardContent>
                  <BalanceChart chartData={chartData} />
                </CardContent>
                {/* </div> */}
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
