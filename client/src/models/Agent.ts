export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  reasoning?: string;
}

export interface ChatResponse {
  message: string;
  reasoning?: string;
  actionTaken: ActionType;
  state: AgentState;
  data?: {
    needsConfirmation?: boolean;
    transactionToDelete?: {
      id: string;
      amount: number;
      merchant: string;
      category?: string;
      date?: string;
    };
    budget?: unknown;
    navigate_to?: string;
    [key: string]: unknown;
  };
}

export interface ChatRequest {
  message: string;
}

export interface AddExpenseRequest {
  text: string;
}

export interface DeleteTransactionRequest {
  query: string;
  confirmed?: boolean;
  transaction_id?: string;
}

export interface GenerateReportRequest {
  report_type?: "monthly" | "category" | "trends";
  start_date?: string;
  end_date?: string;
}

export type AgentState = "planning" | "acting" | "observing" | "completed";

export type ActionType =
  | "add_expense"
  | "delete_transaction"
  | "generate_report"
  | "set_budget"
  | "get_budget"
  | "get_expenses"
  | "general_response"
  | "error";

export interface ExpenseParseResult {
  amount: number;
  category: string;
  merchant: string;
  date?: string;
  description?: string;
  confidence: number;
}
