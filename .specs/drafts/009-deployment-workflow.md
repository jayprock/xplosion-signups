---
id: 009-deployment-workflow
title: Production Deployment Workflow & Database Management
created: 2026-03-24
priority: high
tags: [devops, documentation, production]
---

# Idea

Document and finalize the deployment process now that the app is live in production. The project owner does not currently have a production database backup/management strategy and does not know how to deploy code updates. This spec should address:

1. **Production database management** — Backups, migrations, and safe schema changes against live data
2. **Deploying code updates** — How to get changes from the develop branch to the live Vercel deployment safely and rapidly
3. **Documented deployment workflow** — A clear, repeatable process the project owner can follow without deep technical knowledge

The goal is to enable rapid, safe iteration on the live app with confidence that data is protected and deployments are reversible.

## Notes

- App is already live on Vercel with a Supabase backend
- Specs 005 (external service setup) and 006 (data seeding/launch) were completed informally
- A backup script exists (`scripts/backup-data.mjs`) but production backup strategy needs formalization
- Supabase migrations exist in `supabase/migrations/` but the process for running them against production needs to be documented
