import type { TransactionType } from '@expense-tracker/shared';

const NBSP = '\u00A0';
const MINUS = '−';

/**
 * Форматирует сумму-строку из API (`"12345.5"`, `"-10.00"`) в `12 345,50 ₽`.
 * Работает со строкой напрямую, чтобы не терять точность Decimal при приведении к number.
 * Если передан тип операции, добавляет знак: `+` для дохода и `−` для расхода.
 */
export function formatAmount(amount: string, type?: TransactionType): string {
  const negative = amount.startsWith('-');
  const [integer = '0', fraction = ''] = amount.replace(/^[-+]/, '').split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  const value = `${grouped},${fraction.padEnd(2, '0').slice(0, 2)}${NBSP}₽`;

  if (type === 'INCOME') {
    return `+${value}`;
  }
  if (type === 'EXPENSE' || negative) {
    return `${MINUS}${value}`;
  }
  return value;
}
