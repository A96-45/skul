import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Calendar, Clock, FileText, Upload } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { mockAssignments, mockSubmissions, mockUsers } from "@/mocks/data";
import Button from "@/components/Button";
import { Assignment } from "@/types";

export default function AssignmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  
  const [assignment, setAssignment] = useState<Assignment | undefined>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const assignmentData = mockAssignments.find(a => a.id === id);
    setAssignment(assignmentData);
    
    // Check if the current user has submitted
    if (user?.role === "student") {
      const submission = mockSubmissions.find(
        s => s.assignmentId === id && s.studentId === user.id
      );
      setHasSubmitted(!!submission);
    }
  }, [id, user]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysLeft = () => {
    if (!assignment) return "";
    
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

  const handleSubmit = () => {
    // In a real app, this would navigate to a submission screen
    alert("Submit assignment functionality would be implemented here");
  };

  const creator = assignment 
    ? mockUsers.find(u => u.id === assignment.createdBy) 
    : undefined;

  if (!assignment) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{assignment.title}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Calendar size={16} color={Colors.darkGray} />
            <Text style={styles.metaText}>
              Due: {formatDate(assignment.dueDate)}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Clock size={16} color={Colors.darkGray} />
            <Text style={[
              styles.metaText,
              getDaysLeft() === "Overdue" && styles.overdueText
            ]}>
              {getDaysLeft()}
            </Text>
          </View>
        </View>
        
        {assignment.maxScore && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              Maximum Score: {assignment.maxScore} points
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{assignment.description}</Text>
        
        {assignment.attachments && assignment.attachments.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            
            {assignment.attachments.map((attachment, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.attachmentItem}
              >
                <FileText size={20} color={Colors.primary} />
                <Text style={styles.attachmentName}>
                  Attachment {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.createdBySection}>
          <Text style={styles.createdByText}>
            Created by: {creator ? creator.name : "Unknown"}
          </Text>
          <Text style={styles.createdAtText}>
            {formatDate(assignment.createdAt)}
          </Text>
        </View>
      </View>

      {user?.role === "student" && (
        <View style={styles.submissionSection}>
          {hasSubmitted ? (
            <View style={styles.submittedContainer}>
              <View style={styles.submittedHeader}>
                <Text style={styles.submittedTitle}>Submitted</Text>
                <TouchableOpacity>
                  <Text style={styles.viewSubmissionText}>
                    View Submission
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.submittedText}>
                You have already submitted this assignment.
              </Text>
            </View>
          ) : (
            <Button
              title="Submit Assignment"
              onPress={handleSubmit}
              variant="primary"
              fullWidth
              icon={<Upload size={20} color={Colors.white} />}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  overdueText: {
    color: Colors.error,
    fontWeight: "600" as const,
  },
  scoreContainer: {
    backgroundColor: `${Colors.success}20`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  scoreText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: "600" as const,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.lightText,
    lineHeight: 20,
    marginBottom: 24,
  },
  attachmentsSection: {
    marginBottom: 24,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentName: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  createdBySection: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 16,
  },
  createdByText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  createdAtText: {
    fontSize: 12,
    color: Colors.darkGray,
    marginTop: 4,
  },
  submissionSection: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  submittedContainer: {
    backgroundColor: `${Colors.success}10`,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  submittedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  submittedTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.success,
  },
  viewSubmissionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600" as const,
  },
  submittedText: {
    fontSize: 14,
    color: Colors.text,
  },
});