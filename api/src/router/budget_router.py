from fastapi import APIRouter, HTTPException, Depends
from typing import List
from src.models.budget import Budget, BudgetCreate, BudgetUpdate
from src.service.notion_service import NotionService

router = APIRouter(prefix="/budgets", tags=["budgets"])

def get_notion_service():
    return NotionService()

@router.get("", response_model=List[Budget])
async def get_budgets(notion_service: NotionService = Depends(get_notion_service)):
    try:
        budgets = notion_service.get_all_budgets()
        return budgets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{budget_id}", response_model=Budget)
async def get_budget(budget_id: str, notion_service: NotionService = Depends(get_notion_service)):
    try:
        budget = notion_service.get_budget_by_id(budget_id)
        if not budget:
            raise HTTPException(status_code=404, detail="Budget not found")
        return budget
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=Budget)
async def create_budget(budget: BudgetCreate, notion_service: NotionService = Depends(get_notion_service)):
    try:
        created = notion_service.create_budget(
            category=budget.category,
            amount=budget.amount,
            period=budget.period,
            start_date=budget.start_date
        )
        return created
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{budget_id}", response_model=Budget)
async def update_budget(budget_id: str, budget: BudgetUpdate, notion_service: NotionService = Depends(get_notion_service)):
    try:
        updated = notion_service.update_budget(
            budget_id=budget_id,
            category=budget.category,
            amount=budget.amount,
            period=budget.period,
            spent=budget.spent,
            start_date=budget.start_date
        )
        return updated
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{budget_id}")
async def delete_budget(budget_id: str, notion_service: NotionService = Depends(get_notion_service)):
    try:
        success = notion_service.delete_budget(budget_id)
        return {"success": success, "message": "Budget deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
