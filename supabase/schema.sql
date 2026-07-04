create table if not exists public.couple_app_state (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint couple_app_state_singleton check (id = 'shared')
);

alter table public.couple_app_state enable row level security;

create policy "public read couple app state"
  on public.couple_app_state
  for select
  using (true);

create policy "public insert couple app state"
  on public.couple_app_state
  for insert
  with check (true);

create policy "public update couple app state"
  on public.couple_app_state
  for update
  using (true)
  with check (true);

create or replace function public.set_couple_app_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_couple_app_state_updated_at on public.couple_app_state;

create trigger set_couple_app_state_updated_at
before insert or update on public.couple_app_state
for each row
execute function public.set_couple_app_state_updated_at();
