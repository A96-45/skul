import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, Plus, UserPlus, Users, GraduationCap } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { useUnits } from "@/hooks/units-store";
import UnitCard from "@/components/UnitCard";
import EmptyState from "@/components/EmptyState";
import { Unit } from "@/types";

export default function UnitsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getUserUnits, units, loading } = useUnits();
  
  const [enrolledUnits, setEnrolledUnits] = useState<Unit[]>([]);
  const [createdUnits, setCreatedUnits] = useState<Unit[]>([]);
  const [activeTab, setActiveTab] = useState<"enrolled" | "created">("enrolled");

  useEffect(() => {
    if (!loading && user) {
      // Get units where user is enrolled/teaching
      const userUnits = getUserUnits();
      setEnrolledUnits(userUnits);
      
      // Get units created by the user
      const created = units.filter(unit => unit.createdBy === user.id);
      setCreatedUnits(created);
    }
  }, [loading, getUserUnits, units, user]);

  const navigateToCreateUnit = () => {
    router.push("/create");
  };

  const navigateToDiscover = () => {
    router.push("/discover");
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

  const getHeaderTitle = () => {
    if (user?.role === "lecturer") {
      return "My Units";
    } else {
      return "My Units";
    }
  };

  const getTabTitle = (tab: "enrolled" | "created") => {
    if (tab === "enrolled") {
      return user?.role === "lecturer" ? "Teaching" : "Enrolled";
    } else {
      return user?.role === "lecturer" ? "Created" : "Created";
    }
  };

  const getEmptyStateProps = (tab: "enrolled" | "created") => {
    if (tab === "enrolled") {
      if (user?.role === "lecturer") {
        return {
          title: "No Units to Teach",
          description: "Accept invitations from students to start teaching",
          actionLabel: "View Invitations",
          onAction: navigateToDiscover,
          icon: <GraduationCap size={40} color={Colors.primary} />,
        };
      } else {
        return {
          title: "No Enrolled Units",
          description: "Discover and enroll in units to start learning",
          actionLabel: "Discover Units",
          onAction: navigateToDiscover,
          icon: <BookOpen size={40} color={Colors.primary} />,
        };
      }
    } else {
      return {
        title: "No Created Units",
        description: user?.role === "lecturer" 
          ? "Create your first unit to start teaching"
          : "Create your first unit card to invite lecturers",
        actionLabel: user?.role === "lecturer" ? "Create Unit" : "Create Unit Card",
        onAction: navigateToCreateUnit,
        icon: <Plus size={40} color={Colors.primary} />,
      };
    }
  };

  const activeUnits = activeTab === "enrolled" ? enrolledUnits : createdUnits;
  const emptyStateProps = getEmptyStateProps(activeTab);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getHeaderTitle()}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={navigateToDiscover}
          >
            {user?.role === "lecturer" ? (
              <UserPlus size={16} color={Colors.secondary} />
            ) : (
              <BookOpen size={16} color={Colors.secondary} />
            )}
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              {user?.role === "lecturer" ? "Invitations" : "Discover"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={navigateToCreateUnit}
          >
            <Plus size={16} color={Colors.white} />
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "enrolled" && styles.activeTab
          ]}
          onPress={() => setActiveTab("enrolled")}
        >
          <Users 
            size={16} 
            color={activeTab === "enrolled" ? Colors.primary : Colors.darkGray} 
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === "enrolled" && styles.activeTabText
            ]}
          >
            {getTabTitle("enrolled")} ({enrolledUnits.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "created" && styles.activeTab
          ]}
          onPress={() => setActiveTab("created")}
        >
          <Plus 
            size={16} 
            color={activeTab === "created" ? Colors.primary : Colors.darkGray} 
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === "created" && styles.activeTabText
            ]}
          >
            {getTabTitle("created")} ({createdUnits.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeUnits.length > 0 ? (
        <FlatList
          data={activeUnits}
          renderItem={renderUnitItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <EmptyState
          title={emptyStateProps.title}
          description={emptyStateProps.description}
          icon={emptyStateProps.icon}
          actionLabel={emptyStateProps.actionLabel}
          onAction={emptyStateProps.onAction}
        />
      )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  actionButtonText: {
    fontWeight: "600" as const,
    marginLeft: 4,
    fontSize: 12,
  },
  primaryButtonText: {
    color: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.secondary,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
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
  listContainer: {
    padding: 16,
  },
});