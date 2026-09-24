import { Command } from '@nestjs/cqrs';
import type { CreateTransactionInput, Transaction } from '@expense-tracker/shared';

/** Создаёт транзакцию. Бросает BadRequestException, если категории нет или она чужая. */
export class CreateTransactionCommand extends Command<Transaction> {
  constructor(
    public readonly userId: string,
    public readonly input: CreateTransactionInput,
  ) {
    super();
  }
}
