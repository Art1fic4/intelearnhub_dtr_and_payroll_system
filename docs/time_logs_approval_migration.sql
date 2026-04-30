alter table public.time_logs
  add column if not exists start_time text,
  add column if not exists end_time text,
  add column if not exists name text,
  add column if not exists role text,
  add column if not exists subject_code text,
  add column if not exists subject_description text,
  add column if not exists grade_level text,
  add column if not exists status text not null default 'pending',
  add column if not exists audit_note text,
  add column if not exists edited_by_admin boolean not null default false;

alter table public.time_logs
  add constraint if not exists time_logs_role_check check (role in ('Faculty', 'Student'));

alter table public.time_logs
  add constraint if not exists time_logs_status_check check (status in ('pending', 'approved', 'rejected'));

create index if not exists idx_time_logs_status on public.time_logs(status);
create index if not exists idx_time_logs_role on public.time_logs(role);
