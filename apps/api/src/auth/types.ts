/** Данные пользователя, извлечённые из JWT и положенные в request.user. */
export interface AuthUser {
  id: string;
  email: string;
}
