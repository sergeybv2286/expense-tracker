import 'server-only';
import {
  DEFAULT_PAGE_SIZE,
  type Paginated,
  type Transaction,
  type TransactionPeriod,
  type TransactionSummary,
} from '@expense-tracker/shared';
import { apiServerRequest } from '@/shared/api/server';

/** Страница транзакций текущего пользователя, от новых к старым. */
export function getTransactions(page: number): Promise<Paginated<Transaction>> {
  return apiServerRequest<Paginated<Transaction>>('/transactions', {
    query: { page, pageSize: DEFAULT_PAGE_SIZE },
  });
}

/** Доходы, расходы и баланс за период. */
export function getTransactionsSummary(period: TransactionPeriod): Promise<TransactionSummary> {
  return apiServerRequest<TransactionSummary>('/transactions/summary', { query: period });
}
