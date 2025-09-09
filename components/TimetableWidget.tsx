import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Clock, MapPin, BookOpen, Calendar } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { useUnits } from "@/hooks/units-store";

interface TimetableEntry {
  id: string;
  unitId: string;
  unitName: string;
  unitCode: string;
  time: string;
  date: string;
  venue?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface TimetableWidgetProps {
  showAll?: boolean;
  compact?: boolean;
}

export default function TimetableWidget({ showAll = false, compact = false }: TimetableWidgetProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { getUserUnits, loading } = useUnits();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [currentDay, setCurrentDay] = useState(new Date().getDay()); // 0 = Sunday, 6 = Saturday

  useEffect(() => {
    if (!loading && user) {
      generateTimetableFromUnits();
    }
  }, [loading, user]);

  const generateTimetableFromUnits = () => {
    const units = getUserUnits();
    const generatedTimetable: TimetableEntry[] = [];

    units.forEach((unit, index) => {
      // Parse the unit's date string to determine days
      const daysOfWeek = parseDaysFromString(unit.date);

      daysOfWeek.forEach((dayOfWeek, dayIndex) => {
        // Create a unique ID combining unit ID and day
        const entryId = `${unit.id}-${dayOfWeek}`;

        generatedTimetable.push({
          id: entryId,
          unitId: unit.id,
          unitName: unit.name,
          unitCode: unit.code,
          time: unit.time,
          date: unit.date,
          venue: unit.venue,
          dayOfWeek,
          startTime: unit.time.split(' - ')[0] || unit.time,
          endTime: unit.time.split(' - ')[1] || unit.time,
        });
      });
    });

    setTimetable(generatedTimetable);
  };

  const parseDaysFromString = (dateString: string): number[] => {
    // Parse strings like "Monday, Wednesday, Friday" into day numbers
    const dayMap: { [key: string]: number } = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };

    return dateString
      .toLowerCase()
      .split(',')
      .map(day => day.trim())
      .map(day => dayMap[day])
      .filter(day => day !== undefined) as number[];
  };

  const getDayName = (dayNumber: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };

  const getTodaysClasses = () => {
    return timetable.filter(entry => entry.dayOfWeek === currentDay);
  };

  const handleClassPress = (entry: TimetableEntry) => {
    if (user?.role === "student") {
      // Students navigate to unit details
      router.push(`/unit/${entry.unitId}`);
    } else if (user?.role === "lecturer") {
      // Lecturers navigate to unit details where they can create alerts
      router.push(`/unit/${entry.unitId}`);
    }
  };

  const getUpcomingClasses = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    return timetable
      .filter(entry => {
        if (entry.dayOfWeek < currentDay) return false; // Past days this week
        if (entry.dayOfWeek > currentDay) return true; // Future days this week

        // Today - check if class hasn't started yet
        const [startHour, startMinute] = entry.startTime.split(':').map(Number);
        const classTime = startHour * 60 + startMinute;
        return classTime > currentTime;
      })
      .sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;

        const [aHour, aMinute] = a.startTime.split(':').map(Number);
        const [bHour, bMinute] = b.startTime.split(':').map(Number);
        return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
      })
      .slice(0, showAll ? undefined : 3);
  };

  const todaysClasses = getTodaysClasses();
  const upcomingClasses = getUpcomingClasses();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading timetable...</Text>
      </View>
    );
  }

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <Calendar size={16} color={Colors.primary} />
          <Text style={styles.compactTitle}>Today's Classes</Text>
        </View>

        {todaysClasses.length > 0 ? (
          todaysClasses.slice(0, 2).map((entry) => (
            <View key={entry.id} style={styles.compactClass}>
              <Text style={styles.compactTime}>{entry.startTime}</Text>
              <Text style={styles.compactUnit} numberOfLines={1}>
                {entry.unitCode}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noClasses}>No classes today</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calendar size={20} color={Colors.primary} />
        <Text style={styles.title}>Today's Schedule</Text>
        <Text style={styles.subtitle}>{getDayName(currentDay)}</Text>
      </View>

      {todaysClasses.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {todaysClasses.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.classCard}
              onPress={() => handleClassPress(entry)}
              activeOpacity={0.7}
            >
              <View style={styles.classHeader}>
                <View style={styles.timeContainer}>
                  <Clock size={16} color={Colors.primary} />
                  <Text style={styles.time}>{entry.time}</Text>
                </View>
                {entry.venue && (
                  <View style={styles.venueContainer}>
                    <MapPin size={14} color={Colors.darkGray} />
                    <Text style={styles.venue}>{entry.venue}</Text>
                  </View>
                )}
              </View>

              <View style={styles.classContent}>
                <Text style={styles.unitName}>{entry.unitName}</Text>
                <Text style={styles.unitCode}>{entry.unitCode}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <BookOpen size={40} color={Colors.lightText} />
          <Text style={styles.emptyTitle}>No Classes Today</Text>
          <Text style={styles.emptySubtitle}>Enjoy your day off!</Text>
        </View>
      )}

      {upcomingClasses.length > 0 && !showAll && (
        <TouchableOpacity style={styles.upcomingButton}>
          <Text style={styles.upcomingText}>
            +{upcomingClasses.length} more upcoming classes
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compactContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 6,
  },
  compactClass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  compactTime: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    width: 60,
  },
  compactUnit: {
    fontSize: 12,
    color: Colors.text,
    flex: 1,
  },
  noClasses: {
    fontSize: 12,
    color: Colors.lightText,
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  classCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 4,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venue: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 2,
  },
  classContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  unitCode: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.lightText,
    marginTop: 4,
  },
  upcomingButton: {
    marginTop: 12,
    padding: 8,
    alignItems: 'center',
  },
  upcomingText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
});
