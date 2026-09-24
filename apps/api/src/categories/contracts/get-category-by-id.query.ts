import { Query } from '@nestjs/cqrs';
import type { Category } from '@expense-tracker/shared';

/** Категория пользователя по id или null, если её нет или она принадлежит другому пользователю. */
export class GetCategoryByIdQuery extends Query<Category | null> {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
    super();
  }
}
