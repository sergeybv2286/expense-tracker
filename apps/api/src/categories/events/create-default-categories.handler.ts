import { Logger } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../users/contracts';
import { CategoriesRepository } from '../categories.repository';
import { DEFAULT_CATEGORIES } from '../default-categories';

/** Создаёт новому пользователю набор категорий по умолчанию. */
@EventsHandler(UserRegisteredEvent)
export class CreateDefaultCategoriesHandler implements IEventHandler<UserRegisteredEvent> {
  private readonly logger = new Logger(CreateDefaultCategoriesHandler.name);

  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async handle({ userId }: UserRegisteredEvent): Promise<void> {
    // Ошибку только логируем: сбой создания категорий не должен ломать регистрацию.
    try {
      await this.categoriesRepository.createMany(userId, DEFAULT_CATEGORIES);
    } catch (error) {
      this.logger.error(
        `Не удалось создать категории по умолчанию для пользователя ${userId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
