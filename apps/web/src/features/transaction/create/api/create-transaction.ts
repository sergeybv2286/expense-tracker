'use server';

import { revalidatePath } from 'next/cache';
import { unstable_rethrow } from 'next/navigation';
import {
  createTransactionSchema,
  type CreateTransactionInput,
  type Transaction,
} from '@expense-tracker/shared';
import { ApiError } from '@/shared/api';
import { apiServerRequest } from '@/shared/api/server';

export type CreateTransactionResult = { ok: true } | { ok: false; error: string };

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<CreateTransactionResult> {
  const parsed = createTransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Проверьте введённые данные' };
  }

  try {
    await apiServerRequest<Transaction>('/transactions', { method: 'POST', body: parsed.data });
  } catch (error) {
    // redirect() из apiServerRequest бросает служебное исключение Next, его нельзя проглатывать.
    unstable_rethrow(error);
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: 'Не удалось связаться с сервером' };
  }

  revalidatePath('/');
  return { ok: true };
}
