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
        
        if not self.expenses_db_id:
            raise ValueError("NOTION_EXPENSES_DB_ID is not set in environment variables")
    
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
