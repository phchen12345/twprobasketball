# AGENTS.md

Before making code changes in this repository, read and follow `docs/rules.md`.

## Critical Rules

- Never modify Chinese text unless the user explicitly asks.
- Do not rewrite, translate, simplify, or improve Chinese copy.
- Keep `app/` for Next.js route files only.
- Put shared UI in `components/`.
- Put feature-specific reusable logic in `features/`.
- Put domain logic and mappers in `domain/`.
- Put shared hooks in `hooks/`.
- Put API clients, storage helpers, types, and utilities in `lib/`.
- Do not put product-specific components in `components/ui`.
- Prefer `@/` imports for cross-layer imports.
- Run `npm run build` after code changes when feasible.
