import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { AtSign, BookOpen, User, Hash } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/hooks/auth-store";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [admissionNumber, setAdmissionNumber] = useState(user?.admissionNumber || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (user?.role === "student" && !admissionNumber.trim()) {
      newErrors.admissionNumber = "Admission number is required";
    }
    
    if (user?.role === "lecturer" && !department.trim()) {
      newErrors.department = "Department is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const profileData: any = {
        name,
        email,
      };
      
      if (user?.role === "student") {
        profileData.admissionNumber = admissionNumber;
      } else if (user?.role === "lecturer") {
        profileData.department = department;
      }
      
      updateProfile(profileData);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please provide your information to get started
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          leftIcon={<User size={20} color={Colors.darkGray} />}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          leftIcon={<AtSign size={20} color={Colors.darkGray} />}
        />

        {user?.role === "student" && (
          <Input
            label="Admission Number"
            placeholder="Enter your admission number"
            value={admissionNumber}
            onChangeText={setAdmissionNumber}
            error={errors.admissionNumber}
            leftIcon={<Hash size={20} color={Colors.darkGray} />}
          />
        )}

        {user?.role === "lecturer" && (
          <Input
            label="Department"
            placeholder="Enter your department"
            value={department}
            onChangeText={setDepartment}
            error={errors.department}
            leftIcon={<BookOpen size={20} color={Colors.darkGray} />}
          />
        )}

        <Button
          title="Complete Setup"
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          variant="primary"
          size="large"
        />
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
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
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
  form: {
    marginBottom: 24,
  },
});