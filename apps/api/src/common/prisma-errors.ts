import { Prisma } from '../generated/prisma/client';

/** Коды ошибок Prisma, которые обрабатываются в хэндлерах. */
export const PrismaErrorCode = {
  /** Нарушение уникального ограничения. */
  UniqueViolation: 'P2002',
  /** Запись для update/delete не найдена. */
  RecordNotFound: 'P2025',
  /** Нарушение внешнего ключа, например удаление записи, на которую ссылаются. */
  ForeignKeyViolation: 'P2003',
} as const;

export function isPrismaError(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}
