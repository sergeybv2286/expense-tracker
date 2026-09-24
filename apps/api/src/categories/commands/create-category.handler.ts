import { ConflictException } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import type { Category } from '@expense-tracker/shared';
import { isPrismaError, PrismaErrorCode } from '../../common/prisma-errors';
import { CreateCategoryCommand } from '../contracts';
import { CategoriesRepository } from '../categories.repository';
import { toCategory } from '../categories.mapper';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand, Category> {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute({ userId, input }: CreateCategoryCommand): Promise<Category> {
    try {
      return toCategory(await this.categoriesRepository.create(userId, input));
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.UniqueViolation)) {
        throw new ConflictException('Категория с таким названием уже существует');
      }
      throw error;
    }
  }
}
