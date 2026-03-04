# Next.js + Supabase AG-Grid Views Management System

## Описание проекта

Проект реализует систему управления табличными представлениями (views) для AG-Grid.
Пользователь проходит авторизацию через Supabase, после чего может работать в защищенной зоне приложения.

Цель проекта:
- использовать единый переиспользуемый подход для таблиц;
- хранить пользовательские настройки представлений;
- обеспечить серверную работу с данными (SSR/API);
- ограничить доступ к пользовательским данным на уровне БД (RLS для `views`).

## Используемые технологии

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Forms**: react-hook-form, zod, @hookform/resolvers
- **Data Grid**: AG Grid
- **Auth**: Supabase Auth (Email/Password + email confirmation)
- **Database**: Supabase Postgres
- **ORM**: Prisma 7 (+ `@prisma/adapter-pg`)
- **Cookies**: js-cookie
- **HTTP**: axios

## Текущая реализация

- базовая auth-инфраструктура Supabase;
- страница `/login` с `Sign In` и `Sign Up`;
- подтверждение регистрации через `/api/register/confirm`;
- защищенные маршруты через `proxy.ts`;
- API endpoints:
  - `/api/auth`
  - `/api/dashboard`
  - `/api/register/confirm`
- Prisma schema + migrations + seed для `orders` и `invoices`;
- заполнение тестовых данных из `data/orders.json` и `data/invoices.json`.

## Структура конфигов роутов

- `src/config/url.config.ts` — page URLs
- `src/config/api.config.ts` — API URLs

## Требования

- Node.js 20+
- npm 10+
- доступ к Supabase проекту

## Переменные окружения

Пример `.env`:

```env
APP_ENV=development
APP_URL=http://localhost:3000
APP_DOMAIN=localhost

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...

DATABASE_URL=...      # pooled/runtime
DIRECT_URL=...        # direct/migrations
```

## Установка и запуск

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Открыть: `http://localhost:3000`

## Проверка качества

```bash
npm run lint
npm run build
```

## Настройки Supabase Auth

В Supabase Dashboard:
- `Authentication -> Providers -> Email`: включить Email provider и Confirm email.
- `Authentication -> URL Configuration`:
  - Site URL: `http://localhost:3000`
  - Redirect URL: `http://localhost:3000/api/register/confirm`

## Ближайшие шаги

- реализовать generic `AGGridTable`;
- реализовать CRUD для `views` (save/save as/reset/dirty state);
- добавить серверные API для AG-Grid sorting/filtering/pagination;
- подключить страницы `/orders` и `/invoices` к реальным grid-данным.

