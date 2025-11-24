from fastapi import APIRouter, HTTPException, status, Header
from src.models.agent import ChatRequest, ChatResponse, AddExpenseRequest, DeleteTransactionRequest, GenerateReportRequest, SetBudgetRequest, AgentDecision
from src.service.agent_service import AgentService
from src.repository.agent_repository import AgentRepository
from src.repository.chat_repository import ChatRepository
from src.utils.decorators import handle_notion_errors
import jwt

router = APIRouter(prefix="/agent", tags=["agent"])
agent_service = AgentService()
agent_repository = AgentRepository()


def get_user_id_from_token(authorization: str) -> str:
    try:
        if not authorization or not authorization.startswith("Bearer "):
            return "anonymous"
        
        token = authorization.split(" ")[1]
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded.get("sub", "anonymous")
    except Exception:
        return "anonymous"


@router.post("/chat", response_model=ChatResponse)
@handle_notion_errors
async def chat(request: ChatRequest, authorization: str = Header(None)):
    try:
        user_id = get_user_id_from_token(authorization)
        
        ChatRepository.save_message(
            user_id=user_id,
            role="user",
            content=request.message
        )
        
        response = agent_service.process_message(request.message)
        
        ChatRepository.save_message(
            user_id=user_id,
            role="assistant",
            content=response.message,
            reasoning=response.reasoning,
            metadata={
                "action_taken": response.action_taken,
                "state": response.state,
                "data": response.data
            }
        )
        
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
            description=expense_create.description or ""
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


@router.post("/delete-transaction", response_model=ChatResponse)
@handle_notion_errors
async def delete_transaction(request: DeleteTransactionRequest):
    try:
        result = agent_service.delete_transaction_by_query(request.query)
        
        from src.models.agent import ActionType, AgentState
        
        if result.get("needs_confirmation"):
            decision = AgentDecision(
                user_message=request.query,
                agent_state=AgentState.COMPLETED,
                llm_reasoning="Multiple matches found, needs user confirmation",
                action_taken=ActionType.DELETE_TRANSACTION,
                result=result
            )
            agent_repository.log_decision(decision)
            
            matches = result.get("matches", [])
            match_list = "\n".join([
                f"- ${m['amount']:.2f} at {m['merchant']} on {m['date']}"
                for m in matches
            ])
            
            return ChatResponse(
                message=f"I found {len(matches)} matching transactions:\n{match_list}\n\nPlease be more specific about which one to delete.",
                reasoning="Multiple matches require clarification",
                action_taken=ActionType.DELETE_TRANSACTION,
                state=AgentState.COMPLETED,
                data=result
            )
        
        if not result.get("success"):
            decision = AgentDecision(
                user_message=request.query,
                agent_state=AgentState.COMPLETED,
                llm_reasoning="Transaction not found",
                action_taken=ActionType.ERROR,
                result=result
            )
            agent_repository.log_decision(decision)
            
            return ChatResponse(
                message=result.get("message", "Transaction not found"),
                reasoning="No matching transaction",
                action_taken=ActionType.ERROR,
                state=AgentState.COMPLETED,
                data=result
            )
        
        deleted = result.get("deleted_transaction", {})
        decision = AgentDecision(
            user_message=request.query,
            agent_state=AgentState.COMPLETED,
            llm_reasoning=f"Deleted transaction: {deleted.get('merchant')}",
            action_taken=ActionType.DELETE_TRANSACTION,
            result=result
        )
        agent_repository.log_decision(decision)
        
        return ChatResponse(
            message=result.get("message", "Transaction deleted successfully"),
            reasoning="Transaction deleted",
            action_taken=ActionType.DELETE_TRANSACTION,
            state=AgentState.COMPLETED,
            data=result
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in delete-transaction endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting transaction: {str(e)}"
        )


@router.post("/generate-report", response_model=ChatResponse)
@handle_notion_errors
async def generate_report(request: GenerateReportRequest):
    try:
        result = agent_service.generate_spending_report(
            report_type=request.report_type,
            start_date=request.start_date,
            end_date=request.end_date
        )
        
        from src.models.agent import ActionType, AgentState
        
        if not result.get("success"):
            decision = AgentDecision(
                user_message=f"Generate {request.report_type} report",
                agent_state=AgentState.COMPLETED,
                llm_reasoning="Failed to generate report",
                action_taken=ActionType.ERROR,
                result=result
            )
            agent_repository.log_decision(decision)
            
            return ChatResponse(
                message=result.get("message", "Failed to generate report"),
                reasoning="Report generation failed",
                action_taken=ActionType.ERROR,
                state=AgentState.COMPLETED,
                data=result
            )
        
        decision = AgentDecision(
            user_message=f"Generate {request.report_type} report",
            agent_state=AgentState.COMPLETED,
            llm_reasoning=f"Generated {request.report_type} report with {result.get('transaction_count')} transactions",
            action_taken=ActionType.GENERATE_REPORT,
            result=result
        )
        agent_repository.log_decision(decision)
        
        total = result.get('total_spent', 0)
        count = result.get('transaction_count', 0)
        top_cat = result.get('top_category', 'N/A')
        
        message = f"Report generated! You spent ${total:.2f} across {count} transactions. Top category: {top_cat}."
        
        return ChatResponse(
            message=message,
            reasoning=f"Generated {request.report_type} report",
            action_taken=ActionType.GENERATE_REPORT,
            state=AgentState.COMPLETED,
            data={**result, "navigate_to": "/reports"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in generate-report endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating report: {str(e)}"
        )


@router.post("/set-budget", response_model=ChatResponse)
@handle_notion_errors
async def set_budget(request: SetBudgetRequest):
    try:
        result = agent_service.set_budget_goal(request.text)
        
        from src.models.agent import ActionType, AgentState
        
        if not result.get("success"):
            decision = AgentDecision(
                user_message=request.text,
                agent_state=AgentState.COMPLETED,
                llm_reasoning="Failed to set budget",
                action_taken=ActionType.ERROR,
                result=result
            )
            agent_repository.log_decision(decision)
            
            return ChatResponse(
                message=result.get("message", "Failed to set budget"),
                reasoning="Budget setting failed",
                action_taken=ActionType.ERROR,
                state=AgentState.COMPLETED,
                data=result
            )
        
        budget = result.get("budget", {})
        action = result.get("action", "set")
        
        decision = AgentDecision(
            user_message=request.text,
            agent_state=AgentState.COMPLETED,
            llm_reasoning=f"{action.capitalize()} budget for {budget.get('category')}",
            action_taken=ActionType.SET_BUDGET,
            result=result
        )
        agent_repository.log_decision(decision)
        
        return ChatResponse(
            message=result.get("message", "Budget set successfully"),
            reasoning=f"Budget {action}",
            action_taken=ActionType.SET_BUDGET,
            state=AgentState.COMPLETED,
            data={**result, "navigate_to": "/budgets"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in set-budget endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error setting budget: {str(e)}"
        )
