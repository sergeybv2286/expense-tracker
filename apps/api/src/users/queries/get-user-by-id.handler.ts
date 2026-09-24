import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery, type PublicUser } from '../contracts';
import { UsersRepository } from '../users.repository';
import { toPublicUser } from '../users.mapper';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery, PublicUser | null> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(query: GetUserByIdQuery): Promise<PublicUser | null> {
    const user = await this.usersRepository.findById(query.id);
    return user ? toPublicUser(user) : null;
  }
}
