'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Principal', href: '/', icon: HomeIcon },
  { name: 'Conversaciones', href: '/conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Habitaciones', href: '/rooms', icon: BuildingOfficeIcon },
  { name: 'Scripts de Venta', href: '/scripts', icon: DocumentTextIcon },
  { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <span className="text-lg font-semibold">Hotel Sales Bot</span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={cn(
                                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                    isActive
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  )}
                                >
                                  <item.icon
                                    className={cn('h-6 w-6 shrink-0', {
                                      'text-gray-900': isActive,
                                      'text-gray-400 group-hover:text-gray-900': !isActive,
                                    })}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <span className="text-lg font-semibold">Hotel Sales Bot</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            isActive
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          )}
                        >
                          <item.icon
                            className={cn('h-6 w-6 shrink-0', {
                              'text-gray-900': isActive,
                              'text-gray-400 group-hover:text-gray-900': !isActive,
                            })}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
