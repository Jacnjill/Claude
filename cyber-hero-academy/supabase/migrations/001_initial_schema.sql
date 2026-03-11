-- ============================================================
-- Cyber Hero Academy — Initial Schema
-- Run this in your Supabase project's SQL editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Users (extends Supabase auth.users) ─────────────────────────────────────
create table if not exists public.user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text not null default 'Hero',
  xp          integer not null default 0,
  level       integer not null default 1,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Modules ─────────────────────────────────────────────────────────────────
create table if not exists public.modules (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null,
  difficulty    text not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  order_index   integer not null default 0,
  icon          text not null default '🛡️',
  color_accent  text not null default '#7C3AED',
  created_at    timestamptz not null default now()
);

-- ─── Lessons ─────────────────────────────────────────────────────────────────
create table if not exists public.lessons (
  id             uuid primary key default gen_random_uuid(),
  module_id      uuid not null references public.modules(id) on delete cascade,
  title          text not null,
  story_content  text not null,
  comic_panels   jsonb not null default '[]',
  order_index    integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ─── Quizzes ─────────────────────────────────────────────────────────────────
create table if not exists public.quizzes (
  id              uuid primary key default gen_random_uuid(),
  lesson_id       uuid not null references public.lessons(id) on delete cascade,
  question        text not null,
  options         jsonb not null,   -- [{ id, text }]
  correct_answer  text not null,    -- option id
  explanation     text not null default '',
  order_index     integer not null default 0
);

-- ─── Progress ────────────────────────────────────────────────────────────────
create table if not exists public.progress (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  module_id           uuid not null references public.modules(id) on delete cascade,
  lesson_id           uuid references public.lessons(id) on delete cascade,
  completion_status   text not null default 'not_started'
                        check (completion_status in ('not_started','in_progress','completed')),
  score               integer,        -- quiz score percentage
  xp_awarded          integer not null default 0,
  completed_at        timestamptz,
  unique (user_id, module_id, lesson_id)
);

-- ─── Badges ──────────────────────────────────────────────────────────────────
create table if not exists public.badges (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  description      text not null,
  icon             text not null default '🏅',
  condition_type   text not null check (condition_type in ('mission_complete','perfect_score','streak')),
  condition_value  integer not null default 1
);

-- ─── User Badges ─────────────────────────────────────────────────────────────
create table if not exists public.user_badges (
  user_id    uuid not null references auth.users(id) on delete cascade,
  badge_id   uuid not null references public.badges(id) on delete cascade,
  earned_at  timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.user_profiles enable row level security;
alter table public.modules        enable row level security;
alter table public.lessons        enable row level security;
alter table public.quizzes        enable row level security;
alter table public.progress       enable row level security;
alter table public.badges         enable row level security;
alter table public.user_badges    enable row level security;

-- Users can read/update their own profile
create policy "Users can view own profile"   on public.user_profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = id);

-- Modules and lessons are public (read-only for authenticated users)
create policy "Authenticated users can read modules" on public.modules for select to authenticated using (true);
create policy "Authenticated users can read lessons" on public.lessons for select to authenticated using (true);
create policy "Authenticated users can read quizzes" on public.quizzes for select to authenticated using (true);
create policy "Authenticated users can read badges"  on public.badges  for select to authenticated using (true);

-- Progress is private to each user
create policy "Users can view own progress"   on public.progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.progress for update using (auth.uid() = user_id);

-- User badges
create policy "Users can view own badges"   on public.user_badges for select using (auth.uid() = user_id);
create policy "Users can insert own badges" on public.user_badges for insert with check (auth.uid() = user_id);
