
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Utensils, 
  Bus, 
  ShoppingBag, 
  Home, 
  Gamepad2, 
  HeartPulse, 
  GraduationCap, 
  Wallet, 
  DollarSign,
  MoreHorizontal,
  ArrowLeft,
  PieChart,
  LineChart,
  Calendar,
  Edit2,
  ChevronDown,
  Settings,
  Info
} from 'lucide-react';

export const Icons = {
  Add: Plus,
  Delete: Trash2,
  Income: TrendingUp,
  Expense: TrendingDown,
  Back: ArrowLeft,
  Pie: PieChart,
  Line: LineChart,
  Calendar: Calendar,
  Edit: Edit2,
  ChevronDown: ChevronDown,
  Settings: Settings,
  Info: Info,
  // Categories (Chinese keys)
  '餐饮': Utensils,
  '交通': Bus,
  '购物': ShoppingBag,
  '居住': Home,
  '娱乐': Gamepad2,
  '医疗': HeartPulse,
  '教育': GraduationCap,
  '其他': MoreHorizontal,
  '工资': Wallet,
  '奖金': DollarSign,
  '理财': TrendingUp,
  '红包': HeartPulse,
};

export const getCategoryIcon = (category: string) => {
  const map: Record<string, any> = Icons;
  return map[category] || Icons['其他'];
};
