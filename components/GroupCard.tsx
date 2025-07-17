import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Users } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Group } from "@/types";
import { mockUsers } from "@/mocks/data";

interface GroupCardProps {
  group: Group;
  onPress: () => void;
}

export default function GroupCard({ group, onPress }: GroupCardProps) {
  const creator = mockUsers.find(user => user.id === group.createdBy);
  
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
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{group.name}</Text>
        <View style={styles.membersBadge}>
          <Users size={12} color={Colors.primary} />
          <Text style={styles.membersText}>
            {group.members.length} members
          </Text>
        </View>
      </View>
      
      {group.description && (
        <Text style={styles.description} numberOfLines={2}>
          {group.description}
        </Text>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.creator}>
          Created by: {creator ? creator.name : "Unknown"}
        </Text>
        <Text style={styles.date}>
          {formatDate(group.createdAt)}
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
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  membersBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  membersText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "600" as const,
    marginLeft: 4,
  },
  description: {
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
  creator: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  date: {
    fontSize: 12,
    color: Colors.darkGray,
  },
});