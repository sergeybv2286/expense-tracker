import { CreateUserHandler } from './create-user.handler';
import { UpdateLastLoginHandler } from './update-last-login.handler';

export * from './create-user.handler';
export * from './update-last-login.handler';

export const CommandHandlers = [CreateUserHandler, UpdateLastLoginHandler];
