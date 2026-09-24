import { redirect } from 'next/navigation';
import { TransactionsSummary } from '@/widgets/transactions-summary';
import { TransactionsTable } from '@/widgets/transactions-table';
import { CreateTransactionDialog } from '@/features/transaction/create';
import { getCategories } from '@/entities/category/server';
import { getTransactions, getTransactionsSummary } from '@/entities/transaction/server';
import { getCurrentMonthPeriod } from '@/shared/lib/date';

/** Номер страницы из `?page=`. Мусор и значения меньше единицы считаем первой страницей. */
function parsePage(value: string | string[] | undefined): number {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const page = parsePage((await searchParams).page);
  const { label, ...period } = getCurrentMonthPeriod();

  const [transactions, summary, categories] = await Promise.all([
    getTransactions(page),
    getTransactionsSummary(period),
    getCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(transactions.total / transactions.pageSize));
  if (page > totalPages) {
    redirect(totalPages === 1 ? '/' : `/?page=${totalPages}`);
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <TransactionsSummary summary={summary} periodLabel={label} />
      <section aria-labelledby="transactions-title" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h1 id="transactions-title" className="text-2xl font-semibold tracking-tight">
            Транзакции
          </h1>
          <CreateTransactionDialog categories={categories} />
        </div>
        <TransactionsTable transactions={transactions} categories={categories} />
      </section>
    </main>
  );
}
