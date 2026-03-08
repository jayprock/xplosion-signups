---
id: 001-volunteer-signup-app
title: Parent-Facing Frontend POC
created: 2026-03-08
priority: high
tags: [mvp, frontend, poc]
blocked-by: []
---

## Goal

Build a mobile-first frontend proof of concept for a team sign-up platform. Parents visit a memorable URL, find their team, and interact with various sign-up lists (game-day volunteer duties, walk-up songs, etc.). The POC uses mock data behind a swappable data layer so the UI can be iterated on independently before wiring up a real backend.

This is parent-facing pages only. No admin interface, no real database, no email.

## Tech Stack

- Next.js (App Router, TypeScript, Tailwind CSS)
- shadcn/ui for UI components
- Swappable mock data layer (`lib/data/` with functions that return mock data; same signatures the real API would use later)

## Pages

### 1. Homepage (`/`)

- A polished, welcoming home page — not a bare pass-through. Should look like a real product landing page with clean design, branding, and purpose.
- Communicates what the site is: a sign-up platform for travel baseball teams
- Prominent search/input: "Enter your coach's last name to find your team"
- On submit, search mock data for matching teams, navigate to the team page
- Acts as a lightweight guard — you need to know the coach's name to access a team
- After finding the team, the parent lands on `/t/[teamSlug]` which they can bookmark for future visits
- May also include a call-to-action for coaches (e.g., "Are you a coach? Add your team.") — this would link to admin sign-up in a future spec, but the CTA should be present in the POC as a placeholder

### 2. Team Dashboard (`/t/[teamSlug]`)

- **The central hub.** Shows all sign-up lists for this team with a status summary for each.
- Each sign-up list appears as a card/tile with:
  - List name (e.g., "Field Prep - vs Thunder 5/15", "Walk-Up Songs")
  - Status indicator based on the urgency model (see below)
  - Quick summary (e.g., "2 of 3 filled", "8 of 12 players submitted")
- Tapping a card navigates to the individual sign-up list page
- Only shows upcoming/active lists (past events are hidden or dimmed)

#### Status Model (event-tied lists with unfilled slots)

| Condition | Status | Visual Treatment |
|-----------|--------|-----------------|
| Current week + unfilled slots | Urgent | Strong emphasis (e.g., red) |
| 2 weeks out + unfilled | High priority | Moderate emphasis (e.g., orange) |
| 3 weeks out + unfilled | Warning | Mild emphasis (e.g., yellow) |
| 3+ weeks out + unfilled | Informational | Neutral |
| All slots filled | Completed | Positive/success state (e.g., green) |

Note: These thresholds may become configurable per list in the future.

#### Status Model (standalone lists like walk-up songs)

- **Filled**: All expected entries are submitted
- **Not filled**: Some entries are missing

### 3. Individual Sign-Up List (`/t/[teamSlug]/[listSlug]`)

- Full view of a single sign-up list
- Shows all slots/entries with who has signed up and what's still open

#### Event-Tied Lists (Field Prep, Field Shutdown, Snacks, Mowing)

- Shows the event details (date, time, opponent, location)
- Each duty slot shows: slot name, who signed up (if anyone), or an open state inviting sign-up
- To sign up: parent types their name into the open slot
- To remove: parent can clear their name (for the demo, no identity verification needed)

#### Standalone Lists (Walk-Up Songs)

- List of all players on the team
- Each player entry has fields for:
  - Player name
  - Artist name
  - Song name
  - Where to start the song (timestamp or description)
- Supports multiple walk-up song lists per team (e.g., base playlist + special events like Halloween)
- Parent types in the song details for their player

## Sign-Up List Concept

The system is a **generic sign-up list platform**. Each list is a template that the admin defines (in a future spec). Two categories:

1. **Event-tied lists** — associated with a game/event date. Examples: Field Prep, Field Shutdown, Snacks, Mowing. Status uses the time-based urgency model.
2. **Standalone lists** — not tied to a specific date. Examples: Walk-Up Songs. Status is simply filled/not-filled.

For the POC, the mock data layer should include examples of both types.

## Mock Data

The data layer lives in `lib/data/` and exports functions with signatures that match what the real API would provide. Mock data should include:

- **1 team**: e.g., "12U Xplosion" coached by "Smith"
- **4-6 upcoming events** at various dates (some this week, some 2-3 weeks out, some 4+ weeks out) to demonstrate all urgency tiers
- **4 event-tied list types**: Field Prep (2 slots), Field Shutdown (2 slots), Snacks (1 slot), Mowing (1 slot)
- **Some slots pre-filled, some empty** to show mixed status states
- **1 base walk-up song list** with ~12 players, some with songs entered, some blank
- **1 special event walk-up song list** (e.g., "Halloween Playlist") mostly empty

## Acceptance Criteria

- [ ] Homepage loads with coach name search; entering "Smith" navigates to the team dashboard
- [ ] Team dashboard shows all sign-up lists with correct status indicators across all urgency tiers
- [ ] Tapping a sign-up card navigates to the individual list page
- [ ] Event-tied list page shows slots with names and open slots; parent can type a name to sign up
- [ ] Walk-up song list page shows player entries with song detail fields
- [ ] Multiple walk-up song lists are accessible (base + special event)
- [ ] UI is mobile-first and looks clean on a phone-width viewport (375px)
- [ ] `npm run build` passes with no errors
- [ ] Mock data layer is cleanly separated in `lib/data/` with swappable function signatures

## Constraints

- No real backend, database, or auth — mock data only
- No admin pages — admin is a separate spec (002)
- No email/notifications — separate spec (004)
- Keep the sign-up interaction simple for the demo (type name, no identity verification)
- Style is designer's choice — clean, modern, baseball-appropriate

## Foundation (already set up on `develop`)

The following shared foundation is in place. Worktree variations build on top of this:

- **Next.js scaffold**: App Router, TypeScript, Tailwind CSS v4, ESLint
- **shadcn/ui**: Initialized with `button` component and `utils.ts`
- **Data types**: `src/lib/types.ts` — `Team`, `SignupList`, `EventInfo`, `FieldDefinition`, `SignupEntry`, `ListStatus`, `UrgencyLevel`
- **Mock data**: `src/lib/data/mock-data.ts` — 1 team, 4 events across urgency tiers, 4 duty types, 2 walk-up song lists (base + Halloween)
- **Data layer API**: `src/lib/data/index.ts` — `searchTeamsByCoach()`, `getTeamBySlug()`, `getSignupListsForTeam()`, `getSignupListBySlug()`, `getListStatus()`, `groupListsByEvent()`, `getStandaloneLists()`
- **Route stubs**: `/` (homepage), `/t/[teamSlug]` (dashboard), `/t/[teamSlug]/[listSlug]` (list detail)
- **Build verified**: `npm run build` passes cleanly

## Notes

- After entering the coach name, the parent lands on a bookmarkable URL (`/t/team-slug`) so they don't have to repeat the search
- The generic list concept should be extensible — future list types beyond volunteer duties and walk-up songs should be easy to add
- The urgency status thresholds will likely become configurable per list in a future iteration
- Full plan with backend/deployment details: `.claude/plans/nested-imagining-cascade.md`
