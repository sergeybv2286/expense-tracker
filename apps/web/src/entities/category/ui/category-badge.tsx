import type { Category } from '@expense-tracker/shared';
import { Badge } from '@/shared/ui/badge';

export function CategoryBadge({ category }: { category: Category | undefined }) {
  if (!category) {
    return <Badge variant="outline">Без категории</Badge>;
  }
  return (
    <Badge variant="outline" className="gap-1.5">
      {category.emoji ? (
        <span aria-hidden>{category.emoji}</span>
      ) : (
        <span
          aria-hidden
          className="size-2 rounded-full"
          style={{ backgroundColor: category.color }}
        />
      )}
      {category.name}
    </Badge>
  );
}
