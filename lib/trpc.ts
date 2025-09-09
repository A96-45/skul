// Frontend tRPC client configuration for Skola

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/types/api';

// Create the tRPC client
export const trpc = createTRPCReact<AppRouter>();

// Export the client instance
export { type AppRouter };
