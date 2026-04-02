---
id: 007-walkup-song-prominence
title: Make Walk-Up Song Signups More Accessible
created: 2026-03-24
priority: medium
tags: []
blocked-by: []
---

# Goal

The team dashboard buries walk-up song signups beneath data signups like lawn mowing, field prep, and field shutdown. With many events on the schedule, the walk-up song signup is easy to miss. This feature makes walk-up song signups more accessible.

# Approach

This spec is executed in two phases: **design exploration** followed by **integration**.

## Phase 1: Design Exploration

Use the `/frontend-design` skill to create **7 distinct design variations** that solve the walk-up song accessibility problem. The variations should be creative — they may range from focused component changes to full dashboard layout rethinks.

### Variation Routes

- Mount each variation under the existing team slug: `/team/{slug}/v1` through `/team/{slug}/v7`
- Each route renders a fully functional (read-only) view using real data
- **All data access must be read-only** — the database is shared between dev and production

### Acceptance Criteria — Phase 1

- 7 variations are accessible at `/team/{slug}/v1` through `/v7`
- Each variation takes a meaningfully different approach to surfacing walk-up song signups
- All variations use real team data from Supabase (read-only queries only)
- No mutations — no create, update, or delete operations on any variation route
- Variations are visually reviewable side-by-side by navigating between URLs

## Phase 2: Integration

After visual review of the 7 variations, the chosen design is integrated into the real team dashboard.

### Acceptance Criteria — Phase 2

- The selected variation's design replaces or updates the current team dashboard
- All 7 variation routes (`/v1` through `/v7`) are removed (cleanup)
- Walk-up song signups are noticeably more accessible than before the change
- Existing dashboard functionality (dated events, other standalone lists) is preserved
- No regressions to signup create/edit/delete flows

