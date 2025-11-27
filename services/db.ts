
import { Bill, TransactionType } from '../types';

const STORAGE_KEY = 'bubu_ledger_data_v1';

export const db = {
  getAllBills: (): Bill[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load data", e);
      return [];
    }
  },

  addBill: (bill: Omit<Bill, 'id'>): Bill => {
    const bills = db.getAllBills();
    const newBill: Bill = {
      ...bill,
      id: Date.now(), // Simple ID generation based on timestamp
    };
    const updatedBills = [...bills, newBill];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBills));
    return newBill;
  },

  deleteBill: (id: number): void => {
    const bills = db.getAllBills();
    const updatedBills = bills.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBills));
  },

  updateBill: (bill: Bill): void => {
    const bills = db.getAllBills();
    const index = bills.findIndex(b => b.id === bill.id);
    if (index !== -1) {
      bills[index] = bill;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
    }
  },
  
  // Helper for generating seed data if empty
  seedIfEmpty: () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const now = Date.now();
      const day = 86400000;
      const seedData: Bill[] = [
        { id: 1, type: TransactionType.EXPENSE, amount: 25.50, category: '餐饮', remark: '午餐', timestamp: now },
        { id: 2, type: TransactionType.EXPENSE, amount: 12.00, category: '交通', remark: '打车', timestamp: now - day },
        { id: 3, type: TransactionType.INCOME, amount: 5000, category: '工资', remark: '三月工资', timestamp: now - (day * 2) },
        { id: 4, type: TransactionType.EXPENSE, amount: 120, category: '购物', remark: '超市采购', timestamp: now - (day * 3) },
        { id: 5, type: TransactionType.EXPENSE, amount: 45, category: '餐饮', remark: '晚餐', timestamp: now - (day * 4) },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    }
  }
};
