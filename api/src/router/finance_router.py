from fastapi import APIRouter
from src.repository.finance_repository import financeRepository


router = APIRouter(
    prefix="/finance", tags=["finance"], responses={404: {"description": "Not found"}}
)

repo = financeRepository()


@router.get("/all")
def get_all_finance_info():
    return repo.get_all_finance_info()
