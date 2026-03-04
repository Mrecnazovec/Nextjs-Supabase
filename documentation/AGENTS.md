## Context

This document defines mandatory implementation and refactoring rules for the
`Next.js + Supabase AG-Grid Views Management System`.

Use these rules whenever you:

- build pages/components;
- implement or update API/data access;
- modify auth/authorization/view persistence;
- refactor reusable grid architecture.

---

## Target Stack

- Next.js 16 (App Router, TypeScript strict mode)
- Supabase Auth + Postgres
- Prisma ORM (`prisma` + `@prisma/client`)
- AG-Grid (Community is enough)
- Forms: `react-hook-form` + `zod` + shadcn `Form`
- Client cookies: `js-cookie`

---

## Product Requirements

- Authenticated users manage saved AG-Grid views.
- Users can access only their own views.
- Ownership isolation is enforced by Supabase RLS.
- `orders` and `invoices` are public for this task.
- Grid data must be loaded with SSR/API.
- Sorting/filtering/pagination must be server-side (DB/API), not client-side.

---

## Required Pages

- `/login`: sign up/sign in with Supabase auth.
- `/dashboard`: protected landing for authenticated user.
- `/invoices`: protected grid page.
- `/orders`: protected grid page.

Unauthenticated users must be redirected to `/login`.

---

## Data Access Rules (Prisma + Supabase)

- Prisma is the primary ORM for Supabase Postgres access.
- Keep schema/migrations in `prisma/`.
- Use shared Prisma singleton on server.
- Never use Prisma in client components.
- Grid reads must go through server handlers/API routes.
- For `views`, enforce `user_id` ownership in queries and DB-level RLS.

---

## Data Model Rules

### Public tables

- `orders` (from provided JSON)
- `invoices` (from provided JSON)

### User-scoped table

- `views` stores saved grid state.
- Required owner field: `user_id`.
- RLS policies must allow CRUD only when `user_id = auth.uid()`.

### Seeding

- Must run against a fresh Supabase project.
- Prisma migrations/setup must create required tables and seed `orders`/`invoices`.

---

## Reusable AG-Grid Architecture (Mandatory)

Implement a generic `AGGridTable` for both `/orders` and `/invoices`.

It must support:

- dynamic `columnDefs`;
- default view loading;
- saved view loading/switching;
- persisted/restored column state, sort model, filter model;
- unsaved changes indicator (dirty state).

Do not duplicate grid logic between pages.

---

## View Management UX (Mandatory)

- view selector dropdown;
- `Save View`;
- `Save As New View`;
- `Reset to Default`;
- visual unsaved-changes indicator.

---

## Static Field Contracts

### Invoices view fields

- `invoice_id`, `customer_name`, `customer_email`, `invoice_date`, `due_date`
- `amount`, `tax`, `total`
- `status`: `draft | sent | paid | overdue | cancelled`
- `payment_method` (nullable), `notes` (nullable)

Initially visible:

- Invoice ID, Customer Name, Invoice Date, Due Date, Total, Status

### Orders view fields

- `order_id`, `customer_name`, `customer_phone`, `order_date`, `shipping_address`
- `items_count`, `subtotal`, `shipping_cost`, `discount`, `total`
- `status`: `pending | confirmed | processing | delivered`
- `tracking_number` (nullable), `estimated_delivery` (nullable)

Initially visible:

- Order ID, Customer Name, Order Date, Items Count, Total, Status, Tracking Number

---

## Backend/API Rules

- Grid data operations go through API routes/server handlers.
- Sorting/filtering/pagination is DB-driven.
- Validate and sanitize incoming grid query/filter params.
- Keep API contracts typed/shared.
- Prefer Prisma query builder.
- In Next.js 16 use `proxy.ts` (not legacy `middleware.ts` naming).

---

## Routing Config Rules

- Keep page URLs in `src/config/url.config.ts`.
- Keep API URLs in `src/config/api.config.ts`.
- Do not duplicate route constants if config already exists.
- `proxy.ts` matcher must remain a static literal (Next compile-time requirement).

---

## Page Structure Rules

- Do not use `_components` inside route segments.
- Use `page.tsx` + sibling `[Folder]Page.tsx`.
- `page.tsx` should be thin route entry; main UI logic in `[Folder]Page.tsx`.

Examples:

- `src/app/login/page.tsx` + `src/app/login/LoginPage.tsx`
- `src/app/orders/page.tsx` + `src/app/orders/OrdersPage.tsx`

---

## UI & Forms Rules

- Prefer existing components from `src/components/ui`.
- If missing, add via shadcn/ui first.
- Rename shadcn component files to PascalCase single-word:
  - `button.tsx` -> `Button.tsx`
  - `form.tsx` -> `Form.tsx`
- Avoid kebab-case component filenames in `src/components/ui`.
- All forms must use `react-hook-form` + shadcn `Form` + `zod`.

---

## Architecture & Refactoring Rules

- Keep TypeScript strict.
- Keep components small and focused.
- Max 2 local helper functions per React component.
- If helpers grow:
  - move UI into child components;
  - move pure logic into `lib/`, `hooks/`, or `services/`.

Placement:

- `lib/` - pure helpers/formatters
- `hooks/` - React hooks
- `services/` - service/business/data-access layer
- `shared/enums`, `shared/types`, `shared/regex` for shared contracts

Global reusable enums/types must live in `shared/` and be re-exported.

### Minimal, direct code

- Keep code simple and behavior-preserving.
- Avoid unnecessary abstractions and indirection.
- Use `useMemo`/`useCallback` only when justified.
- Remove dead code and duplicates.

---

## Knowledge Source Rules

- Use Context7 first for library/framework behavior clarification.
- For React/Next decisions follow Vercel skills:
  - `vercel-react-best-practices`
  - `vercel-composition-patterns`

---

## `documentation/DOCS.md` Rules

`documentation/DOCS.md` is the source of truth for reusable entities.
Update it whenever adding/renaming/removing entities.

Must include one-line entries for:

- hooks, helpers, services
- shared enums/types/regex
- components, stores

Entry format:

- `EntityName - short description with purpose and key params/props`.

---

## Validation Before Finish

Run and pass:

- `npm run lint`
- `npm run build`

Manual checks:

- auth flow (sign up confirm, sign in, logout)
- route protection
- RLS isolation for `views`
- view save/load/update/delete
- unsaved-changes indicator behavior
- API-driven sorting/filtering in both grids

Never use hieroglyphs or obscure symbols. Use only Cyrillic and Latin scripts.
