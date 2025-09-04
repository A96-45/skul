import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (size === "small") baseStyle.push(styles.small);
    if (size === "large") baseStyle.push(styles.large);
    if (variant === "primary") baseStyle.push(styles.primary);
    if (variant === "secondary") baseStyle.push(styles.secondary);
    if (variant === "outline") baseStyle.push(styles.outline);
    if (variant === "text") baseStyle.push(styles.textVariant);
    if (disabled) baseStyle.push(styles.disabled);
    if (fullWidth) baseStyle.push(styles.fullWidth);
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    if (size === "small") baseStyle.push(styles.textSmall);
    if (size === "large") baseStyle.push(styles.textLarge);
    if (variant === "primary") baseStyle.push(styles.textPrimary);
    if (variant === "secondary") baseStyle.push(styles.textSecondary);
    if (variant === "outline") baseStyle.push(styles.textOutline);
    if (variant === "text") baseStyle.push(styles.textText);
    if (disabled) baseStyle.push(styles.textDisabled);
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === "primary" ? Colors.white : Colors.primary} 
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textVariant: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  textLarge: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  textPrimary: {
    color: Colors.white,
  },
  textSecondary: {
    color: Colors.white,
  },
  textOutline: {
    color: Colors.primary,
  },
  textText: {
    color: Colors.primary,
  },
  textDisabled: {
    opacity: 0.5,
  },
});