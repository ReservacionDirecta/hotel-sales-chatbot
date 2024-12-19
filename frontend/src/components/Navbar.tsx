'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Principal', href: '/', icon: HomeIcon },
  { name: 'Conversaciones', href: '/conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Habitaciones', href: '/rooms', icon: BuildingOfficeIcon },
  { name: 'Scripts de Venta', href: '/scripts', icon: DocumentTextIcon },
  { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon },
];

export function Navbar({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <span className="ml-2 text-lg font-semibold">Hotel Sales Bot</span>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    isActive
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <item.icon className="w-5 h-5 mr-2" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex lg:hidden">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'p-2 text-sm font-medium rounded-md',
                    isActive
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  )}
                >
                  <item.icon className="w-6 h-6" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
