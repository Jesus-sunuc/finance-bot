def test_expense_validation():
    from src.models.expense import ExpenseCreate
    
    expense = ExpenseCreate(
        amount=50.0,
        category="Food",
        merchant="Restaurant",
        date="2025-12-01",
        description="Lunch"
    )
    
    assert expense.amount == 50.0
    assert expense.category == "Food"
    assert expense.merchant == "Restaurant"


def test_expense_validation_positive_amount():
    from src.models.expense import ExpenseCreate
    from pydantic import ValidationError
    import pytest
    
    with pytest.raises(ValidationError):
        ExpenseCreate(
            amount=-10.0,
            category="Food",
            merchant="Store",
            date="2025-12-01"
        )


def test_budget_validation():
    from src.models.budget import BudgetCreate
    
    budget = BudgetCreate(
        category="Food",
        amount=500.0,
        period="monthly"
    )
    
    assert budget.category == "Food"
    assert budget.amount == 500.0
    assert budget.period == "monthly"


def test_budget_period_validation():
    from src.models.budget import BudgetCreate
    from pydantic import ValidationError
    import pytest
    
    with pytest.raises(ValidationError):
        BudgetCreate(
            category="Food",
            amount=500.0,
            period="invalid_period"
        )


def test_expense_update_optional_fields():
    from src.models.expense import ExpenseUpdate
    
    update = ExpenseUpdate(amount=100.0)
    assert update.amount == 100.0
    assert update.category is None
    
    update2 = ExpenseUpdate(category="Entertainment", merchant="Cinema")
    assert update2.category == "Entertainment"
    assert update2.merchant == "Cinema"
    assert update2.amount is None
