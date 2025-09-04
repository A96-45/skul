import { BundleInspector } from '../.rorkai/inspector';
import { RorkErrorBoundary } from '../.rorkai/rork-error-boundary';
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProviders } from "@/providers/app-providers";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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
      <Stack.Screen name="edit-profile" options={{ headerShown: true, title: "Edit Profile" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthContext>
              <UnitsContext>
                {Platform.OS === "android" && <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />}
                <BundleInspector><RorkErrorBoundary><RootLayoutNav /></RorkErrorBoundary></BundleInspector>
              </UnitsContext>
            </AuthContext>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </trpc.Provider>
    </SafeAreaProvider>
  );
}