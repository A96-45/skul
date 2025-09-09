/**
 * 🔑 LOGIN SCREEN - User Authentication Entry Point
 *
 * Purpose: Authenticate users and route them to appropriate flows
 * Features:
 * - Email/password login form
 * - Form validation and error handling
 * - Demo accounts for testing
 * - Automatic routing based on profile completion
 * - Responsive design for mobile/web
 *
 * Flow: Login → Profile Check → Role Select/Profile Setup → Main App
 * Authentication: Currently uses mock data (will integrate with tRPC)
 * Navigation: Conditional routing based on user profile state
 *
 * @file app/(auth)/login.tsx
 * @location Authentication flow entry point
 */

import React, { useState } from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { AtSign, Lock, Building, MapPin } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/hooks/auth-store";

export default function LoginScreen() {
  const router = useRouter();
  const { login, getInstitutionByEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectedInstitution, setDetectedInstitution] = useState<any>(null);

  // Detect institution based on email domain
  React.useEffect(() => {
    if (email.includes('@')) {
      const institution = getInstitutionByEmail(email);
      setDetectedInstitution(institution);
    } else {
      setDetectedInstitution(null);
    }
  }, [email, getInstitutionByEmail]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      
      if (result.success && result.user) {
        if (result.user.name && result.user.email) {
          router.replace("/(tabs)");
        } else {
          router.replace("/profile-setup");
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push("/role-select");
  };

  // For demo purposes, we'll provide some test accounts
  const fillTestAccount = (role: "student" | "lecturer") => {
    if (role === "student") {
      setEmail("john.doe@student.university.edu");
      setPassword("password");
    } else {
      setEmail("jane.smith@university.edu");
      setPassword("password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000" }}
          style={styles.logo}
        />
        <Text style={styles.title}>Skola</Text>
        <Text style={styles.subtitle}>
          Your academic communication platform
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<AtSign size={20} color={Colors.darkGray} />}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<Lock size={20} color={Colors.darkGray} />}
        />

        {/* Institution Information */}
        {detectedInstitution && (
          <View style={styles.institutionCard}>
            <View style={styles.institutionHeader}>
              <Building size={20} color={Colors.primary} />
              <Text style={styles.institutionTitle}>Institution Detected</Text>
            </View>
            <Text style={styles.institutionName}>{detectedInstitution.name}</Text>
            <View style={styles.institutionDetails}>
              <MapPin size={14} color={Colors.darkGray} />
              <Text style={styles.institutionLocation}>{detectedInstitution.location}</Text>
            </View>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Log In"
          onPress={handleLogin}
          loading={loading}
          fullWidth
          variant="primary"
          size="large"
        />

        <Text style={styles.orText}>OR</Text>

        <Button
          title="Create New Account"
          onPress={handleCreateAccount}
          variant="outline"
          fullWidth
        />
      </View>

      <View style={styles.testAccounts}>
        <Text style={styles.testAccountsTitle}>Demo Accounts:</Text>
        <View style={styles.testAccountButtons}>
          <Button
            title="Student"
            onPress={() => fillTestAccount("student")}
            variant="text"
            size="small"
          />
          <Button
            title="Lecturer"
            onPress={() => fillTestAccount("lecturer")}
            variant="text"
            size="small"
          />
        </View>
      </View>
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
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  orText: {
    textAlign: "center",
    marginVertical: 16,
    color: Colors.darkGray,
  },
  testAccounts: {
    marginTop: 40,
    alignItems: "center",
  },
  testAccountsTitle: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 8,
  },
  testAccountButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  institutionCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  institutionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  institutionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  institutionName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  institutionDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  institutionLocation: {
    fontSize: 14,
    color: Colors.darkGray,
  },
});