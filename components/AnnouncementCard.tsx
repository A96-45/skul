import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AlertCircle, Clock } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Announcement } from "@/types";
import { mockUsers } from "@/mocks/data";

interface AnnouncementCardProps {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const creator = mockUsers.find(user => user.id === announcement.createdBy);
  
  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={[
      styles.card, 
      announcement.important && styles.importantCard
    ]}>
      {announcement.important && (
        <View style={styles.importantBadge}>
          <AlertCircle size={12} color={Colors.white} />
          <Text style={styles.importantText}>Important</Text>
        </View>
      )}
      
      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.content}>{announcement.content}</Text>
      
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Clock size={12} color={Colors.darkGray} />
          <Text style={styles.date}>{formatDate(announcement.createdAt)}</Text>
        </View>
        
        <Text style={styles.author}>
          {creator ? creator.name : "Unknown"}
        </Text>
      </View>
    </View>
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
  importantCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  importantBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  importantText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "600" as const,
    marginLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
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
  author: {
    fontSize: 12,
    color: Colors.darkGray,
  },
});