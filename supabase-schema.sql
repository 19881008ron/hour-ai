create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (char_length(username) between 3 and 30),
  email text not null unique,
  nationality text not null,
  occupation text not null,
  age integer not null check (age between 18 and 100),
  gender text not null check (gender in ('female', 'male', 'nonbinary', 'prefer_not_to_say')),
  level text null check (level in ('C', 'B', 'A')),
  role text not null default 'customer' check (role in ('customer', 'agent', 'admin')),
  consent_at timestamptz not null,
  level_updated_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.level_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  previous_level text null check (previous_level in ('C', 'B', 'A')),
  new_level text null check (new_level in ('C', 'B', 'A')),
  changed_by uuid not null references public.profiles(user_id),
  changed_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.level_history enable row level security;
revoke all on public.profiles from anon, authenticated;
revoke all on public.level_history from anon, authenticated;

grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.level_history to service_role;
grant usage, select on sequence public.level_history_id_seq to service_role;

create index if not exists profiles_level_idx on public.profiles(level);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);
create index if not exists level_history_user_idx on public.level_history(user_id, changed_at desc);

-- After registering your own account, run this once with your real email:
-- update public.profiles set role = 'admin' where email = 'YOUR-ADMIN-EMAIL@example.com';
