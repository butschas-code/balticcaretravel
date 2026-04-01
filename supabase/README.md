# Supabase setup (patient portal)

This folder documents how to connect the Baltic Care Travel **login** page (`/login.html`) to your Supabase project.

## 1. Create a project

Use your existing project URL (Settings → API → Project URL).

## 2. Run the database migration

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste the contents of `migrations/001_portal_schema.sql`.
3. Run it once (or again after edits: policies are dropped and recreated so re-runs are safe).

If the auth trigger fails with a syntax error, replace:

`execute procedure public.handle_new_user()`

with:

`execute function public.handle_new_user()`

(depending on your Postgres version).

4. **Also run** `migrations/002_profiles_insert_own.sql` once. It adds an RLS policy so the portal can create a missing `profiles` row after login (fixes users who confirmed email but had no profile row, and makes client-side recovery possible).

5. **Run** `migrations/003_rls_hardening.sql` once. It tightens RLS: patients cannot self-promote to `clinic_staff`, client inserts into `profiles` must be `role = patient`, and `case_id` on `case_files` / `questionnaire_responses` must belong to the same user (or be null). **001 already enables RLS on all portal tables**; 003 closes common holes.

## 3. Auth settings

- **Authentication → Providers → Email**: enable.
- **Confirm email** (recommended for production): when **on**, new users see a clear “check your inbox” screen on `login.html` until they confirm; when **off**, Supabase returns a session immediately after sign-up and users skip that step (they still see a short welcome message before the intake wizard).
- **Authentication → URL configuration** (you set this once in the Supabase dashboard):
  - Run **`npm run supabase:auth-help`** from the website project root: it prints the list below, checks `.env`, and opens the URL settings page (if `VITE_SUPABASE_URL` is set).
  - **Deployed site (Vercel):**
    - **Site URL:** `https://balticcaretravel.vercel.app`
    - **Redirect URLs** (add each):  
      `https://balticcaretravel.vercel.app/login.html`  
      `http://localhost:3000/login.html`  
      `http://127.0.0.1:3000/login.html`
  - **Optional:** if you use Vercel *branch* previews (random `*.vercel.app` hosts), add redirect pattern: `https://*.vercel.app/**`

## 4. Local environment variables

1. Copy `.env.example` to `.env` in the **website** project root (never commit `.env`).
2. In Supabase: **Settings → API → Project API keys**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`  
   Do **not** put the `service_role` key in the frontend or in git.

3. Start the dev server: `npm run dev` and open `/login.html`.

## 5. Assigning patients to clinics (until you have an admin app)

Coordinators can use the **Table Editor** (with appropriate dashboard access) or SQL:

1. Ensure a row exists in `clinics` (a placeholder is inserted by the migration).
2. Insert into `patient_cases`:

```sql
insert into public.patient_cases (user_id, clinic_id, status, treatment_plan_id)
values (
  '<patient-auth-uuid>',
  '<clinic-uuid>',
  'active',
  'PLAN-2026-001'
);
```

3. For **clinic staff** logins: create the user in Auth, then update their profile:

```sql
update public.profiles
set role = 'clinic_staff', clinic_id = '<clinic-uuid>'
where id = '<staff-auth-uuid>';
```

## 6. Storage

The migration creates a private bucket `case-files` and RLS policies:

- Patients upload under `{user_id}/...`.
- Clinic staff can read objects that are referenced in `case_files` for cases assigned to their `clinic_id`.

Configure a **5 MB** limit and allowed MIME types in **Storage → case-files** if you want stricter enforcement than the app alone.

## 7. Security notes

- The **anon** key is safe in the browser only because of **RLS**. Never disable RLS on these tables in production without replacing controls.
- For server-side matching, automation, or doctor-system APIs, use **Edge Functions** or a small backend with the **service_role** key (server-only), not in Vite.

## 8. Later improvements

- Email confirmation, password reset, and MFA.
- Word/PDF generation (server-side) and HL7/FHIR or clinic-specific APIs.
- Auditing and retention policies for health data (GDPR / German practice).
