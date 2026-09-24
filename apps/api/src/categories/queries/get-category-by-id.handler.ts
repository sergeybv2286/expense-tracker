import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import type { Category } from '@expense-tracker/shared';
import { GetCategoryByIdQuery } from '../contracts';
import { CategoriesRepository } from '../categories.repository';
import { toCategory } from '../categories.mapper';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<
  GetCategoryByIdQuery,
  Category | null
> {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute({ id, userId }: GetCategoryByIdQuery): Promise<Category | null> {
    const record = await this.categoriesRepository.findById(id, userId);
    return record ? toCategory(record) : null;
  }
}
