import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import type { Paginated, Transaction } from '@expense-tracker/shared';
import { ListTransactionsQuery } from '../contracts';
import { TransactionsRepository } from '../transactions.repository';
import { toTransaction } from '../transactions.mapper';

@QueryHandler(ListTransactionsQuery)
export class ListTransactionsHandler implements IQueryHandler<
  ListTransactionsQuery,
  Paginated<Transaction>
> {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute({ userId, filter }: ListTransactionsQuery): Promise<Paginated<Transaction>> {
    const { records, total } = await this.transactionsRepository.findPage(userId, filter);
    return {
      items: records.map(toTransaction),
      total,
      page: filter.page,
      pageSize: filter.pageSize,
    };
  }
}
