/**
 * 🎯 ROOT APP LAYOUT - Main Entry Point
 *
 * Purpose: Root layout component that wraps the entire Skola application
 * Features:
 * - Splash screen management
 * - Global navigation setup (Stack)
 * - Safe area handling
 * - Gesture handler configuration
 * - App-wide providers integration
 *
 * Navigation: Automatically routes to auth flow or main tabs based on auth state
 * Dependencies: AppProviders, Expo Router, React Native Gesture Handler
 *
 * @file app/_layout.tsx
 * @location Root layout (automatically loaded by Expo Router)
 */

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProviders } from "@/providers/app-providers";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: "#FFFFFF",
      },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppProviders>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {Platform.OS === "android" && <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />}
        <RootLayoutNav />
      </GestureHandlerRootView>
    </AppProviders>
  );
}