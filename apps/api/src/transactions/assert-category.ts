import { BadRequestException } from '@nestjs/common';
import type { QueryBus } from '@nestjs/cqrs';
import { GetCategoryByIdQuery } from '../categories/contracts';

/** Проверяет через контракт модуля категорий, что категория существует и принадлежит пользователю. */
export async function assertCategoryExists(
  queryBus: QueryBus,
  categoryId: string,
  userId: string,
): Promise<void> {
  const category = await queryBus.execute(new GetCategoryByIdQuery(categoryId, userId));
  if (!category) {
    throw new BadRequestException('Категория не найдена');
  }
}
