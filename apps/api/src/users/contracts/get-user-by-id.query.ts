import { Query } from '@nestjs/cqrs';
import type { PublicUser } from './public-user';

/** Возвращает публичные данные пользователя по id или null, если его нет. */
export class GetUserByIdQuery extends Query<PublicUser | null> {
  constructor(public readonly id: string) {
    super();
  }
}
