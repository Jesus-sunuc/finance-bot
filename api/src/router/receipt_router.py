from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from src.service.agent_service import AgentService
from src.models.expense import ExpenseCreate
import base64
import os
from typing import Dict, Any

router = APIRouter(prefix="/receipts", tags=["receipts"])

@router.post("/upload")
async def upload_receipt(file: UploadFile = File(...)) -> JSONResponse:
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    try:
        contents = await file.read()
        
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        agent_service = AgentService()
        expense_data = agent_service.extract_receipt_data(base64_image)
        
        if not expense_data:
            return JSONResponse(
                status_code=200,
                content={
                    "success": False,
                    "message": "Could not extract expense details from receipt",
                    "expense_data": None
                }
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Receipt processed successfully",
                "expense_data": expense_data,
                "filename": file.filename
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing receipt: {str(e)}")
    finally:
        await file.close()

@router.post("/upload-and-save")
async def upload_and_save_receipt(file: UploadFile = File(...)) -> JSONResponse:
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    try:
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        agent_service = AgentService()
        expense_data = agent_service.extract_receipt_data(base64_image)
        
        if not expense_data:
            return JSONResponse(
                status_code=200,
                content={
                    "success": False,
                    "message": "Could not extract expense details from receipt"
                }
            )
        
        from datetime import datetime
        created_expense = agent_service.notion_service.create_expense(
            amount=expense_data.get('amount', 0),
            category=expense_data.get('category', 'Other'),
            merchant=expense_data.get('merchant', 'Unknown'),
            date=expense_data.get('date', datetime.now().strftime("%Y-%m-%d")),
            description=expense_data.get('description', f"Receipt upload: {file.filename}")
        )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Receipt processed and expense created",
                "expense_data": expense_data,
                "expense_id": created_expense.get("id") if created_expense else None,
                "filename": file.filename
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing receipt: {str(e)}")
    finally:
        await file.close()
