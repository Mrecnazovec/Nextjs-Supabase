# Next.js + Supabase AG-Grid Views Management System

## Описание проекта
Веб-приложение на Next.js для работы с таблицами `orders` и `invoices` через AG Grid.
Авторизованный пользователь может создавать, загружать, обновлять и удалять свои сохраненные представления таблиц (views).

Основные возможности:
- авторизация и регистрация через Supabase Auth (Email/Password + email confirmation);
- защищенные страницы: `/dashboard`, `/orders`, `/invoices`;
- server-side загрузка данных для AG Grid (sorting/filtering/pagination через API);
- пользовательские views с сохранением состояния колонок, сортировки и фильтров;
- ограничение доступа к views на уровне базы через Supabase RLS.

## Технологии
- Next.js 16 (App Router), React 19, TypeScript
- Supabase (Auth + Postgres)
- Prisma ORM 7 (`@prisma/client`, `@prisma/adapter-pg`)
- AG Grid
- shadcn/ui, Tailwind CSS
- react-hook-form, zod

## Переменные окружения
Создайте `.env` и заполните минимум:

```env
APP_ENV=development
APP_URL=http://localhost:3000
APP_DOMAIN=localhost

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...

DATABASE_URL=...      # pooled/runtime
DIRECT_URL=...        # direct/migrations
DATABASE_URL_RLS=...  # optional: runtime URL без bypassrls для строгого RLS в views
```

## Запуск проекта
1. Установить зависимости:
```bash
npm install
```

2. Сгенерировать Prisma Client:
```bash
npm run prisma:generate
```

3. Применить миграции:
```bash
npm run prisma:migrate -- --name init
```

4. Заполнить тестовые данные:
```bash
npm run prisma:seed
```

5. Запустить dev-сервер:
```bash
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

## Полезные команды
```bash
npm run lint
npm run build
```

## Настройка Supabase Auth
В Supabase Dashboard:
- `Authentication -> Sign In / Providers -> Email`: включить Email provider и Confirm email;
- `Authentication -> URL Configuration`:
  - Site URL: `http://localhost:3000`
  - Redirect URL: `http://localhost:3000/api/register/confirm`
