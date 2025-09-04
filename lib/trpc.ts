import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

// Only export the type-safe react hooks creator
export const trpc = createTRPCReact<AppRouter>({
  transformer: superjson,
});