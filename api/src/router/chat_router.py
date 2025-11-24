from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
from src.repository.chat_repository import ChatRepository
import jwt
import os

router = APIRouter(prefix="/api/chat", tags=["chat"])


class SaveMessageRequest(BaseModel):
    role: str
    content: str
    reasoning: Optional[str] = None
    session_id: Optional[str] = None
    metadata: Optional[dict] = None


class ChatMessageResponse(BaseModel):
    id: int
    user_id: str
    role: str
    content: str
    reasoning: Optional[str]
    timestamp: str
    session_id: Optional[str]
    metadata: Optional[dict]


def get_user_id_from_token(authorization: str) -> str:
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
        
        token = authorization.split(" ")[1]
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded.get("sub", "unknown")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


@router.post("/messages", status_code=201)
def save_message(
    request: SaveMessageRequest,
    authorization: str = Header(None)
):
    user_id = get_user_id_from_token(authorization)
    
    message_id = ChatRepository.save_message(
        user_id=user_id,
        role=request.role,
        content=request.content,
        reasoning=request.reasoning,
        session_id=request.session_id,
        metadata=request.metadata,
    )
    
    return {"id": message_id, "message": "Message saved successfully"}


@router.get("/messages", response_model=List[ChatMessageResponse])
def get_messages(
    limit: int = 100,
    authorization: str = Header(None)
):
    user_id = get_user_id_from_token(authorization)
    
    messages = ChatRepository.get_user_messages(user_id, limit)
    return messages


@router.get("/messages/session/{session_id}", response_model=List[ChatMessageResponse])
def get_session_messages(
    session_id: str,
    authorization: str = Header(None)
):
    messages = ChatRepository.get_session_messages(session_id)
    return messages


@router.delete("/messages")
def delete_all_messages(
    authorization: str = Header(None)
):
    user_id = get_user_id_from_token(authorization)
    
    deleted_count = ChatRepository.delete_user_messages(user_id)
    return {
        "message": f"Deleted {deleted_count} messages successfully",
        "deleted_count": deleted_count
    }


@router.delete("/messages/session/{session_id}")
def delete_session_messages(
    session_id: str,
    authorization: str = Header(None)
):
    """Delete all messages for a specific session"""
    deleted_count = ChatRepository.delete_session_messages(session_id)
    return {
        "message": f"Deleted {deleted_count} messages successfully",
        "deleted_count": deleted_count
    }
