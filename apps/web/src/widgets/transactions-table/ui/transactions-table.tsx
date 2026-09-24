import { ReceiptTextIcon } from 'lucide-react';
import type { Category, Paginated, Transaction } from '@expense-tracker/shared';
import { DeleteTransactionButton } from '@/features/transaction/delete';
import { CategoryBadge } from '@/entities/category';
import { TransactionAmount } from '@/entities/transaction';
import { formatDate } from '@/shared/lib/date';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { TransactionsPagination } from './transactions-pagination';

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-12 text-center">
      <ReceiptTextIcon className="size-8 text-muted-foreground" />
      <p className="font-medium">Транзакций пока нет</p>
      <p className="text-sm text-muted-foreground">
        Нажмите «Добавить», чтобы записать первый доход или расход
      </p>
    </div>
  );
}

/** Страница списка транзакций с удалением и пагинацией. */
export function TransactionsTable({
  transactions,
  categories,
}: {
  transactions: Paginated<Transaction>;
  categories: Category[];
}) {
  const { items, total, page, pageSize } = transactions;
  if (total === 0) {
    return <EmptyState />;
  }

  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Дата</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead className="hidden md:table-cell">Описание</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Действия</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-muted-foreground">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <CategoryBadge category={categoriesById.get(transaction.categoryId)} />
                </TableCell>
                <TableCell className="hidden max-w-xs truncate md:table-cell">
                  {transaction.description ?? '—'}
                </TableCell>
                <TableCell className="text-right">
                  <TransactionAmount amount={transaction.amount} type={transaction.type} />
                </TableCell>
                <TableCell>
                  <DeleteTransactionButton transactionId={transaction.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {(page - 1) * pageSize + 1}–{(page - 1) * pageSize + items.length} из {total}
        </p>
        <TransactionsPagination page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
