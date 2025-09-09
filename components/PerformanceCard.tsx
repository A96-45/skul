// 📊 PERFORMANCE CARD COMPONENT - Academic Performance Visualization

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react-native";
import Colors from "@/constants/colors";

interface PerformanceData {
  overallGrade: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  attendanceRate: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface PerformanceCardProps {
  performance: PerformanceData;
  compact?: boolean;
}

export default function PerformanceCard({ performance, compact = false }: PerformanceCardProps) {
  const getGradeColor = (grade: number) => {
    if (grade >= 80) return Colors.success;
    if (grade >= 60) return Colors.warning;
    return Colors.error;
  };

  const getTrendIcon = () => {
    switch (performance.trend) {
      case 'up':
        return <TrendingUp size={16} color={Colors.success} />;
      case 'down':
        return <TrendingDown size={16} color={Colors.error} />;
      default:
        return <Minus size={16} color={Colors.darkGray} />;
    }
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { borderColor: Colors.divider }]}>
        <View style={styles.compactHeader}>
          <View style={styles.gradeContainer}>
            <Text style={[styles.compactGrade, { color: getGradeColor(performance.overallGrade) }]}>
              {performance.overallGrade}%
            </Text>
            {getTrendIcon()}
          </View>
          <Text style={[styles.compactLabel, { color: Colors.darkGray }]}>Overall Grade</Text>
        </View>
        <View style={styles.compactProgress}>
          <Text style={[styles.compactProgressText, { color: Colors.text }]}>
            {performance.assignmentsCompleted}/{performance.totalAssignments} assignments
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderColor: Colors.divider }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Target size={24} color={getGradeColor(performance.overallGrade)} />
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: Colors.text }]}>Academic Performance</Text>
            <Text style={[styles.subtitle, { color: Colors.darkGray }]}>
              Last updated: {performance.lastUpdated}
            </Text>
          </View>
        </View>
        <View style={styles.trendContainer}>
          {getTrendIcon()}
        </View>
      </View>

      <View style={styles.metricsContainer}>
        {/* Overall Grade */}
        <View style={styles.metricCard}>
          <Text style={[styles.metricLabel, { color: Colors.darkGray }]}>Overall Grade</Text>
          <Text style={[styles.metricValue, { color: getGradeColor(performance.overallGrade) }]}>
            {performance.overallGrade}%
          </Text>
        </View>

        {/* Assignments */}
        <View style={styles.metricCard}>
          <Text style={[styles.metricLabel, { color: Colors.darkGray }]}>Assignments</Text>
          <Text style={[styles.metricValue, { color: Colors.primary }]}>
            {performance.assignmentsCompleted}/{performance.totalAssignments}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${performance.totalAssignments > 0 ? (performance.assignmentsCompleted / performance.totalAssignments) * 100 : 0}%`,
                  backgroundColor: Colors.primary
                }
              ]}
            />
          </View>
        </View>

        {/* Attendance */}
        <View style={styles.metricCard}>
          <Text style={[styles.metricLabel, { color: Colors.darkGray }]}>Attendance</Text>
          <Text style={[styles.metricValue, { color: Colors.secondary }]}>
            {performance.attendanceRate}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    backgroundColor: Colors.white,
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
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  trendContainer: {
    padding: 4,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.mediumGray,
    borderRadius: 2,
    marginTop: 8,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  // Compact styles
  compactContainer: {
    borderRadius: 8,
    padding: 12,
    margin: 8,
    borderWidth: 1,
    backgroundColor: Colors.white,
  },
  compactHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  gradeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  compactGrade: {
    fontSize: 24,
    fontWeight: "700" as const,
    marginRight: 4,
  },
  compactLabel: {
    fontSize: 12,
  },
  compactProgress: {
    alignItems: "center",
  },
  compactProgressText: {
    fontSize: 12,
  },
});
