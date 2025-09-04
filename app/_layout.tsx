// Development tools - can be enabled in development mode
// import { BundleInspector } from '../.rorkai/inspector';
// import { RorkErrorBoundary } from '../.rorkai/rork-error-boundary';
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
      <Stack.Screen name="unit/[id]" options={{ headerShown: true, title: "Unit Details" }} />
      <Stack.Screen name="assignment/[id]" options={{ headerShown: true, title: "Assignment" }} />
      <Stack.Screen name="group/[id]" options={{ headerShown: true, title: "Group" }} />
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