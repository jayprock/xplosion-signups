-- 001: Create tables for x-signups

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  coach_last_name text not null,
  season_year integer not null,
  admin_password text not null,
  created_at timestamptz not null default now()
);

create table signup_lists (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  name text not null,
  slug text not null,
  category text not null check (category in ('dated', 'standalone')),
  date date,
  time text,
  location text,
  note text,
  fields jsonb not null default '[]',
  slots_needed integer not null,
  created_at timestamptz not null default now(),
  unique (team_id, slug)
);

create table signup_entries (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references signup_lists(id) on delete cascade,
  slot_index integer not null,
  "values" jsonb not null default '{}',
  signed_up_at timestamptz not null default now()
);
