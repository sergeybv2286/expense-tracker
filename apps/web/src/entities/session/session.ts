import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/shared/config/session';

const WEEK_SECONDS = 60 * 60 * 24 * 7;

/** Кладёт JWT в httpOnly-cookie, чтобы токен был недоступен клиентскому JS. */
export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: WEEK_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
