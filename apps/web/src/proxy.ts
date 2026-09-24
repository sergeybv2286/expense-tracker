import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/shared/config/session';

/**
 * Оптимистичная проверка: без cookie сессии сразу отправляем на вход.
 * Валидность токена проверяет API, а протухший токен ловит apiServerRequest по 401.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Пропускаем публичные страницы целиком (`/login`, но не `/login-history`), служебные пути Next и
  // конкретные статические файлы. Всё остальное, включая пути с точкой, проверяется.
  matcher: ['/((?!(?:login|register|privacy|terms)(?:/|$)|_next/|favicon\\.ico$).*)'],
};
