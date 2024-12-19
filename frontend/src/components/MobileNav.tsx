'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Conversaciones', href: '/conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white lg:hidden">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center py-3 px-2',
                isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
              <span className="mt-1 text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
