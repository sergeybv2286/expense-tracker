import 'server-only';
import type { Category } from '@expense-tracker/shared';
import { apiServerRequest } from '@/shared/api/server';

export function getCategories(): Promise<Category[]> {
  return apiServerRequest<Category[]>('/categories');
}
