import pytest
from unittest.mock import patch
from fastapi import status


@pytest.fixture
def mock_notion_service():
    with patch('src.router.budget_router.NotionService') as mock:
        yield mock.return_value


def test_get_all_budgets(client, mock_notion_service):
    mock_budgets = [
        {
            "id": "budget-1",
            "category": "Food",
            "amount": 500.0,
            "period": "monthly",
            "start_date": "2025-12-01",
            "spent": 150.0,
            "remaining": 350.0,
            "percentage": 30.0,
            "created_time": "2025-12-01T12:00:00Z"
        }
    ]
    mock_notion_service.get_all_budgets.return_value = mock_budgets
    
    response = client.get("/api/budgets")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1
    assert data[0]["category"] == "Food"


def test_get_budget_by_id(client, mock_notion_service):
    mock_budget = {
        "id": "budget-1",
        "category": "Food",
        "amount": 500.0,
        "period": "monthly",
        "start_date": "2025-12-01",
        "spent": 150.0,
        "remaining": 350.0,
        "percentage": 30.0,
        "created_time": "2025-12-01T12:00:00Z"
    }
    mock_notion_service.get_budget_by_id.return_value = mock_budget
    
    response = client.get("/api/budgets/budget-1")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == "budget-1"
    assert data["amount"] == 500.0


def test_create_budget(client, mock_notion_service, mock_budget_data):
    created_budget = {
        "id": "budget-new",
        **mock_budget_data,
        "spent": 0.0,
        "remaining": 500.0,
        "percentage": 0.0,
        "created_time": "2025-12-01T12:00:00Z"
    }
    mock_notion_service.create_budget.return_value = created_budget
    
    response = client.post("/api/budgets", json=mock_budget_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["category"] == "Food"
    assert data["amount"] == 500.0
