## Context

This document defines mandatory implementation and refactoring rules for the
`Next.js + Supabase AG-Grid Views Management System`.

Use these rules whenever you:

- build pages and components in this project;
- implement or update data access and API handlers;
- modify authentication, authorization, or view persistence logic;
- refactor reusable grid architecture.

---

## Target Stack

- Next.js (App Router, TypeScript, strict mode).
- Supabase:
  - Auth (Email/Password sign up with email confirmation, sign in, logout).
  - PostgreSQL database.
- Prisma ORM (`prisma` + `@prisma/client`) for database access.
- AG-Grid (Community edition is enough).

---

## High-Level Product Requirements

- Authenticated users can create/manage saved AG-Grid views (table configurations).
- Users can access only their own saved views.
- Access control for views is enforced by Supabase Row Level Security (RLS).
- `orders` and `invoices` data are public for this test task (not user-scoped).
- Grid data must be loaded via SSR in Next.js.
- Sorting/filtering/pagination must be processed through API/database queries,
  not client-side AG-Grid data manipulation.

---

## Required Pages

- `/login` - Supabase auth form:
  - Email/password sign up (with email confirmation flow).
  - Email/password sign in.
  - Logout action available after auth.
- `/dashboard` - protected page with navigation and view selector entry point.
- `/invoices` - protected page with reusable AG-Grid + views management.
- `/orders` - protected page with reusable AG-Grid + views management.

All protected pages must redirect unauthenticated users to `/login`.

---

## Data Access Rules (Prisma + Supabase)

- Use Prisma as the primary ORM for reads/writes to Supabase Postgres tables.
- Keep Prisma schema and migrations in `prisma/`.
- Use a shared Prisma client singleton for server runtime.
- Never use Prisma directly in client components.
- All grid data requests must go through server handlers/API routes.
- For user-scoped `views`, always enforce ownership checks by `user_id` in query
  conditions and keep DB-level RLS policies enabled.

---

## Data Model Rules

### Public tables

- `orders` table (test data from provided JSON).
- `invoices` table (test data from provided JSON).

These tables are not user-scoped in this assignment.

### User-scoped table

- `views` table stores saved grid configurations.
- Mandatory ownership field: `user_id` (Supabase auth user id).
- RLS policies must ensure:
  - user can `select/insert/update/delete` only rows where `user_id = auth.uid()`.

### Seeding

- The project must run against a fresh Supabase project.
- Prisma migrations/setup scripts must create required tables and insert
  provided test data for `orders` and `invoices`.

---

## Reusable AG-Grid Architecture (Mandatory)

Implement a generic reusable component (`AGGridTable`) that can power
both `/orders` and `/invoices`.

The reusable grid contract must support:

- dynamic `columnDefs`;
- loading a default view config;
- loading/switching saved views;
- persisting and restoring:
  - column state (order, width, visibility, pinning);
  - sorting model;
  - filtering model;
- notifying UI about unsaved changes (dirty state).

Avoid duplicating grid logic between orders and invoices pages. Page-specific
code should mostly define schema/columns and endpoints.

---

## View Management UX (Mandatory)

For grid pages, implement:

- view selector dropdown (switch between saved views);
- `Save View` button (update current view);
- `Save As New View` action (create variant);
- `Reset to Default` action;
- clear visual indicator for unsaved changes.

---

## Static Field Contracts

### Invoices view

Fields:

- `invoice_id` (string)
- `customer_name` (string)
- `customer_email` (string)
- `invoice_date` (date)
- `due_date` (date)
- `amount` (number, currency format)
- `tax` (number, percentage)
- `total` (number, computed)
- `status` (`draft | sent | paid | overdue | cancelled`)
- `payment_method` (string, nullable)
- `notes` (string, nullable)

Initially visible columns:

- Invoice ID
- Customer Name
- Invoice Date
- Due Date
- Total
- Status

### Orders view

Fields:

- `order_id` (string)
- `customer_name` (string)
- `customer_phone` (string)
- `order_date` (date)
- `shipping_address` (string)
- `items_count` (number)
- `subtotal` (number)
- `shipping_cost` (number)
- `discount` (number, percentage)
- `total` (number, computed)
- `status` (`pending | confirmed | processing | delivered`)
- `tracking_number` (string, nullable)
- `estimated_delivery` (date, nullable)

Initially visible columns:

- Order ID
- Customer Name
- Order Date
- Items Count
- Total
- Status
- Tracking Number

---

## Backend/API Rules

- All grid read operations must go through API routes/server handlers.
- Sorting/filtering/pagination must be handled in DB queries, not client-side.
- Validate incoming query params; map AG-Grid filter model to safe queries.
- Keep API contracts typed and shared.
- Prefer Prisma query builder for server-side filtering/sorting logic.

---

## Code Style and Conventions

- Use Prettier for code formatting.
- Variable and function names should use camelCase.
- Use existing components from `/src/components/ui/` first.
- If component is missing, create it via shadcn/ui before writing custom UI.
- Keep UI accessible and responsive.

---

## Architecture and Refactoring Rules

- Use strict TypeScript.
- Keep components small and focused.
- A single React component must not contain more than 2 local helper functions.
- If more helpers are needed:
  - move UI parts into child components (`components/`);
  - move pure logic into `lib/`, `hooks/`, or `services/`.

Placement guidelines:

- `lib/` - pure utilities/formatters/common helpers.
- `hooks/` - React hooks.
- `services/` - service layer/business logic/data-access abstractions.
- `shared/enums` - enums.
- `shared/types` - interfaces and types.
- `shared/regex` - regular expressions.

Global reusable types/enums must live in `shared/` and be re-exported from it.

### Minimal, direct code (refactor focus)

- Keep code short and straightforward; preserve behavior.
- Skip `useMemo`/`useCallback` unless they prevent real overhead/rerenders.
- Avoid unnecessary normalization/indirection.
- Remove dead code and duplication.

---

## `documentation/DOCS.md` Requirements

`documentation/DOCS.md` is the single source of truth for reusable units.
Whenever you add/rename/remove entities, update DOCS.md.

Must include one-line entries for:

- hooks from `hooks/`;
- helpers from `lib/`;
- services from `services/`;
- enums from `shared/enums/`;
- interfaces/types from `shared/types/`;
- regex patterns from `shared/regex/`;
- components from `components/`;
- stores from `stores/`.

Entry format:

- `EntityName - short description with purpose and key params/props`.

---

## Validation Before Finish

Run and pass:

- `npm run lint`
- `npm run build`

Also verify manually:

- auth flows (sign up confirm, sign in, logout);
- route protection;
- RLS isolation for `views`;
- save/load/update/delete view flows;
- unsaved changes indicator behavior;
- API-driven sorting/filtering in both grids.

Never use hieroglyphs or obscure symbols. Use only Cyrillic and Latin scripts.
