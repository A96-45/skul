import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Clock, Download, FileText } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Document } from "@/types";
import { mockUsers } from "@/mocks/data";

interface DocumentCardProps {
  document: Document;
  onPress: () => void;
}

export default function DocumentCard({ document, onPress }: DocumentCardProps) {
  const uploader = mockUsers.find(user => user.id === document.uploadedBy);
  
  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get icon based on document type
  const getDocumentIcon = () => {
    switch (document.type.toLowerCase()) {
      case "pdf":
        return <FileText size={24} color={Colors.error} />;
      case "pptx":
      case "ppt":
        return <FileText size={24} color={Colors.accent} />;
      case "docx":
      case "doc":
        return <FileText size={24} color={Colors.primary} />;
      default:
        return <FileText size={24} color={Colors.darkGray} />;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getDocumentIcon()}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{document.name}</Text>
          {document.description && (
            <Text style={styles.description} numberOfLines={1}>
              {document.description}
            </Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Clock size={12} color={Colors.darkGray} />
          <Text style={styles.date}>{formatDate(document.uploadedAt)}</Text>
        </View>
        
        <Text style={styles.uploader}>
          {uploader ? uploader.name : "Unknown"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.lightText,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  uploader: {
    fontSize: 12,
    color: Colors.darkGray,
  },
});