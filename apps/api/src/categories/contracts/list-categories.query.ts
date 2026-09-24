import { Query } from '@nestjs/cqrs';
import type { Category } from '@expense-tracker/shared';

/** Категории пользователя, отсортированные по sortOrder и имени. search ищет по имени без учёта регистра. */
export class ListCategoriesQuery extends Query<Category[]> {
  constructor(
    public readonly userId: string,
    public readonly search?: string,
  ) {
    super();
  }
}
