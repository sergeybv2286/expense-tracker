'use client';

import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTransactionSchema,
  type Category,
  type CreateTransactionInput,
} from '@expense-tracker/shared';
import '@/shared/config/zod-locale';
import { todayIso } from '@/shared/lib/date';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { createTransaction } from '../api/create-transaction';

const TYPE_LABELS = { EXPENSE: 'Расход', INCOME: 'Доход' } as const;

function getDefaultValues(): CreateTransactionInput {
  return { type: 'EXPENSE', amount: '', categoryId: '', date: todayIso(), description: '' };
}

export function CreateTransactionDialog({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: getDefaultValues(),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset(getDefaultValues());
      setServerError(null);
    }
  }

  async function onSubmit(values: CreateTransactionInput) {
    setServerError(null);
    const result = await createTransaction({ ...values, description: values.description || null });
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Добавить
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Новая транзакция</DialogTitle>
          <DialogDescription>Запишите доход или расход</DialogDescription>
        </DialogHeader>
        <form id="create-transaction" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="transaction-type">Тип</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="transaction-type" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="transaction-amount">Сумма, ₽</FieldLabel>
                    <Input
                      {...field}
                      // Русская раскладка вводит запятую, API ждёт точку.
                      onChange={(event) => field.onChange(event.target.value.replace(',', '.'))}
                      id="transaction-amount"
                      inputMode="decimal"
                      placeholder="0.00"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transaction-category">Категория</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="transaction-category"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.emoji && <span aria-hidden>{category.emoji}</span>}
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError>Выберите категорию</FieldError>}
                </Field>
              )}
            />
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transaction-date">Дата</FieldLabel>
                  <Input
                    {...field}
                    id="transaction-date"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transaction-description">Описание</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id="transaction-description"
                    placeholder="Необязательно"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {serverError && <FieldError>{serverError}</FieldError>}
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="submit" form="create-transaction" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Сохраняем…' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
