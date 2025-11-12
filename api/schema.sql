-- psql -U $POSTGRES_USER $POSTGRES_DB

drop table if exists agent_decision_log cascade;

create table
    agent_decision_log (
        id serial primary key,
        user_message text not null,
        agent_state text not null,
        llm_reasoning text,
        action_taken text not null,
        result jsonb,
        created_at timestamp default current_timestamp
    );