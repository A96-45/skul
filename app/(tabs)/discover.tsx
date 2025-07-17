import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Alert } from "react-native";
import { Search, UserPlus, Lock } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { useUnits } from "@/hooks/units-store";
import UnitCard from "@/components/UnitCard";
import Input from "@/components/Input";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { Unit } from "@/types";

export default function DiscoverScreen() {
  const { user } = useAuth();
  const { units, joinUnit, loading } = useUnits();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [joinLoading, setJoinLoading] = useState<Record<string, boolean>>({});
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      let availableUnits: Unit[] = [];
      
      if (user?.role === "student") {
        // For students, show units they're not already a member of
        availableUnits = units.filter(unit => 
          !unit.students.includes(user.id) && unit.createdBy !== user.id
        );
      } else if (user?.role === "lecturer") {
        // For lecturers, show units they haven't joined yet or were invited to
        availableUnits = units.filter(unit => 
          (!unit.lecturerId || unit.lecturerId !== user.id) &&
          (unit.invitedLecturers?.includes(user.email) || !unit.lecturerId)
        );
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        setFilteredUnits(
          availableUnits.filter(
            unit =>
              unit.code.toLowerCase().includes(query) ||
              unit.name.toLowerCase().includes(query) ||
              unit.university?.toLowerCase().includes(query)
          )
        );
      } else {
        setFilteredUnits(availableUnits);
      }
    }
  }, [loading, units, searchQuery, user?.id, user?.role, user?.email]);

  const handleJoinUnit = async (unit: Unit) => {
    if (!user) return;

    // Check admission number restriction for students
    if (user.role === "student" && unit.restrictedTo && unit.restrictedTo.length > 0 && user.admissionNumber) {
      const isAllowed = unit.restrictedTo.some(pattern => 
        user.admissionNumber?.startsWith(pattern)
      );
      
      if (!isAllowed) {
        Alert.alert(
          "Access Restricted",
          `Your admission number (${user.admissionNumber}) doesn't have access to this unit. Required prefixes: ${unit.restrictedTo.join(", ")}`,
          [{ text: "OK" }]
        );
        return;
      }
    }

    setJoinLoading(prev => ({ ...prev, [unit.id]: true }));
    setJoinError(null);
    
    try {
      const result = await joinUnit(unit.id);
      
      if (result.success) {
        Alert.alert(
          "Success!",
          user.role === "lecturer" 
            ? "You have successfully joined this unit as the lecturer!"
            : "You have successfully enrolled in this unit!",
          [{ text: "OK" }]
        );
      } else {
        setJoinError(result.error || "Failed to join unit");
      }
    } catch (error) {
      console.error("Error joining unit:", error);
      setJoinError("An error occurred. Please try again.");
    } finally {
      setJoinLoading(prev => ({ ...prev, [unit.id]: false }));
    }
  };

  const renderUnitItem = ({ item }: { item: Unit }) => {
    const isRestricted = user?.role === "student" && 
      item.restrictedTo && 
      item.restrictedTo.length > 0 && 
      user.admissionNumber &&
      !item.restrictedTo.some(pattern => user.admissionNumber?.startsWith(pattern));

    return (
      <View style={styles.unitContainer}>
        <UnitCard unit={item} />
        
        {isRestricted && (
          <View style={styles.restrictionNotice}>
            <Lock size={16} color={Colors.error} />
            <Text style={styles.restrictionText}>
              Restricted to: {item.restrictedTo?.join(", ")}
            </Text>
          </View>
        )}
        
        <Button
          title={
            user?.role === "lecturer" 
              ? "Accept Invitation" 
              : isRestricted 
                ? "Access Restricted"
                : "Enroll in Unit"
          }
          onPress={() => handleJoinUnit(item)}
          loading={joinLoading[item.id]}
          disabled={isRestricted}
          variant={isRestricted ? "outline" : "primary"}
          size="small"
          icon={<UserPlus size={16} color={isRestricted ? Colors.darkGray : Colors.white} />}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getTitle = () => {
    return user?.role === "lecturer" ? "Unit Invitations" : "Discover Units";
  };

  const getPlaceholder = () => {
    return user?.role === "lecturer" 
      ? "Search for unit invitations..." 
      : "Search for units by code, name, or university...";
  };

  const getEmptyStateProps = () => {
    if (user?.role === "lecturer") {
      return {
        title: "No Invitations",
        description: searchQuery 
          ? "No unit invitations match your search criteria"
          : "You don't have any pending unit invitations",
      };
    } else {
      return {
        title: "No Units Found",
        description: searchQuery
          ? "No units match your search criteria"
          : "There are no available units to join",
      };
    }
  };

  const emptyStateProps = getEmptyStateProps();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={Colors.darkGray} />}
        />
      </View>

      {joinError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{joinError}</Text>
        </View>
      )}

      {filteredUnits.length > 0 ? (
        <FlatList
          data={filteredUnits}
          renderItem={renderUnitItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <EmptyState
          title={emptyStateProps.title}
          description={emptyStateProps.description}
          icon={<Search size={40} color={Colors.primary} />}
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
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  listContainer: {
    padding: 16,
  },
  unitContainer: {
    marginBottom: 24,
  },
  restrictionNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.error}10`,
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  restrictionText: {
    fontSize: 12,
    color: Colors.error,
    marginLeft: 4,
    fontWeight: "600" as const,
  },
  errorContainer: {
    backgroundColor: `${Colors.error}20`,
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
  },
});