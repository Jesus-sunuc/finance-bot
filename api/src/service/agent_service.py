import os
import json
from typing import Optional, Dict, Any
from datetime import datetime
from openai import OpenAI
from src.models.agent import AgentState, ActionType, ExpenseParseResult, AgentDecision, ChatResponse
from src.models.expense import ExpenseCreate
from src.service.notion_service import NotionService

class AgentService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY") or os.getenv("AI_TOKEN")
        base_url = os.getenv("OPENAI_BASE_URL") or os.getenv("AI_BASE_URL")
        
        if api_key is None:
            raise RuntimeError("OpenAI API key not set. Provide OPENAI_API_KEY or AI_TOKEN in the environment.")
        
        if base_url:
            self.client = OpenAI(api_key=api_key, base_url=base_url)
        else:
            self.client = OpenAI(api_key=api_key)
        self.notion_service = NotionService()
        self.current_state = AgentState.PLANNING
        
    def process_message(self, user_message: str) -> ChatResponse:
        self.current_state = AgentState.PLANNING
        plan = self._plan(user_message)
        self.current_state = AgentState.ACTING
        result = self._act(plan, user_message)
        self.current_state = AgentState.OBSERVING
        response = self._observe(result, plan)
        self.current_state = AgentState.COMPLETED
        return response
    
    def _plan(self, user_message: str) -> Dict[str, Any]:
        system_prompt = """You are a financial assistant AI. Analyze the user's message and determine their intent.
        
Possible intents:
- ADD_EXPENSE: User is reporting a spending/expense
- GET_BUDGET: User wants to see their budget
- GET_EXPENSES: User wants to see their expenses
- GENERAL_RESPONSE: General question or conversation

Respond in JSON format:
{
    "intent": "ADD_EXPENSE|GET_BUDGET|GET_EXPENSES|GENERAL_RESPONSE",
    "reasoning": "Brief explanation of why you chose this intent",
    "confidence": 0.0-1.0
}"""
        
        response = self.client.chat.completions.create(
            model="gpt-oss-120b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            response_format={"type": "json_object"}
        )
        
        plan = json.loads(response.choices[0].message.content)
        return plan
    
    def _act(self, plan: Dict[str, Any], user_message: str) -> Dict[str, Any]:
        intent = plan.get("intent", "GENERAL_RESPONSE")
        reasoning = plan.get("reasoning", "")
        
        if intent == "ADD_EXPENSE":
            expense_data = self.parse_expense_from_text(user_message)
            
            if expense_data:
                expense_create = ExpenseCreate(
                    amount=expense_data.amount,
                    category=expense_data.category,
                    merchant=expense_data.merchant,
                    date=expense_data.date or datetime.now().strftime("%Y-%m-%d"),
                    description=expense_data.description or ""
                )
                
                created_expense = self.notion_service.create_expense(expense_create)
                
                return {
                    "action": ActionType.ADD_EXPENSE,
                    "reasoning": reasoning,
                    "success": True,
                    "data": {
                        "expense": expense_data.model_dump(),
                        "expense_id": created_expense.id if created_expense else None
                    }
                }
            else:
                return {
                    "action": ActionType.ERROR,
                    "reasoning": "Failed to parse expense details",
                    "success": False,
                    "data": None
                }
        
        elif intent == "GET_BUDGET":
            return {
                "action": ActionType.GET_BUDGET,
                "reasoning": reasoning,
                "success": True,
                "data": {"message": "Budget feature coming soon!"}
            }
        
        elif intent == "GET_EXPENSES":
            return {
                "action": ActionType.GET_EXPENSES,
                "reasoning": reasoning,
                "success": True,
                "data": {"message": "Expense listing feature coming soon!"}
            }
        
        else:
            response = self._generate_general_response(user_message)
            return {
                "action": ActionType.GENERAL_RESPONSE,
                "reasoning": reasoning,
                "success": True,
                "data": {"response": response}
            }
    
    def _observe(self, result: Dict[str, Any], plan: Dict[str, Any]) -> ChatResponse:
        action = result.get("action", ActionType.GENERAL_RESPONSE)
        success = result.get("success", False)
        reasoning = result.get("reasoning", "")
        data = result.get("data", {})
        
        if action == ActionType.ADD_EXPENSE and success:
            expense = data.get("expense", {})
            message = f"I've added your expense: ${expense.get('amount', 0):.2f} at {expense.get('merchant', 'Unknown')} for {expense.get('category', 'Uncategorized')}."
        
        elif action == ActionType.ERROR:
            message = "I had trouble understanding that expense. Could you try rephrasing? For example: 'I spent $45 on groceries at Whole Foods'"
        
        elif action == ActionType.GENERAL_RESPONSE:
            message = data.get("response", "I'm here to help with your finances!")
        
        else:
            message = data.get("message", "I'm working on that feature!")
        
        return ChatResponse(
            message=message,
            reasoning=reasoning,
            action_taken=action,
            state=AgentState.COMPLETED,
            data=data
        )
    
    def parse_expense_from_text(self, text: str) -> Optional[ExpenseParseResult]:
        system_prompt = """You are an expense parser. Extract expense details from natural language.

Extract these fields:
- amount: The dollar amount (number only, no $)
- category: The expense category (Groceries, Dining, Transportation, Entertainment, Shopping, Bills, Healthcare, Other)
- merchant: The store/vendor name
- date: The date in YYYY-MM-DD format (if mentioned, otherwise use today)
- description: Any additional context
- confidence: Your confidence in the parse (0.0-1.0)

Respond ONLY in JSON format:
{
    "amount": 45.00,
    "category": "Groceries",
    "merchant": "Whole Foods",
    "date": "2025-11-09",
    "description": "Weekly shopping",
    "confidence": 0.95
}

If you cannot parse the expense, return confidence: 0.0"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-oss-120b",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Today is {datetime.now().strftime('%Y-%m-%d')}. Parse this expense: {text}"}
                ],
                response_format={"type": "json_object"}
            )
            
            parsed_data = json.loads(response.choices[0].message.content)
            expense_result = ExpenseParseResult(**parsed_data)
            
            if expense_result.confidence >= 0.5:
                return expense_result
            
            return None
            
        except Exception as e:
            print(f"Error parsing expense: {e}")
            return None
    
    def _generate_general_response(self, message: str) -> str:
        system_prompt = """You are a helpful financial assistant. Respond to the user's question or comment in a friendly, concise way. 
        Keep responses brief (1-2 sentences). If they're asking about features, mention that you can help track expenses, budgets, and provide financial insights."""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-oss-120b",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=150
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I'm here to help with your finances! You can tell me about expenses, ask about your budget, or chat with me."
