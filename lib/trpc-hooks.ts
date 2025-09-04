import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

// Create TRPC hooks
export const trpc = createTRPCReact<AppRouter>({
  transformer: superjson,
});

// Export individual hooks for use in components
export const {
  useQuery: useTRPCQuery,
  useMutation: useTRPCMutation,
  useInfiniteQuery: useTRPCInfiniteQuery,
} = trpc;

// Auth hooks
export const useAuth = () => ({
  login: trpc.auth.login.useMutation,
  register: trpc.auth.register.useMutation,
  getProfile: trpc.auth.getProfile.useQuery,
});

// Timetable hooks
export const useTimetable = () => ({
  getTimetable: trpc.timetable.get.useQuery,
  createEntry: trpc.timetable.create.useMutation,
});

// Example hooks
export const useExample = () => ({
  hello: trpc.example.hi.useQuery,
});
