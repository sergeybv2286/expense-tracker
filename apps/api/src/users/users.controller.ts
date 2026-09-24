import { Controller, Get, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types';
import { GetUserByIdQuery, type PublicUser } from './contracts';

@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  async getMe(@CurrentUser() currentUser: AuthUser): Promise<PublicUser> {
    const user = await this.queryBus.execute(new GetUserByIdQuery(currentUser.id));
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }
}
