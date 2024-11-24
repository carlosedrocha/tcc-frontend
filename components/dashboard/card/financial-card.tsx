import React from 'react';

interface FinancialCardProps {
  title: string;
  icon?: React.ReactNode;
  value: number;
  description?: string;
}

const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  icon,
  value,
  description
}) => {
  return (
    <>
      <main>
        <div className="rounded-md bg-white p-4 shadow-md">
          <h2>
            <span className="text-sm font-medium">{title}</span>
          </h2>
          {/* <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h2 className="text-sm font-medium">{title}</h2>
        {icon}
      </div> */}
          <div className="p-2">
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default FinancialCard;
