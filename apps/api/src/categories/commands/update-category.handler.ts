import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import type { Category } from '@expense-tracker/shared';
import { isPrismaError, PrismaErrorCode } from '../../common/prisma-errors';
import { UpdateCategoryCommand } from '../contracts';
import { CategoriesRepository } from '../categories.repository';
import { toCategory } from '../categories.mapper';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand, Category> {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute({ id, userId, input }: UpdateCategoryCommand): Promise<Category> {
    try {
      return toCategory(await this.categoriesRepository.update(id, userId, input));
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RecordNotFound)) {
        throw new NotFoundException('Категория не найдена');
      }
      if (isPrismaError(error, PrismaErrorCode.UniqueViolation)) {
        throw new ConflictException('Категория с таким названием уже существует');
      }
      throw error;
    }
  }
}
