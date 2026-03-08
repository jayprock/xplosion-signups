---
id: 001-volunteer-signup-app
title: Volunteer Sign-Up Web App for Youth Travel Baseball
created: 2026-03-08
priority: high
tags: [mvp, full-stack]
---

# Idea

Build a mobile-first volunteer sign-up web app for youth travel baseball teams. Parents visit a memorable URL (e.g., `xsignups.com/t/rockets`), pick their family from a dropdown, and claim open slots for game-day duties (field prep, field shutdown, mowing, snacks). Coaches manage teams, rosters, events, and slot types through an admin dashboard.

Key differentiators over existing tools (Google Sheets, SignUpGenius):
- **Memorable URL** parents can type from memory instead of hunting for a buried link
- **"Who hasn't signed up" callout** front and center on the team page
- **Multi-team support** in one place (two sons' teams + expandable to other coaches in the program)
- **Only upcoming events shown**, color-coded by urgency (green/yellow/red)
- **Optional email reminders** via daily cron job
- **No account required for parents** -- just visit the link, pick your name, sign up

## Tech Stack
- Next.js (App Router, TypeScript, Tailwind CSS)
- Vercel free tier (hosting)
- Supabase free tier (PostgreSQL database + coach auth)
- shadcn/ui (UI components)
- Resend free tier (email reminders, 100/day)
- Domain ~$10-15/year
- **Total cost: ~$1/month**

## Auth Model
- Parents: No accounts. Team PIN (optional 4-digit) + family dropdown stored in localStorage
- Coaches: Supabase Auth with magic link login, protected `/admin` routes

## Database Schema
- **organizations** - baseball program grouping
- **coaches** - extends Supabase auth users
- **teams** - name, slug (used in URL), optional PIN, season year
- **coach_teams** - many-to-many join
- **families** - display name, player name, optional email/phone
- **family_teams** - many-to-many join
- **events** - date, time, location, title, home/away
- **slot_types** - reusable volunteer role templates per team (field prep, snacks, etc.)
- **volunteer_slots** - specific slots on a specific event with `slots_needed` count
- **signups** - family claims a slot (unique constraint prevents doubles)
- **email_log** - tracks sent reminders to avoid duplicates

## Pages
- `/` - landing page with team search
- `/t/[teamSlug]` - **primary parent page** with upcoming events, sign-up status, volunteer leaderboard, missing volunteers callout
- `/t/[teamSlug]/event/[eventId]` - event detail deep-link
- `/admin` - coach dashboard
- `/admin/login` - magic link login
- `/admin/teams/[teamId]` - team management (roster, events, slot types, settings)

## Key Features
- CSV import for rosters and game schedules
- Auto-create default volunteer slots when adding events
- Volunteer leaderboard (fairness tracking)
- Missing volunteers callout (families with no upcoming signups)
- Color-coded slot status on event cards
- Daily cron job for email reminders (2-3 days before event) and nag emails
- Race condition handling via unique constraints + transaction-level slot capacity checks

## Implementation Phases
1. Foundation (scaffold, Supabase setup, migrations, types)
2. Coach admin CRUD (auth, teams, roster, events, slot types)
3. Parent-facing team page (PIN gate, family selector, event cards, sign-up flow, leaderboard)
4. Email + polish (Resend integration, cron, event detail page)
5. Deploy (domain, Vercel, seed data, share links)

## Notes

- Scale: 30-60 families across two teams, potentially growing if shared with other coaches
- Season: roughly March-October, 2-4 games/week
- Parent comms: GameChanger chat (one team), WhatsApp (other team)
- Supabase free tier pauses after 7 days inactivity -- daily cron keeps it alive during season
- Full plan with project structure, API routes, and risk mitigations available at: `.claude/plans/nested-imagining-cascade.md`
