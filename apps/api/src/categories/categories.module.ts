import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CommandHandlers } from './commands';
import { CreateDefaultCategoriesHandler } from './events/create-default-categories.handler';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    CreateDefaultCategoriesHandler,
  ],
})
export class CategoriesModule {}
