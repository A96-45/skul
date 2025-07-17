import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Users } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { useUnits } from "@/hooks/units-store";
import GroupCard from "@/components/GroupCard";
import EmptyState from "@/components/EmptyState";
import { Group, Unit } from "@/types";

export default function GroupsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getUserUnits, groups, loading } = useUnits();
  
  const [userUnits, setUserUnits] = useState<Unit[]>([]);
  const [userGroups, setUserGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!loading && user) {
      const units = getUserUnits();
      setUserUnits(units);
      
      // Get groups for the current user
      const userGroupsList = groups.filter(group => {
        // For students, show groups they're a member of
        if (user.role === "student") {
          return group.members.includes(user.id);
        }
        // For lecturers, show all groups in their units
        else {
          const unitIds = units.map(unit => unit.id);
          return unitIds.includes(group.unitId);
        }
      });
      
      setUserGroups(userGroupsList);
    }
  }, [loading, user, getUserUnits, groups]);

  const navigateToCreateGroup = () => {
    // In a real app, this would navigate to a create group screen
    // For this demo, we'll just show an alert
    alert("Create group functionality would be implemented here");
  };

  const navigateToGroup = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    <GroupCard 
      group={item} 
      onPress={() => navigateToGroup(item.id)} 
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {user?.role === "student" ? "My Groups" : "Student Groups"}
        </Text>
        
        {user?.role === "student" && userUnits.length > 0 && (
          <TouchableOpacity 
            style={styles.createButton}
            onPress={navigateToCreateGroup}
          >
            <Plus size={20} color={Colors.white} />
            <Text style={styles.createButtonText}>Create Group</Text>
          </TouchableOpacity>
        )}
      </View>

      {userGroups.length > 0 ? (
        <FlatList
          data={userGroups}
          renderItem={renderGroupItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <EmptyState
          title="No Groups Yet"
          description={
            user?.role === "student"
              ? userUnits.length > 0
                ? "Create your first group to collaborate with classmates"
                : "Join a unit first to create or join groups"
              : "Your students haven't created any groups yet"
          }
          icon={<Users size={40} color={Colors.primary} />}
          actionLabel={
            user?.role === "student" && userUnits.length > 0
              ? "Create Group"
              : undefined
          }
          onAction={
            user?.role === "student" && userUnits.length > 0
              ? navigateToCreateGroup
              : undefined
          }
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
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.white,
    fontWeight: "600" as const,
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
  },
});