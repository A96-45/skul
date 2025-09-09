/**
 * 🔐 AUTHENTICATION STORE - User Auth & Profile Management
 *
 * Purpose: Centralized authentication state management for Skola
 * Features:
 * - User authentication state (login/logout)
 * - Role-based access control (Student/Lecturer)
 * - Profile management and validation
 * - Persistent storage with AsyncStorage
 * - Automatic auth state restoration
 *
 * State: User object, loading states, profile completion status
 * Persistence: AsyncStorage for offline user data
 * Architecture: Zustand-style context hook pattern
 *
 * @file hooks/auth-store.ts
 * @location Used throughout app for auth checks and user data
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";
import { User, UserRole, Institution } from "@/types";
import { mockUsers } from "@/mocks/data";

// Predefined institutions for demo purposes
const MOCK_INSTITUTIONS: Institution[] = [
  {
    id: "1",
    name: "Machakos University",
    type: "university",
    location: "Machakos, Kenya",
    domain: "university.edu",
  },
  {
    id: "2",
    name: "Nairobi Technical College",
    type: "college",
    location: "Nairobi, Kenya",
    domain: "techcollege.edu",
  },
  {
    id: "3",
    name: "Kenyatta International Institute",
    type: "institute",
    location: "Nairobi, Kenya",
    domain: "kii.edu",
  },
];

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const sessionToken = await AsyncStorage.getItem("session_token");
        const lastLogin = await AsyncStorage.getItem("last_login");

        if (storedUser && sessionToken) {
          const userData = JSON.parse(storedUser);

          // Check if session is still valid (within 30 days)
          const sessionAge = Date.now() - (lastLogin ? parseInt(lastLogin) : 0);
          const maxSessionAge = 30 * 24 * 60 * 60 * 1000; // 30 days

          if (sessionAge < maxSessionAge) {
            // Session is valid, restore user
            setUser({
              ...userData,
              sessionToken,
              lastLoginAt: lastLogin ? parseInt(lastLogin) : undefined,
            });
          } else {
            // Session expired, clear stored data
            await AsyncStorage.multiRemove(["user", "session_token", "last_login"]);
          }
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadUser();
  }, []);

  // Save user to storage when it changes
  useEffect(() => {
    const saveUser = async () => {
      if (!initialized) return;
      
      try {
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Failed to save user:", error);
      }
    };

    saveUser();
  }, [user, initialized]);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual tRPC call when backend is ready
      // const result = await trpc.auth.login.mutate({ email, password });

      // For now, still using mock data but with better structure
      const foundUser = mockUsers.find(u => u.email === email);

      if (foundUser) {
        // Enhance user data with institution and session info
        const institution = MOCK_INSTITUTIONS.find(inst =>
          email.includes(inst.domain)
        );

        const enhancedUser: User = {
          ...foundUser,
          institution,
          lastLoginAt: Date.now(),
          sessionToken: `session_${Date.now()}_${foundUser.id}`,
        };

        setUser(enhancedUser);

        // Save session data
        await AsyncStorage.setItem("session_token", enhancedUser.sessionToken!);
        await AsyncStorage.setItem("last_login", enhancedUser.lastLoginAt!.toString());

        return { success: true, user: enhancedUser };
      }

      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login" };
    }
  };

  const logout = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove(["user", "session_token", "last_login"]);
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
      // Still clear user state even if storage fails
      setUser(null);
    }
  };

  const selectRole = (role: UserRole) => {
    // This is for the initial role selection
    // In a real app, this would create a new user or update an existing one
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      email: "",
      role,
    };
    
    setUser(newUser);
    return newUser;
  };

  const updateProfile = (updatedUser: Partial<User>) => {
    if (!user) return { success: false, error: "No user logged in" };
    
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  // Get available institutions
  const getInstitutions = () => {
    return MOCK_INSTITUTIONS;
  };

  // Get institution by ID
  const getInstitutionById = (id: string) => {
    return MOCK_INSTITUTIONS.find(inst => inst.id === id);
  };

  // Get institution by email domain
  const getInstitutionByEmail = (email: string) => {
    const domain = email.split('@')[1];
    return MOCK_INSTITUTIONS.find(inst => inst.domain === domain);
  };

  // Check if session is valid
  const isSessionValid = () => {
    if (!user?.sessionToken || !user?.lastLoginAt) return false;

    const sessionAge = Date.now() - user.lastLoginAt;
    const maxSessionAge = 30 * 24 * 60 * 60 * 1000; // 30 days

    return sessionAge < maxSessionAge;
  };

  // Extend session (called on user activity)
  const extendSession = async () => {
    if (user) {
      const updatedUser = {
        ...user,
        lastLoginAt: Date.now(),
      };
      setUser(updatedUser);
      await AsyncStorage.setItem("last_login", updatedUser.lastLoginAt.toString());
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isProfileComplete: !!user && !!user.name && !!user.email && !!user.institution,
    login,
    logout,
    selectRole,
    updateProfile,
    getInstitutions,
    getInstitutionById,
    getInstitutionByEmail,
    isSessionValid,
    extendSession,
  };
});