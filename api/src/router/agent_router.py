from fastapi import APIRouter, HTTPException, status
from src.models.agent import ChatRequest, ChatResponse, AddExpenseRequest, AgentDecision
from src.service.agent_service import AgentService
from src.repository.agent_repository import AgentRepository
from src.utils.decorators import handle_notion_errors

router = APIRouter(prefix="/agent", tags=["agent"])
agent_service = AgentService()
agent_repository = AgentRepository()

@router.post("/chat", response_model=ChatResponse)
@handle_notion_errors
async def chat(request: ChatRequest):
    try:
        response = agent_service.process_message(request.message)
        decision = AgentDecision(
            user_message=request.message,
            agent_state=response.state,
            llm_reasoning=response.reasoning,
            action_taken=response.action_taken,
            result=response.data
        )
        agent_repository.log_decision(decision)
        return response
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing message: {str(e)}"
        )


@router.post("/add-expense", response_model=ChatResponse)
@handle_notion_errors
async def add_expense_from_text(request: AddExpenseRequest):
    try:
        expense_data = agent_service.parse_expense_from_text(request.text)
        
        if not expense_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not parse expense from text. Please try rephrasing."
            )
        
        from src.models.expense import ExpenseCreate
        from datetime import datetime
        
        expense_create = ExpenseCreate(
            amount=expense_data.amount,
            category=expense_data.category,
            merchant=expense_data.merchant,
            date=expense_data.date or datetime.now().strftime("%Y-%m-%d"),
            description=expense_data.description or ""
        )
        
        created_expense = agent_service.notion_service.create_expense(
            amount=expense_create.amount,
            category=expense_create.category,
            merchant=expense_create.merchant,
            date=expense_create.date,
            description=expense_create.description
        )
        
        from src.models.agent import ActionType, AgentState
        
        decision = AgentDecision(
            user_message=request.text,
            agent_state=AgentState.COMPLETED,
            llm_reasoning=f"Parsed expense with {expense_data.confidence:.0%} confidence",
            action_taken=ActionType.ADD_EXPENSE,
            result={
                "expense": expense_data.model_dump(),
                "expense_id": created_expense.get("id") if created_expense else None
            }
        )
        agent_repository.log_decision(decision)
        
        response = ChatResponse(
            message=f"Added expense: ${expense_data.amount:.2f} at {expense_data.merchant} for {expense_data.category}",
            reasoning=f"Parsed with {expense_data.confidence:.0%} confidence",
            action_taken=ActionType.ADD_EXPENSE,
            state=AgentState.COMPLETED,
            data={"expense": expense_data.model_dump()}
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in add-expense endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error adding expense: {str(e)}"
        )


@router.get("/decisions")
async def get_recent_decisions(limit: int = 10):
    try:
        decisions = agent_repository.get_recent_decisions(limit)
        return {"decisions": decisions}
    except Exception as e:
        print(f"Error getting decisions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving decisions: {str(e)}"
        )
