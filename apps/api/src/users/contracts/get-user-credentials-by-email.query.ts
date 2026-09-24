import { Query } from '@nestjs/cqrs';

export interface UserCredentials {
  id: string;
  email: string;
  passwordHash: string;
}

/**
 * Возвращает учётные данные пользователя (включая хэш пароля) по email.
 * Отдельный запрос от GetUserByIdQuery, чтобы хэш не утекал в обычные ответы.
 */
export class GetUserCredentialsByEmailQuery extends Query<UserCredentials | null> {
  constructor(public readonly email: string) {
    super();
  }
}
