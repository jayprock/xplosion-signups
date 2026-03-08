# Specs Workflow

This folder contains specifications for work items using a stage-based workflow. It was created by the `/setup-specs` skill.

## Folder Structure

| Folder | Purpose |
|--------|---------|
| `drafts/` | Raw ideas, not yet ready for implementation |
| `ready/` | Fully specified, approved for work |
| `sprint/` | Work selected for immediate implementation |
| `archive/` | Completed and merged |
| `artifacts/` | Per-spec artifact storage (images, diagrams, data files) |

## Configuration

The `project.yaml` file contains settings for this project:

```yaml
project-key: my-project-a1b2c3d4  # Unique key for counter API
id-digits: 3                       # Pads to 001, 002, etc.
```

- **project-key**: Used by the counter API to generate unique sequential IDs across all users and branches. Don't change this after specs exist.
- **id-digits**: Number of digits for ID padding (3 = up to 999 specs, 4 = up to 9999).

## Workflow Stages

```
/capture     /refine      (manual)     /implement
    │            │            │            │
    ▼            ▼            ▼            ▼
  Idea ────> Drafts ────> Ready ────> Sprint ────> Archive
```

### Stage Transitions

| Transition | How | When |
|------------|-----|------|
| Idea -> Drafts | `/capture` skill | Idea captured |
| Drafts -> Ready | `/refine` skill | Draft is fully specified |
| Ready -> Sprint | Move file manually | Sprint planning |
| Sprint -> Archive | `/implement` skill | Implementation complete |

## Quick Start

1. **Capture an idea**: Run `/capture` and describe your idea
2. **Refine it**: Run `/refine <path>` to flesh out the spec
3. **Plan sprint**: Move ready specs to `sprint/` folder
4. **Implement**: Run `/implement <path>` to code it and archive when complete
5. **Merge**: PR brings archived spec to main

## Skills Reference

| Skill | Purpose |
|-------|---------|
| `/capture` | Capture an idea as a draft with auto-generated ID |
| `/refine <path>` | Refine a draft into a ready spec through Q&A |
| `/implement <path>` | Implement a sprint spec, create branch, archive on completion |
| `/next-id [slug]` | Generate the next available spec ID |

## Spec ID Convention

All specs use the format `NNN-short-slug` (e.g., `001-auth-flow`, `002-user-profile`):

- **NNN**: Sequential number (padded per `id-digits` config) for uniqueness and ordering
- **short-slug**: Human-readable description (2-4 words, lowercase, hyphenated)

Use `/capture` to auto-generate the ID, or `/next-id` to get the next number manually.

## Writing Good Specs

A ready spec must clearly convey:

1. **Goal** - What we're building and why
2. **Acceptance Criteria** - How we know it's done (verifiable items)

Edge cases, constraints, and context should be included where relevant.

**Tips:**

- Be specific in acceptance criteria - clear requirements lead to better implementations
- One spec per PR - clean history, easier reviews
