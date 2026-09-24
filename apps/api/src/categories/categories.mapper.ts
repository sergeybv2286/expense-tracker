import type { Category } from '@expense-tracker/shared';
import type { Category as CategoryRecord } from '../generated/prisma/client';

/** Превращает запись Prisma в представление категории в API. */
export function toCategory(record: CategoryRecord): Category {
  return {
    id: record.id,
    name: record.name,
    color: record.color,
    icon: record.icon,
    emoji: record.emoji,
    description: record.description,
    sortOrder: record.sortOrder,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
