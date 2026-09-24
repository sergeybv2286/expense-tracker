import { Query } from '@nestjs/cqrs';
import type { TransactionPeriod, TransactionSummary } from '@expense-tracker/shared';

/** Доходы, расходы, баланс и разбивка по категориям за период. */
export class GetTransactionsSummaryQuery extends Query<TransactionSummary> {
  constructor(
    public readonly userId: string,
    public readonly period: TransactionPeriod,
  ) {
    super();
  }
}
