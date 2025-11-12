from typing import Optional, Dict, Any
import json
from src.service.database.helper import run_sql
from src.models.agent import AgentDecision

class AgentRepository:
    def log_decision(self, decision: AgentDecision) -> int:
        query = """
            INSERT INTO agent_decision_log 
            (user_message, agent_state, llm_reasoning, action_taken, result)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """
        result_json = json.dumps(decision.result) if decision.result else None
        params = (
            decision.user_message,
            decision.agent_state.value,
            decision.llm_reasoning,
            decision.action_taken.value,
            result_json
        )
        result = run_sql(query, params)
        return result[0][0] if result else None
    
    def get_recent_decisions(self, limit: int = 10) -> list:
        query = """
            SELECT id, user_message, agent_state, llm_reasoning, 
                   action_taken, result, created_at
            FROM agent_decision_log
            ORDER BY created_at DESC
            LIMIT %s
        """
        return run_sql(query, (limit,))
    
    def get_decision_by_id(self, decision_id: int) -> Optional[Dict[str, Any]]:
        query = """
            SELECT id, user_message, agent_state, llm_reasoning, 
                   action_taken, result, created_at
            FROM agent_decision_log
            WHERE id = %s
        """
        result = run_sql(query, (decision_id,))
        return result[0] if result else None
