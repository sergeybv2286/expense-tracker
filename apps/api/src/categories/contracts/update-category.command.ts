import { Command } from '@nestjs/cqrs';
import type { Category, UpdateCategoryInput } from '@expense-tracker/shared';

/** Частично обновляет категорию. Бросает NotFoundException или ConflictException (имя занято). */
export class UpdateCategoryCommand extends Command<Category> {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly input: UpdateCategoryInput,
  ) {
    super();
  }
}
