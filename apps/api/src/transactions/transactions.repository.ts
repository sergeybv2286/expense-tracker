import { Injectable } from '@nestjs/common';
import type {
  CreateTransactionInput,
  TransactionListQuery,
  TransactionPeriod,
  TransactionType,
  UpdateTransactionInput,
} from '@expense-tracker/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma, Transaction } from '../generated/prisma/client';

export interface TransactionTotals {
  byType: { type: TransactionType; total: Prisma.Decimal | null }[];
  byCategory: { categoryId: string; type: TransactionType; total: Prisma.Decimal | null }[];
}

export interface TransactionPage {
  records: Transaction[];
  total: number;
}

/**
 * Единственное место работы с таблицей transactions через Prisma.
 * Все методы фильтруют по userId, чтобы нельзя было обратиться к чужой транзакции.
 */
@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Страница транзакций по фильтру и общее количество подходящих записей. */
  async findPage(
    userId: string,
    { type, categoryId, page, pageSize, ...period }: TransactionListQuery,
  ): Promise<TransactionPage> {
    const where = { userId, type, categoryId, ...this.periodFilter(period) };
    const [records, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.transaction.count({ where }),
    ]);
    return { records, total };
  }

  findById(id: string, userId: string): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({ where: { id, userId } });
  }

  create(userId: string, { date, ...data }: CreateTransactionInput): Promise<Transaction> {
    return this.prisma.transaction.create({ data: { ...data, date: new Date(date), userId } });
  }

  /** Бросает Prisma P2025, если транзакции нет или она чужая. */
  update(
    id: string,
    userId: string,
    { date, ...data }: UpdateTransactionInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id, userId },
      data: { ...data, ...(date ? { date: new Date(date) } : {}) },
    });
  }

  /** Бросает Prisma P2025, если транзакции нет или она чужая. */
  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.transaction.delete({ where: { id, userId } });
  }

  /** Суммы за период: по типу операции и по паре «категория + тип». */
  async totals(userId: string, period: TransactionPeriod): Promise<TransactionTotals> {
    const where = { userId, ...this.periodFilter(period) };
    const [byType, byCategory] = await Promise.all([
      this.prisma.transaction.groupBy({ by: ['type'], where, _sum: { amount: true } }),
      this.prisma.transaction.groupBy({
        by: ['categoryId', 'type'],
        where,
        _sum: { amount: true },
      }),
    ]);
    return {
      byType: byType.map(({ type, _sum }) => ({ type, total: _sum.amount })),
      byCategory: byCategory.map(({ categoryId, type, _sum }) => ({
        categoryId,
        type,
        total: _sum.amount,
      })),
    };
  }

  private periodFilter({ from, to }: TransactionPeriod): Prisma.TransactionWhereInput {
    if (!from && !to) {
      return {};
    }
    return {
      date: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      },
    };
  }
}
