import { NotFoundException } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { isPrismaError, PrismaErrorCode } from '../../common/prisma-errors';
import { DeleteCategoryCommand } from '../contracts';
import { CategoriesRepository } from '../categories.repository';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand, void> {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute({ id, userId }: DeleteCategoryCommand): Promise<void> {
    try {
      await this.categoriesRepository.delete(id, userId);
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RecordNotFound)) {
        throw new NotFoundException('Категория не найдена');
      }
      throw error;
    }
  }
}
