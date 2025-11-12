export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  reasoning?: string;
}

export interface ChatResponse {
  message: string;
  reasoning?: string;
  action_taken: ActionType;
  state: AgentState;
  data?: Record<string, unknown>;
}

export interface ChatRequest {
  message: string;
}

export interface AddExpenseRequest {
  text: string;
}

export type AgentState = "planning" | "acting" | "observing" | "completed";

export type ActionType =
  | "add_expense"
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
