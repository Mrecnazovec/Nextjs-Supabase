## Lib helpers

cn - Utility from `src/lib/utils.ts` that merges conditional class names with Tailwind conflict resolution.
prisma - Shared PrismaClient singleton from `src/lib/prisma.ts` for server-side Prisma access.
SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY - Environment helpers from `src/lib/supabase/env.ts` for Supabase URL and public key validation.
createClient (browser) - Factory from `src/lib/supabase/client.ts` that creates a client-side Supabase instance.
createClient (server) - Factory from `src/lib/supabase/server.ts` that creates a server-side Supabase client bound to Next.js cookies.
updateSession - Middleware helper from `src/lib/supabase/middleware.ts` that refreshes auth cookies and protects routes.

## Services

getAccessToken/setAccessToken/removeFromStorage - Auth token cookie helpers from `src/services/auth/auth-token.service.ts` using `js-cookie`.

## Route config

PUBLIC_URL/PROTECTED_URL/PROTECTED_URL_LIST - Page route helpers in `src/config/url.config.ts` for redirects, links, and protection checks.
API_URL - API route helpers in `src/config/api.config.ts` (`/api/auth`, `/api/dashboard`, `/api/register/confirm`).

## API routes

GET /api/auth - Route handler in `src/app/api/auth/route.ts` that returns current auth status and user identity.
GET /api/dashboard - Route handler in `src/app/api/dashboard/route.ts` that returns secured dashboard counters.
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

