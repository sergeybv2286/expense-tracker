import { Command } from '@nestjs/cqrs';
import type { PublicUser } from './public-user';

/** Создаёт пользователя. Бросает ConflictException, если email уже занят. */
export class CreateUserCommand extends Command<PublicUser> {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly passwordHash: string,
  ) {
    super();
  }
}
