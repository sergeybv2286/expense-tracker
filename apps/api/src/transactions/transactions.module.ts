import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';

@Module({
  imports: [CqrsModule],
  controllers: [TransactionsController],
  providers: [TransactionsRepository, ...CommandHandlers, ...QueryHandlers],
})
export class TransactionsModule {}
