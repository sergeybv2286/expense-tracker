import { Query } from '@nestjs/cqrs';
import type { Paginated, Transaction, TransactionListQuery } from '@expense-tracker/shared';

/** Страница транзакций пользователя с фильтрами, от новых к старым. */
export class ListTransactionsQuery extends Query<Paginated<Transaction>> {
  constructor(
    public readonly userId: string,
    public readonly filter: TransactionListQuery,
  ) {
    super();
  }
}
