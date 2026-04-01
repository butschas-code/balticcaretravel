-- Baltic Care Travel — patient portal schema
-- Run in Supabase SQL Editor (or supabase db push) once per project.
-- Requires: Auth email confirmations OFF for MVP (Authentication → Providers → Email).

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Clinics (partner registry; assign patients via patient_cases)
-- ---------------------------------------------------------------------------
create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users; separates identity from clinical payloads)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'patient' check (role in ('patient', 'clinic_staff')),
  clinic_id uuid references public.clinics (id),
  preferred_language text default 'de',
  phone text,
  country text,
  updated_at timestamptz not null default now()
);

create index if not exists profiles_clinic_id_idx on public.profiles (clinic_id);
create index if not exists profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- Service signup / intent (non-clinical coordination data)
-- ---------------------------------------------------------------------------
create table if not exists public.patient_intake (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  treatment_type text,
  country text,
  phone text,
  preferred_language text,
  referral_source text,
  consent_terms boolean not null default false,
  consent_privacy boolean not null default false,
  consent_health_data boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ---------------------------------------------------------------------------
-- Assignment to a partner clinic (backend / coordinator maintains rows)
-- ---------------------------------------------------------------------------
create table if not exists public.patient_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  clinic_id uuid not null references public.clinics (id) on delete restrict,
  treatment_plan_id text,
  status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'archived')),
  assigned_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patient_cases_user_id_idx on public.patient_cases (user_id);
create index if not exists patient_cases_clinic_id_idx on public.patient_cases (clinic_id);

-- ---------------------------------------------------------------------------
-- Questionnaire (flexible JSON; export to PDF/Word/API later)
-- ---------------------------------------------------------------------------
create table if not exists public.questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  case_id uuid references public.patient_cases (id) on delete set null,
  questionnaire_slug text not null default 'intake_v1',
  responses jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, questionnaire_slug)
);

-- ---------------------------------------------------------------------------
-- File metadata (Storage object path must match storage_path)
-- ---------------------------------------------------------------------------
create table if not exists public.case_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  case_id uuid references public.patient_cases (id) on delete set null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes int,
  created_at timestamptz not null default now(),
  unique (storage_path)
);

create index if not exists case_files_user_id_idx on public.case_files (user_id);
create index if not exists case_files_case_id_idx on public.case_files (case_id);

-- ---------------------------------------------------------------------------
-- Auth trigger: create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    ),
    'patient'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.clinics enable row level security;
alter table public.profiles enable row level security;
alter table public.patient_intake enable row level security;
alter table public.patient_cases enable row level security;
alter table public.questionnaire_responses enable row level security;
alter table public.case_files enable row level security;

-- Idempotent: safe if you run this migration more than once
drop policy if exists clinics_authenticated_read on public.clinics;
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_select_for_clinic_staff on public.profiles;
drop policy if exists patient_intake_select_own on public.patient_intake;
drop policy if exists patient_intake_insert_own on public.patient_intake;
drop policy if exists patient_intake_update_own on public.patient_intake;
drop policy if exists patient_cases_select_own on public.patient_cases;
drop policy if exists patient_cases_select_clinic on public.patient_cases;
drop policy if exists questionnaire_select_own on public.questionnaire_responses;
drop policy if exists questionnaire_insert_own on public.questionnaire_responses;
drop policy if exists questionnaire_update_own on public.questionnaire_responses;
drop policy if exists questionnaire_select_clinic on public.questionnaire_responses;
drop policy if exists case_files_select_own on public.case_files;
drop policy if exists case_files_insert_own on public.case_files;
drop policy if exists case_files_select_clinic on public.case_files;
drop policy if exists case_files_storage_insert_own on storage.objects;
drop policy if exists case_files_storage_select_own on storage.objects;
drop policy if exists case_files_storage_select_clinic on storage.objects;

-- Clinics: readable by any authenticated user (for display names); no public anon
create policy clinics_authenticated_read
  on public.clinics for select
  to authenticated
  using (true);

-- Profiles: own row
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Own-row insert: recovery if handle_new_user did not run; portal upsert after login
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Clinic staff: read patient profiles linked via shared cases
create policy profiles_select_for_clinic_staff
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles me
      join public.patient_cases pc on pc.user_id = profiles.id
      where me.id = auth.uid()
        and me.role = 'clinic_staff'
        and me.clinic_id is not null
        and pc.clinic_id = me.clinic_id
    )
  );

-- Intake
create policy patient_intake_select_own
  on public.patient_intake for select
  to authenticated
  using (auth.uid() = user_id);

create policy patient_intake_insert_own
  on public.patient_intake for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy patient_intake_update_own
  on public.patient_intake for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Cases: patient sees own
create policy patient_cases_select_own
  on public.patient_cases for select
  to authenticated
  using (auth.uid() = user_id);

-- Cases: clinic staff sees cases for their clinic
create policy patient_cases_select_clinic
  on public.patient_cases for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles me
      where me.id = auth.uid()
        and me.role = 'clinic_staff'
        and me.clinic_id = patient_cases.clinic_id
    )
  );

-- Questionnaire
create policy questionnaire_select_own
  on public.questionnaire_responses for select
  to authenticated
  using (auth.uid() = user_id);

create policy questionnaire_insert_own
  on public.questionnaire_responses for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy questionnaire_update_own
  on public.questionnaire_responses for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy questionnaire_select_clinic
  on public.questionnaire_responses for select
  to authenticated
  using (
    case_id is not null
    and exists (
      select 1
      from public.patient_cases pc
      join public.profiles me on me.id = auth.uid()
      where pc.id = questionnaire_responses.case_id
        and me.role = 'clinic_staff'
        and me.clinic_id = pc.clinic_id
    )
  );

-- Case files metadata
create policy case_files_select_own
  on public.case_files for select
  to authenticated
  using (auth.uid() = user_id);

create policy case_files_insert_own
  on public.case_files for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy case_files_select_clinic
  on public.case_files for select
  to authenticated
  using (
    case_id is not null
    and exists (
      select 1
      from public.patient_cases pc
      join public.profiles me on me.id = auth.uid()
      where pc.id = case_files.case_id
        and me.role = 'clinic_staff'
        and me.clinic_id = pc.clinic_id
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: private bucket for case files (5 MB enforced in app + optional dashboard limit)
-- ---------------------------------------------------------------------------
-- 5 MB limit and MIME allowlist can be set in Dashboard → Storage → case-files → Configuration
insert into storage.buckets (id, name, public)
values ('case-files', 'case-files', false)
on conflict (id) do nothing;

-- Path convention: {auth.uid()}/{uuid}_{original_name}
create policy case_files_storage_insert_own
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'case-files'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy case_files_storage_select_own
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'case-files'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy case_files_storage_select_clinic
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'case-files'
    and exists (
      select 1
      from public.case_files cf
      join public.patient_cases pc on pc.id = cf.case_id
      join public.profiles me on me.id = auth.uid()
      where cf.storage_path = objects.name
        and me.role = 'clinic_staff'
        and me.clinic_id = pc.clinic_id
    )
  );

-- Optional seed clinic (replace in dashboard)
insert into public.clinics (slug, name)
values ('partner-placeholder', 'Partner clinic (assign in admin)')
on conflict (slug) do nothing;
