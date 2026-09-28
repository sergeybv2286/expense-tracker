import { ArrowDownRightIcon, ArrowUpRightIcon, ScaleIcon, type LucideIcon } from 'lucide-react';
import type { TransactionSummary } from '@expense-tracker/shared';
import { formatAmount } from '@/shared/lib/money';
import { cn } from '@/shared/lib/utils';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  className?: string;
}

function SummaryCard({ title, amount, icon: Icon, className }: SummaryCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardDescription className="flex items-center justify-between">
          {title}
          <Icon className={cn('size-4', className)} />
        </CardDescription>
        <CardTitle className={cn('text-2xl tabular-nums', className)}>
          {formatAmount(amount)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

/** Доходы, расходы и баланс за период. */
export function TransactionsSummary({
  summary,
  periodLabel,
}: {
  summary: TransactionSummary;
  periodLabel: string;
}) {
  return (
    <section aria-labelledby="summary-title" className="flex flex-col gap-3">
      <h2 id="summary-title" className="text-sm text-muted-foreground first-letter:uppercase">
        {periodLabel}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Доходы"
          amount={summary.income}
          icon={ArrowUpRightIcon}
          className="text-emerald-600 dark:text-emerald-400"
        />
        <SummaryCard title="Расходы" amount={summary.expense} icon={ArrowDownRightIcon} />
        <SummaryCard
          title="Баланс"
          amount={summary.balance}
          icon={ScaleIcon}
          className={summary.balance.startsWith('-') ? 'text-destructive' : undefined}
        />
      </div>
    </section>
  );
}
