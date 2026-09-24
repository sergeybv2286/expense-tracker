import { z } from 'zod';

// Сообщения валидации из shared-схем показываем пользователю на русском.
z.config(z.locales.ru());
