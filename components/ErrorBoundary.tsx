// 🛡️ ERROR BOUNDARY COMPONENT - Graceful Error Handling

import React, { Component, ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AlertTriangle, RefreshCw } from "lucide-react-native";
import Colors from "@/constants/colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.errorContent}>
            <AlertTriangle size={48} color={Colors.error} />
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We encountered an unexpected error. Please try again.
            </Text>
            {__DEV__ && this.state.error && (
              <Text style={styles.errorDetails}>
                {this.state.error.message}
              </Text>
            )}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
            >
              <RefreshCw size={16} color={Colors.white} />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 20,
  },
  errorContent: {
    alignItems: "center",
    maxWidth: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  errorDetails: {
    fontSize: 12,
    color: Colors.error,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "monospace",
    backgroundColor: Colors.lightGray,
    padding: 8,
    borderRadius: 4,
    width: "100%",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
