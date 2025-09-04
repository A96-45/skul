import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface UseProfilePhotoReturn {
  isLoading: boolean;
  pickImage: () => Promise<string | null>;
  takePhoto: () => Promise<string | null>;
  requestPermissions: () => Promise<boolean>;
}

export const useProfilePhoto = (): UseProfilePhotoReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted' || libraryPermission.status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Camera and photo library permissions are required to set a profile photo.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const pickImage = async (): Promise<string | null> => {
    try {
      setIsLoading(true);

      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile photos
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      setIsLoading(true);

      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile photos
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    pickImage,
    takePhoto,
    requestPermissions,
  };
};
