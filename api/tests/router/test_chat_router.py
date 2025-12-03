import pytest
from unittest.mock import patch
from fastapi import status


@pytest.fixture
def mock_chat_repository():
    with patch('src.router.chat_router.ChatRepository') as mock:
        yield mock


def test_save_message(client, mock_chat_repository, mock_auth_header):
    mock_chat_repository.save_message.return_value = 1
    
    message_data = {
        "role": "user",
        "content": "What's my budget for food?",
        "session_id": "session-1"
    }
    
    response = client.post(
        "/api/chat/messages",
        json=message_data,
        headers=mock_auth_header
    )
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["id"] == 1
    assert data["message"] == "Message saved successfully"


def test_get_messages(client, mock_chat_repository, mock_auth_header):
    mock_messages = [
        {
            "id": 1,
            "user_id": "test-user",
            "role": "user",
            "content": "Hello",
            "reasoning": None,
            "timestamp": "2025-12-01T12:00:00Z",
            "session_id": "session-1",
            "metadata": None
        }
    ]
    mock_chat_repository.get_user_messages.return_value = mock_messages
    
    response = client.get("/api/chat/messages", headers=mock_auth_header)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1
    assert data[0]["content"] == "Hello"


def test_unauthorized_access(client):
    response = client.get("/api/chat/messages")
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_delete_user_messages(client, mock_chat_repository, mock_auth_header):
    mock_chat_repository.delete_user_messages.return_value = 5
    
    response = client.delete("/api/chat/messages", headers=mock_auth_header)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["deleted_count"] == 5
