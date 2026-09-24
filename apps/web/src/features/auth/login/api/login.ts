'use server';

import { loginSchema, type AuthResponse, type LoginInput } from '@expense-tracker/shared';
import { setSessionToken } from '@/entities/session';
import { ApiError, apiPost } from '@/shared/api';

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(input: LoginInput): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Проверьте введённые данные' };
  }

  try {
    const { accessToken } = await apiPost<AuthResponse>('/auth/login', parsed.data);
    await setSessionToken(accessToken);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: 'Не удалось связаться с сервером' };
  }
}
