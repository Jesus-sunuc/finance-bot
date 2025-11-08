export interface Expense {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  date: Date;
  description: string;
  createdTime: Date;
}

export interface ExpenseCreate {
  amount: number;
  category: string;
  merchant: string;
  date: string;
  description?: string;
}

export interface ExpenseUpdate {
  amount?: number;
  category?: string;
  merchant?: string;
  date?: string;
  description?: string;
}
