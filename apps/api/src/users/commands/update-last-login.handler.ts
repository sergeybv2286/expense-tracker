import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { UpdateLastLoginCommand } from '../contracts';
import { UsersRepository } from '../users.repository';

@CommandHandler(UpdateLastLoginCommand)
export class UpdateLastLoginHandler implements ICommandHandler<UpdateLastLoginCommand, void> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: UpdateLastLoginCommand): Promise<void> {
    await this.usersRepository.updateLastLogin(command.userId);
  }
}
