## Lib helpers

cn - Utility from `src/lib/utils.ts` that merges conditional class names with Tailwind conflict resolution.
prisma - Shared PrismaClient singleton from `src/lib/prisma.ts` for server-side Prisma access.
SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY - Environment helpers from `src/lib/supabase/env.ts` for Supabase URL and public key validation.
createClient (browser) - Factory from `src/lib/supabase/client.ts` that creates a client-side Supabase instance.
createClient (server) - Factory from `src/lib/supabase/server.ts` that creates a server-side Supabase client bound to Next.js cookies.
updateSession - Middleware helper from `src/lib/supabase/middleware.ts` that refreshes auth cookies and protects routes.

## Services

getAccessToken/setAccessToken/removeFromStorage - Auth token cookie helpers from `src/services/auth/auth-token.service.ts` using `js-cookie`.
signUpWithEmail/signInWithEmail/resendSignUpConfirmation - Auth service methods from `src/services/auth/auth.service.ts` for Supabase email/password flows.
getCurrentUser/getCurrentUserFromClient - Profile service helpers from `src/services/profile/profile.service.ts` for retrieving authenticated Supabase user.
getDashboardStats - Dashboard service method from `src/services/dashboard/dashboard.service.ts` that returns orders/invoices/views counters.
parseGridListQuery/getPaginationParams - Grid query helpers from `src/services/grid/grid-query.service.ts` for server-side pagination and sorting parsing.
getOrdersList - Orders service method from `src/services/orders/orders.service.ts` that returns paginated/sorted orders list.
getInvoicesList - Invoices service method from `src/services/invoices/invoices.service.ts` that returns paginated/sorted invoices list.
getUserViews/getUserViewById/createUserView/updateUserView/deleteUserView - Views service CRUD methods from `src/services/views/views.service.ts` with user-scoped access.

## Shared enums

SortDirectionEnum - sort direction constants (`asc`/`desc`) in `src/shared/enums/SortDirection.enum.ts`.
OrdersSortFieldEnum - allowed orders sort fields in `src/shared/enums/OrdersSortField.enum.ts`.
InvoicesSortFieldEnum - allowed invoices sort fields in `src/shared/enums/InvoicesSortField.enum.ts`.
ViewEntityTypeEnum - view entity constants (`orders`/`invoices`) in `src/shared/enums/ViewEntityType.enum.ts`.

## Shared types

EmailPasswordAuthInput - auth credentials payload type in `src/shared/types/Auth.interface.ts`.
DashboardStats - dashboard counters response shape in `src/shared/types/Dashboard.interface.ts`.
GridListQuery/PaginationParams/ParseGridListQueryOptions - generic grid query and pagination contracts in `src/shared/types/GridQuery.interface.ts`.
OrdersSortField/OrdersListResult - orders list contracts in `src/shared/types/Orders.interface.ts`.
InvoicesSortField/InvoicesListResult - invoices list contracts in `src/shared/types/Invoices.interface.ts`.
CreateViewInput/UpdateViewInput - views CRUD payload contracts in `src/shared/types/Views.interface.ts`.

## Route config

PUBLIC_URL/PROTECTED_URL/PROTECTED_URL_LIST - Page route helpers in `src/config/url.config.ts` for redirects, links, and protection checks.
API_URL - API route helpers in `src/config/api.config.ts` (`/api/auth`, `/api/dashboard`, `/api/register/confirm`).
API_URL.orders/API_URL.invoices/API_URL.views/API_URL.viewById - API URL builders in `src/config/api.config.ts` for data grid and views endpoints.

## API routes

GET /api/auth - Route handler in `src/app/api/auth/route.ts` that returns current auth status and user identity.
GET /api/dashboard - Route handler in `src/app/api/dashboard/route.ts` that returns secured dashboard counters.
GET /api/orders - Route handler in `src/app/api/orders/route.ts` that returns paginated/sorted orders via query params.
GET /api/invoices - Route handler in `src/app/api/invoices/route.ts` that returns paginated/sorted invoices via query params.
GET /api/views - Route handler in `src/app/api/views/route.ts` that returns current user saved views (optional `entityType` filter).
POST /api/views - Route handler in `src/app/api/views/route.ts` that creates a new user-scoped view.
GET /api/views/[id] - Route handler in `src/app/api/views/[id]/route.ts` that returns a single user view by id.
PATCH /api/views/[id] - Route handler in `src/app/api/views/[id]/route.ts` that updates a single user view.
DELETE /api/views/[id] - Route handler in `src/app/api/views/[id]/route.ts` that deletes a single user view.
GET /api/register/confirm - Route handler in `src/app/api/register/confirm/route.ts` that verifies Supabase email OTP and redirects.

## Actions

signOutAction - Server action in `src/app/dashboard/actions.ts` for logout via Supabase auth.

## Components

LoginPage - Client login page component in `src/app/login/LoginPage.tsx` for email/password sign in, sign up, and email confirmation resend.
Alert - shadcn UI alert component in `src/components/ui/Alert.tsx` for status and error messages.
Button - shadcn UI button component in `src/components/ui/Button.tsx` with variants and `asChild` support.
Card - shadcn UI card primitives in `src/components/ui/Card.tsx` for structured content blocks.
Input - shadcn UI input component in `src/components/ui/Input.tsx` for form fields.
Label - shadcn UI label component in `src/components/ui/Label.tsx` for accessible form labels.
Tabs - shadcn UI tabs components in `src/components/ui/Tabs.tsx` for mode switching (sign in/sign up).
Form - shadcn form primitives in `src/components/ui/Form.tsx` built on `react-hook-form` for typed form fields and validation messages.

## Proxy

proxy - Request proxy function in `proxy.ts` that applies session updates and route protection.

