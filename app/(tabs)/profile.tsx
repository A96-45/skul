import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AtSign, BookOpen, Hash, LogOut, User, Camera, ImageIcon, Edit3 } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/auth-store";
import { useProfilePhoto } from "@/hooks/use-profile-photo";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const { pickImage, takePhoto, isLoading: photoLoading } = useProfilePhoto();
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handlePhotoUpload = async (source: 'gallery' | 'camera') => {
    try {
      const imageUri = source === 'gallery'
        ? await pickImage()
        : await takePhoto();

      if (imageUri) {
        // In a real app, you would upload the image to a server and get back a URL
        // For now, we'll just store the local URI
        const result = updateProfile({ profilePicture: imageUri });
        if (result.success) {
          Alert.alert('Success', 'Profile photo updated successfully!');
        } else {
          Alert.alert('Error', 'Failed to update profile photo');
        }
      }
      setShowPhotoOptions(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo');
    }
  };

  const showPhotoOptionsAlert = () => {
    Alert.alert(
      'Choose Photo Source',
      'Select how you want to add your profile photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => handlePhotoUpload('camera') },
        { text: 'Choose from Gallery', onPress: () => handlePhotoUpload('gallery') },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {user?.name ? getInitials(user.name) : 'U'}
              </Text>
            </View>
          )}
          <View style={styles.editPhotoButton}>
            <Button
              title=""
              onPress={showPhotoOptionsAlert}
              variant="primary"
              size="small"
              icon={<Edit3 size={16} color={Colors.white} />}
              style={styles.editPhotoIcon}
              loading={photoLoading}
            />
          </View>
        </View>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>
          {user?.role === "lecturer" ? "Lecturer" : "Student"}
        </Text>

        {!user?.profilePicture && (
          <View style={styles.photoOptions}>
            <Text style={styles.photoPrompt}>Add a profile photo</Text>
            <View style={styles.photoButtons}>
              <Button
                title="Take Photo"
                onPress={() => handlePhotoUpload('camera')}
                variant="outline"
                size="small"
                icon={<Camera size={16} color={Colors.primary} />}
                loading={photoLoading}
                style={styles.photoButton}
              />
              <Button
                title="Choose Photo"
                onPress={() => handlePhotoUpload('gallery')}
                variant="outline"
                size="small"
                icon={<ImageIcon size={16} color={Colors.primary} />}
                loading={photoLoading}
                style={styles.photoButton}
              />
            </View>
          </View>
        )}
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
    position: 'relative',
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  editPhotoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  photoOptions: {
    marginTop: 16,
    alignItems: 'center',
  },
  photoPrompt: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 12,
    textAlign: 'center',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    minWidth: 120,
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