from enum import Enum
from typing import Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime

class AgentState(str, Enum):
    PLANNING = "planning"
    ACTING = "acting"
    OBSERVING = "observing"
    COMPLETED = "completed"

class ActionType(str, Enum):
    ADD_EXPENSE = "add_expense"
    DELETE_TRANSACTION = "delete_transaction"
    GENERATE_REPORT = "generate_report"
    GET_BUDGET = "get_budget"
    GET_EXPENSES = "get_expenses"
    GENERAL_RESPONSE = "general_response"
    ERROR = "error"

class ExpenseParseResult(BaseModel):
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    merchant: str = Field(..., min_length=1)
    date: Optional[str] = None
    description: Optional[str] = ""
    confidence: float = Field(default=1.0, ge=0, le=1)

class AgentDecision(BaseModel):
    user_message: str = Field(..., min_length=1)
    agent_state: AgentState
    llm_reasoning: Optional[str] = None
    action_taken: ActionType
    result: Optional[Dict[str, Any]] = None

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str = Field(..., min_length=1)
    timestamp: Optional[datetime] = None
    reasoning: Optional[str] = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)

class ChatResponse(BaseModel):
    message: str
    reasoning: Optional[str] = None
    action_taken: ActionType
    state: AgentState
    data: Optional[Dict[str, Any]] = None

class AddExpenseRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)

class DeleteTransactionRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Description of transaction to delete")

class GenerateReportRequest(BaseModel):
    report_type: str = Field(default="monthly", pattern="^(monthly|category|trends)$")
    start_date: Optional[str] = None
    end_date: Optional[str] = None
