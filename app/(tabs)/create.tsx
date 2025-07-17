import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AlertTriangle, BookOpen, Hash, Info, Clock, MapPin, UserPlus, Mail } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/hooks/auth-store";
import { useUnits } from "@/hooks/units-store";

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createUnit } = useUnits();
  
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [university, setUniversity] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [restrictedTo, setRestrictedTo] = useState("");
  const [inviteLecturerName, setInviteLecturerName] = useState("");
  const [inviteLecturerEmail, setInviteLecturerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!code.trim()) {
      newErrors.code = "Unit code is required";
    }
    
    if (!name.trim()) {
      newErrors.name = "Unit name is required";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!university.trim()) {
      newErrors.university = "University name is required";
    }

    if (!time.trim()) {
      newErrors.time = "Class time is required";
    }

    if (!date.trim()) {
      newErrors.date = "Class date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUnit = () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (!user) {
        throw new Error("User not found");
      }
      
      const restrictionPatterns = restrictedTo
        .split(",")
        .map(pattern => pattern.trim())
        .filter(pattern => pattern.length > 0);
      
      const result = createUnit({
        code,
        name,
        description,
        university,
        time,
        date,
        venue: venue || undefined,
        lecturerId: user.role === "lecturer" ? user.id : "", // If lecturer creates, auto-assign
        createdBy: user.id,
        restrictedTo: restrictionPatterns.length > 0 ? restrictionPatterns : undefined,
        invitedLecturers: inviteLecturerName && inviteLecturerEmail ? [inviteLecturerEmail] : undefined,
      });
      
      if (result.success && result.unit) {
        // Show success message with invitation info
        if (user.role === "student" && inviteLecturerName) {
          Alert.alert(
            "Unit Card Created!",
            `Unit card created successfully. An invitation has been sent to ${inviteLecturerName} (${inviteLecturerEmail}).`,
            [{ text: "OK", onPress: () => router.replace(`/unit/${result.unit!.id}`) }]
          );
        } else {
          router.replace(`/unit/${result.unit.id}`);
        }
      } else {
        setErrors({ form: result.error || "Failed to create unit card" });
      }
    } catch (error) {
      console.error("Error creating unit card:", error);
      setErrors({ form: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return user?.role === "lecturer" ? "Create Unit" : "Create Unit Card";
  };

  const getSubtitle = () => {
    return user?.role === "lecturer" 
      ? "Create a new unit for your students"
      : "Create a unit card and invite your lecturer to join";
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Unit Code"
          placeholder="e.g., CS101"
          value={code}
          onChangeText={setCode}
          error={errors.code}
          leftIcon={<Hash size={20} color={Colors.darkGray} />}
        />

        <Input
          label="Unit Name"
          placeholder="e.g., Introduction to Computer Science"
          value={name}
          onChangeText={setName}
          error={errors.name}
          leftIcon={<BookOpen size={20} color={Colors.darkGray} />}
        />

        <Input
          label="University Name"
          placeholder="e.g., Machakos University"
          value={university}
          onChangeText={setUniversity}
          error={errors.university}
          leftIcon={<BookOpen size={20} color={Colors.darkGray} />}
        />

        <Input
          label="Class Time"
          placeholder="e.g., 10:00 AM - 12:00 PM"
          value={time}
          onChangeText={setTime}
          error={errors.time}
          leftIcon={<Clock size={20} color={Colors.darkGray} />}
        />

        <Input
          label="Class Date/Schedule"
          placeholder="e.g., Monday, Wednesday, Friday"
          value={date}
          onChangeText={setDate}
          error={errors.date}
          leftIcon={<Clock size={20} color={Colors.darkGray} />}
        />

        <Input
          label="Venue (Optional)"
          placeholder="e.g., Room 101, Computer Lab"
          value={venue}
          onChangeText={setVenue}
          leftIcon={<MapPin size={20} color={Colors.darkGray} />}
        />

        <Input
          label="Description"
          placeholder="Provide a brief description of the unit"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.textArea}
          error={errors.description}
          leftIcon={<Info size={20} color={Colors.darkGray} />}
        />

        {user?.role === "student" && (
          <View style={styles.inviteSection}>
            <Text style={styles.sectionTitle}>Invite Lecturer (Optional)</Text>
            <Input
              label="Lecturer Name"
              placeholder="e.g., Dr. Jane Smith"
              value={inviteLecturerName}
              onChangeText={setInviteLecturerName}
              leftIcon={<UserPlus size={20} color={Colors.darkGray} />}
            />
            <Input
              label="Lecturer Email"
              placeholder="e.g., jane.smith@university.edu"
              value={inviteLecturerEmail}
              onChangeText={setInviteLecturerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={Colors.darkGray} />}
            />
            <Text style={styles.helperText}>
              If the lecturer has an account, they'll receive an invitation notification.
            </Text>
          </View>
        )}

        <Input
          label="Restrict Access (Optional)"
          placeholder="e.g., CS2023, ENG2023 (comma-separated)"
          value={restrictedTo}
          onChangeText={setRestrictedTo}
          error={errors.restrictedTo}
          leftIcon={<AlertTriangle size={20} color={Colors.darkGray} />}
        />
        
        <Text style={styles.helperText}>
          Enter admission number prefixes to restrict access to specific students.
          Leave empty to allow all students to join.
        </Text>

        {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}

        <Button
          title={user?.role === "lecturer" ? "Create Unit" : "Create Unit Card"}
          onPress={handleCreateUnit}
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.lightText,
  },
  form: {
    marginBottom: 24,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  inviteSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 12,
  },
  helperText: {
    fontSize: 12,
    color: Colors.darkGray,
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
});