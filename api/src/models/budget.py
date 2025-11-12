from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class BudgetCreate(BaseModel):
    category: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    period: str = Field(default="monthly", pattern="^(monthly|weekly|yearly)$")
    start_date: Optional[str] = None

class BudgetUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = Field(default=None, gt=0)
    period: Optional[str] = Field(default=None, pattern="^(monthly|weekly|yearly)$")
    start_date: Optional[str] = None

class Budget(BaseModel):
    id: str
    category: str
    amount: float
    period: str
    start_date: str
    spent: float = 0.0
    remaining: float = 0.0
    percentage: float = 0.0
    created_time: Optional[str] = None

class SetBudgetRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500, description="Natural language budget instruction")

class BudgetParseResult(BaseModel):
    category: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    period: str = Field(default="monthly")
    confidence: float = Field(default=1.0, ge=0, le=1)
