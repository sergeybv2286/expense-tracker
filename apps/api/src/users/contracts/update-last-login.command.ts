import { Command } from '@nestjs/cqrs';

/** Обновляет отметку последнего входа пользователя. */
export class UpdateLastLoginCommand extends Command<void> {
  constructor(public readonly userId: string) {
    super();
  }
}
