import { TagsIcon } from 'lucide-react';

export function CategoriesPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Категории</h1>
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-12 text-center">
        <TagsIcon className="size-8 text-muted-foreground" />
        <p className="font-medium">Раздел в разработке</p>
        <p className="text-sm text-muted-foreground">
          Скоро здесь можно будет управлять категориями доходов и расходов
        </p>
      </div>
    </main>
  );
}
