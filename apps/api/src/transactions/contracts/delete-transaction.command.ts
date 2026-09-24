import { Command } from '@nestjs/cqrs';

/** Удаляет транзакцию. Бросает NotFoundException. */
export class DeleteTransactionCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
    super();
  }
}
