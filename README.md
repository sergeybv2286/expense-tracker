# Expense Tracker

Монорепозиторий трекера расходов.

| Пакет | Путь | Стек |
|---|---|---|
| `@expense-tracker/web` | `apps/web` | Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui |
| `@expense-tracker/api` | `apps/api` | Nest.js 12, Prisma 7, PostgreSQL 17 |
| `@expense-tracker/shared` | `packages/shared` | Общие типы и zod-схемы |

Инструменты: pnpm workspaces, Turborepo, TypeScript 6, ESLint, Prettier.

## Требования

- Node.js **24 LTS** (`nvm use`; минимум 22.12 — требование Prisma 7)
- pnpm (`corepack enable`)
- Docker

## Первый запуск

```bash
corepack enable
pnpm install                      # pnpm может попросить разрешить build-скрипты: pnpm approve-builds

cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

pnpm db:up                        # Postgres в Docker
pnpm db:generate                  # генерация Prisma Client
pnpm --filter @expense-tracker/api prisma:migrate --name init

pnpm dev                          # web: http://localhost:3000, api: http://localhost:3001/api
```

Проверка API: `curl http://localhost:3001/api/health`.

## Скрипты

| Команда | Что делает |
|---|---|
| `pnpm dev` | Запускает все приложения в режиме разработки |
| `pnpm build` | Собирает все пакеты |
| `pnpm lint` / `pnpm typecheck` | Линтинг / проверка типов |
| `pnpm db:up` / `pnpm db:down` | Поднимает / останавливает Postgres |
| `pnpm db:generate` | Генерирует Prisma Client в `apps/api/src/generated` |

## Добавление компонентов shadcn/ui

```bash
cd apps/web && pnpm dlx shadcn@latest add button
```
