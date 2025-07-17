import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { 
  Bell, BookOpen, Calendar, FileText, Plus, UserPlus, 
  Users, GraduationCap, TrendingUp, Clock, Award,
  MessageSquare, CheckCircle
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { useUnits } from "@/hooks/units-store";
import UnitCard from "@/components/UnitCard";
import AnnouncementCard from "@/components/AnnouncementCard";
import AssignmentCard from "@/components/AssignmentCard";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { Announcement, Assignment, Unit } from "@/types";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    getUserUnits, 
    announcements, 
    assignments,
    loading 
  } = useUnits();
  
  const [userUnits, setUserUnits] = useState<Unit[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (!loading) {
      const units = getUserUnits();
      setUserUnits(units);
      
      // Get unit IDs for the current user
      const unitIds = units.map(unit => unit.id);
      
      // Get recent announcements for user's units
      const filteredAnnouncements = announcements
        .filter(ann => unitIds.includes(ann.unitId))
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 3);
      setRecentAnnouncements(filteredAnnouncements);
      
      // Get upcoming assignments for user's units
      const now = Date.now();
      const filteredAssignments = assignments
        .filter(ass => unitIds.includes(ass.unitId) && ass.dueDate > now)
        .sort((a, b) => a.dueDate - b.dueDate)
        .slice(0, 3);
      setUpcomingAssignments(filteredAssignments);
    }
  }, [loading, getUserUnits, announcements, assignments]);

  const navigateToUnit = (unitId: string) => {
    router.push(`/unit/${unitId}`);
  };

  const navigateToAssignment = (assignmentId: string) => {
    router.push(`/assignment/${assignmentId}`);
  };

  const navigateToUnits = () => {
    router.push("/units");
  };

  const navigateToDiscover = () => {
    router.push("/discover");
  };

  const navigateToCreate = () => {
    router.push("/create");
  };

  const renderUnitItem = ({ item }: { item: Unit }) => (
    <UnitCard unit={item} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon";
    else if (hour >= 17) timeGreeting = "Good evening";

    if (user?.role === "lecturer") {
      return `${timeGreeting}, Professor!`;
    } else {
      return `${timeGreeting}, ${user?.name?.split(' ')[0] || 'Student'}!`;
    }
  };

  const getWelcomeMessage = () => {
    if (user?.role === "lecturer") {
      return "Ready to inspire minds today?";
    } else {
      return "Ready to learn something new today?";
    }
  };

  const renderLecturerDashboard = () => (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.header, styles.lecturerHeader]}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.welcomeMessage}>{getWelcomeMessage()}</Text>
        </View>
        <View style={styles.lecturerBadge}>
          <GraduationCap size={20} color={Colors.lecturerColor} />
          <Text style={styles.lecturerBadgeText}>Lecturer</Text>
        </View>
      </View>

      {/* Quick Stats for Lecturers */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.lecturerStatCard]}>
          <BookOpen size={24} color={Colors.lecturerColor} />
          <Text style={styles.statNumber}>{userUnits.length}</Text>
          <Text style={styles.statLabel}>Units Teaching</Text>
        </View>
        <View style={[styles.statCard, styles.lecturerStatCard]}>
          <Users size={24} color={Colors.lecturerColor} />
          <Text style={styles.statNumber}>
            {userUnits.reduce((total, unit) => total + unit.students.length, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
        <View style={[styles.statCard, styles.lecturerStatCard]}>
          <FileText size={24} color={Colors.lecturerColor} />
          <Text style={styles.statNumber}>{upcomingAssignments.length}</Text>
          <Text style={styles.statLabel}>Active Assignments</Text>
        </View>
      </View>

      {userUnits.length === 0 && (
        <View style={styles.quickActions}>
          <Button
            title="View Invitations"
            onPress={navigateToDiscover}
            variant="primary"
            icon={<UserPlus size={16} color={Colors.white} />}
          />
          <Button
            title="Create Unit"
            onPress={navigateToCreate}
            variant="outline"
            icon={<Plus size={16} color={Colors.primary} />}
          />
        </View>
      )}

      {/* Teaching Units */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <GraduationCap size={20} color={Colors.lecturerColor} />
            <Text style={styles.sectionTitle}>My Teaching Units</Text>
          </View>
          <TouchableOpacity onPress={navigateToUnits}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {userUnits.length > 0 ? (
          <FlatList
            data={userUnits.slice(0, 2)}
            renderItem={renderUnitItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <EmptyState
            title="No Units Yet"
            description="Accept invitations from students to start teaching"
            icon={<GraduationCap size={40} color={Colors.lecturerColor} />}
            actionLabel="View Invitations"
            onAction={navigateToDiscover}
          />
        )}
      </View>

      {/* Recent Announcements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <MessageSquare size={20} color={Colors.lecturerColor} />
            <Text style={styles.sectionTitle}>My Announcements</Text>
          </View>
        </View>

        {recentAnnouncements.length > 0 ? (
          recentAnnouncements.map(announcement => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))
        ) : (
          <EmptyState
            title="No Announcements"
            description="Create announcements to communicate with your students"
            icon={<MessageSquare size={40} color={Colors.lecturerColor} />}
          />
        )}
      </View>
    </ScrollView>
  );

  const renderStudentDashboard = () => (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.header, styles.studentHeader]}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.welcomeMessage}>{getWelcomeMessage()}</Text>
        </View>
        <View style={styles.studentBadge}>
          <BookOpen size={20} color={Colors.studentColor} />
          <Text style={styles.studentBadgeText}>Student</Text>
        </View>
      </View>

      {/* Quick Stats for Students */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.studentStatCard]}>
          <BookOpen size={24} color={Colors.studentColor} />
          <Text style={styles.statNumber}>{userUnits.length}</Text>
          <Text style={styles.statLabel}>Enrolled Units</Text>
        </View>
        <View style={[styles.statCard, styles.studentStatCard]}>
          <Clock size={24} color={Colors.accent} />
          <Text style={styles.statNumber}>{upcomingAssignments.length}</Text>
          <Text style={styles.statLabel}>Due Soon</Text>
        </View>
        <View style={[styles.statCard, styles.studentStatCard]}>
          <CheckCircle size={24} color={Colors.success} />
          <Text style={styles.statNumber}>
            {assignments.filter(a => userUnits.some(u => u.id === a.unitId) && a.dueDate < Date.now()).length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {userUnits.length === 0 && (
        <View style={styles.quickActions}>
          <Button
            title="Create Unit Card"
            onPress={navigateToCreate}
            variant="primary"
            icon={<Plus size={16} color={Colors.white} />}
          />
          <Button
            title="Discover Units"
            onPress={navigateToDiscover}
            variant="outline"
            icon={<BookOpen size={16} color={Colors.primary} />}
          />
        </View>
      )}

      {/* My Unit Cards */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <BookOpen size={20} color={Colors.studentColor} />
            <Text style={styles.sectionTitle}>My Unit Cards</Text>
          </View>
          <TouchableOpacity onPress={navigateToUnits}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {userUnits.length > 0 ? (
          <FlatList
            data={userUnits.slice(0, 2)}
            renderItem={renderUnitItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <EmptyState
            title="No Unit Cards Yet"
            description="Create your first unit card to get started"
            icon={<BookOpen size={40} color={Colors.studentColor} />}
            actionLabel="Create Unit Card"
            onAction={navigateToCreate}
          />
        )}
      </View>

      {/* Upcoming Assignments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Calendar size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
          </View>
        </View>

        {upcomingAssignments.length > 0 ? (
          upcomingAssignments.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onPress={() => navigateToAssignment(assignment.id)}
            />
          ))
        ) : (
          <EmptyState
            title="No Upcoming Assignments"
            description="You're all caught up! Great job!"
            icon={<Award size={40} color={Colors.success} />}
          />
        )}
      </View>

      {/* Recent Announcements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Bell size={20} color={Colors.studentColor} />
            <Text style={styles.sectionTitle}>Recent Announcements</Text>
          </View>
        </View>

        {recentAnnouncements.length > 0 ? (
          recentAnnouncements.map(announcement => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))
        ) : (
          <EmptyState
            title="No Announcements"
            description="You don't have any recent announcements"
            icon={<Bell size={40} color={Colors.studentColor} />}
          />
        )}
      </View>
    </ScrollView>
  );

  return user?.role === "lecturer" ? renderLecturerDashboard() : renderStudentDashboard();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  lecturerHeader: {
    backgroundColor: `${Colors.lecturerColor}15`,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lecturerColor,
  },
  studentHeader: {
    backgroundColor: `${Colors.studentColor}15`,
    borderLeftWidth: 4,
    borderLeftColor: Colors.studentColor,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  welcomeMessage: {
    fontSize: 14,
    color: Colors.lightText,
  },
  lecturerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.lecturerColor}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  lecturerBadgeText: {
    color: Colors.lecturerColor,
    fontSize: 12,
    fontWeight: "600" as const,
    marginLeft: 4,
  },
  studentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.studentColor}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  studentBadgeText: {
    color: Colors.studentColor,
    fontSize: 12,
    fontWeight: "600" as const,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lecturerStatCard: {
    backgroundColor: Colors.white,
    borderTopWidth: 3,
    borderTopColor: Colors.lecturerColor,
  },
  studentStatCard: {
    backgroundColor: Colors.white,
    borderTopWidth: 3,
    borderTopColor: Colors.studentColor,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 4,
    textAlign: "center",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginLeft: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600" as const,
  },
});