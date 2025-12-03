"""Test Pydantic models for data validation"""
import pytest
from pydantic import ValidationError


def test_expense_create_valid(sample_expense):
    from src.models.expense import ExpenseCreate
    
    expense = ExpenseCreate(**sample_expense)
    assert expense.amount == sample_expense["amount"]
    assert expense.category == sample_expense["category"]


def test_expense_response_defaults():
    from src.models.expense import ExpenseResponse
    
    response = ExpenseResponse(
        id="test-123",
        created_time="2025-12-01T12:00:00Z"
    )
    
    assert response.id == "test-123"
    assert response.amount == 0.0
    assert response.category == "Uncategorized"
    assert response.merchant == "Unknown"


def test_budget_create_default_period(sample_budget):
    from src.models.budget import BudgetCreate
    
    budget_data = sample_budget.copy()
    del budget_data["period"]
    
    budget = BudgetCreate(**budget_data)
    assert budget.period == "monthly"


def test_budget_positive_amount():
    from src.models.budget import BudgetCreate
    
    with pytest.raises(ValidationError):
        BudgetCreate(
            category="Food",
            amount=-100.0,
            period="monthly"
        )


def test_expense_required_fields():
    from src.models.expense import ExpenseCreate
    
    with pytest.raises(ValidationError):
        ExpenseCreate(amount=50.0)  # Missing required fields
