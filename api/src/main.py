from dotenv import load_dotenv

load_dotenv()

from src.router import finance_router


import logging
from fastapi import FastAPI, APIRouter


app = FastAPI()

logging.getLogger("uvicorn.access").addFilter(lambda _: False)


router = APIRouter(prefix="/api")


@router.get("/health")
def health_check():
    return True


router.include_router(finance_router.router)

app.include_router(router)
