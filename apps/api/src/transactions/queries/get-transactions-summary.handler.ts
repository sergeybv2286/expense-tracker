import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import type { TransactionSummary } from '@expense-tracker/shared';
import { Prisma } from '../../generated/prisma/client';
import { GetTransactionsSummaryQuery } from '../contracts';
import { TransactionsRepository } from '../transactions.repository';

@QueryHandler(GetTransactionsSummaryQuery)
export class GetTransactionsSummaryHandler implements IQueryHandler<
  GetTransactionsSummaryQuery,
  TransactionSummary
> {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute({ userId, period }: GetTransactionsSummaryQuery): Promise<TransactionSummary> {
    const { byType, byCategory } = await this.transactionsRepository.totals(userId, period);
    // Считаем в Decimal, чтобы не терять копейки на переводе в number.
    const totalOf = (type: string) =>
      byType.find((row) => row.type === type)?.total ?? new Prisma.Decimal(0);
    const income = totalOf('INCOME');
    const expense = totalOf('EXPENSE');

    return {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      balance: income.minus(expense).toFixed(2),
      byCategory: byCategory.map(({ categoryId, type, total }) => ({
        categoryId,
        type,
        total: (total ?? new Prisma.Decimal(0)).toFixed(2),
      })),
    };
  }
}
