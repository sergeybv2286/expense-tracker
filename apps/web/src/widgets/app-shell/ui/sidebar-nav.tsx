'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftRightIcon, TagsIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar';

const NAV_ITEMS = [
  { href: '/', label: 'Транзакции', icon: ArrowLeftRightIcon },
  { href: '/categories', label: 'Категории', icon: TagsIcon },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Разделы</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton asChild isActive={pathname === href} tooltip={label}>
                {/* На мобильных меню открыто поверх страницы, после перехода его закрываем. */}
                <Link href={href} onClick={() => setOpenMobile(false)}>
                  <Icon />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
