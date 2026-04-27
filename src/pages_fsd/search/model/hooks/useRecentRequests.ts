'use client';

import { useState } from 'react';

export const useRecentRequests = (limit: number) => {
  const [recentRequests, setRecentRequests] = useState<string[]>([]);

  const saveRecentRequest = (request: string) => {
    setRecentRequests((currentRequests) =>
      [request, ...currentRequests.filter((item) => item !== request)].slice(
        0,
        limit,
      ),
    );
  };

  return {
    recentRequests,
    saveRecentRequest,
  };
};
