import { z } from 'zod';
import { paginationQuerySchema } from './pagination.js';

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const;
export const transactionTypeSchema = z.enum(TRANSACTION_TYPES);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

/** Сумма строкой: до 10 цифр в целой части и до 2 после точки, как у `Decimal(12,2)`. */
export const TRANSACTION_AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/;

export const createTransactionSchema = z.object({
  amount: z
    .string()
    .trim()
    .regex(TRANSACTION_AMOUNT_REGEX, 'Введите сумму, например 1250.50')
    .refine((value) => /[1-9]/.test(value), 'Сумма должна быть больше нуля'),
  type: transactionTypeSchema,
  description: z.string().trim().max(255).nullable().optional(),
  date: z.iso.date(),
  categoryId: z.uuid(),
});
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

/** `null` в description очищает поле. */
export const updateTransactionSchema = createTransactionSchema.partial();
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

/** Период в формате `YYYY-MM-DD`, границы включаются. */
export const transactionPeriodSchema = z.object({
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
});
export type TransactionPeriod = z.infer<typeof transactionPeriodSchema>;

export const transactionListQuerySchema = transactionPeriodSchema.extend({
  type: transactionTypeSchema.optional(),
  categoryId: z.uuid().optional(),
  ...paginationQuerySchema.shape,
});
export type TransactionListQuery = z.infer<typeof transactionListQuerySchema>;

export const transactionSummaryQuerySchema = transactionPeriodSchema;
export type TransactionSummaryQuery = z.infer<typeof transactionSummaryQuerySchema>;

/** Представление транзакции в API. Сумма передаётся строкой, чтобы не терять точность Decimal. */
export interface Transaction {
  id: string;
  amount: string;
  type: TransactionType;
  description: string | null;
  /** Дата операции в формате `YYYY-MM-DD`. */
  date: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCategoryTotal {
  categoryId: string;
  type: TransactionType;
  total: string;
}

/** Итоги за период. Все суммы строками с двумя знаками после точки. */
export interface TransactionSummary {
  income: string;
  expense: string;
  /** Доходы минус расходы. */
  balance: string;
  byCategory: TransactionCategoryTotal[];
}
