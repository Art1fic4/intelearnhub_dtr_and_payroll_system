# Frontend Architecture Guide

## Structure

- `src/app`: application shell only (router, providers, bootstrap wiring).
- `src/features`: domain modules (`landing`, `auth`, `portal/faculty`, `portal/student`).
- `src/shared`: reusable primitives and cross-domain helpers (`shared/ui`, `shared/lib`).

## Dependency Rules

- `app` can import from `features` and `shared`.
- `features` can import from `shared`.
- `shared` must never import from `features`.
- Prefer `@/...` imports instead of deep relative paths.

## Backend Handover Conventions

- Keep API clients inside feature modules (`src/features/<domain>/api`) or shared API base (`src/shared/api`).
- Keep static/mock data in `model/constants.ts` until backend endpoints replace them.
- Add DTO and runtime validation in each feature before binding backend responses to UI.
- Keep route-level pages thin; move UI/data logic into feature `components/` and `model/`.

## Quality Gates

- `npm run typecheck` enforces strict TypeScript.
- `npm run lint` enforces hooks and boundary rules.
- `npm run format:check` enforces formatting.
- `npm run build` verifies production build integrity.
