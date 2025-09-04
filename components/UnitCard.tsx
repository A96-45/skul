import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Book, Users, Clock, MapPin, User } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Unit } from "@/types";
import { mockUsers } from "@/mocks/data";

interface UnitCardProps {
  unit: Unit;
}

export default function UnitCard({ unit }: UnitCardProps) {
  const router = useRouter();
  
  const lecturer = unit.lecturerId ? mockUsers.find(user => user.id === unit.lecturerId) : null;
  const creator = mockUsers.find(user => user.id === unit.createdBy);
  
  const handlePress = () => {
    router.push(`/unit/${unit.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.codeContainer}>
          <Text style={styles.code}>{unit.code}</Text>
          <Text style={styles.university}>{unit.university}</Text>
        </View>
        <View style={styles.studentsContainer}>
          <Users size={14} color={Colors.darkGray} />
          <Text style={styles.students}>{unit.students.length} students</Text>
        </View>
      </View>
      
      <Text style={styles.name}>{unit.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {unit.description}
      </Text>
      
      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleItem}>
          <Clock size={14} color={Colors.darkGray} />
          <Text style={styles.scheduleText}>{unit.time}</Text>
        </View>
        <View style={styles.scheduleItem}>
          <Clock size={14} color={Colors.darkGray} />
          <Text style={styles.scheduleText}>{unit.date}</Text>
        </View>
      </View>

      {unit.venue && (
        <View style={styles.venueContainer}>
          <MapPin size={14} color={Colors.darkGray} />
          <Text style={styles.venueText}>{unit.venue}</Text>
        </View>
      )}
      
      <View style={styles.footer}>
        <View style={styles.peopleContainer}>
          <View style={styles.personContainer}>
            <User size={12} color={Colors.darkGray} />
            <Text style={styles.personText}>
              Created by: {creator ? creator.name : "Unknown"}
            </Text>
          </View>
          
          {lecturer ? (
            <View style={styles.personContainer}>
              <Book size={12} color={Colors.primary} />
              <Text style={styles.lecturerText}>
                {lecturer.name}
              </Text>
            </View>
          ) : (
            <Text style={styles.noLecturerText}>No lecturer assigned</Text>
          )}
        </View>
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
    borderLeftColor: Colors.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  codeContainer: {
    flex: 1,
  },
  code: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  university: {
    fontSize: 12,
    color: Colors.darkGray,
    marginTop: 2,
  },
  studentsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  students: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 12,
  },
  scheduleContainer: {
    marginBottom: 8,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  venueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  venueText: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  peopleContainer: {
    gap: 4,
  },
  personContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  personText: {
    fontSize: 11,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  lecturerText: {
    fontSize: 11,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: "600" as const,
  },
  noLecturerText: {
    fontSize: 11,
    color: Colors.error,
    fontStyle: "italic",
  },
});