import { GetCategoryByIdHandler } from './get-category-by-id.handler';
import { ListCategoriesHandler } from './list-categories.handler';

export * from './list-categories.handler';
export * from './get-category-by-id.handler';

export const QueryHandlers = [ListCategoriesHandler, GetCategoryByIdHandler];
