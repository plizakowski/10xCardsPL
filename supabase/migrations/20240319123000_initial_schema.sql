-- Migration: Initial schema for 10x-cards project
-- Description: Creates initial tables and security policies for flashcards management system
-- Author: System
-- Date: 2024-03-19

-- Set proper encoding and locale
set client_encoding = 'UTF8';

-- [ ] ROLLBACK SECTION
begin;

-- Disable RLS before dropping policies (if tables exist)
do $$ begin
    if exists (select 1 from information_schema.tables where table_name = 'ai_requests') then
        raise notice 'Disabling RLS for ai_requests...';
        alter table ai_requests disable row level security;
    end if;

    if exists (select 1 from information_schema.tables where table_name = 'flashcards') then
        raise notice 'Disabling RLS for flashcards...';
        alter table flashcards disable row level security;
    end if;
end $$;

-- Drop policies (if tables exist)
do $$ begin
    if exists (select 1 from information_schema.tables where table_name = 'ai_requests') then
        raise notice 'Dropping ai_requests policies...';
        drop policy if exists "Users can delete their own AI requests" on ai_requests;
        drop policy if exists "Users can insert their own AI requests" on ai_requests;
        drop policy if exists "Users can view their own AI requests" on ai_requests;
    end if;

    if exists (select 1 from information_schema.tables where table_name = 'flashcards') then
        raise notice 'Dropping flashcards policies...';
        drop policy if exists "Users can delete their own flashcards" on flashcards;
        drop policy if exists "Users can update their own flashcards" on flashcards;
        drop policy if exists "Users can insert their own flashcards" on flashcards;
        drop policy if exists "Users can view their own flashcards" on flashcards;
    end if;
end $$;

-- Drop indexes (if exist)
drop index if exists idx_ai_requests_user_id;
drop index if exists idx_flashcards_user_id;

-- Drop tables
do $$ begin
    raise notice 'Dropping tables...';
end $$;
drop table if exists ai_requests cascade;
drop table if exists flashcards cascade;

-- Drop enum type
do $$ begin
    raise notice 'Dropping enum type...';
end $$;
drop type if exists flashcard_status cascade;

commit;

-- [ ] MIGRATION SECTION
begin;

do $$ begin
    raise notice 'Starting migration...';
end $$;

-- [1] Enable required extensions
do $$ begin
    raise notice 'Enabling UUID extension...';
end $$;
create extension if not exists "uuid-ossp";

-- [2] Create custom types
do $$ begin
    raise notice 'Creating enum type...';
end $$;
do $$ begin
    if not exists (select 1 from pg_type where typname = 'flashcard_status') then
        create type flashcard_status as enum ('accepted', 'rejected', 'editing');
    end if;
end $$;

-- [3] Create tables and indexes
do $$ begin
    raise notice 'Creating tables...';
end $$;

-- Flashcards table
create table if not exists flashcards (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    front_text varchar(4000) not null,
    back_text varchar(4000) not null,
    status flashcard_status not null
);

do $$ begin
    raise notice 'Creating flashcards index...';
end $$;
create index if not exists idx_flashcards_user_id on flashcards(user_id);

-- AI Requests table
create table if not exists ai_requests (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    request_identifier text not null
);

do $$ begin
    raise notice 'Creating ai_requests index...';
end $$;
create index if not exists idx_ai_requests_user_id on ai_requests(user_id);

-- [4] Enable Row Level Security
do $$ begin
    raise notice 'Enabling RLS...';
end $$;
alter table flashcards enable row level security;
alter table ai_requests enable row level security;

-- [5] Create RLS policies
do $$ begin
    raise notice 'Creating RLS policies...';
end $$;

-- Flashcards policies
create policy "Users can view their own flashcards"
    on flashcards for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own flashcards"
    on flashcards for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
    on flashcards for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
    on flashcards for delete
    to authenticated
    using (auth.uid() = user_id);

-- AI Requests policies
create policy "Users can view their own AI requests"
    on ai_requests for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own AI requests"
    on ai_requests for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can delete their own AI requests"
    on ai_requests for delete
    to authenticated
    using (auth.uid() = user_id);

do $$ begin
    raise notice 'Migration completed successfully!';
end $$;
commit;

-- Note: We don't need to create users table as it's managed by Supabase Auth
-- The auth.users table is automatically created and managed by Supabase 