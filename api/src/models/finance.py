from datetime import datetime
from pydantic import BaseModel


class finance(BaseModel):
    id: int
    name: str
    created_at: datetime
