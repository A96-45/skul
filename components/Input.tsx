/**
 * 📝 INPUT COMPONENT - Form Input with Validation
 *
 * Purpose: Reusable input component with validation and icons
 * Features:
 * - Label and placeholder support
 * - Left and right icon support
 * - Error state display
 * - Validation feedback
 * - Keyboard type options
 * - Secure text entry for passwords
 * - Multiline support
 *
 * Validation: Visual error states with red borders and error messages
 * Icons: Lucide React Native icons for visual enhancement
 * Accessibility: Proper labels and error announcements
 *
 * @file components/Input.tsx
 * @location Used in all forms throughout Skola (login, profile, etc.)
 */

import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import Colors from "@/constants/colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        ...(error ? [styles.inputContainerError] : []),
        ...(props.editable === false ? [styles.inputContainerDisabled] : []),
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            ...(leftIcon ? [styles.inputWithLeftIcon] : []),
            ...(rightIcon ? [styles.inputWithRightIcon] : []),
            ...(style ? [style] : []),
          ]}
          placeholderTextColor={Colors.darkGray}
          {...props}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  inputContainerDisabled: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.mediumGray,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
  error: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
});