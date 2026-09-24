import { NotFoundException } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { isPrismaError, PrismaErrorCode } from '../../common/prisma-errors';
import { DeleteTransactionCommand } from '../contracts';
import { TransactionsRepository } from '../transactions.repository';

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler implements ICommandHandler<DeleteTransactionCommand, void> {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute({ id, userId }: DeleteTransactionCommand): Promise<void> {
    try {
      await this.transactionsRepository.delete(id, userId);
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RecordNotFound)) {
        throw new NotFoundException('Транзакция не найдена');
      }
      throw error;
    }
  }
}
