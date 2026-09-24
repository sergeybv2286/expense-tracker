import { Injectable } from '@nestjs/common';
import type { CreateCategoryInput, UpdateCategoryInput } from '@expense-tracker/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { Category } from '../generated/prisma/client';

/**
 * Единственное место работы с таблицей categories через Prisma.
 * Все методы фильтруют по userId, чтобы нельзя было обратиться к чужой категории.
 */
@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(userId: string, search?: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        userId,
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  findById(id: string, userId: string): Promise<Category | null> {
    return this.prisma.category.findFirst({ where: { id, userId } });
  }

  create(userId: string, data: CreateCategoryInput): Promise<Category> {
    return this.prisma.category.create({ data: { ...data, userId } });
  }

  /** Массовое создание; категории с уже существующими именами пропускаются. */
  async createMany(userId: string, data: CreateCategoryInput[]): Promise<void> {
    await this.prisma.category.createMany({
      data: data.map((item) => ({ ...item, userId })),
      skipDuplicates: true,
    });
  }

  /** Бросает Prisma P2025, если категории нет или она чужая. */
  update(id: string, userId: string, data: UpdateCategoryInput): Promise<Category> {
    return this.prisma.category.update({ where: { id, userId }, data });
  }

  /** Бросает Prisma P2025, если категории нет или она чужая. */
  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.category.delete({ where: { id, userId } });
  }
}
