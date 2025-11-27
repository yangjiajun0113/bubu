import React, { useState } from 'react';
import { Icons } from './Icons';

interface MonthPickerProps {
  currentDate: Date;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({ currentDate, onSelect, onClose }) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const selectedMonth = currentDate.getMonth();

  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月', 
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const handleMonthSelect = (index: number) => {
    onSelect(selectedYear, index);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header with Year Selector */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">选择月份</h3>
          <div className="flex items-center gap-4 bg-gray-50 rounded-full px-2 py-1">
            <button 
              onClick={() => setSelectedYear(y => y - 1)}
              className="p-2 text-gray-500 hover:text-primary active:scale-95"
            >
              <Icons.Back size={18} />
            </button>
            <span className="font-bold text-lg text-primary min-w-[3rem] text-center">{selectedYear}</span>
            <button 
              onClick={() => setSelectedYear(y => y + 1)}
              className="p-2 text-gray-500 hover:text-primary active:scale-95"
            >
              <Icons.Back size={18} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Months Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {months.map((m, idx) => {
            // Check if this is the currently selected month in the currently selected year
            const isSelected = idx === selectedMonth && selectedYear === currentDate.getFullYear();
            
            return (
              <button
                key={m}
                onClick={() => handleMonthSelect(idx)}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  isSelected 
                    ? 'bg-primary text-white shadow-lg scale-105' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-2 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl"
        >
          取消
        </button>
      </div>
    </div>
  );
};
