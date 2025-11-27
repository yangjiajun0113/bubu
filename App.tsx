
import React, { useEffect, useState } from 'react';
import { db } from './services/db';
import { Bill, ViewState, TransactionType } from './types';
import { SummaryCard } from './components/SummaryCard';
import { Charts } from './components/Charts';
import { TransactionList } from './components/TransactionList';
import { AddBillModal } from './components/AddBillModal';
import { MonthPicker } from './components/MonthPicker';
import { Icons } from './components/Icons';

function App() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Edit State
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load data on mount
  useEffect(() => {
    db.seedIfEmpty();
    refreshData();
  }, []);

  const refreshData = () => {
    setBills(db.getAllBills());
  };

  const handleSaveBill = (billData: Bill | Omit<Bill, 'id'>) => {
    if ('id' in billData) {
      // It's an update
      db.updateBill(billData as Bill);
    } else {
      // It's a new bill
      db.addBill(billData);
    }
    setEditingBill(null);
    refreshData();
  };

  const handleDeleteBill = (id: number) => {
    if (window.confirm('确认删除这条记录吗？')) {
        db.deleteBill(id);
        refreshData();
    }
  };
  
  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setViewState('add'); // Reusing 'add' view for editing
  };

  const handleCloseModal = () => {
    setViewState('dashboard');
    setEditingBill(null);
  };

  const handleMonthSelect = (year: number, month: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    newDate.setMonth(month);
    setCurrentDate(newDate);
  };
  
  const handleResetData = () => {
    if (window.confirm('警告：此操作将清空所有记账数据且无法恢复！确认要重置吗？')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Derived state for summary
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthlyBills = bills.filter(b => {
    const d = new Date(b.timestamp);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncome = monthlyBills
    .filter(b => b.type === TransactionType.INCOME)
    .reduce((sum, b) => sum + b.amount, 0);

  const totalExpense = monthlyBills
    .filter(b => b.type === TransactionType.EXPENSE)
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile Simulator Container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Main Dashboard Content */}
        {viewState === 'dashboard' && (
          <>
            {/* Header */}
            <div className="bg-primary px-6 pt-10 pb-16 rounded-b-[2rem] shadow-lg relative">
                <div className="flex justify-between items-start text-white mb-6">
                    <div>
                        <h1 className="text-xl font-bold mb-1 opacity-90">布布记账</h1>
                        
                        {/* Month Picker Trigger */}
                        <button 
                          onClick={() => setShowMonthPicker(true)}
                          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-lg transition-all active:scale-95"
                        >
                            <Icons.Calendar size={16} className="text-white" />
                            <span className="text-sm font-medium">
                              {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                            </span>
                            <Icons.ChevronDown size={14} className="text-white/70" />
                        </button>
                    </div>
                    
                    {/* Settings Button */}
                    <button 
                      onClick={() => setShowSettings(true)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <Icons.Settings size={20} className="text-white" />
                    </button>
                </div>
                
                {/* Summary Card - Positioned to overlap header */}
                <div className="-mb-24">
                    <SummaryCard income={totalIncome} expense={totalExpense} />
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pt-12 px-4 space-y-4">
                <Charts bills={bills} currentMonth={currentMonth} currentYear={currentYear} />
                <TransactionList 
                  bills={monthlyBills} 
                  onDelete={handleDeleteBill} 
                  onEdit={handleEditBill}
                />
            </div>

            {/* FAB */}
            <button 
                onClick={() => { setEditingBill(null); setViewState('add'); }}
                className="absolute bottom-6 right-6 bg-primary text-white p-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all z-10"
            >
                <Icons.Add size={28} />
            </button>
          </>
        )}

        {/* Add/Edit Modal */}
        {viewState === 'add' && (
            <AddBillModal 
                initialData={editingBill}
                onSave={handleSaveBill} 
                onClose={handleCloseModal} 
            />
        )}
        
        {/* Month Picker Modal */}
        {showMonthPicker && (
          <MonthPicker 
            currentDate={currentDate}
            onSelect={handleMonthSelect}
            onClose={() => setShowMonthPicker(false)}
          />
        )}

        {/* Settings / About Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white w-[85%] max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">关于应用</h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                  <Icons.Add size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="bg-primaryContainer/30 p-4 rounded-xl">
                  <h4 className="font-bold text-primary mb-1 flex items-center gap-2">
                    <Icons.Info size={16} /> 离线使用
                  </h4>
                  <p>本应用为 PWA，支持完全离线运行。数据存储在您的手机浏览器本地缓存中。</p>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <h4 className="font-bold text-expense mb-1 flex items-center gap-2">
                    <Icons.Delete size={16} /> 数据管理
                  </h4>
                  <p className="mb-3">如果清除浏览器缓存或卸载浏览器，数据将会丢失。</p>
                  <button 
                    onClick={handleResetData}
                    className="w-full bg-white border border-red-200 text-expense py-2 rounded-lg font-medium shadow-sm active:scale-95 transition-all"
                  >
                    重置/清空所有数据
                  </button>
                </div>
              </div>

              <div className="text-center text-xs text-gray-400">
                BuBu Ledger v1.0.2
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
