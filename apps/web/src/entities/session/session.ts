import 'server-only';
import { cookies } from 'next/headers';

const TOKEN_COOKIE = 'access_token';
const WEEK_SECONDS = 60 * 60 * 24 * 7;

/** Кладёт JWT в httpOnly-cookie, чтобы токен был недоступен клиентскому JS. */
export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: WEEK_SECONDS,
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
}
