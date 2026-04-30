# Supabase Table Setup

This creates Supabase tables based on the frontend contracts in `src/core/contracts/models.ts`.

## 1) Run the schema SQL

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Open `docs/supabase_schema.sql` from this repo and copy all content.
4. Paste into SQL Editor, then click **Run**.

## 2) Verify tables

In SQL Editor, run:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('faculty', 'students', 'subjects', 'time_logs', 'attendance_records')
order by table_name;
```

## 3) Quick insert test

Run this test insert:

```sql
insert into public.faculty (
  id, name, email, phone, address, education_level, hourly_rate, subjects, has_profile_pic, has_tor, has_diploma
)
values (
  'FA-TEST-001',
  'Supabase Test Faculty',
  'supabase.test.faculty@interlearn.edu',
  '+63 900 000 0000',
  'Test Address',
  'Masteral',
  500.00,
  array['MATH-101'],
  false,
  true,
  true
)
on conflict (id) do nothing;
```

Then verify:

```sql
select id, name, email
from public.faculty
where id = 'FA-TEST-001';
```

## Notes

- This schema uses text IDs to match your existing mock IDs (for example `FA-1001`, `ST-10001`).
- `subjects` and `days` are stored as Postgres text arrays.
- `profile_picture` and `documents` are stored as JSONB.
- `subjects.faculty_id` is nullable so subjects can be created before assigning faculty.
- Current RLS policies allow both `anon` and `authenticated` read/insert/update/delete for quick integration testing. Tighten these before production.

## If you already created tables before this update

Run this SQL migration once:

```sql
alter table public.subjects
  alter column faculty_id drop not null;

alter table public.subjects
  drop constraint if exists subjects_faculty_id_fkey;

alter table public.subjects
  add constraint subjects_faculty_id_fkey
  foreign key (faculty_id)
  references public.faculty(id)
  on update cascade
  on delete set null;

-- If student update fails with "Check Supabase RLS update policy",
-- make sure authenticated sessions are also allowed by RLS:
drop policy if exists "Allow anon read students" on public.students;
create policy "Allow anon read students" on public.students for select to anon, authenticated using (true);
drop policy if exists "Allow anon write students" on public.students;
create policy "Allow anon write students" on public.students for insert to anon, authenticated with check (true);
drop policy if exists "Allow anon update students" on public.students;
create policy "Allow anon update students" on public.students for update to anon, authenticated using (true) with check (true);
drop policy if exists "Allow anon delete students" on public.students;
create policy "Allow anon delete students" on public.students for delete to anon, authenticated using (true);
```
