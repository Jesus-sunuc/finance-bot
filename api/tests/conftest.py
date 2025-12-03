import pytest
from fastapi.testclient import TestClient
from src.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_expense_data():
    return {
        "amount": 50.0,
        "category": "Food",
        "merchant": "Restaurant",
        "date": "2025-12-01",
        "description": "Lunch"
    }


@pytest.fixture
def mock_budget_data():
    return {
        "category": "Food",
        "amount": 500.0,
        "period": "monthly",
        "start_date": "2025-12-01"
    }


@pytest.fixture
def mock_auth_header():
    return {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJuYW1lIjoiVGVzdCBVc2VyIn0.test"}
