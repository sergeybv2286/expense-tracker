import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { AuthResponse, LoginInput, RegisterInput } from '@expense-tracker/shared';
import {
  CreateUserCommand,
  GetUserByIdQuery,
  GetUserCredentialsByEmailQuery,
  UpdateLastLoginCommand,
  type PublicUser,
} from '../users/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const passwordHash = await argon2.hash(input.password);
    const user = await this.commandBus.execute(
      new CreateUserCommand(input.email, input.name, passwordHash),
    );
    return this.buildAuthResponse(user);
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const credentials = await this.queryBus.execute(
      new GetUserCredentialsByEmailQuery(input.email),
    );

    const isValid = credentials
      ? await argon2.verify(credentials.passwordHash, input.password)
      : false;
    if (!credentials || !isValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    await this.commandBus.execute(new UpdateLastLoginCommand(credentials.id));

    const user = await this.queryBus.execute(new GetUserByIdQuery(credentials.id));
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: PublicUser): AuthResponse {
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken, user };
  }
}
