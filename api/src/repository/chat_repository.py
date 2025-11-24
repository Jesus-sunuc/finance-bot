from typing import List, Optional
from src.service.database.helper import Database
import json


class ChatRepository:
    @staticmethod
    def save_message(
        user_id: str,
        role: str,
        content: str,
        reasoning: Optional[str] = None,
        session_id: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> int:
        pool = Database.get_pool()

        with pool.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO chat_messages (user_id, role, content, reasoning, session_id, metadata)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    (
                        user_id,
                        role,
                        content,
                        reasoning,
                        session_id,
                        json.dumps(metadata) if metadata else None,
                    ),
                )
                message_id = cursor.fetchone()[0]
                conn.commit()
                return message_id

    @staticmethod
    def get_user_messages(user_id: str, limit: int = 100) -> List[dict]:
        pool = Database.get_pool()

        with pool.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id, user_id, role, content, reasoning, timestamp, session_id, metadata
                    FROM chat_messages
                    WHERE user_id = %s
                    ORDER BY timestamp ASC
                    LIMIT %s
                    """,
                    (user_id, limit),
                )

                columns = [desc[0] for desc in cursor.description]
                messages = []
                for row in cursor.fetchall():
                    message = dict(zip(columns, row))
                    if message.get("metadata"):
                        message["metadata"] = (
                            json.loads(message["metadata"])
                            if isinstance(message["metadata"], str)
                            else message["metadata"]
                        )
                    if message.get("timestamp"):
                        message["timestamp"] = message["timestamp"].isoformat()
                    messages.append(message)

                return messages

    @staticmethod
    def get_session_messages(session_id: str) -> List[dict]:
        pool = Database.get_pool()

        with pool.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id, user_id, role, content, reasoning, timestamp, session_id, metadata
                    FROM chat_messages
                    WHERE session_id = %s
                    ORDER BY timestamp ASC
                    """,
                    (session_id,),
                )

                columns = [desc[0] for desc in cursor.description]
                messages = []
                for row in cursor.fetchall():
                    message = dict(zip(columns, row))
                    if message.get("metadata"):
                        message["metadata"] = (
                            json.loads(message["metadata"])
                            if isinstance(message["metadata"], str)
                            else message["metadata"]
                        )
                    if message.get("timestamp"):
                        message["timestamp"] = message["timestamp"].isoformat()
                    messages.append(message)

                return messages

    @staticmethod
    def delete_user_messages(user_id: str) -> int:
        pool = Database.get_pool()

        with pool.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    DELETE FROM chat_messages
                    WHERE user_id = %s
                    """,
                    (user_id,),
                )
                deleted_count = cursor.rowcount
                conn.commit()
                return deleted_count

    @staticmethod
    def delete_session_messages(session_id: str) -> int:
        pool = Database.get_pool()

        with pool.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    DELETE FROM chat_messages
                    WHERE session_id = %s
                    """,
                    (session_id,),
                )
                deleted_count = cursor.rowcount
                conn.commit()
                return deleted_count
