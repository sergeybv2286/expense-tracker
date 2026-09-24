## Контекст (что уже есть)
- Авторизация (JWT), модуль категорий

## Задача
Создай TransactionModule - центральный
модуль приложения для учетов доходов и расходов

## Модель данных
Добавь модель Transaction в schema.prisma:
- id (String, uuid, @default(uuid()))
- amount (Decimal)
- type (Enum: INCOME, EXPENSE)
- description (String, nullable)
- date (DateTime)
- categoryId(String, связь с Category)
- userId(String, связь с User)
- createdId(DateTime, @default(now()))

Обнови модель User и Category - добавь обратные
связи transactions Transaction[]

## Контроллер и эндпоинты
- POST /transactions: создать транзакцию
- GET /transactions
- GET /transactions/summary
- GET /transactions/:id
- PATCH /transactions/:id
- DELETE /transactions/:id

## Паттерн
- Следуй структуре модуля на основе бекенда нашего проекта
- Взаимодействие через CQRS

## Ограничения
- Не добавлять зависимости без указания
- class-validator для DTO
- После реализации запустить сборку