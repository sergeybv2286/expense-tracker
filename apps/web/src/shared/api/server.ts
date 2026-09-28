import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE } from '../config/session';
import { ApiError, apiRequest, type ApiRequestInit } from './http';

/**
 * Запрос к API от имени текущего пользователя: токен берётся из httpOnly-cookie.
 * Без токена или при 401 (токен протух) отправляет на страницу входа.
 */
export async function apiServerRequest<TResponse>(
  path: string,
  init: Omit<ApiRequestInit, 'token'> = {},
): Promise<TResponse> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) {
    redirect('/login');
  }

  try {
    return await apiRequest<TResponse>(path, { ...init, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/login');
    }
    throw error;
  }
}
