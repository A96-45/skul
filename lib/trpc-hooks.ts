// Simplified tRPC hooks for development
// These are mock implementations - replace with actual tRPC when backend is ready

export const useAuthTRPC = () => ({
  // Mock implementations for development
  login: { mutateAsync: async () => ({ success: true }) },
  register: { mutateAsync: async () => ({ success: true }) },
  getProfile: { data: null, isLoading: false },
});

export const useTimetable = () => ({
  getTimetable: { data: null, isLoading: false },
  createEntry: { mutateAsync: async () => ({ success: true }) },
});

export const useExample = () => ({
  hello: { data: { message: "Hello from tRPC!", timestamp: new Date().toISOString() }, isLoading: false },
});
