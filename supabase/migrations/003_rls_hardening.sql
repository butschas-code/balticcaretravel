-- Harden RLS: block privilege escalation on profiles, validate case_id on writes.
-- Run after 001 (and 002). Safe to re-run: uses DROP IF EXISTS / OR REPLACE.

-- ---------------------------------------------------------------------------
-- Profiles: patients cannot promote themselves to clinic_staff or set clinic_id
-- (RLS update policy alone does not restrict columns.)
-- ---------------------------------------------------------------------------
create or replace function public.profiles_enforce_patient_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only when the signed-in user updates their own row (not service role / SQL as postgres).
  if old.role = 'patient'
     and auth.uid() is not null
     and auth.uid() = old.id
  then
    new.role := 'patient';
    new.clinic_id := null;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_enforce_patient_row_trg on public.profiles;
create trigger profiles_enforce_patient_row_trg
  before update on public.profiles
  for each row
  execute function public.profiles_enforce_patient_row();

-- Client-side recovery insert must only create a normal patient row
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles for insert
  to authenticated
  with check (
    auth.uid() = id
    and role = 'patient'
    and clinic_id is null
  );

-- ---------------------------------------------------------------------------
-- case_files: case_id must be null or refer to the same user's case
-- ---------------------------------------------------------------------------
drop policy if exists case_files_insert_own on public.case_files;
create policy case_files_insert_own
  on public.case_files for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and (
      case_id is null
      or exists (
        select 1
        from public.patient_cases pc
        where pc.id = case_id
          and pc.user_id = auth.uid()
      )
    )
  );

-- ---------------------------------------------------------------------------
-- questionnaire_responses: same case_id rule on insert/update
-- ---------------------------------------------------------------------------
drop policy if exists questionnaire_insert_own on public.questionnaire_responses;
create policy questionnaire_insert_own
  on public.questionnaire_responses for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and (
      case_id is null
      or exists (
        select 1
        from public.patient_cases pc
        where pc.id = case_id
          and pc.user_id = auth.uid()
      )
    )
  );

drop policy if exists questionnaire_update_own on public.questionnaire_responses;
create policy questionnaire_update_own
  on public.questionnaire_responses for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      case_id is null
      or exists (
        select 1
        from public.patient_cases pc
        where pc.id = case_id
          and pc.user_id = auth.uid()
      )
    )
  );
