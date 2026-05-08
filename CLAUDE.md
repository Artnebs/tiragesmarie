# tiragesmarie — repo guide

> Les Tirages de Marie — astrology booking + livret SaaS Arthur took over for Marie. React + Tailwind frontend, Express + tRPC backend, Drizzle ORM (MySQL), Docker dev DB, Stripe + Resend integrations.

## Canonical context
- Topic file: `~/.claude/projects/-home-arthur/memory/tiragesmarie-project.md` (canonical narrative, login + tunnel info)
- Architecture overview: `ARCHITECTURE.md`
- Test playbooks: `BOOKING_TESTING.md`, `EMAIL_TESTING.md`
- Generated booklets: `generated-livrets/`

## Dev environment
- Run: `./.run-dev.sh` (port 3010) or `pnpm dev`
- Dev DB: Docker container `marie-db` (MySQL)
- Live demo: ngrok tunnel `https://windburned-lucille-learnedly.ngrok-free.dev`
- Admin: `/admin/login` (password-based, see `.env`)

## Stack
- Frontend: React + Tailwind, cosmic theme + dark mode
- API: Express + tRPC
- ORM: Drizzle (`drizzle.config.ts`, migrations in `drizzle/`)
- PDF: end-to-end natal chart → assembly → booklet pipeline (commit `f10daeb`)
- Email: Resend (keys not committed)
- Payments: Stripe (keys not committed)

## Hard rules
- Do not commit `.env` or any file containing real Stripe/Resend keys.
- Do not modify `drizzle/migrations/*` retroactively — add a new migration instead.
- This repo is solo Arthur — no PR review process. Direct commits to feature branch are fine, but ASK before pushing to `main`.

<!-- AUTO-FOCUS:start -->
## Current Focus

**As of**: 2026-05-08
**Objective**: <set objective for current sprint — preserved across E1 hook fires>
**Last completed**: b79cfd6 — docs(claude): add repo guide and Current Focus for brain sync
**Open blockers**: none
**Next actions**:
1. (auto-populated from `NEXT:` commit trailers by E1 Stop hook)

<!-- AUTO-FOCUS:end -->

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, use `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` — these traverse real graph edges. Do NOT use `graphify query` (broken BFS, returns irrelevant results)
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
