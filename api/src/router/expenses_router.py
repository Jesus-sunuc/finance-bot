from typing import List
from fastapi import APIRouter, HTTPException, status
from src.models.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from src.service.notion_service import NotionService
from src.utils.decorators import handle_notion_errors

router = APIRouter(prefix="/expenses", tags=["expenses"])
notion_service = NotionService()


@router.get("", response_model=List[ExpenseResponse])
@handle_notion_errors
async def get_all_expenses():
    expenses = notion_service.get_all_expenses()
    valid_expenses = [
        exp for exp in expenses
        if exp.get('id') and (exp.get('amount', 0) > 0 or exp.get('merchant'))
    ]
    return valid_expenses


@router.get("/{expense_id}", response_model=ExpenseResponse)
@handle_notion_errors
async def get_expense(expense_id: str):
    expense = notion_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense {expense_id} not found"
        )
    return expense


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
@handle_notion_errors
async def create_expense(expense: ExpenseCreate):
    new_expense = notion_service.create_expense(
        amount=expense.amount,
        category=expense.category,
        merchant=expense.merchant,
        date=expense.date,
        description=expense.description or ""
    )
    return new_expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
@handle_notion_errors
async def update_expense(expense_id: str, expense: ExpenseUpdate):
    updated_expense = notion_service.update_expense(
        expense_id=expense_id,
        amount=expense.amount,
        category=expense.category,
        merchant=expense.merchant,
        date=expense.date,
        description=expense.description
    )
    return updated_expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
@handle_notion_errors
async def delete_expense(expense_id: str):
    success = notion_service.delete_expense(expense_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense {expense_id} not found"
        )
    return None
