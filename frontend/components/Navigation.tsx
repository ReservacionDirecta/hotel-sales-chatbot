'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cog6ToothIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Hotel Sales Bot</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/conversations"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/conversations')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
                Conversaciones
              </Link>
              <Link
                href="/settings"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/settings')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5 mr-1" />
                Configuración
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <Link
            href="/conversations"
            className={`flex flex-col items-center p-3 ${
              isActive('/conversations') ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
            <span className="text-xs">Conversaciones</span>
          </Link>
          <Link
            href="/settings"
            className={`flex flex-col items-center p-3 ${
              isActive('/settings') ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Cog6ToothIcon className="h-6 w-6" />
            <span className="text-xs">Configuración</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
