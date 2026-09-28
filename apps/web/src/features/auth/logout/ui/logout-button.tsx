import { LogOutIcon } from 'lucide-react';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';
import { logout } from '../api/logout';

/** Пункт меню профиля. Форма с server action работает и без клиентского JS. */
export function LogoutMenuItem() {
  return (
    <form action={logout}>
      <DropdownMenuItem asChild>
        <button type="submit" className="w-full">
          <LogOutIcon />
          Выйти
        </button>
      </DropdownMenuItem>
    </form>
  );
}
