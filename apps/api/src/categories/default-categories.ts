import type { CreateCategoryInput } from '@expense-tracker/shared';

/** Категории, которые создаются каждому новому пользователю при регистрации. */
export const DEFAULT_CATEGORIES: CreateCategoryInput[] = [
  { name: 'Продукты', color: '#22C55E', icon: 'shopping-cart', emoji: '🛒', sortOrder: 0 },
  { name: 'Кафе и рестораны', color: '#F97316', icon: 'utensils', emoji: '🍽️', sortOrder: 1 },
  { name: 'Транспорт', color: '#3B82F6', icon: 'bus', emoji: '🚌', sortOrder: 2 },
  { name: 'Жильё', color: '#8B5CF6', icon: 'house', emoji: '🏠', sortOrder: 3 },
  { name: 'Связь и интернет', color: '#06B6D4', icon: 'smartphone', emoji: '📱', sortOrder: 4 },
  { name: 'Здоровье', color: '#EF4444', icon: 'heart-pulse', emoji: '💊', sortOrder: 5 },
  { name: 'Одежда', color: '#EC4899', icon: 'shirt', emoji: '👕', sortOrder: 6 },
  { name: 'Развлечения', color: '#EAB308', icon: 'clapperboard', emoji: '🎬', sortOrder: 7 },
  { name: 'Подарки', color: '#D946EF', icon: 'gift', emoji: '🎁', sortOrder: 8 },
  { name: 'Другое', color: '#64748B', icon: 'package', emoji: '📦', sortOrder: 9 },
];
