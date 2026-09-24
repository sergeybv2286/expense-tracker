/** Публикуется после успешной регистрации пользователя. Пока без подписчиков. */
export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}
