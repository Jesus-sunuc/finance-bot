import pytest
from fastapi import status


def test_health_check(client):
    response = client.get("/api/health")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "FinanceBot API"


def test_cors_headers(client):
    response = client.options("/api/health")
    
    assert response.status_code in [status.HTTP_200_OK, status.HTTP_405_METHOD_NOT_ALLOWED]
