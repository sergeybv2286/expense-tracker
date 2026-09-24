import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  currency: z.string().length(3).toUpperCase().default('RUB'),
  description: z.string().trim().max(255).optional(),
  spentAt: z.iso.date(),
  categoryId: z.uuid().optional(),
});
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export const updateExpenseSchema = createExpenseSchema.partial();
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

/** Представление расхода в API. Сумма передаётся строкой, чтобы не терять точность Decimal. */
export interface Expense {
  id: string;
  amount: string;
  currency: string;
  description: string | null;
  spentAt: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}
