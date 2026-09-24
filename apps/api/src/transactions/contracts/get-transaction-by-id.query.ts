import { Query } from '@nestjs/cqrs';
import type { Transaction } from '@expense-tracker/shared';

/** Транзакция пользователя по id или null, если её нет или она принадлежит другому пользователю. */
export class GetTransactionByIdQuery extends Query<Transaction | null> {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
    super();
  }
}
