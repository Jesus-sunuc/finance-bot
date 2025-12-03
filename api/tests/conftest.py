import pytest
import os

# Set minimal environment variables for testing
os.environ.setdefault("NOTION_API_KEY", "test-notion-key")
os.environ.setdefault("NOTION_EXPENSES_DB_ID", "test-expenses-db")
os.environ.setdefault("NOTION_BUDGET_DB_ID", "test-budget-db")
os.environ.setdefault("DATABASE_URL", "postgresql://test:test@localhost:5432/test")
os.environ.setdefault("OPENAI_API_KEY", "test-openai-key")


@pytest.fixture
def sample_expense():
    """Sample expense data for testing"""
    return {
        "amount": 50.0,
        "category": "Food",
        "merchant": "Restaurant",
        "date": "2025-12-01",
        "description": "Lunch"
    }


@pytest.fixture
def sample_budget():
    """Sample budget data for testing"""
    return {
        "category": "Food",
        "amount": 500.0,
        "period": "monthly",
        "start_date": "2025-12-01"
    }
