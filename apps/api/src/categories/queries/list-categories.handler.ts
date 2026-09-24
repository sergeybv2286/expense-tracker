import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import type { Category } from '@expense-tracker/shared';
import { ListCategoriesQuery } from '../contracts';
import { CategoriesRepository } from '../categories.repository';
import { toCategory } from '../categories.mapper';

@QueryHandler(ListCategoriesQuery)
export class ListCategoriesHandler implements IQueryHandler<ListCategoriesQuery, Category[]> {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute({ userId, search }: ListCategoriesQuery): Promise<Category[]> {
    const records = await this.categoriesRepository.findMany(userId, search);
    return records.map(toCategory);
  }
}
