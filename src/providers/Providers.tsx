import type { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@/api";
import { isNetworkError } from "@/helpers";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Never retry on 4xx client errors (e.g. 400, 401, 403, 404, 422)
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }

          // Retry network errors up to 2 times
          if (isNetworkError(error)) {
            return failureCount < 2;
          }

          return false;
        },
      },
    },
  });
}

export const queryClient = createQueryClient();

export interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
