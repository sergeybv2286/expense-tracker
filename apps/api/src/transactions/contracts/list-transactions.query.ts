import { Query } from '@nestjs/cqrs';
import type { Transaction, TransactionListQuery } from '@expense-tracker/shared';

/** Транзакции пользователя с фильтрами, от новых к старым. */
export class ListTransactionsQuery extends Query<Transaction[]> {
  constructor(
    public readonly userId: string,
    public readonly filter: TransactionListQuery,
  ) {
    super();
  }
}
