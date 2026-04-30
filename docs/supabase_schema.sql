-- Interlearn Hub baseline schema for Supabase
-- Based on src/core/contracts/models.ts

create table if not exists public.faculty (
  id text primary key,
  name text not null,
  email text not null unique,
  phone text not null,
  address text not null,
  education_level text not null,
  hourly_rate numeric(10,2) not null check (hourly_rate >= 0),
  subjects text[] not null default '{}',
  bank_account text,
  has_profile_pic boolean not null default false,
  has_tor boolean not null default false,
  has_diploma boolean not null default false,
  profile_picture jsonb,
  documents jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id text primary key,
  name text not null,
  email text not null unique,
  phone text not null,
  address text not null,
  grade_level text not null,
  subjects text[] not null default '{}',
  profile_picture jsonb,
  documents jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id text primary key,
  code text not null unique,
  name text not null,
  description text not null,
  days text[] not null default '{}',
  start_time text not null,
  end_time text not null,
  grade_level text not null,
  faculty_id text references public.faculty(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.time_logs (
  id text primary key,
  date date not null,
  time text not null,
  start_time text,
  end_time text,
  name text,
  role text check (role in ('Faculty', 'Student')),
  subject_code text,
  subject_description text,
  grade_level text,
  faculty_id text not null references public.faculty(id) on update cascade on delete restrict,
  faculty_name text not null,
  subject text not null,
  grade text not null,
  hours numeric(6,2) not null check (hours >= 0),
  hourly_rate numeric(10,2) not null check (hourly_rate >= 0),
  is_overtime boolean not null default false,
  has_tor boolean not null default false,
  has_diploma boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  audit_note text,
  edited_by_admin boolean not null default false,
  period_start date,
  period_end date,
  period_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance_records (
  id text primary key,
  student_id text not null references public.students(id) on update cascade on delete restrict,
  student_name text not null,
  date date not null,
  time text not null,
  subject text not null,
  status text not null check (status in ('Present', 'Absent')),
  period_start date,
  period_end date,
  period_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subjects_faculty_id on public.subjects(faculty_id);
create index if not exists idx_time_logs_faculty_id on public.time_logs(faculty_id);
create index if not exists idx_attendance_student_id on public.attendance_records(student_id);

alter table public.faculty enable row level security;
alter table public.students enable row level security;
alter table public.subjects enable row level security;
alter table public.time_logs enable row level security;
alter table public.attendance_records enable row level security;

drop policy if exists "Allow anon read faculty" on public.faculty;
create policy "Allow anon read faculty" on public.faculty for select to anon, authenticated using (true);
drop policy if exists "Allow anon write faculty" on public.faculty;
create policy "Allow anon write faculty" on public.faculty for insert to anon, authenticated with check (true);
drop policy if exists "Allow anon update faculty" on public.faculty;
create policy "Allow anon update faculty" on public.faculty for update to anon, authenticated using (true) with check (true);
drop policy if exists "Allow anon delete faculty" on public.faculty;
create policy "Allow anon delete faculty" on public.faculty for delete to anon, authenticated using (true);

drop policy if exists "Allow anon read students" on public.students;
create policy "Allow anon read students" on public.students for select to anon, authenticated using (true);
drop policy if exists "Allow anon write students" on public.students;
create policy "Allow anon write students" on public.students for insert to anon, authenticated with check (true);
drop policy if exists "Allow anon update students" on public.students;
create policy "Allow anon update students" on public.students for update to anon, authenticated using (true) with check (true);
drop policy if exists "Allow anon delete students" on public.students;
create policy "Allow anon delete students" on public.students for delete to anon, authenticated using (true);

drop policy if exists "Allow anon read subjects" on public.subjects;
create policy "Allow anon read subjects" on public.subjects for select to anon, authenticated using (true);
drop policy if exists "Allow anon write subjects" on public.subjects;
create policy "Allow anon write subjects" on public.subjects for insert to anon, authenticated with check (true);
drop policy if exists "Allow anon update subjects" on public.subjects;
create policy "Allow anon update subjects" on public.subjects for update to anon, authenticated using (true) with check (true);
drop policy if exists "Allow anon delete subjects" on public.subjects;
create policy "Allow anon delete subjects" on public.subjects for delete to anon, authenticated using (true);

drop policy if exists "Allow anon read time_logs" on public.time_logs;
create policy "Allow anon read time_logs" on public.time_logs for select to anon, authenticated using (true);
drop policy if exists "Allow anon write time_logs" on public.time_logs;
create policy "Allow anon write time_logs" on public.time_logs for insert to anon, authenticated with check (true);
drop policy if exists "Allow anon update time_logs" on public.time_logs;
create policy "Allow anon update time_logs" on public.time_logs for update to anon, authenticated using (true) with check (true);
drop policy if exists "Allow anon delete time_logs" on public.time_logs;
create policy "Allow anon delete time_logs" on public.time_logs for delete to anon, authenticated using (true);

drop policy if exists "Allow anon read attendance_records" on public.attendance_records;
create policy "Allow anon read attendance_records" on public.attendance_records for select to anon, authenticated using (true);
drop policy if exists "Allow anon write attendance_records" on public.attendance_records;
create policy "Allow anon write attendance_records" on public.attendance_records for insert to anon, authenticated with check (true);
drop policy if exists "Allow anon update attendance_records" on public.attendance_records;
create policy "Allow anon update attendance_records" on public.attendance_records for update to anon, authenticated using (true) with check (true);
drop policy if exists "Allow anon delete attendance_records" on public.attendance_records;
create policy "Allow anon delete attendance_records" on public.attendance_records for delete to anon, authenticated using (true);
  