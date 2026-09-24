import type { TransactionType } from '@expense-tracker/shared';
import { formatAmount } from '@/shared/lib/money';
import { cn } from '@/shared/lib/utils';

export function TransactionAmount({
  amount,
  type,
  className,
}: {
  amount: string;
  type: TransactionType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'font-medium tabular-nums whitespace-nowrap',
        type === 'INCOME' && 'text-emerald-600 dark:text-emerald-400',
        className,
      )}
    >
      {formatAmount(amount, type)}
    </span>
  );
}
