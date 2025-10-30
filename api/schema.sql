-- psql -U $POSTGRES_USER $POSTGRES_DB
drop table if exists finance cascade;

create table finance (
    id serial primary key,
    name text not null,
    created_at timestamp default current_timestamp
);