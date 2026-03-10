---
id: 002-admin-interface
title: Admin Interface
created: 2026-03-08
priority: medium
tags: [frontend, admin]
blocked-by: [001-volunteer-signup-app]
---

## Goal

Build password-protected admin pages for managing signup lists and team settings, plus open entry editing on parent-facing pages. Extends the app from spec 001 using the same swappable mock data layer.

**Admin = can create/edit/delete signup lists and manage team settings.**
**Non-admin = can view lists, sign up, and edit/remove any signup entry.**

No user accounts, no roster, no coach role — just a per-team password gate.

## Auth Gate

- Add `adminPassword` field to the `Team` type
- Visiting any `/t/[teamSlug]/admin/...` route without a valid session redirects to a login page
- Login page: simple password input form at `/t/[teamSlug]/admin/login`
- On correct password: set an HTTP-only cookie scoped to the team
- Next.js middleware checks for valid cookie on all `/admin` subroutes
- Invalid password: inline error message, no lockout (not security-critical)
- This auth approach gets replaced entirely by Supabase auth in spec 003

## Admin Pages

### Admin Dashboard (`/t/[teamSlug]/admin`)

- Overview of all signup lists for the team
- Each list shows: name, category, date (if dated), fill status (X/Y slots filled)
- Actions per list: Edit, Delete (with confirmation)
- "Create new list" button
- Empty state: prompt to create the first list
- Link to team settings

### Create List (`/t/[teamSlug]/admin/lists/new`)

Form with fields matching the existing `SignupList` type:

- **Name** (required) — slug auto-generated from name
- **Category**: "dated" or "standalone" toggle
- If dated: **date**, **time**, **location** fields appear
- **Note** (optional) — context like "Game day" or "before practice"
- **Slots needed** (number, required, min 1)
- **Custom field definitions** — add/remove fields, each with:
  - Label (required)
  - Type: "text" or "textarea"
  - Required toggle

On submit: creates list via data layer, redirects to admin dashboard.

### Edit List (`/t/[teamSlug]/admin/lists/[listSlug]/edit`)

- Same form as create, pre-populated with existing data
- Slug is read-only (URL stability)
- Shows current signup count for context
- Save redirects to admin dashboard

### Team Settings (`/t/[teamSlug]/admin/settings`)

- Edit team name, season year
- Change admin password
- Slug is read-only (URL stability)

## Parent-Facing Entry Editing

On the signup list detail page (`/t/[teamSlug]/[listSlug]`):

- Each existing signup entry gets Edit and Remove actions
- **Edit**: opens the entry's fields for inline editing, with Save/Cancel
- **Remove**: confirmation prompt, then deletes the entry
- Anyone can edit or remove any entry (no user context — this is intentional for simplicity)

## Data Layer Extensions

Extend `lib/data/index.ts` with mutation functions (mock implementations that modify in-memory state):

**List mutations:**
- `createSignupList(teamId, data)` → `SignupList`
- `updateSignupList(listId, data)` → `SignupList`
- `deleteSignupList(listId)` → `void`

**Team mutations:**
- `updateTeam(teamId, data)` → `Team`

**Entry mutations:**
- `updateSignupEntry(listId, entryId, data)` → `SignupEntry`
- `deleteSignupEntry(listId, entryId)` → `void`

These follow the same swappable interface pattern from spec 001 — same function signatures will be used when wiring up Supabase in spec 003.

## Acceptance Criteria

- [ ] Per-team password gate protects all `/t/[teamSlug]/admin/` routes via middleware + cookie
- [ ] Admin login page with password input and inline error on wrong password
- [ ] Admin dashboard lists all signup lists with fill status and CRUD actions
- [ ] Admin can create a new signup list with all supported fields (name, category, date/time/location, note, slots, custom field definitions)
- [ ] Slug is auto-generated from name on create
- [ ] Admin can edit an existing signup list (all fields except slug)
- [ ] Admin can delete a signup list with confirmation (warns if entries exist)
- [ ] Admin can edit team settings (name, season year, admin password)
- [ ] Parents can edit and remove signup entries on the list detail page (open to anyone)
- [ ] All mutations use the mock data layer with the same swappable interface pattern
- [ ] Admin pages are mobile-first and consistent with the existing design system
- [ ] Empty states are handled (no lists → create prompt, no entries → informational message)

## Edge Cases

- **Deleting a list with signups**: show warning with signup count, require confirmation
- **Browser back after mutation**: dashboard reflects changes (in-memory mock data updates)
- **Duplicate list names**: allowed (slugs will differ via suffix if needed)
- **Session expiry**: cookie has reasonable TTL; expired cookie redirects to login

## Out of Scope

- Real authentication / user accounts (spec 003)
- Roster or player management (not needed)
- CSV import (not needed now)
- Persistent data storage (mock data only, in-memory)
- Team creation (teams exist in mock data; creation is a future concern)
