import { z } from 'zod';

/** Цвет категории в hex-формате `#RRGGBB`. */
export const CATEGORY_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
/** Имя иконки lucide в kebab-case, например `shopping-cart`. */
export const CATEGORY_ICON_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/**
 * Эмодзи, включая составные (ZWJ-последовательности, тон кожи, keycap).
 * Lookahead отсекает строки только из ASCII: `Emoji_Component` включает `0-9`, `#` и `*`.
 */
export const CATEGORY_EMOJI_REGEX =
  /^(?=.*\P{ASCII})(?:\p{Extended_Pictographic}|\p{Emoji_Component}|‍|️|⃣)+$/u;

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(50),
  color: z.string().regex(CATEGORY_COLOR_REGEX).toUpperCase().optional(),
  icon: z.string().max(50).regex(CATEGORY_ICON_REGEX).nullable().optional(),
  emoji: z.string().max(16).regex(CATEGORY_EMOJI_REGEX).nullable().optional(),
  description: z.string().trim().max(200).nullable().optional(),
  sortOrder: z.int().min(0).optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/** `null` в icon, emoji и description очищает поле. */
export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryListQuerySchema = z.object({
  search: z.string().trim().max(50).optional(),
});
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  emoji: string | null;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
