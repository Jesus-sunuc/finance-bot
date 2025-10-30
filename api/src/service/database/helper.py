from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
import os
from typing import List, Optional
from typing import TypeVar, Type


pg_user = os.environ["PG_USER"]
pg_password = os.environ["PG_PASSWORD"]
pg_host = os.environ["PG_HOST"]
pg_db = os.environ["PG_DB"]

pool = ConnectionPool(
    f"""password={pg_password} user={pg_user} host={pg_host} dbname={pg_db}""",
    open=True,
    check=ConnectionPool.check_connection,
)
pool.wait(timeout=20.0)

T = TypeVar("T")

def run_sql(sql, params=None, output_class: Optional[Type[T]] = None) -> List[T]:
    try:  
        with pool.connection() as connection:
            with (
                connection.cursor(row_factory=class_row(output_class))
                if output_class is not None
                else connection.cursor()
            ) as cursor:
                cursor.execute(sql, params)
                if output_class is None:
                    return cursor.fetchall() if cursor.description is not None else []
                else:
                    records = cursor.fetchall()
                    return records
    except Exception as e:
        print(sql)
        print(params)
        raise
