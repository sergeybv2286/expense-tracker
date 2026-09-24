import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  loginSchema,
  registerSchema,
  type AuthResponse,
  type LoginInput,
  type RegisterInput,
} from '@expense-tracker/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterInput,
  ): Promise<AuthResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body(new ZodValidationPipe(loginSchema)) body: LoginInput): Promise<AuthResponse> {
    return this.authService.login(body);
  }
}
