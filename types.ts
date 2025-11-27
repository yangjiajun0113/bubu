
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Bill {
  id: number;
  type: TransactionType;
  amount: number;
  category: string;
  remark?: string;
  timestamp: number;
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
  bills: Bill[];
}

export const INCOME_CATEGORIES = ['工资', '奖金', '理财', '红包', '其他'];
export const EXPENSE_CATEGORIES = ['餐饮', '交通', '购物', '居住', '娱乐', '医疗', '教育', '其他'];

export type ViewState = 'dashboard' | 'add' | 'edit';
