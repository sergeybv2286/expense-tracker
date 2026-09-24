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
  createTransactionSchema,
  transactionListQuerySchema,
  transactionSummaryQuerySchema,
  updateTransactionSchema,
  type CreateTransactionInput,
  type Transaction,
  type TransactionListQuery,
  type TransactionSummary,
  type TransactionSummaryQuery,
  type UpdateTransactionInput,
} from '@expense-tracker/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import {
  CreateTransactionCommand,
  DeleteTransactionCommand,
  GetTransactionByIdQuery,
  GetTransactionsSummaryQuery,
  ListTransactionsQuery,
  UpdateTransactionCommand,
} from './contracts';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(transactionListQuerySchema)) query: TransactionListQuery,
  ): Promise<Transaction[]> {
    return this.queryBus.execute(new ListTransactionsQuery(user.id, query));
  }

  // Объявлен до ':id', чтобы 'summary' не попадал в параметр id.
  @Get('summary')
  summary(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(transactionSummaryQuerySchema)) query: TransactionSummaryQuery,
  ): Promise<TransactionSummary> {
    return this.queryBus.execute(new GetTransactionsSummaryQuery(user.id, query));
  }

  @Get(':id')
  async getById(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Transaction> {
    const transaction = await this.queryBus.execute(new GetTransactionByIdQuery(id, user.id));
    if (!transaction) {
      throw new NotFoundException('Транзакция не найдена');
    }
    return transaction;
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createTransactionSchema)) body: CreateTransactionInput,
  ): Promise<Transaction> {
    return this.commandBus.execute(new CreateTransactionCommand(user.id, body));
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateTransactionSchema)) body: UpdateTransactionInput,
  ): Promise<Transaction> {
    return this.commandBus.execute(new UpdateTransactionCommand(id, user.id, body));
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.commandBus.execute(new DeleteTransactionCommand(id, user.id));
  }
}
