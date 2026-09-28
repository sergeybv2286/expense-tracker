import type { User } from '@expense-tracker/shared';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';

/** Первые буквы имени и фамилии: «Иван Петров» → «ИП». */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function UserAvatar({ user, className }: { user: User; className?: string }) {
  return (
    <Avatar className={cn('rounded-lg', className)}>
      <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
}
