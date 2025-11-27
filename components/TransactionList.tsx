
import React from 'react';
import { Bill, TransactionType } from '../types';
import { Icons, getCategoryIcon } from './Icons';

interface TransactionListProps {
  bills: Bill[];
  onDelete: (id: number) => void;
  onEdit: (bill: Bill) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ bills, onDelete, onEdit }) => {
  // Group by date
  const grouped = bills.reduce((acc, bill) => {
    // Format: "YYYY/M/D" to ensure correct sorting and grouping
    const date = new Date(bill.timestamp);
    const key = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(bill);
    return acc;
  }, {} as Record<string, Bill[]>);

  // Sort dates descending
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="pb-24">
      <h3 className="font-bold text-gray-700 mb-2 px-2">近期账单</h3>
      {sortedDates.map(dateKey => {
        // Calculate daily stats
        const dayBills = grouped[dateKey];
        const dayIncome = dayBills.filter(b => b.type === TransactionType.INCOME).reduce((sum, b) => sum + b.amount, 0);
        const dayExpense = dayBills.filter(b => b.type === TransactionType.EXPENSE).reduce((sum, b) => sum + b.amount, 0);
        
        const dateObj = new Date(dateKey);
        // Chinese Date Format: "3月15日 星期三"
        const displayDate = dateObj.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'short' });

        return (
          <div key={dateKey} className="mb-4">
            <div className="flex justify-between items-center px-2 mb-2 text-xs text-gray-500 font-medium bg-gray-100 py-1 rounded">
              <span>{displayDate}</span>
              <div className="flex gap-3">
                {dayIncome > 0 && <span className="text-income">+¥{dayIncome.toFixed(2)}</span>}
                {dayExpense > 0 && <span className="text-expense">-¥{dayExpense.toFixed(2)}</span>}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
              {dayBills.sort((a, b) => b.timestamp - a.timestamp).map(bill => {
                const CategoryIcon = getCategoryIcon(bill.category);
                const isIncome = bill.type === TransactionType.INCOME;

                return (
                  <div key={bill.id} className="p-3 flex items-center hover:bg-gray-50 transition-colors group relative">
                    <div className={`p-2 rounded-full mr-3 ${isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <CategoryIcon size={18} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{bill.category}</div>
                      {bill.remark && <div className="text-xs text-gray-400">{bill.remark}</div>}
                    </div>

                    <div className="text-right mr-2">
                      <div className={`font-bold ${isIncome ? 'text-income' : 'text-expense'}`}>
                        {isIncome ? '+' : '-'}¥{bill.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(bill.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Actions - visible on hover or touch */}
                    <div className="flex gap-1 ml-1">
                      <button 
                          onClick={() => onEdit(bill)}
                          className="p-2 text-gray-300 hover:text-primary transition-colors hover:bg-primaryContainer/20 rounded-full"
                          title="编辑"
                      >
                          <Icons.Edit size={16} />
                      </button>
                      <button 
                          onClick={() => onDelete(bill.id)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full"
                          title="删除"
                      >
                          <Icons.Delete size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {bills.length === 0 && (
          <div className="text-center py-10 text-gray-400">
              暂无账单，快去记一笔吧！
          </div>
      )}
    </div>
  );
};
