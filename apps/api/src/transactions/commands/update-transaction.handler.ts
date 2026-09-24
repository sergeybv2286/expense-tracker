import { NotFoundException } from '@nestjs/common';
import { CommandHandler, QueryBus, type ICommandHandler } from '@nestjs/cqrs';
import type { Transaction } from '@expense-tracker/shared';
import { isPrismaError, PrismaErrorCode } from '../../common/prisma-errors';
import { UpdateTransactionCommand } from '../contracts';
import { TransactionsRepository } from '../transactions.repository';
import { toTransaction } from '../transactions.mapper';
import { assertCategoryExists } from '../assert-category';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler implements ICommandHandler<
  UpdateTransactionCommand,
  Transaction
> {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ id, userId, input }: UpdateTransactionCommand): Promise<Transaction> {
    if (input.categoryId) {
      await assertCategoryExists(this.queryBus, input.categoryId, userId);
    }
    try {
      return toTransaction(await this.transactionsRepository.update(id, userId, input));
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RecordNotFound)) {
        throw new NotFoundException('Транзакция не найдена');
      }
      throw error;
    }
  }
}
