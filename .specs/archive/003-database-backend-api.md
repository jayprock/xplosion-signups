---
id: 003-database-backend-api
title: Database & Backend API
created: 2026-03-08
priority: medium
tags: [backend, database, supabase]
blocked-by: [002-admin-interface]
---

## Goal

Replace the in-memory mock data layer with a real Supabase (PostgreSQL) backend. The existing UI pages, forms, and components stay exactly the same — only the data access layer (`src/lib/data/index.ts`) gets rewritten to call Supabase instead of reading/writing in-memory arrays.

This is the foundation for the app to actually persist data across deployments and support real users.

## Database Schema

Three tables, matching the existing TypeScript types:

### `teams`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| name | text | e.g., "12U Xplosion" |
| slug | text (unique) | URL-safe, e.g., "xplosion-12u" |
| coach_last_name | text | Used for parent search |
| season_year | integer | e.g., 2026 |
| admin_password | text | Plain text (low-stakes, small community) |
| created_at | timestamptz | Default now() |

### `signup_lists`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| team_id | uuid (FK → teams) | Cascade delete |
| name | text | e.g., "Mowing" |
| slug | text | Unique within team (composite unique on team_id + slug) |
| category | text | "dated" or "standalone" |
| date | date | Nullable, for dated lists |
| time | text | Nullable |
| location | text | Nullable |
| note | text | Nullable |
| fields | jsonb | Array of FieldDefinition objects: `[{key, label, type, required}]` |
| slots_needed | integer | How many entries are needed |
| created_at | timestamptz | Default now() |

### `signup_entries`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| list_id | uuid (FK → signup_lists) | Cascade delete |
| slot_index | integer | Which slot this fills (0 to slots_needed - 1) |
| values | jsonb | Key-value pairs: `{name: "Tom", song: "..."}` |
| signed_up_at | timestamptz | Default now() |

**Why JSONB for `fields` and `values`:** The current app uses `FieldDefinition[]` and `Record<string, string>` — JSONB maps directly to these types with no extra tables or joins. Simpler schema, simpler queries.

## Auth

**No changes to the auth model.** Keep the current cookie-based password system:

- **Site admin**: Password stored in an environment variable (`SITE_ADMIN_PASSWORD`). Verified server-side, sets `site_admin` cookie.
- **Team admin**: Password stored in the `teams.admin_password` column. Verified server-side, sets `admin_[teamSlug]` cookie.
- **Parents**: No login required. Anonymous access for viewing lists and submitting/editing/removing entries.

Supabase Auth is not used — the app connects to Supabase using the service role key server-side. All database access goes through server actions and API routes (never from the browser directly).

## Row-Level Security (RLS)

RLS is enabled on all tables but policies are straightforward since all access is server-side via the service role key:

- The Supabase client uses the **service role key** (bypasses RLS) because auth is handled at the application level via cookies, not Supabase Auth.
- RLS is enabled as a safety net with permissive policies, in case a client key is ever accidentally exposed.

| Table | Policy |
|-------|--------|
| teams | Public read. Authenticated (service role) write. |
| signup_lists | Public read. Authenticated (service role) write. |
| signup_entries | Public read/insert/update/delete (community trust model). |

## Race Condition Handling

**Problem:** Two parents see 1 slot open and both submit at the same time → 2 entries for 1 slot.

**Solution:** A PostgreSQL function `claim_signup_slot` that:
1. Counts existing entries for the given list
2. Checks if count < `slots_needed`
3. Inserts the new entry only if there's room
4. Returns the new entry on success, or an error if the slot was just taken

This runs as a single database transaction, so two simultaneous requests can't both succeed. The UI shows a friendly "This slot was just filled — try another" message on failure.

## Data Layer Swap

Replace `src/lib/data/index.ts` implementation:

- **Same exported function signatures** — `getTeamBySlug()`, `getSignupListsForTeam()`, `createSignupList()`, etc.
- **Same return types** — functions still return `Team`, `SignupList`, `SignupEntry`, etc.
- **Supabase client** initialized from environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- **Column name mapping** — database uses `snake_case`, TypeScript uses `camelCase`. Mapping happens in the data layer so the rest of the app doesn't need to change.
- Delete `src/lib/data/mock-data.ts` once the swap is complete.

Pure helper functions that don't touch data (`getListStatus`, `groupListsByDate`, `getStandaloneLists`) stay as-is — they compute from the data, they don't fetch it.

## SQL Migrations

Provide migrations as `.sql` files in a `supabase/migrations/` directory:

1. `001_create_tables.sql` — Create teams, signup_lists, signup_entries tables
2. `002_enable_rls.sql` — Enable RLS and create policies
3. `003_claim_slot_function.sql` — Create the `claim_signup_slot` function

## Prerequisites (manual, one-time)

Before implementing this spec, you need a Supabase project:

1. **Create a free Supabase account** at https://supabase.com (sign in with GitHub)
2. **Create a new project** — pick any name (e.g., "x-signups"), choose a region close to you, set a database password
3. **Copy your project credentials** — from the project's Settings → API page, grab the Project URL and service_role key

That's it. The free tier includes 2 projects, 500MB storage, and unlimited API requests — more than enough for this app. This is the same database you'll use in production.

### What the implementation handles (no manual steps)

- All SQL migration files (you'll run these against your Supabase project)
- npm dependency (`@supabase/supabase-js`)
- `.env.local` with your project credentials
- Rewritten data layer pointing at Supabase

## Environment Variables

New variables needed in `.env.local`:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_ADMIN_PASSWORD=admin123
```

`SITE_ADMIN_PASSWORD` moves from being hardcoded to an env var.

## Acceptance Criteria

- [ ] Running the SQL migrations on a fresh Supabase project creates all tables, policies, and functions
- [ ] Creating a team through the admin UI persists it in Supabase (survives server restart)
- [ ] Creating signup lists (including recurring weekly lists) persists correctly
- [ ] Parents can sign up for a slot, and the entry appears in the database
- [ ] If all slots are filled, the signup form shows the list as full
- [ ] Two simultaneous signups for the last slot: one succeeds, one gets a "slot just filled" message
- [ ] Parents can edit and remove any entry (community trust model)
- [ ] Admin login still works with team passwords and site admin password
- [ ] Coach search on the home page returns results from the database
- [ ] The mock data file (`mock-data.ts`) is deleted
- [ ] All existing pages and flows work identically to the mock version
- [ ] Environment variables are documented and the app fails gracefully if they're missing

## Out of Scope

- Supabase Auth / magic links (staying with simple passwords)
- Email functionality (that's spec 004)
- Vercel deployment and domain setup (that's spec 005 — Supabase project creation moves here)
- Seeding real team data (that's spec 006)
- UI changes (this spec is backend-only — the UI stays the same)
