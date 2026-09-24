import { Command } from '@nestjs/cqrs';
import type { Transaction, UpdateTransactionInput } from '@expense-tracker/shared';

/** Частично обновляет транзакцию. Бросает NotFoundException или BadRequestException (категория не найдена). */
export class UpdateTransactionCommand extends Command<Transaction> {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly input: UpdateTransactionInput,
  ) {
    super();
  }
}
