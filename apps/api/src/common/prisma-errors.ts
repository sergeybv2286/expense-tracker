import { Prisma } from '../generated/prisma/client';

/** Коды ошибок Prisma, которые обрабатываются в хэндлерах. */
export const PrismaErrorCode = {
  /** Нарушение уникального ограничения. */
  UniqueViolation: 'P2002',
  /** Запись для update/delete не найдена. */
  RecordNotFound: 'P2025',
} as const;

export function isPrismaError(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}
