import 'server-only';
import type { User } from '@expense-tracker/shared';
import { apiServerRequest } from '@/shared/api/server';

export function getCurrentUser(): Promise<User> {
  return apiServerRequest<User>('/users/me');
}
