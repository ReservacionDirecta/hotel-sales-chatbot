'use client';

import ErrorMessage from '@/components/ErrorMessage';

export default function ConversationsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <ErrorMessage
        title="Error al cargar las conversaciones"
        message={error.message}
        onRetry={reset}
      />
    </div>
  );
}
