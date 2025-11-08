from typing import Optional
from pydantic import BaseModel, Field, field_validator


class ExpenseBase(BaseModel):
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    merchant: str = Field(..., min_length=1)
    date: str
    description: Optional[str] = ""


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1)
    merchant: Optional[str] = Field(None, min_length=1)
    date: Optional[str] = None
    description: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: str
    amount: float = 0.0
    category: str = "Uncategorized"
    merchant: str = "Unknown"
    date: str = ""
    description: str = ""
    created_time: str

    @field_validator('category', mode='before')
    @classmethod
    def validate_category(cls, v):
        return v if v else "Uncategorized"

    @field_validator('merchant', mode='before')
    @classmethod
    def validate_merchant(cls, v):
        return v if v else "Unknown"

    class Config:
        from_attributes = True
