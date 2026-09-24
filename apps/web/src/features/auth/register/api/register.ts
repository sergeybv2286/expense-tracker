'use server';

import { registerSchema, type AuthResponse, type RegisterInput } from '@expense-tracker/shared';
import { setSessionToken } from '@/entities/session';
import { ApiError, apiPost } from '@/shared/api';

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function register(input: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Проверьте введённые данные' };
  }

  try {
    const { accessToken } = await apiPost<AuthResponse>('/auth/register', parsed.data);
    await setSessionToken(accessToken);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: 'Не удалось связаться с сервером' };
  }
}
