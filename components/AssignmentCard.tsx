import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, Clock } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Assignment } from "@/types";
import { mockUsers } from "@/mocks/data";

interface AssignmentCardProps {
  assignment: Assignment;
  onPress: () => void;
}

export default function AssignmentCard({ assignment, onPress }: AssignmentCardProps) {
  const creator = mockUsers.find(user => user.id === assignment.createdBy);
  
  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate days left
  const getDaysLeft = () => {
    const now = Date.now();
    const diff = assignment.dueDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) {
      return "Overdue";
    } else if (days === 0) {
      return "Due today";
    } else if (days === 1) {
      return "Due tomorrow";
    } else {
      return `${days} days left`;
    }
  };

  const daysLeft = getDaysLeft();
  const isOverdue = daysLeft === "Overdue";

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{assignment.title}</Text>
        <View style={[
          styles.dueBadge,
          isOverdue && styles.overdueBadge
        ]}>
          <Calendar size={12} color={isOverdue ? Colors.white : Colors.primary} />
          <Text style={[
            styles.dueText,
            isOverdue && styles.overdueText
          ]}>
            {daysLeft}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {assignment.description}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Clock size={12} color={Colors.darkGray} />
          <Text style={styles.date}>Due: {formatDate(assignment.dueDate)}</Text>
        </View>
        
        {assignment.maxScore && (
          <Text style={styles.score}>
            {assignment.maxScore} points
          </Text>
        )}
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  dueBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueBadge: {
    backgroundColor: Colors.error,
  },
  dueText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "600" as const,
    marginLeft: 4,
  },
  overdueText: {
    color: Colors.white,
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
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  score: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.success,
  },
});