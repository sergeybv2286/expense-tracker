import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import {
  GetUserCredentialsByEmailQuery,
  type UserCredentials,
} from '../contracts/get-user-credentials-by-email.query';
import { UsersRepository } from '../users.repository';

@QueryHandler(GetUserCredentialsByEmailQuery)
export class GetUserCredentialsByEmailHandler implements IQueryHandler<
  GetUserCredentialsByEmailQuery,
  UserCredentials | null
> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(query: GetUserCredentialsByEmailQuery): Promise<UserCredentials | null> {
    const user = await this.usersRepository.findByEmail(query.email);
    if (!user) {
      return null;
    }
    return { id: user.id, email: user.email, passwordHash: user.passwordHash };
  }
}
