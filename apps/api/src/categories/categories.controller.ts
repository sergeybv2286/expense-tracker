import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  categoryListQuerySchema,
  createCategorySchema,
  updateCategorySchema,
  type Category,
  type CategoryListQuery,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from '@expense-tracker/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import {
  CreateCategoryCommand,
  DeleteCategoryCommand,
  GetCategoryByIdQuery,
  ListCategoriesQuery,
  UpdateCategoryCommand,
} from './contracts';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(categoryListQuerySchema)) query: CategoryListQuery,
  ): Promise<Category[]> {
    return this.queryBus.execute(new ListCategoriesQuery(user.id, query.search));
  }

  @Get(':id')
  async getById(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Category> {
    const category = await this.queryBus.execute(new GetCategoryByIdQuery(id, user.id));
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }
    return category;
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createCategorySchema)) body: CreateCategoryInput,
  ): Promise<Category> {
    return this.commandBus.execute(new CreateCategoryCommand(user.id, body));
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateCategorySchema)) body: UpdateCategoryInput,
  ): Promise<Category> {
    return this.commandBus.execute(new UpdateCategoryCommand(id, user.id, body));
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.commandBus.execute(new DeleteCategoryCommand(id, user.id));
  }
}
