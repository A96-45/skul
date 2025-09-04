import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, Users } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { UserRole } from "@/types";

export default function RoleSelectScreen() {
  const router = useRouter();
  const { selectRole } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    selectRole(role);
    router.push("/profile-setup");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000" }}
          style={styles.logo}
        />
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Select your role to personalize your experience
        </Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleCard, styles.studentCard]}
          onPress={() => handleRoleSelect("student")}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, styles.studentIconContainer]}>
            <Users size={40} color={Colors.studentColor} />
          </View>
          <Text style={styles.roleTitle}>Student</Text>
          <Text style={styles.roleDescription}>
            Join classes, access materials, submit assignments, and collaborate with peers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, styles.lecturerCard]}
          onPress={() => handleRoleSelect("lecturer")}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, styles.lecturerIconContainer]}>
            <BookOpen size={40} color={Colors.lecturerColor} />
          </View>
          <Text style={styles.roleTitle}>Lecturer</Text>
          <Text style={styles.roleDescription}>
            Create classes, share materials, manage assignments, and communicate with students
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: "center",
  },
  roleContainer: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.studentColor,
  },
  lecturerCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.lecturerColor,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  studentIconContainer: {
    backgroundColor: `${Colors.studentColor}20`,
  },
  lecturerIconContainer: {
    backgroundColor: `${Colors.lecturerColor}20`,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: "center",
    lineHeight: 20,
  },
  backButton: {
    marginTop: 40,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600" as const,
  },
});