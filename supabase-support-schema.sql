alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('customer', 'agent', 'admin'));

create table if not exists public.support_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  topic text not null default 'course',
  status text not null default 'open' check (status in ('open', 'pending', 'closed')),
  priority text not null default 'normal' check (priority in ('normal', 'high')),
  assigned_to uuid null references public.profiles(user_id),
  last_message_at timestamptz not null default now(),
  customer_unread integer not null default 0,
  agent_unread integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(user_id) on delete cascade,
  sender_role text not null check (sender_role in ('customer', 'agent', 'admin')),
  body text not null default '',
  created_at timestamptz not null default now(),
  read_at timestamptz null
);

create table if not exists public.support_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.support_messages(id) on delete cascade,
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text not null check (mime_type in ('image/png', 'image/jpeg', 'image/webp', 'image/gif')),
  file_size integer not null check (file_size > 0 and file_size <= 4194304),
  created_at timestamptz not null default now()
);

create table if not exists public.support_agent_notes (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  agent_id uuid not null references public.profiles(user_id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.support_conversation_tags (
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  primary key (conversation_id, tag)
);

alter table public.support_conversations enable row level security;
alter table public.support_messages enable row level security;
alter table public.support_attachments enable row level security;
alter table public.support_agent_notes enable row level security;
alter table public.support_conversation_tags enable row level security;

revoke all on public.support_conversations from anon, authenticated;
revoke all on public.support_messages from anon, authenticated;
revoke all on public.support_attachments from anon, authenticated;
revoke all on public.support_agent_notes from anon, authenticated;
revoke all on public.support_conversation_tags from anon, authenticated;

grant select, insert, update, delete on public.support_conversations to service_role;
grant select, insert, update, delete on public.support_messages to service_role;
grant select, insert, update, delete on public.support_attachments to service_role;
grant select, insert, update, delete on public.support_agent_notes to service_role;
grant select, insert, update, delete on public.support_conversation_tags to service_role;
grant usage, select on sequence public.support_agent_notes_id_seq to service_role;

create index if not exists support_conversations_user_idx on public.support_conversations(user_id, last_message_at desc);
create index if not exists support_conversations_status_idx on public.support_conversations(status, last_message_at desc);
create index if not exists support_messages_conversation_idx on public.support_messages(conversation_id, created_at asc);
create index if not exists support_attachments_message_idx on public.support_attachments(message_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'support-attachments',
  'support-attachments',
  false,
  4194304,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Optional: promote an account to support agent.
-- update public.profiles set role = 'agent' where email = 'AGENT-EMAIL@example.com';
