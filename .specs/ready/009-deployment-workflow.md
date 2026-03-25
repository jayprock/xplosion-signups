---
id: 009-deployment-workflow
title: Production Deployment Workflow & Database Management
created: 2026-03-24
priority: high
tags: [devops, documentation, production]
blocked-by: []
---

# Goal

Establish a safe, documented deployment workflow for the production app. Today there is no dev database (development runs against production), no tested backup process, and no documented steps for deploying code or running migrations. This spec delivers the tooling, configuration, and documentation to fix all three.

# Acceptance Criteria

- [ ] A separate Supabase project exists for development, with the same schema as production
- [ ] `.env.local` points to the dev database; production env vars live only in Vercel
- [ ] The backup script (`npm run backup`) has been run successfully against production at least once
- [ ] A `DEPLOYMENT.md` file exists in the repo root with clear, step-by-step instructions covering:
  - How to deploy code changes (develop → main → auto-deploy)
  - How to run database migrations (test on dev, then run on prod)
  - How to run backups
  - A pre-deploy checklist
- [ ] The full workflow has been verified end-to-end: backup → migrate dev → migrate prod → merge to main → confirm deploy

# Solution Approach

## 1. Dev Database Setup (Working Session)

Create a second free-tier Supabase project for development:
- Run all four existing migration files (`001` through `004`) against the new project via the SQL Editor
- Seed it with sample data (can reuse backup data or create fresh test data)
- Update `.env.local` to point to the dev Supabase project
- Production env vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SITE_ADMIN_PASSWORD`) remain configured only in Vercel's environment settings — never in local files

## 2. Verify Backup Script

- Run `npm run backup` against the **production** database (temporarily using prod creds) to capture a baseline backup
- Confirm the JSON output in `/backups` is complete and readable
- Switch `.env.local` back to dev credentials afterward
- Add a note to DEPLOYMENT.md on how to run backups against production when needed

## 3. Deployment Flow

The deployment pipeline is:

```
feature branch → PR → merge to develop → test → merge develop to main → Vercel auto-deploys
```

- Vercel watches `main` and auto-deploys on push/merge
- `develop` is the integration branch where feature work lands first
- Merging `develop` → `main` is the release trigger

### Database Migration Flow

When a change requires a schema update:

1. Write a new numbered migration file in `supabase/migrations/`
2. Run it against the **dev** database via Supabase SQL Editor to verify
3. **Before deploying code that depends on the migration**: run it against **production** via SQL Editor
4. Then merge the code to `main` (which triggers deploy)

Key principle: **migrations go to prod before the code that needs them**. This prevents the app from crashing due to missing columns/tables.

## 4. DEPLOYMENT.md

Create a reference doc at the repo root with these sections:

### Pre-Deploy Checklist
- [ ] Run `npm run backup` against production
- [ ] Confirm `npm run build` passes locally
- [ ] If there are database migrations: run on dev DB first, then on prod DB
- [ ] Merge to `main`

### How to Deploy Code
Step-by-step: merge develop → main, verify on Vercel dashboard

### How to Run Database Migrations
Step-by-step: write migration file, test on dev, run on prod, then deploy code

### How to Run Backups
Step-by-step: temporarily set prod creds, run script, verify output, restore dev creds

### How to Roll Back
- Vercel: redeploy previous commit from dashboard
- Database: restore from backup JSON (manual process via SQL Editor)

## 5. Environment Configuration

Two `.env` profiles:
- **`.env.local`** (local development) → points to dev Supabase project
- **Vercel environment variables** (production) → points to prod Supabase project

The `.env.example` file should be updated to document both profiles clearly.

# Edge Cases & Risks

- **Destructive migration on prod**: Always back up before running migrations. The pre-deploy checklist enforces this.
- **Code deployed before migration**: Could cause runtime errors. The documented flow (migrate first, deploy second) prevents this.
- **Backup script fails**: The script currently exits with an error message if creds are missing. No silent failures.
- **Vercel deploy fails**: Vercel keeps the previous deployment active until the new one succeeds. Built-in safety net.

# Out of Scope

- Automated CI/CD pipeline (GitHub Actions) — overkill for this project's scale
- Automated scheduled backups — can be added later if needed
- Supabase CLI setup — SQL Editor is simpler for this project's needs
