import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import type { Transaction } from '@expense-tracker/shared';
import { ListTransactionsQuery } from '../contracts';
import { TransactionsRepository } from '../transactions.repository';
import { toTransaction } from '../transactions.mapper';

@QueryHandler(ListTransactionsQuery)
export class ListTransactionsHandler implements IQueryHandler<
  ListTransactionsQuery,
  Transaction[]
> {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute({ userId, filter }: ListTransactionsQuery): Promise<Transaction[]> {
    const records = await this.transactionsRepository.findMany(userId, filter);
    return records.map(toTransaction);
  }
}
