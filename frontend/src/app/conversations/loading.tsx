'use client';

export default function ConversationsLoading() {
  return (
    <div className="h-full">
      <div className="flex h-full">
        {/* Conversations List Loading */}
        <div className="w-1/3 border-r bg-white">
          <div className="p-4 border-b">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="overflow-y-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 border-b">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Detail Loading */}
        <div className="flex-1 bg-gray-50">
          <div className="h-full flex flex-col">
            <div className="p-4 bg-white border-b">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-end">
                  <div className="w-64 h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
