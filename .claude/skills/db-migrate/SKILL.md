---
name: db-migrate
description: Изменить модель данных Prisma, создать и применить миграцию, перегенерировать клиент и синхронизировать схемы в packages/shared.
disable-model-invocation: true
argument-hint: <migration_name> [описание изменения]
---

Задача: $ARGUMENTS

Первое слово в аргументах — имя миграции в snake_case (например, `add_expense_tags`). Остальное — описание изменения. Если имени нет, спроси его.

1. Проверь, что Postgres запущен: `docker compose ps`. Если нет, выполни `pnpm db:up` и дождись статуса `healthy`.
2. Внеси изменения в `apps/api/prisma/schema.prisma`, сохраняя принятый стиль: `@map`/`@@map` в snake_case, `@db.Uuid` для id и внешних ключей, `Decimal(12,2)` для денег, индексы для внешних ключей и частых фильтров.
3. `pnpm --filter @expense-tracker/api prisma:migrate --name <migration_name>`. Если Prisma предупреждает о потере данных, остановись и покажи предупреждение пользователю, прежде чем продолжать.
4. `pnpm db:generate`.
5. Синхронизируй `packages/shared/src`: zod-схемы входных данных и интерфейсы ответов API должны соответствовать новой схеме (Decimal и даты передаются строками).
6. Запусти skill `/verify`.
7. Покажи пользователю SQL созданной миграции (`apps/api/prisma/migrations/<timestamp>_<migration_name>/migration.sql`) и кратко перечисли, что изменилось.
