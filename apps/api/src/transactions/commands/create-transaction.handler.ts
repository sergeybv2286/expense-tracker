import { CommandHandler, QueryBus, type ICommandHandler } from '@nestjs/cqrs';
import type { Transaction } from '@expense-tracker/shared';
import { CreateTransactionCommand } from '../contracts';
import { TransactionsRepository } from '../transactions.repository';
import { toTransaction } from '../transactions.mapper';
import { assertCategoryExists } from '../assert-category';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<
  CreateTransactionCommand,
  Transaction
> {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ userId, input }: CreateTransactionCommand): Promise<Transaction> {
    await assertCategoryExists(this.queryBus, input.categoryId, userId);
    return toTransaction(await this.transactionsRepository.create(userId, input));
  }
}
