/**
 * 🔧 APP PROVIDERS - Global State & API Setup
 *
 * Purpose: Configures and provides global context for the entire Skola application
 * Features:
 * - tRPC client configuration and setup
 * - React Query for intelligent data fetching
 * - Authentication context (AuthContext)
 * - Units data management (UnitsContext)
 * - Safe area provider for device compatibility
 *
 * Architecture: Provider pattern - wraps entire app with necessary contexts
 * Dependencies: tRPC, React Query, Zustand stores, Safe Area Context
 *
 * @file providers/app-providers.tsx
 * @location Imported by app/_layout.tsx (root layout)
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpLink } from '@trpc/client';
import superjson from 'superjson';
import { AuthContext } from '@/hooks/auth-store';
import { UnitsContext } from '@/hooks/units-store';
import ErrorBoundary from '@/components/ErrorBoundary';
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};
