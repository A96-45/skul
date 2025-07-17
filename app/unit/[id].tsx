import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Bell, BookOpen, Calendar, FileText, Plus, Users } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { useUnits } from "@/hooks/units-store";
import AnnouncementCard from "@/components/AnnouncementCard";
import DocumentCard from "@/components/DocumentCard";
import AssignmentCard from "@/components/AssignmentCard";
import EmptyState from "@/components/EmptyState";
import { mockUsers } from "@/mocks/data";
import { Announcement, Assignment, Document, Group, Unit } from "@/types";

export default function UnitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { 
    getUnitById, 
    getUnitDocuments, 
    getUnitAnnouncements, 
    getUnitAssignments,
    getUnitGroups,
    loading 
  } = useUnits();
  
  const [unit, setUnit] = useState<Unit | undefined>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<string>("announcements");

  useEffect(() => {
    if (!loading && id) {
      const unitData = getUnitById(id);
      setUnit(unitData);
      
      if (unitData) {
        setDocuments(getUnitDocuments(id));
        setAnnouncements(getUnitAnnouncements(id));
        setAssignments(getUnitAssignments(id));
        setGroups(getUnitGroups(id));
      }
    }
  }, [loading, id, getUnitById, getUnitDocuments, getUnitAnnouncements, getUnitAssignments, getUnitGroups]);

  const lecturer = unit ? mockUsers.find(u => u.id === unit.lecturerId) : undefined;
  const isLecturer = user?.role === "lecturer" && unit?.lecturerId === user.id;

  const handleCreateAnnouncement = () => {
    // In a real app, this would navigate to a create announcement screen
    alert("Create announcement functionality would be implemented here");
  };

  const handleAddDocument = () => {
    // In a real app, this would navigate to an add document screen
    alert("Add document functionality would be implemented here");
  };

  const handleCreateAssignment = () => {
    // In a real app, this would navigate to a create assignment screen
    alert("Create assignment functionality would be implemented here");
  };

  const navigateToAssignment = (assignmentId: string) => {
    router.push(`/assignment/${assignmentId}`);
  };

  const navigateToGroup = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  if (loading || !unit) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.unitInfo}>
            <Text style={styles.unitCode}>{unit.code}</Text>
            <Text style={styles.unitName}>{unit.name}</Text>
            <Text style={styles.unitDescription}>{unit.description}</Text>
          </View>
          
          <View style={styles.lecturerInfo}>
            <Text style={styles.lecturerLabel}>Lecturer:</Text>
            <Text style={styles.lecturerName}>
              {lecturer ? lecturer.name : "Unknown"}
            </Text>
          </View>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Users size={16} color={Colors.darkGray} />
              <Text style={styles.statText}>
                {unit.students.length} students
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "announcements" && styles.activeTab
              ]}
              onPress={() => setActiveTab("announcements")}
            >
              <Bell 
                size={16} 
                color={activeTab === "announcements" ? Colors.primary : Colors.darkGray} 
              />
              <Text 
                style={[
                  styles.tabText,
                  activeTab === "announcements" && styles.activeTabText
                ]}
              >
                Announcements
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "documents" && styles.activeTab
              ]}
              onPress={() => setActiveTab("documents")}
            >
              <FileText 
                size={16} 
                color={activeTab === "documents" ? Colors.primary : Colors.darkGray} 
              />
              <Text 
                style={[
                  styles.tabText,
                  activeTab === "documents" && styles.activeTabText
                ]}
              >
                Documents
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "assignments" && styles.activeTab
              ]}
              onPress={() => setActiveTab("assignments")}
            >
              <Calendar 
                size={16} 
                color={activeTab === "assignments" ? Colors.primary : Colors.darkGray} 
              />
              <Text 
                style={[
                  styles.tabText,
                  activeTab === "assignments" && styles.activeTabText
                ]}
              >
                Assignments
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "groups" && styles.activeTab
              ]}
              onPress={() => setActiveTab("groups")}
            >
              <Users 
                size={16} 
                color={activeTab === "groups" ? Colors.primary : Colors.darkGray} 
              />
              <Text 
                style={[
                  styles.tabText,
                  activeTab === "groups" && styles.activeTabText
                ]}
              >
                Groups
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.content}>
          {activeTab === "announcements" && (
            <View>
              {isLecturer && (
                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleCreateAnnouncement}
                >
                  <Plus size={20} color={Colors.white} />
                  <Text style={styles.createButtonText}>
                    Create Announcement
                  </Text>
                </TouchableOpacity>
              )}
              
              {announcements.length > 0 ? (
                announcements.map(announcement => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))
              ) : (
                <EmptyState
                  title="No Announcements"
                  description="There are no announcements for this unit yet"
                  icon={<Bell size={40} color={Colors.primary} />}
                />
              )}
            </View>
          )}
          
          {activeTab === "documents" && (
            <View>
              {isLecturer && (
                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleAddDocument}
                >
                  <Plus size={20} color={Colors.white} />
                  <Text style={styles.createButtonText}>
                    Add Document
                  </Text>
                </TouchableOpacity>
              )}
              
              {documents.length > 0 ? (
                documents.map(document => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onPress={() => {}}
                  />
                ))
              ) : (
                <EmptyState
                  title="No Documents"
                  description="There are no documents for this unit yet"
                  icon={<FileText size={40} color={Colors.primary} />}
                />
              )}
            </View>
          )}
          
          {activeTab === "assignments" && (
            <View>
              {isLecturer && (
                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleCreateAssignment}
                >
                  <Plus size={20} color={Colors.white} />
                  <Text style={styles.createButtonText}>
                    Create Assignment
                  </Text>
                </TouchableOpacity>
              )}
              
              {assignments.length > 0 ? (
                assignments.map(assignment => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onPress={() => navigateToAssignment(assignment.id)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No Assignments"
                  description="There are no assignments for this unit yet"
                  icon={<Calendar size={40} color={Colors.primary} />}
                />
              )}
            </View>
          )}
          
          {activeTab === "groups" && (
            <View>
              {groups.length > 0 ? (
                groups.map(group => (
                  <View key={group.id}>
                    <TouchableOpacity 
                      onPress={() => navigateToGroup(group.id)}
                      style={styles.groupCard}
                    >
                      <View style={styles.groupHeader}>
                        <Text style={styles.groupName}>{group.name}</Text>
                        <View style={styles.groupMembersContainer}>
                          <Users size={14} color={Colors.darkGray} />
                          <Text style={styles.groupMembers}>
                            {group.members.length} members
                          </Text>
                        </View>
                      </View>
                      
                      {group.description && (
                        <Text style={styles.groupDescription}>
                          {group.description}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <EmptyState
                  title="No Groups"
                  description="There are no study groups for this unit yet"
                  icon={<Users size={40} color={Colors.primary} />}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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
  unitInfo: {
    marginBottom: 16,
  },
  unitCode: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  unitName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  unitDescription: {
    fontSize: 14,
    color: Colors.lightText,
    lineHeight: 20,
  },
  lecturerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  lecturerLabel: {
    fontSize: 14,
    color: Colors.darkGray,
    marginRight: 4,
  },
  lecturerName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  tabsContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  activeTabText: {
    color: Colors.primary,
  },
  content: {
    padding: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
  },
  createButtonText: {
    color: Colors.white,
    fontWeight: "600" as const,
    marginLeft: 8,
  },
  groupCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  groupMembersContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupMembers: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: Colors.lightText,
  },
});