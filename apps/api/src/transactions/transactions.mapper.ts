import type { Transaction } from '@expense-tracker/shared';
import type { Transaction as TransactionRecord } from '../generated/prisma/client';

/** Превращает запись Prisma в представление транзакции в API. */
export function toTransaction(record: TransactionRecord): Transaction {
  return {
    id: record.id,
    amount: record.amount.toFixed(2),
    type: record.type,
    description: record.description,
    // Колонка типа DATE приходит как полночь по UTC.
    date: record.date.toISOString().slice(0, 10),
    categoryId: record.categoryId,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
