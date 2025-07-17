import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/auth-store";

export default function Index() {
  const { isAuthenticated, loading, isProfileComplete } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (!isProfileComplete) {
    return <Redirect href="/profile-setup" />;
  }

  return <Redirect href="/(tabs)" />;
}