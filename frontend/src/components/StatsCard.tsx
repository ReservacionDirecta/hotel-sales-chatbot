'use client';

import { ComponentType } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  Icon: ComponentType<{ className?: string }>;
  description: string;
  loading?: boolean;
}

export default function StatsCard({ title, value, Icon, description, loading = false }: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6">
      <dt>
        <div className="absolute rounded-md bg-blue-500 p-3">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500">
          {title}
        </p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6">
        <p className="text-2xl font-semibold text-gray-900">
          {loading ? '-' : value}
        </p>
      </dd>
      <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-2">
        <div className="text-sm text-gray-500">
          {description}
        </div>
      </div>
    </div>
  );
}
