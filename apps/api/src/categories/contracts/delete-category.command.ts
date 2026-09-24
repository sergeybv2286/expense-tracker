import { Command } from '@nestjs/cqrs';

/** Удаляет категорию; её расходы остаются с categoryId = null. Бросает NotFoundException. */
export class DeleteCategoryCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
    super();
  }
}
