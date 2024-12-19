'use client';

import ErrorMessage from '@/components/ErrorMessage';

export default function RoomsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto py-6">
      <ErrorMessage
        title="Error al cargar las habitaciones"
        message={error.message}
        onRetry={reset}
      />
    </div>
  );
}
