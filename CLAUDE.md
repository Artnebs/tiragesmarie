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

## Current Focus

**Date:** 2026-04-30
**Status:** Phase 4 UI polish in progress; livret PDF pipeline shipped end-to-end; Marie's "alignement en détails" content parsed into typed library.
**Branch:** `feat/phase-4-ui-polish` (clean except untracked `.run-dev.sh`)

**Active tasks:**
- PDF engine for livret booklet — DONE (`f10daeb feat(pdf): end-to-end natal chart → assembly → PDF booklet`). Generated artifact present in `generated-livrets/sophie-martin-1-1776819550321.pdf`.
- Marie's content library parsed (`371cefa feat(content): parse Marie's 'Alignement en détails' PDF into typed library`).
- Admin password login replaced Manus OAuth (`f547e22`); date rendering fixed (`8b279d4`).
- Cosmic theme + parallax hero + redesigned calendar + mobile-first polish shipped (`45385d6`).
- Blog CMS + article detail + dark mode shipped (`538c138`).
- Stripe + Resend integrations wired in code; **no real keys configured** in `.env` yet — payments and emails won't actually send in production until keys land.

**Last commit:** `f10daeb feat(pdf): end-to-end natal chart → assembly → PDF booklet`

**Next concrete step:** Provide real Stripe + Resend API keys in `.env`; smoke-test booking → email confirmation → PDF delivery end-to-end against the live ngrok demo before showing Marie.
