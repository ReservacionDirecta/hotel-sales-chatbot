'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Principal', href: '/', icon: HomeIcon },
  { name: 'Conversaciones', href: '/conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Habitaciones', href: '/rooms', icon: BuildingOfficeIcon },
  { name: 'Scripts', href: '/scripts', icon: DocumentTextIcon },
  { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="max-w-screen-xl mx-auto">
        <nav className="flex justify-around">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center p-2 ${
                pathname === item.href
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="mt-1 text-xs">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
