import { Tabs } from "expo-router";
import { BookOpen, Home, Plus, Search, Settings, Users, Calendar, GraduationCap } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";

export default function TabLayout() {
  const { user } = useAuth();
  const isLecturer = user?.role === "lecturer";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isLecturer ? Colors.lecturerColor : Colors.studentColor,
        tabBarInactiveTintColor: Colors.darkGray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.divider,
          height: Platform.OS === "ios" ? 88 : 70,
          paddingBottom: Platform.OS === "ios" ? 34 : 16,
          paddingTop: 8,
          paddingHorizontal: 8,
        },
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600" as const,
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === "ios" ? 0 : 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="units"
        options={{
          title: isLecturer ? "My Units" : "Units",
          tabBarIcon: ({ color }) => isLecturer 
            ? <GraduationCap size={24} color={color} />
            : <BookOpen size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => <Plus size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="discover"
        options={{
          title: isLecturer ? "Invitations" : "Discover",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}