import type { User } from '../generated/prisma/client';
import type { PublicUser } from './contracts';

/** Превращает запись Prisma в публичное представление пользователя (без хэша пароля). */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}
