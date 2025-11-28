import os
from typing import List, Optional
from notion_client import Client
from notion_client.errors import APIResponseError

class NotionService:
    def __init__(self):
        api_key = os.getenv("NOTION_API_KEY")
        if not api_key:
            raise ValueError("NOTION_API_KEY environment variable is not set")
        
        self.client = Client(auth=api_key)
        self.expenses_db_id = os.getenv("NOTION_EXPENSES_DB_ID")
        self.budgets_db_id = os.getenv("NOTION_BUDGET_DB_ID")
        
        if not self.expenses_db_id:
            raise ValueError("NOTION_EXPENSES_DB_ID is not set in environment variables")
        
        if not self.budgets_db_id:
            raise ValueError("NOTION_BUDGET_DB_ID is not set in environment variables")
    
    def get_all_expenses(self) -> List[dict]:
        try:
            response = self.client.databases.query(database_id=self.expenses_db_id)
            return [self._parse_expense_page(page) for page in response.get("results", [])]
        except APIResponseError as e:
            raise Exception(f"Failed to fetch expenses from Notion: {str(e)}")
    
    def get_expense_by_id(self, expense_id: str) -> Optional[dict]:
        try:
            page = self.client.pages.retrieve(page_id=expense_id)
            return self._parse_expense_page(page)
        except APIResponseError as e:
            raise Exception(f"Failed to fetch expense {expense_id}: {str(e)}")
    
    def create_expense(self, amount: float, category: str, merchant: str, date: str, description: str = "") -> dict:
        try:
            db_schema = self.client.databases.retrieve(database_id=self.expenses_db_id)
            actual_properties = db_schema.get("properties", {})
            properties = self._build_expense_properties(actual_properties, amount, category, merchant, date, description)
            
            response = self.client.pages.create(
                parent={"database_id": self.expenses_db_id},
                properties=properties
            )
            return self._parse_expense_page(response)
        except APIResponseError as e:
            raise Exception(f"Failed to create expense: {str(e)}")
    
    def update_expense(self, expense_id: str, amount: Optional[float] = None, category: Optional[str] = None, 
                      merchant: Optional[str] = None, date: Optional[str] = None, description: Optional[str] = None) -> dict:
        try:
            properties = {}
            if amount is not None:
                properties["Amount"] = {"number": amount}
            if category is not None:
                properties["Category"] = {"select": {"name": category}}
            if merchant is not None:
                properties["Merchant"] = {"rich_text": [{"text": {"content": merchant}}]}
            if date is not None:
                properties["Date"] = {"date": {"start": date}}
            if description is not None:
                properties["Description"] = {"rich_text": [{"text": {"content": description}}]}
            
            response = self.client.pages.update(page_id=expense_id, properties=properties)
            return self._parse_expense_page(response)
        except APIResponseError as e:
            raise Exception(f"Failed to update expense: {str(e)}")
    
    def delete_expense(self, expense_id: str) -> bool:
        try:
            self.client.pages.update(page_id=expense_id, archived=True)
            return True
        except APIResponseError as e:
            raise Exception(f"Failed to delete expense: {str(e)}")
    
    def _build_expense_properties(self, actual_properties: dict, amount: float, category: str, 
                                  merchant: str, date: str, description: str) -> dict:
        properties = {}
        
        for prop_name, prop_data in actual_properties.items():
            if prop_data.get("type") == "title":
                properties[prop_name] = {"title": [{"text": {"content": f"{merchant} - ${amount}"}}]}
                break
        
        property_mapping = {
            "amount": ("number", amount),
            "category": ("select", {"name": category}),
            "merchant": ("rich_text", [{"text": {"content": merchant}}]),
            "date": ("date", {"start": date}),
            "description": ("rich_text", [{"text": {"content": description}}])
        }
        
        for prop_name, prop_data in actual_properties.items():
            prop_type = prop_data.get("type")
            prop_name_lower = prop_name.lower()
            
            for field_name, (expected_type, value) in property_mapping.items():
                if field_name in prop_name_lower and prop_type == expected_type:
                    properties[prop_name] = {expected_type: value}
                    break
        
        return properties
    
    def _parse_expense_page(self, page: dict) -> dict:
        props = page.get("properties", {})
        result = {
            "id": page.get("id"),
            "amount": 0.0,
            "category": "",
            "merchant": "",
            "date": "",
            "description": "",
            "created_time": page.get("created_time"),
        }
        
        for prop_name, prop_data in props.items():
            prop_name_lower = prop_name.lower()
            prop_type = prop_data.get("type")
            
            if "amount" in prop_name_lower and prop_type == "number":
                result["amount"] = prop_data.get("number", 0) or 0.0
            elif "category" in prop_name_lower and prop_type == "select":
                select_data = prop_data.get("select")
                result["category"] = select_data.get("name", "") if select_data else ""
            elif "merchant" in prop_name_lower and prop_type == "rich_text":
                result["merchant"] = self._get_rich_text(prop_data)
            elif "date" in prop_name_lower and prop_type == "date":
                date_data = prop_data.get("date")
                result["date"] = date_data.get("start", "") if date_data else ""
            elif "description" in prop_name_lower and prop_type == "rich_text":
                result["description"] = self._get_rich_text(prop_data)
        
        return result
    
    def _get_rich_text(self, rich_text_prop: dict) -> str:
        rich_text_array = rich_text_prop.get("rich_text", [])
        if not rich_text_array:
            return ""
        return "".join([text.get("plain_text", "") for text in rich_text_array])
    
    def get_all_budgets(self) -> List[dict]:
        try:
            response = self.client.databases.query(database_id=self.budgets_db_id)
            return [self._parse_budget_page(page) for page in response.get("results", [])]
        except APIResponseError as e:
            raise Exception(f"Failed to fetch budgets from Notion: {str(e)}")
    
    def get_budget_by_id(self, budget_id: str) -> Optional[dict]:
        try:
            page = self.client.pages.retrieve(page_id=budget_id)
            return self._parse_budget_page(page)
        except APIResponseError as e:
            raise Exception(f"Failed to fetch budget {budget_id}: {str(e)}")
    
    def create_budget(self, category: str, amount: float, period: str = "monthly", start_date: Optional[str] = None) -> dict:
        try:
            db_schema = self.client.databases.retrieve(database_id=self.budgets_db_id)
            actual_properties = db_schema.get("properties", {})
            properties = self._build_budget_properties(actual_properties, category, amount, period, start_date)
            
            response = self.client.pages.create(
                parent={"database_id": self.budgets_db_id},
                properties=properties
            )
            return self._parse_budget_page(response)
        except APIResponseError as e:
            raise Exception(f"Failed to create budget: {str(e)}")
    
    def update_budget(self, budget_id: str, category: Optional[str] = None, amount: Optional[float] = None, 
                     period: Optional[str] = None, spent: Optional[float] = None, start_date: Optional[str] = None) -> dict:
        try:
            properties = {}
            if category is not None:
                properties["Category"] = {"rich_text": [{"text": {"content": category}}]}
            if amount is not None:
                properties["Amount"] = {"number": amount}
            if period is not None:
                properties["Period"] = {"select": {"name": period}}
            if spent is not None:
                properties["Spent"] = {"number": spent}
            if start_date is not None:
                properties["Start Date"] = {"date": {"start": start_date}}
            
            response = self.client.pages.update(page_id=budget_id, properties=properties)
            return self._parse_budget_page(response)
        except APIResponseError as e:
            raise Exception(f"Failed to update budget: {str(e)}")
    
    def delete_budget(self, budget_id: str) -> bool:
        try:
            self.client.pages.update(page_id=budget_id, archived=True)
            return True
        except APIResponseError as e:
            raise Exception(f"Failed to delete budget: {str(e)}")
    
    def _build_budget_properties(self, actual_properties: dict, category: str, amount: float, 
                                 period: str, start_date: Optional[str]) -> dict:
        from datetime import datetime
        properties = {}
        
        for prop_name, prop_data in actual_properties.items():
            if prop_data.get("type") == "title":
                properties[prop_name] = {"title": [{"text": {"content": f"{category} Budget"}}]}
                break
        
        property_mapping = {
            "category": ("rich_text", [{"text": {"content": category}}]),
            "amount": ("number", amount),
            "period": ("select", {"name": period}),
            "spent": ("number", 0.0),
            "start date": ("date", {"start": start_date or datetime.now().strftime("%Y-%m-%d")})
        }
        
        for prop_name, prop_data in actual_properties.items():
            prop_type = prop_data.get("type")
            prop_name_lower = prop_name.lower()
            
            for field_name, (expected_type, value) in property_mapping.items():
                if field_name in prop_name_lower and prop_type == expected_type:
                    properties[prop_name] = {expected_type: value}
                    break
        
        return properties
    
    def _parse_budget_page(self, page: dict) -> dict:
        props = page.get("properties", {})
        result = {
            "id": page.get("id"),
            "category": "",
            "amount": 0.0,
            "period": "monthly",
            "spent": 0.0,
            "start_date": "",
            "created_time": page.get("created_time"),
        }
        
        for prop_name, prop_data in props.items():
            prop_name_lower = prop_name.lower()
            prop_type = prop_data.get("type")
            
            if "category" in prop_name_lower and prop_type == "rich_text":
                result["category"] = self._get_rich_text(prop_data)
            elif "amount" in prop_name_lower and prop_type == "number":
                result["amount"] = prop_data.get("number", 0) or 0.0
            elif "period" in prop_name_lower and prop_type == "select":
                select_data = prop_data.get("select")
                result["period"] = select_data.get("name", "monthly") if select_data else "monthly"
            elif "spent" in prop_name_lower and prop_type == "number":
                result["spent"] = prop_data.get("number", 0) or 0.0
            elif "start" in prop_name_lower and "date" in prop_name_lower and prop_type == "date":
                date_data = prop_data.get("date")
                result["start_date"] = date_data.get("start", "") if date_data else ""
        
        result["remaining"] = result["amount"] - result["spent"]
        result["percentage"] = (result["spent"] / result["amount"] * 100) if result["amount"] > 0 else 0
        
        return result

