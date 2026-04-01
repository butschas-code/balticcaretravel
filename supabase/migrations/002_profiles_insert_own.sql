-- Allow authenticated users to insert their own profile row if the auth trigger did not run
-- (e.g. legacy users or rare signup/confirm timing). Upsert in the portal uses this.

drop policy if exists profiles_insert_own on public.profiles;

create policy profiles_insert_own
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);
