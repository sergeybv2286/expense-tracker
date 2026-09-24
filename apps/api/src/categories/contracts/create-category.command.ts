import { Command } from '@nestjs/cqrs';
import type { Category, CreateCategoryInput } from '@expense-tracker/shared';

/** Создаёт категорию. Бросает ConflictException, если имя уже занято. */
export class CreateCategoryCommand extends Command<Category> {
  constructor(
    public readonly userId: string,
    public readonly input: CreateCategoryInput,
  ) {
    super();
  }
}
