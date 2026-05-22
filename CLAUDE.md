# CLAUDE.md — Militaria Translation Studio

## Project goal

Build a local working prototype for a recruitment task for the AI Automation Specialist role at Militaria.pl.

The app is a context-aware e-commerce translation/localization tool from Polish into:
EN-US, EN-UK, DE, FR, UK, RO, CS, HU, FI.

The product must demonstrate:
- content-type-aware translation profiles,
- glossary and protected terms,
- structured AI output,
- quality notes,
- warnings,
- human review recommendation,
- clean UI for a nontechnical e-commerce/content employee.

## Source of truth

Read these before implementation:
- README.md
- doc/02-translation-profiles.md
- doc/03-language-rules.md
- doc/04-glossary.md
- doc/06-ai-response-schema.md
- doc/07-prompt-pipeline.md
- doc/11-handoff-to-vibe-coding.md
- doc/13-ui-implementation-handoff.html

## Hard scope limits

Do not build:
- authentication,
- database,
- deployment,
- admin dashboard,
- analytics dashboard,
- multi-page app,
- PIM/CMS integration,
- batch CSV/XLSX translation,
- user accounts,
- glossary CRUD.

## Technical direction

Use:
- Next.js App Router
- TypeScript strict
- Tailwind CSS
- one main page
- server-side API route for translation
- demo/mock fallback when no API key exists

## UX direction

The UI must be:
- Polish,
- clean internal SaaS,
- not military-themed,
- not a landing page,
- not sci-fi AI,
- two-column desktop workbench.

## Required states

Implement:
- empty state,
- loading state,
- success state,
- error state,
- demo/API mode indicator.

## Quality bar

Before finishing:
- run lint/build if configured,
- verify demo mode works without API key,
- verify README run instructions,
- ensure README is concise,
- ensure final repo is not polluted with doc/ artifacts.