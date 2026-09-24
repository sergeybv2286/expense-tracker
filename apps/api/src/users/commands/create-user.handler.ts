import { ConflictException } from '@nestjs/common';
import { CommandHandler, EventBus, type ICommandHandler } from '@nestjs/cqrs';
import { isPrismaError, PrismaErrorCode } from '../../common/prisma-errors';
import { CreateUserCommand, type PublicUser, UserRegisteredEvent } from '../contracts';
import { UsersRepository } from '../users.repository';
import { toPublicUser } from '../users.mapper';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, PublicUser> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<PublicUser> {
    const { email, name, passwordHash } = command;

    try {
      const user = await this.usersRepository.create({ email, name, passwordHash });
      this.eventBus.publish(new UserRegisteredEvent(user.id, user.email));
      return toPublicUser(user);
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.UniqueViolation)) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
      throw error;
    }
  }
}
