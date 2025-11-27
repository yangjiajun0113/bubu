
import React from 'react';
import { Icons } from './Icons';

interface SummaryCardProps {
  income: number;
  expense: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ income, expense }) => {
  const balance = income - expense;

  return (
    <div className="bg-primaryContainer text-onPrimaryContainer rounded-2xl p-6 mb-4 shadow-sm">
      <div className="text-sm opacity-80 mb-1">当前结余</div>
      <div className="text-3xl font-bold mb-6">¥{balance.toFixed(2)}</div>
      
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-sm opacity-70 mb-1">
            <div className="bg-white/50 p-1 rounded-full">
              <Icons.Income size={14} className="text-income" />
            </div>
            <span>收入</span>
          </div>
          <span className="text-lg font-semibold">¥{income.toFixed(2)}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-sm opacity-70 mb-1">
            <span>支出</span>
            <div className="bg-white/50 p-1 rounded-full">
              <Icons.Expense size={14} className="text-expense" />
            </div>
          </div>
          <span className="text-lg font-semibold">¥{expense.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
