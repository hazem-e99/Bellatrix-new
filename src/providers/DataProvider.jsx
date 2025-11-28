import React, { useEffect, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initCacheManager } from '../utils/cacheManager.js';

// Lazy load DevTools to avoid including it in production bundles or causing resolution issues
const ReactQueryDevtools = React.lazy(() =>
  import('@tanstack/react-query-devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Make data stale immediately for testing (reduced from 5 minutes)
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const DataProvider = ({ children }) => {
  // Initialize cache manager
  useEffect(() => {
    initCacheManager(queryClient);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Enable React Query DevTools in development */}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
};

export default DataProvider;