-- Fix: "infinite recursion detected in policy for relation profiles"
--
-- Several RLS policies query `profiles` to check the current user's role/clinic_id.
-- When those policies sit on the `profiles` table itself (or cross-reference via
-- patient_cases → profiles), PostgreSQL detects circular policy evaluation.
--
-- Solution: SECURITY DEFINER helper functions that read the current user's profile
-- row directly, bypassing RLS. Policies then call these cheap functions instead of
-- sub-selecting from `profiles`.

-- ---------------------------------------------------------------------------
-- Helper functions (bypass RLS via SECURITY DEFINER)
-- ---------------------------------------------------------------------------
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_user_clinic_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select clinic_id from public.profiles where id = auth.uid()
$$;

-- ---------------------------------------------------------------------------
-- Drop and recreate every policy that previously did `FROM profiles me`
-- ---------------------------------------------------------------------------

-- profiles: clinic staff reading patient profiles
drop policy if exists profiles_select_for_clinic_staff on public.profiles;
create policy profiles_select_for_clinic_staff
  on public.profiles for select
  to authenticated
  using (
    current_user_role() = 'clinic_staff'
    and current_user_clinic_id() is not null
    and exists (
      select 1
      from public.patient_cases pc
      where pc.user_id = profiles.id
        and pc.clinic_id = current_user_clinic_id()
    )
  );

-- patient_cases: clinic staff sees cases for their clinic
drop policy if exists patient_cases_select_clinic on public.patient_cases;
create policy patient_cases_select_clinic
  on public.patient_cases for select
  to authenticated
  using (
    current_user_role() = 'clinic_staff'
    and patient_cases.clinic_id = current_user_clinic_id()
  );

-- questionnaire_responses: clinic staff reads responses for their cases
drop policy if exists questionnaire_select_clinic on public.questionnaire_responses;
create policy questionnaire_select_clinic
  on public.questionnaire_responses for select
  to authenticated
  using (
    case_id is not null
    and current_user_role() = 'clinic_staff'
    and exists (
      select 1
      from public.patient_cases pc
      where pc.id = questionnaire_responses.case_id
        and pc.clinic_id = current_user_clinic_id()
    )
  );

-- case_files metadata: clinic staff reads files for their cases
drop policy if exists case_files_select_clinic on public.case_files;
create policy case_files_select_clinic
  on public.case_files for select
  to authenticated
  using (
    case_id is not null
    and current_user_role() = 'clinic_staff'
    and exists (
      select 1
      from public.patient_cases pc
      where pc.id = case_files.case_id
        and pc.clinic_id = current_user_clinic_id()
    )
  );

-- storage: clinic staff reads uploaded objects for their cases
drop policy if exists case_files_storage_select_clinic on storage.objects;
create policy case_files_storage_select_clinic
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'case-files'
    and current_user_role() = 'clinic_staff'
    and exists (
      select 1
      from public.case_files cf
      join public.patient_cases pc on pc.id = cf.case_id
      where cf.storage_path = objects.name
        and pc.clinic_id = current_user_clinic_id()
    )
  );
