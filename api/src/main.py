from dotenv import load_dotenv
load_dotenv()

from src.router import expenses_router, agent_router, budget_router, receipt_router, chat_router
import logging
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FinanceBot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "https://finance-jesus.duckdns.org"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.getLogger("uvicorn.access").addFilter(lambda _: False)

router = APIRouter(prefix="/api")

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "FinanceBot API"}

router.include_router(expenses_router.router)
router.include_router(agent_router.router)
router.include_router(budget_router.router)
router.include_router(receipt_router.router)
router.include_router(chat_router.router)

app.include_router(router)
