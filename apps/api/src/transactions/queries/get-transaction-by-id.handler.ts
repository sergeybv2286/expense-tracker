import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import type { Transaction } from '@expense-tracker/shared';
import { GetTransactionByIdQuery } from '../contracts';
import { TransactionsRepository } from '../transactions.repository';
import { toTransaction } from '../transactions.mapper';

@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdHandler implements IQueryHandler<
  GetTransactionByIdQuery,
  Transaction | null
> {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute({ id, userId }: GetTransactionByIdQuery): Promise<Transaction | null> {
    const record = await this.transactionsRepository.findById(id, userId);
    return record ? toTransaction(record) : null;
  }
}
