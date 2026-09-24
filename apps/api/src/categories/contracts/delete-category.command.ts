import { Command } from '@nestjs/cqrs';

/**
 * Удаляет категорию. Бросает NotFoundException или ConflictException,
 * если в категории есть транзакции.
 */
export class DeleteCategoryCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
    super();
  }
}
