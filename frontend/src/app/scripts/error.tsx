'use client';

import ErrorMessage from '@/components/ErrorMessage';

export default function ScriptsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto py-6">
      <ErrorMessage
        title="Error al cargar los scripts"
        message={error.message}
        onRetry={reset}
      />
    </div>
  );
}
