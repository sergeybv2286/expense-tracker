import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/** Первая, последняя и соседние с текущей страницы, остальное сворачивается в многоточие. */
function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const start = Math.max(2, Math.min(page - 1, totalPages - 4));
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5));
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  return [
    1,
    ...(start > 2 ? (['ellipsis-start'] as const) : []),
    ...middle,
    ...(end < totalPages - 1 ? (['ellipsis-end'] as const) : []),
    totalPages,
  ];
}

function pageHref(page: number): string {
  return page === 1 ? '/' : `/?page=${page}`;
}

export function TransactionsPagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={pageHref(page - 1)} />
          </PaginationItem>
        )}
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <PaginationItem key={item}>
              <PaginationLink href={pageHref(item)} isActive={item === page}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext href={pageHref(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
