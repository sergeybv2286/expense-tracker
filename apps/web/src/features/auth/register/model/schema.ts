import { z } from 'zod';
import { registerSchema } from '@expense-tracker/shared';

/** Форма регистрации: схема API + согласие с документами (на сервер не отправляется). */
export const registerFormSchema = registerSchema.extend({
  agreement: z.boolean().refine((value) => value, {
    message: 'Необходимо принять соглашение и политику',
  }),
});
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
