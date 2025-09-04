import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { mockUsers } from "@/mocks/data";

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
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
        setUser(foundUser);
        return { success: true, user: foundUser };
      }

      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login" };
    }
  };

  const logout = async () => {
    setUser(null);
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

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isProfileComplete: !!user && !!user.name && !!user.email,
    login,
    logout,
    selectRole,
    updateProfile,
  };
});