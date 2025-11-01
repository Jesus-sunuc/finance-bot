import os
from typing import List, Optional, Type, TypeVar
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row

T = TypeVar("T")


class DatabaseConfig:
    def __init__(self):
        self.user = os.environ["PG_USER"]
        self.password = os.environ["PG_PASSWORD"]
        self.host = os.environ["PG_HOST"]
        self.database = os.environ["PG_DB"]
    
    @property
    def connection_string(self) -> str:
        return f"password={self.password} user={self.user} host={self.host} dbname={self.database}"


class Database:
    _instance = None
    _pool = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._initialize_pool()
        return cls._instance
    
    @classmethod
    def _initialize_pool(cls):
        config = DatabaseConfig()
        cls._pool = ConnectionPool(
            config.connection_string,
            open=True,
            check=ConnectionPool.check_connection,
        )
        cls._pool.wait(timeout=20.0)
    
    @classmethod
    def get_pool(cls) -> ConnectionPool:
        if cls._pool is None:
            cls._initialize_pool()
        return cls._pool


def run_sql(sql: str, params: Optional[tuple] = None, output_class: Optional[Type[T]] = None) -> List[T]:
    pool = Database.get_pool()
    
    try:
        with pool.connection() as conn:
            cursor_factory = class_row(output_class) if output_class else None
            
            with conn.cursor(row_factory=cursor_factory) as cur:
                cur.execute(sql, params)
                
                if cur.description is None:
                    return []
                
                return cur.fetchall()
                
    except Exception as error:
        print(f"SQL Error: {sql}")
        print(f"Parameters: {params}")
        raise error
