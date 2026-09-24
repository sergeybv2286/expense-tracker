'use server';

import { revalidatePath } from 'next/cache';
import { unstable_rethrow } from 'next/navigation';
import { z } from 'zod';
import { ApiError } from '@/shared/api';
import { apiServerRequest } from '@/shared/api/server';

export type DeleteTransactionResult = { ok: true } | { ok: false; error: string };

export async function deleteTransaction(id: string): Promise<DeleteTransactionResult> {
  if (!z.uuid().safeParse(id).success) {
    return { ok: false, error: 'Транзакция не найдена' };
  }

  try {
    await apiServerRequest<void>(`/transactions/${id}`, { method: 'DELETE' });
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
