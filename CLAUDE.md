# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Трекер расходов. Монорепо pnpm workspaces + Turborepo: `apps/web` (Next.js 16), `apps/api` (Nest.js 12 + Prisma 7 + PostgreSQL 17), `packages/shared` (общие zod-схемы и типы). Запуск и первичная настройка описаны в @README.md.

## Команды

- Только pnpm (`packageManager` в корневом `package.json`), Node 24 через nvm (`.nvmrc`).
- Команда для одного пакета: `pnpm --filter @expense-tracker/<web|api|shared> <script>`.
- Проверка изменений: `pnpm typecheck && pnpm lint`. Тестов пока нет, так что изменение считается проверенным после этих двух команд.
- Postgres: `pnpm db:up` (docker compose). Миграции: `pnpm --filter @expense-tracker/api prisma:migrate --name <name>`.

## Версии, которые нельзя поднимать без проверки

- TypeScript зафиксирован на `~6.0`: typescript-eslint не поддерживает TS 7.
- Prisma 7 (не 8, у которой тег `latest` указывает на RC). Схема не содержит `url`: подключение задаётся в `apps/api/prisma.config.ts`, а в рантайме через `@prisma/adapter-pg` в `PrismaService`.

## Архитектурные особенности

- `apps/api` компилируется в **CommonJS** (`module: nodenext` без `"type": "module"`), поэтому относительные импорты пишутся без расширений. Генератор Prisma настроен на `moduleFormat = "cjs"`.
- Prisma Client генерируется в `apps/api/src/generated/prisma` (в .gitignore) и импортируется из `../generated/prisma/client`, а не из `@prisma/client`. После правки `schema.prisma` нужно выполнить `pnpm db:generate`.
- `packages/shared` потребляется из `dist` (собирается через `tsc`). В нём внутренние импорты пишутся с `.js` (`./transaction.js`). После правок в shared нужен его `build`: turbo делает его автоматически через `^build`.
- Валидация входных данных в API делается zod-схемами из `@expense-tracker/shared` через `ZodValidationPipe` (`apps/api/src/common`). class-validator не используется.
- Все роуты API имеют префикс `/api`, порт 3001. Web работает на порту 3000.
- Суммы хранятся как `Decimal(12,2)` и в API передаются строкой (см. интерфейс `Transaction` в shared). Не приводить их к `number`.
- Списки в API отдаются страницами: query `page` (с 1) и `pageSize` (по умолчанию 10, максимум 100), ответ `Paginated<T>` из shared (`{ items, total, page, pageSize }`). Схема пагинации — `paginationQuerySchema` в `packages/shared/src/pagination.ts`, её подмешивают в схемы запросов списков.
- UI-компоненты добавляются через shadcn CLI (`pnpm dlx shadcn@latest add <component>` в `apps/web`), руками их не пишем. Алиасы в `components.json` ведут в `src/shared/ui` и `src/shared/lib`, поэтому CLI кладёт компоненты сразу в слой `shared`. После `shadcn add` проверь, что в новых файлах импорт `cn` идёт из `@/shared/lib/utils`: CLI может подставить `from "cn"` и добавить в `package.json` посторонний npm-пакет `cn`. Тогда замени импорт и удали пакет (`pnpm remove cn`).
  - В сгенерированных файлах есть ручные правки, которые `shadcn add --overwrite` сотрёт: русские тексты (`pagination`, `sidebar`, `dialog`, `sheet`), `next/link` вместо `<a>` в `PaginationLink`, `useSyncExternalStore` в `hooks/use-mobile.ts` и детерминированная ширина в `SidebarMenuSkeleton` (ради правил react-hooks). После обновления компонента верни их и прогони `pnpm lint`.
- `apps/web` построен по **Feature-Sliced Design**. Код лежит в `apps/web/src` по слоям (сверху вниз): `app` → `views` → `widgets` → `features` → `entities` → `shared`. Слой импортирует только слои ниже себя, соседние слайсы одного слоя друг друга не импортируют.
  - `app` — это Next.js App Router: только роуты, `layout.tsx` и метаданные. Страница в `app/` — тонкая обёртка, которая реэкспортирует компонент из `views`. Логики и вёрстки здесь нет.
  - `views` — страницы целиком (слой `pages` из FSD переименован, чтобы не путать с Next Pages Router). Собирают `widgets`, `features` и `entities`.
  - `widgets` — самостоятельные крупные блоки интерфейса (`widgets/app-shell`, `widgets/transactions-table`).
  - `features` — пользовательские сценарии (`features/auth/login`, `features/auth/register`). Сегменты слайса: `ui/`, `api/` (в т. ч. server actions), `model/`.
  - `entities` — бизнес-сущности и их данные (`entities/session` — токен в httpOnly-cookie).
  - `shared` — переиспользуемое без бизнес-логики: `ui/` (shadcn), `lib/`, `api/` (HTTP-клиент), `config/`.
  - У каждого слайса есть публичный API — `index.ts`. Импорты извне идут только через него, а не в глубь слайса. Алиас `@/` указывает на `src/`.
  - Серверный код сущности (запросы к API, `server-only`) лежит в отдельной точке входа `server.ts`: `@/entities/<slice>/server`. В `index.ts` остаётся только то, что безопасно для клиентских компонентов (UI, типы). Иначе `server-only` попадёт в клиентский бандл и сборка упадёт.
  - Запросы к API от имени пользователя из серверных компонентов и server actions идут через `apiServerRequest` из `@/shared/api/server`: он берёт токен из cookie и при отсутствии токена или ответе 401 редиректит на `/login`. Сессию (запись и удаление cookie) ведёт `entities/session`; имя cookie лежит в `shared/config/session.ts`, чтобы его видели и `proxy.ts`, и `apiServerRequest`. Импортировать `@/shared/api/server` можно только в серверном коде, он намеренно не реэкспортируется из `@/shared/api`.
  - Исключение из правила «страница в `app/` реэкспортирует `views`»: `app/(main)/layout.tsx` реэкспортирует виджет `widgets/app-shell`. Каркас с сайдбаром — это layout, а не страница.
  - `src/proxy.ts` (в Next 16 он заменил middleware) — только оптимистичная проверка наличия cookie. Валидность токена проверяет API. Публичный роут (`/login`, `/register`, `/privacy`, `/terms`) нужно добавить в исключения `matcher`, иначе он будет редиректить на вход.
  - Server action, которая ходит в API, начинает `catch` с `unstable_rethrow(error)` из `next/navigation`: `redirect()` из `apiServerRequest` бросает служебное исключение, его нельзя проглатывать. Дальше `ApiError` превращается в `{ ok: false, error }`, а сетевая ошибка в «Не удалось связаться с сервером» (как в `features/auth/login`).
  - Токен авторизации хранится в httpOnly-cookie и выставляется server action'ами; клиентский JS его не видит.
- Модули `apps/api` не импортируют сервисы друг друга напрямую: взаимодействие идёт через `@nestjs/cqrs` (`CommandBus`/`QueryBus`/`EventBus`) и публичный контракт модуля в его папке `contracts/` (см. `apps/api/src/users/contracts`).

## Конвенции

- Комментарии в коде и тексты интерфейса пишутся на русском.
- Prettier: одинарные кавычки, trailing comma, ширина строки 100.

## Ветки (GitHub Flow)

- `main` всегда стабильна и готова к деплою. Напрямую в `main` не коммитим и не пушим.
- Каждая новая фича или исправление делается в отдельной ветке, созданной от актуальной `main`.
- Имя ветки: `<type>/<scope>-<short-description>` в kebab-case на английском, `type` и `scope` те же, что в коммитах: `feat/web-transactions-list`, `fix/api-auth-token`. Изменения корня монорепо идут без scope: `chore/update-eslint`.
- Ветка живёт недолго и содержит одну логическую задачу.
- Работа в ветку вливается через Pull Request в `main`, после того как `pnpm typecheck && pnpm lint` проходят. Push и создание PR выполняются только по явной просьбе пользователя.
- После слияния ветка удаляется.

## Коммиты

- Коммитим только по явной просьбе пользователя.
- Формат [Conventional Commits](https://www.conventionalcommits.org/) на английском: `<type>(<scope>): <subject>`.
  - `type`: `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, `build`, `ci`, `chore`.
  - `scope` — пакет: `api`, `web`, `shared`. Если изменение затрагивает несколько пакетов, scope ставится по основному пакету фичи. Изменения корня монорепо (конфиги, CLAUDE.md, CI) идут без scope: `chore: ...`, `docs: ...`.
  - `subject` в повелительном наклонении, со строчной буквы, без точки в конце, не длиннее 72 символов: `feat(api): add transactions module`.
- Тело коммита нужно, если изменение не очевидно из subject. Оно объясняет, что и зачем изменено; перечисления оформляются списком через `-`.
- Ломающее изменение API помечается `!` после scope (`feat(api)!: ...`) и строкой `BREAKING CHANGE: ...` в теле.
- Один коммит — одна логическая задача. Фича коммитится вместе со своей миграцией Prisma, схемами в shared и сопутствующими правками документации.
- Перед коммитом `pnpm typecheck && pnpm lint` должны проходить.
- Не коммитить `.env`, сгенерированный Prisma Client, `dist/` и черновики планов `.claude/.plans/` (они в `.gitignore`).
