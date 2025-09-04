export const getBaseUrl = () => {
  // For development
  if (__DEV__) {
    return process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  }

  // For production
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Fallback for web in production
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  throw new Error("No base url found, please set EXPO_PUBLIC_API_URL");
};
