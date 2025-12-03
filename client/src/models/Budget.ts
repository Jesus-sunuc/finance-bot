export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  spent: number;
  remaining: number;
  percentage: number;
  startDate: string;
  createdTime: string;
}

export interface BudgetCreate {
  category: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  startDate?: string;
}

export interface BudgetUpdate {
  category?: string;
  amount?: number;
  period?: "monthly" | "weekly" | "yearly";
  startDate?: string;
}

export interface SetBudgetRequest {
  text: string;
}

export interface SetBudgetResponse {
  success: boolean;
  message: string;
  budget?: Budget;
  action?: "created" | "updated";
}
