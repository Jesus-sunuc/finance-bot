import pytest
from unittest.mock import patch, MagicMock
from fastapi import status


@pytest.fixture
def mock_notion_service():
    with patch('src.router.expenses_router.NotionService') as mock:
        yield mock.return_value


def test_get_all_expenses(client, mock_notion_service):
    mock_expenses = [
        {
            "id": "exp-1",
            "amount": 50.0,
            "category": "Food",
            "merchant": "Restaurant",
            "date": "2025-12-01",
            "description": "Lunch",
            "created_time": "2025-12-01T12:00:00Z"
        }
    ]
    mock_notion_service.get_all_expenses.return_value = mock_expenses
    
    response = client.get("/api/expenses")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "exp-1"
    assert data[0]["amount"] == 50.0


def test_get_expense_by_id(client, mock_notion_service):
    mock_expense = {
        "id": "exp-1",
        "amount": 50.0,
        "category": "Food",
        "merchant": "Restaurant",
        "date": "2025-12-01",
        "description": "Lunch",
        "created_time": "2025-12-01T12:00:00Z"
    }
    mock_notion_service.get_expense_by_id.return_value = mock_expense
    
    response = client.get("/api/expenses/exp-1")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == "exp-1"
    assert data["merchant"] == "Restaurant"


def test_get_expense_not_found(client, mock_notion_service):
    mock_notion_service.get_expense_by_id.return_value = None
    
    response = client.get("/api/expenses/non-existent")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_create_expense(client, mock_notion_service, mock_expense_data):
    created_expense = {
        "id": "exp-new",
        **mock_expense_data,
        "created_time": "2025-12-01T12:00:00Z"
    }
    mock_notion_service.create_expense.return_value = created_expense
    
    response = client.post("/api/expenses", json=mock_expense_data)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["id"] == "exp-new"
    assert data["amount"] == mock_expense_data["amount"]


def test_delete_expense(client, mock_notion_service):
    mock_notion_service.delete_expense.return_value = True
    
    response = client.delete("/api/expenses/exp-1")
    
    assert response.status_code == status.HTTP_204_NO_CONTENT
