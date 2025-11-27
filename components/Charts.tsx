import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { Bill, TransactionType } from '../types';
import { Icons } from './Icons';

interface ChartsProps {
  bills: Bill[];
  currentMonth: number; // 0-11
  currentYear: number;
}

const COLORS = ['#6750A4', '#B3261E', '#EFB8C8', '#625B71', '#7D5260', '#CCC2DC', '#F2B8B5', '#21005D'];

type TimeDimension = 'month' | 'year';

export const Charts: React.FC<ChartsProps> = ({ bills, currentMonth, currentYear }) => {
  const [chartType, setChartType] = useState<'pie' | 'line'>('pie');
  const [timeDimension, setTimeDimension] = useState<TimeDimension>('month');
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);

  // 1. Filter bills based on Dimension (Month vs Year) and Type (Income vs Expense)
  const filteredBills = bills.filter(b => {
    const d = new Date(b.timestamp);
    const matchesYear = d.getFullYear() === currentYear;
    const matchesMonth = timeDimension === 'month' ? d.getMonth() === currentMonth : true;
    const matchesType = b.type === transactionType;
    return matchesYear && matchesMonth && matchesType;
  });

  // 2. Prepare Pie Data (Categories)
  const pieDataMap = filteredBills.reduce((acc, bill) => {
    if (!acc[bill.category]) {
      acc[bill.category] = { name: bill.category, value: 0 };
    }
    acc[bill.category].value += bill.amount;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);
  
  const pieData = Object.values(pieDataMap) as { name: string; value: number }[];

  // 3. Prepare Line Data (Trend)
  let lineData: { label: string; amount: number }[] = [];

  if (timeDimension === 'month') {
    // Show daily trend for the specific month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    lineData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dailySum = filteredBills
        .filter(b => new Date(b.timestamp).getDate() === day)
        .reduce((sum, b) => sum + b.amount, 0);
      return { label: `${day}日`, amount: dailySum };
    });
  } else {
    // Show monthly trend for the year
    lineData = Array.from({ length: 12 }, (_, i) => {
      const monthIndex = i;
      const monthlySum = filteredBills
        .filter(b => new Date(b.timestamp).getMonth() === monthIndex)
        .reduce((sum, b) => sum + b.amount, 0);
      return { label: `${monthIndex + 1}月`, amount: monthlySum };
    });
  }

  const isIncome = transactionType === TransactionType.INCOME;
  const chartColor = isIncome ? '#10B981' : '#EF4444'; // Green for income, Red for expense

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
      {/* Chart Controls */}
      <div className="flex flex-col gap-3 mb-4">
        
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-700">统计分析</h3>
            <div className="flex bg-surfaceVariant rounded-lg p-1">
                <button 
                    onClick={() => setChartType('pie')}
                    className={`p-2 rounded-md transition-all ${chartType === 'pie' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                    <Icons.Pie size={18} />
                </button>
                <button 
                    onClick={() => setChartType('line')}
                    className={`p-2 rounded-md transition-all ${chartType === 'line' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                    <Icons.Line size={18} />
                </button>
            </div>
        </div>

        {/* Filters Row */}
        <div className="flex justify-between text-xs">
           <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => setTransactionType(TransactionType.EXPENSE)}
                className={`px-3 py-1 rounded-md transition-all ${transactionType === TransactionType.EXPENSE ? 'bg-white text-expense shadow-sm font-medium' : 'text-gray-500'}`}
              >
                支出
              </button>
              <button
                onClick={() => setTransactionType(TransactionType.INCOME)}
                className={`px-3 py-1 rounded-md transition-all ${transactionType === TransactionType.INCOME ? 'bg-white text-income shadow-sm font-medium' : 'text-gray-500'}`}
              >
                收入
              </button>
           </div>

           <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => setTimeDimension('month')}
                className={`px-3 py-1 rounded-md transition-all ${timeDimension === 'month' ? 'bg-white text-primary shadow-sm font-medium' : 'text-gray-500'}`}
              >
                按月
              </button>
              <button
                onClick={() => setTimeDimension('year')}
                className={`px-3 py-1 rounded-md transition-all ${timeDimension === 'year' ? 'bg-white text-primary shadow-sm font-medium' : 'text-gray-500'}`}
              >
                按年
              </button>
           </div>
        </div>
      </div>

      <div className="h-64 w-full">
        {chartType === 'pie' ? (
          pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `¥${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">暂无数据</div>
          )
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="label" tick={{fontSize: 10}} tickLine={false} axisLine={false} interval={timeDimension === 'month' ? 4 : 0} />
              <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value: number) => `¥${value.toFixed(2)}`} />
              <Area type="monotone" dataKey="amount" stroke={chartColor} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Legend for Pie Chart */}
      {chartType === 'pie' && pieData.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-xs text-gray-600">
                      <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      {entry.name}
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};