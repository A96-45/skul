import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpLink } from '@trpc/client';
import superjson from 'superjson';
import { AuthContext } from '@/hooks/auth-store';
import { UnitsContext } from '@/hooks/units-store';
import { trpc } from '@/lib/trpc';
import { getBaseUrl } from '@/lib/trpc/config';

const queryClient = new QueryClient();

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const trpcClient = trpc.createClient({
    links: [
      httpLink({
        url: `${getBaseUrl()}/api/trpc`,
        transformer: superjson,
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthContext>
            <UnitsContext>
              {children}
            </UnitsContext>
          </AuthContext>
        </SafeAreaProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
