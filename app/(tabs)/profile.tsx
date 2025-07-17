import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { AtSign, BookOpen, Hash, LogOut, User } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/auth-store";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: user?.profilePicture || 
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2000" 
            }}
            style={styles.avatar}
          />
        </View>
        
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>
          {user?.role === "lecturer" ? "Lecturer" : "Student"}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <AtSign size={20} color={Colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        {user?.role === "student" && user?.admissionNumber && (
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Hash size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Admission Number</Text>
              <Text style={styles.infoValue}>{user.admissionNumber}</Text>
            </View>
          </View>
        )}

        {user?.role === "lecturer" && user?.department && (
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <BookOpen size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{user.department}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actionsSection}>
        <Button
          title="Edit Profile"
          onPress={() => {}}
          variant="outline"
          fullWidth
          icon={<User size={20} color={Colors.primary} />}
        />
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="primary"
          fullWidth
          icon={<LogOut size={20} color={Colors.white} />}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Skola v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding for mobile navigation
  },
  header: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600" as const,
  },
  infoSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500" as const,
  },
  actionsSection: {
    gap: 16,
    marginBottom: 24,
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  version: {
    fontSize: 12,
    color: Colors.darkGray,
  },
});