import os
import json
from typing import Optional, Dict, Any
from datetime import datetime
from openai import OpenAI
from src.models.agent import AgentState, ActionType, ExpenseParseResult, AgentDecision, ChatResponse
from src.models.expense import ExpenseCreate
from src.models.budget import BudgetParseResult
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
    
    def search_transactions(self, query: str, amount: Optional[float] = None, merchant: Optional[str] = None, date: Optional[str] = None) -> list:
        """Search transactions with optional specific filters"""
        try:
            all_expenses = self.notion_service.get_all_expenses()
            query_lower = query.lower()
            matching = []

            for expense in all_expenses:
                # If specific filters are provided, use exact matching
                if amount is not None:
                    if abs(expense.get('amount', 0) - amount) > 0.01:  # Allow small floating point differences
                        continue
                
                if merchant is not None:
                    expense_merchant = expense.get('merchant', '').lower()
                    if merchant.lower() not in expense_merchant:
                        continue
                
                if date is not None:
                    if expense.get('date', '') != date:
                        continue
                
                # If no specific filters, do general search
                if amount is None and merchant is None and date is None:
                    merchant_field = expense.get('merchant', '').lower()
                    category_field = expense.get('category', '').lower()
                    description_field = expense.get('description', '').lower()
                    amount_str = str(expense.get('amount', ''))

                    if (query_lower in merchant_field or
                        query_lower in category_field or
                        query_lower in description_field or
                        query_lower in amount_str):
                        matching.append(expense)
                else:
                    # All filters passed
                    matching.append(expense)

            return matching
        except Exception as e:
            print(f"Error searching transactions: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def extract_deletion_details(self, deletion_request: str) -> Dict[str, Any]:
        """Extract structured transaction details from deletion request using LLM"""
        system_prompt = """You are a transaction detail extractor. Given a user's deletion request, extract the transaction details.

Extract:
- amount: The dollar amount (number only, no $) - ONLY if explicitly mentioned
- merchant: The merchant/store name - ONLY if explicitly mentioned
- date: The date in YYYY-MM-DD format - ONLY if explicitly mentioned
- query: A general search term if specific details aren't provided

Examples:
- "Delete my $65.00 at Gas station on 2025-11-10" → {"amount": 65.00, "merchant": "Gas station", "date": "2025-11-10"}
- "Delete Mexican store expense" → {"query": "mexican store"}
- "Remove the $99.99 food expense" → {"amount": 99.99, "query": "food"}
- "Delete walmart transaction" → {"merchant": "walmart"}

Return ONLY valid JSON with extracted fields. Include only fields that are explicitly mentioned."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-oss-120b",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Extract details from: {deletion_request}"}
                ],
                max_tokens=100
            )

            import json
            result = json.loads(response.choices[0].message.content.strip())
            return result
        except Exception as e:
            print(f"Error extracting deletion details: {e}")
            # Fallback to simple extraction
            result = {"query": deletion_request}
            
            # Try to extract amount with regex
            import re
            amount_match = re.search(r'\$?(\d+\.?\d*)', deletion_request)
            if amount_match:
                try:
                    result["amount"] = float(amount_match.group(1))
                except ValueError:
                    pass
            
            return result

    def delete_transaction_by_query(self, query: str, confirmed: bool = False, transaction_id: Optional[str] = None) -> Dict[str, Any]:
        if confirmed and transaction_id:
            try:
                transaction = self.notion_service.get_expense_by_id(transaction_id)
                if not transaction:
                    return {
                        "success": False,
                        "message": "Transaction not found"
                    }

                self.notion_service.delete_expense(transaction_id)
                return {
                    "success": True,
                    "message": f"Deleted ${transaction['amount']:.2f} at {transaction['merchant']}",
                    "deleted_transaction": transaction
                }
            except Exception as e:
                print(f"Error deleting transaction: {e}")
                import traceback
                traceback.print_exc()
                return {
                    "success": False,
                    "message": f"Failed to delete transaction: {str(e)}"
                }

        # Extract structured details from the query
        details = self.extract_deletion_details(query)
        
        # Search with structured filters
        matches = self.search_transactions(
            query=details.get("query", query),
            amount=details.get("amount"),
            merchant=details.get("merchant"),
            date=details.get("date")
        )

        if not matches:
            search_description = []
            if details.get("amount"):
                search_description.append(f"${details['amount']:.2f}")
            if details.get("merchant"):
                search_description.append(f"at {details['merchant']}")
            if details.get("date"):
                search_description.append(f"on {details['date']}")
            
            search_str = " ".join(search_description) if search_description else query
            
            return {
                "success": False,
                "message": f"No matching transaction found for '{search_str}'",
                "matches": []
            }

        if len(matches) > 1:
            return {
                "success": False,
                "message": f"Found {len(matches)} matching transactions. Please be more specific.",
                "matches": matches[:3],
                "needs_confirmation": True
            }

        transaction = matches[0]

        if not confirmed:
            return {
                "success": False,
                "needs_confirmation": True,
                "message": f"Are you sure you want to delete this transaction?",
                "transaction_to_delete": transaction,
                "matches": [transaction]
            }

        try:
            self.notion_service.delete_expense(transaction['id'])
            return {
                "success": True,
                "message": f"Deleted ${transaction['amount']:.2f} at {transaction['merchant']}",
                "deleted_transaction": transaction
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to delete transaction: {str(e)}"
            }
    
    def generate_spending_report(self, report_type: str = "monthly", start_date: Optional[str] = None, end_date: Optional[str] = None) -> Dict[str, Any]:
        """Generate a spending report"""
        try:
            from datetime import datetime, timedelta
            all_expenses = self.notion_service.get_all_expenses()
            
            if report_type == "monthly" and not start_date and not end_date:
                now = datetime.now()
                start_date = now.replace(day=1).strftime("%Y-%m-%d")
                end_date = now.strftime("%Y-%m-%d")
            
            if start_date or end_date:
                filtered = []
                for expense in all_expenses:
                    exp_date = expense.get('date', '')
                    if start_date and exp_date < start_date:
                        continue
                    if end_date and exp_date > end_date:
                        continue
                    filtered.append(expense)
                all_expenses = filtered
            
            total_spent = sum(exp.get('amount', 0) for exp in all_expenses)
            
            by_category = {}
            for expense in all_expenses:
                cat = expense.get('category', 'Other')
                if cat not in by_category:
                    by_category[cat] = {'total': 0, 'count': 0}
                by_category[cat]['total'] += expense.get('amount', 0)
                by_category[cat]['count'] += 1
            
            category_breakdown = [
                {
                    'category': cat,
                    'total': data['total'],
                    'count': data['count'],
                    'percentage': (data['total'] / total_spent * 100) if total_spent > 0 else 0
                }
                for cat, data in by_category.items()
            ]
            category_breakdown.sort(key=lambda x: x['total'], reverse=True)
            
            report_data = {
                "success": True,
                "report_type": report_type,
                "total_spent": total_spent,
                "transaction_count": len(all_expenses),
                "category_breakdown": category_breakdown,
                "top_category": category_breakdown[0]['category'] if category_breakdown else None,
                "start_date": start_date,
                "end_date": end_date
            }
            
            if report_type == "monthly":
                if start_date:
                    days_in_period = (datetime.strptime(end_date or start_date, "%Y-%m-%d") - 
                                     datetime.strptime(start_date, "%Y-%m-%d")).days + 1
                else:
                    days_in_period = 30
                report_data["daily_average"] = total_spent / days_in_period if days_in_period > 0 else 0
                report_data["period_description"] = "This Month"
                
            elif report_type == "category":
                report_data["category_breakdown"] = sorted(
                    category_breakdown, 
                    key=lambda x: x['category']
                )
                report_data["total_categories"] = len(category_breakdown)
                report_data["period_description"] = "All Time"
                
            elif report_type == "trends":
                by_date = {}
                for expense in all_expenses:
                    exp_date = expense.get('date', '')
                    if exp_date:
                        if exp_date not in by_date:
                            by_date[exp_date] = 0
                        by_date[exp_date] += expense.get('amount', 0)
                
                sorted_dates = sorted(by_date.keys(), reverse=True)[:7]
                trend_data = [
                    {'date': date, 'amount': by_date[date]}
                    for date in sorted(sorted_dates)
                ]
                report_data["trend_data"] = trend_data
                report_data["period_description"] = "Last 7 Days"
                
                if len(trend_data) >= 2:
                    recent_avg = sum(d['amount'] for d in trend_data[-3:]) / 3 if len(trend_data) >= 3 else trend_data[-1]['amount']
                    older_avg = sum(d['amount'] for d in trend_data[:3]) / 3 if len(trend_data) >= 3 else trend_data[0]['amount']
                    if recent_avg > older_avg * 1.1:
                        report_data["trend_direction"] = "increasing"
                    elif recent_avg < older_avg * 0.9:
                        report_data["trend_direction"] = "decreasing"
                    else:
                        report_data["trend_direction"] = "stable"
                else:
                    report_data["trend_direction"] = "insufficient_data"
            
            return report_data
            
        except Exception as e:
            print(f"Error generating report: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "message": f"Failed to generate report: {str(e)}"
            }
    
    def _plan(self, user_message: str) -> Dict[str, Any]:
        system_prompt = """You are a financial assistant AI. Analyze the user's message and determine their intent.

Possible intents:
- ADD_EXPENSE: User is reporting a spending/expense
- DELETE_EXPENSE: User wants to delete or remove an expense/transaction (e.g., "delete the Mexican store expense", "remove $99.99 food expense")
- SET_BUDGET: User wants to set or update a budget goal (e.g., "set my dining budget to $400")
- GET_BUDGET: User wants to see their budget
- GET_EXPENSES: User wants to see their expenses
- GENERAL_RESPONSE: General question or conversation

Respond in JSON format:
{
    "intent": "ADD_EXPENSE|DELETE_EXPENSE|SET_BUDGET|GET_BUDGET|GET_EXPENSES|GENERAL_RESPONSE",
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
                created_expense = self.notion_service.create_expense(
                    amount=expense_data.amount,
                    category=expense_data.category,
                    merchant=expense_data.merchant,
                    date=expense_data.date or datetime.now().strftime("%Y-%m-%d"),
                    description=expense_data.description or ""
                )
                
                return {
                    "action": ActionType.ADD_EXPENSE,
                    "reasoning": reasoning,
                    "success": True,
                    "data": {
                        "expense": expense_data.model_dump(),
                        "expense_id": created_expense.get("id") if created_expense else None
                    }
                }
            else:
                return {
                    "action": ActionType.ERROR,
                    "reasoning": "Failed to parse expense details",
                    "success": False,
                    "data": None
                }
        
        elif intent == "DELETE_EXPENSE":
            delete_result = self.delete_transaction_by_query(user_message)

            if delete_result.get("needs_confirmation"):
                return {
                    "action": ActionType.DELETE_TRANSACTION,
                    "reasoning": reasoning,
                    "success": False,
                    "needs_confirmation": True,
                    "data": delete_result
                }
            elif delete_result.get("success"):
                return {
                    "action": ActionType.DELETE_TRANSACTION,
                    "reasoning": reasoning,
                    "success": True,
                    "data": delete_result
                }
            else:
                return {
                    "action": ActionType.ERROR,
                    "reasoning": "Failed to delete transaction",
                    "success": False,
                    "data": delete_result
                }

        elif intent == "SET_BUDGET":
            budget_result = self.set_budget_goal(user_message)

            if budget_result.get("success"):
                return {
                    "action": ActionType.SET_BUDGET,
                    "reasoning": reasoning,
                    "success": True,
                    "data": budget_result
                }
            else:
                return {
                    "action": ActionType.ERROR,
                    "reasoning": "Failed to set budget",
                    "success": False,
                    "data": budget_result
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
        needs_confirmation = result.get("needs_confirmation", False)

        if action == ActionType.ADD_EXPENSE and success:
            expense = data.get("expense", {})
            message = f"I've added your expense: ${expense.get('amount', 0):.2f} at {expense.get('merchant', 'Unknown')} for {expense.get('category', 'Uncategorized')}."

        elif action == ActionType.DELETE_TRANSACTION:
            if needs_confirmation:
                matches = data.get("matches", [])
                transaction_to_delete = data.get("transaction_to_delete")

                if len(matches) > 1:
                    message = data.get("message", "Found multiple matching transactions.")
                    if matches:
                        message += "\n\nMatching transactions:"
                        for i, match in enumerate(matches[:3], 1):
                            message += f"\n{i}. ${match.get('amount', 0):.2f} at {match.get('merchant', 'Unknown')} on {match.get('date', 'Unknown date')}"
                        message += "\n\nPlease be more specific about which transaction you want to delete."
                elif transaction_to_delete:
                    message = data.get("message", "Are you sure you want to delete this transaction?")
                else:
                    message = data.get("message", "Please confirm the deletion.")
            elif success:
                deleted = data.get("deleted_transaction", {})
                message = f"I've removed the ${deleted.get('amount', 0):.2f} {deleted.get('category', 'expense')} at {deleted.get('merchant', 'Unknown')} from your records. Let me know if you need anything else!"
            else:
                message = data.get("message", "I couldn't find that transaction. Please try being more specific.")

        elif action == ActionType.SET_BUDGET and success:
            budget = data.get("budget", {})
            action_type = data.get("action", "set")
            message = data.get("message", f"Budget {action_type} successfully!")

        elif action == ActionType.ERROR:
            message = data.get("message", "I had trouble understanding that expense. Could you try rephrasing? For example: 'I spent $45 on groceries at Whole Foods'")

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
    
    def parse_budget_from_text(self, text: str) -> Optional[BudgetParseResult]:
        """Parse budget details from natural language using LLM"""
        
        system_prompt = """You are a budget parser. Extract budget details from natural language.

Extract these fields:
- category: The budget category (Groceries, Dining, Transportation, Entertainment, Shopping, Bills, Healthcare, Other, or a custom category)
- amount: The dollar amount for the budget (number only, no $)
- period: The budget period (monthly, weekly, yearly)
- confidence: Your confidence in the parse (0.0-1.0)

Examples:
"Set my dining budget to $400 this month" → {"category": "Dining", "amount": 400, "period": "monthly", "confidence": 1.0}
"I want to spend $100 weekly on groceries" → {"category": "Groceries", "amount": 100, "period": "weekly", "confidence": 1.0}
"Limit transportation to $200" → {"category": "Transportation", "amount": 200, "period": "monthly", "confidence": 0.9}

Respond ONLY in JSON format:
{
    "category": "Dining",
    "amount": 400.00,
    "period": "monthly",
    "confidence": 0.95
}

If you cannot parse the budget, return confidence: 0.0"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-oss-120b",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Parse this budget request: {text}"}
                ],
                response_format={"type": "json_object"}
            )
            
            parsed_data = json.loads(response.choices[0].message.content)
            budget_result = BudgetParseResult(**parsed_data)
            
            if budget_result.confidence >= 0.5:
                return budget_result
            
            return None
            
        except Exception as e:
            print(f"Error parsing budget: {e}")
            return None
    
    def set_budget_goal(self, text: str) -> Dict[str, Any]:
        budget_data = self.parse_budget_from_text(text)
        
        if not budget_data:
            return {
                "success": False,
                "message": "Could not understand budget request. Try: 'Set my dining budget to $400 this month'"
            }
        
        try:
            existing_budgets = self.notion_service.get_all_budgets()
            existing = next((b for b in existing_budgets if b['category'].lower() == budget_data.category.lower()), None)
            
            if existing:
                updated = self.notion_service.update_budget(
                    budget_id=existing['id'],
                    amount=budget_data.amount,
                    period=budget_data.period
                )
                return {
                    "success": True,
                    "message": f"Updated {budget_data.category} budget to ${budget_data.amount:.2f} per {budget_data.period}",
                    "budget": updated,
                    "action": "updated"
                }
            else:
                created = self.notion_service.create_budget(
                    category=budget_data.category,
                    amount=budget_data.amount,
                    period=budget_data.period
                )
                return {
                    "success": True,
                    "message": f"Set {budget_data.category} budget to ${budget_data.amount:.2f} per {budget_data.period}",
                    "budget": created,
                    "action": "created"
                }
        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to set budget: {str(e)}"
            }
    
    def extract_receipt_data(self, base64_image: str) -> Optional[Dict[str, Any]]:
        system_prompt = """You are an OCR system specialized in reading receipts. Extract the following information:

- merchant: The store/restaurant name
- amount: The total amount (number only, no $)
- date: The date in YYYY-MM-DD format (parse from receipt, use current date if unclear)
- category: Best guess for expense category (Groceries, Dining, Transportation, Entertainment, Shopping, Bills, Healthcare, Other)
- items: List of items purchased (if visible and readable)
- description: Brief description of the purchase
- confidence: Your confidence in the extraction (0.0-1.0)

Respond ONLY in JSON format:
{
    "merchant": "Whole Foods",
    "amount": 45.67,
    "date": "2025-11-19",
    "category": "Groceries",
    "items": ["Milk", "Bread", "Eggs"],
    "description": "Weekly groceries",
    "confidence": 0.95
}

If the image is not a receipt or you cannot read it, return confidence: 0.0"""
        
        try:
            response = self.client.chat.completions.create(
                model="gemma3-27b",
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": f"Today is {datetime.now().strftime('%Y-%m-%d')}. Extract expense details from this receipt image:"
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                response_format={"type": "json_object"},
                max_tokens=500
            )
            
            parsed_data = json.loads(response.choices[0].message.content)
            
            if parsed_data.get('confidence', 0) >= 0.5:
                return parsed_data
            
            return None
            
        except Exception as e:
            print(f"Error extracting receipt data: {e}")
            import traceback
            traceback.print_exc()
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
