import { z } from 'zod';

export const DEFAULT_PAGE_SIZE = 10;

/** Номер страницы с единицы и её размер. Приходят из query-строки, поэтому приводятся к числу. */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(DEFAULT_PAGE_SIZE),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/** Страница списка и общее количество записей по фильтру. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
