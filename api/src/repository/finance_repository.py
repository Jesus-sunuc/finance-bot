from src.models.finance import finance
from src.service.database.helper import run_sql


class financeRepository:
    def get_all_finance_info(self):
        query = "select * from finance"
        return run_sql(query, output_class=finance)
