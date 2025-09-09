/**
 * 📚 UNITS STORE - Course & Academic Data Management
 *
 * Purpose: Centralized data management for all academic content in Skola
 * Features:
 * - Units (courses) management and enrollment
 * - Assignments creation, submission, and grading
 * - Announcements and notifications
 * - Document sharing and management
 * - Study groups and collaboration
 * - Role-based access control for lecturers vs students
 *
 * Data Sources: Mock data (currently), will integrate with tRPC API
 * Architecture: Context hook pattern with CRUD operations
 * State: Units, assignments, announcements, documents, groups
 *
 * @file hooks/units-store.ts
 * @location Used by dashboard, units screen, and academic features
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";
import { Announcement, Assignment, Document, Group, Unit } from "@/types";
import { mockAnnouncements, mockAssignments, mockDocuments, mockGroups, mockUnits, mockPerformanceData } from "@/mocks/data";
import { useAuth } from "./auth-store";

export const [UnitsContext, useUnits] = createContextHook(() => {
  const { user } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from storage or mock data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, this would be API calls
        // For demo purposes, we're using mock data
        setUnits(mockUnits);
        setDocuments(mockDocuments);
        setAnnouncements(mockAnnouncements);
        setAssignments(mockAssignments);
        setGroups(mockGroups);
        setPerformanceData(mockPerformanceData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get units for the current user
  const getUserUnits = () => {
    if (!user) return [];
    
    return units.filter(unit => {
      if (user.role === "lecturer") {
        return unit.lecturerId === user.id;
      } else {
        return unit.students.includes(user.id) || unit.createdBy === user.id;
      }
    });
  };

  // Create a new unit
  const createUnit = (newUnit: Omit<Unit, "id" | "createdAt" | "students">) => {
    if (!user) {
      return { success: false, error: "No user logged in" };
    }
    
    const unit: Unit = {
      ...newUnit,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      students: user.role === "student" ? [user.id] : [], // Creator is automatically added if student
    };
    
    setUnits(prev => [...prev, unit]);
    return { success: true, unit };
  };

  // Join a unit with admission number verification
  const joinUnit = (unitId: string) => {
    if (!user) {
      return { success: false, error: "No user logged in" };
    }
    
    const unitIndex = units.findIndex(u => u.id === unitId);
    if (unitIndex === -1) {
      return { success: false, error: "Unit not found" };
    }
    
    const unit = units[unitIndex];
    let updatedUnit: Unit;
    
    if (user.role === "student") {
      // Check if student's admission number matches restrictions
      if (unit.restrictedTo && unit.restrictedTo.length > 0 && user.admissionNumber) {
        const isAllowed = unit.restrictedTo.some(pattern => 
          user.admissionNumber?.startsWith(pattern)
        );
        
        if (!isAllowed) {
          return { 
            success: false, 
            error: `Your admission number (${user.admissionNumber}) doesn't have access to this unit. Required prefixes: ${unit.restrictedTo.join(", ")}` 
          };
        }
      }
      
      // Check if student is already in the unit
      if (unit.students.includes(user.id)) {
        return { success: false, error: "You're already enrolled in this unit" };
      }
      
      // Add student to unit
      updatedUnit = {
        ...unit,
        students: [...unit.students, user.id],
      };
    } else if (user.role === "lecturer") {
      // Check if lecturer is already assigned to this unit
      if (unit.lecturerId === user.id) {
        return { success: false, error: "You're already the lecturer for this unit" };
      }
      
      // Check if unit already has a lecturer
      if (unit.lecturerId && unit.lecturerId !== "") {
        return { success: false, error: "This unit already has a lecturer" };
      }
      
      // Assign lecturer to unit
      updatedUnit = {
        ...unit,
        lecturerId: user.id,
      };
    } else {
      return { success: false, error: "Invalid user role" };
    }
    
    const updatedUnits = [...units];
    updatedUnits[unitIndex] = updatedUnit;
    
    setUnits(updatedUnits);
    return { success: true, unit: updatedUnit };
  };

  // Add document to a unit (for lecturers)
  const addDocument = (newDoc: Omit<Document, "id" | "uploadedAt" | "uploadedBy">) => {
    if (!user || user.role !== "lecturer") {
      return { success: false, error: "Only lecturers can add documents" };
    }
    
    const document: Document = {
      ...newDoc,
      id: Math.random().toString(36).substring(2, 9),
      uploadedAt: Date.now(),
      uploadedBy: user.id,
    };
    
    setDocuments(prev => [...prev, document]);
    return { success: true, document };
  };

  // Create announcement (for lecturers)
  const createAnnouncement = (newAnnouncement: Omit<Announcement, "id" | "createdAt" | "createdBy">) => {
    if (!user || user.role !== "lecturer") {
      return { success: false, error: "Only lecturers can create announcements" };
    }
    
    const announcement: Announcement = {
      ...newAnnouncement,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      createdBy: user.id,
    };
    
    setAnnouncements(prev => [...prev, announcement]);
    return { success: true, announcement };
  };

  // Create assignment (for lecturers)
  const createAssignment = (newAssignment: Omit<Assignment, "id" | "createdAt" | "createdBy">) => {
    if (!user || user.role !== "lecturer") {
      return { success: false, error: "Only lecturers can create assignments" };
    }
    
    const assignment: Assignment = {
      ...newAssignment,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      createdBy: user.id,
    };
    
    setAssignments(prev => [...prev, assignment]);
    return { success: true, assignment };
  };

  // Create group (for students)
  const createGroup = (newGroup: Omit<Group, "id" | "createdAt" | "createdBy" | "members">) => {
    if (!user) return { success: false, error: "No user logged in" };
    
    const group: Group = {
      ...newGroup,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      createdBy: user.id,
      members: [user.id],
    };
    
    setGroups(prev => [...prev, group]);
    return { success: true, group };
  };

  // Join group (for students)
  const joinGroup = (groupId: string) => {
    if (!user || user.role !== "student") {
      return { success: false, error: "Only students can join groups" };
    }
    
    const groupIndex = groups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) {
      return { success: false, error: "Group not found" };
    }
    
    const group = groups[groupIndex];
    
    // Check if student is already in the group
    if (group.members.includes(user.id)) {
      return { success: false, error: "You're already in this group" };
    }
    
    // Add student to group
    const updatedGroup = {
      ...group,
      members: [...group.members, user.id],
    };
    
    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = updatedGroup;
    
    setGroups(updatedGroups);
    return { success: true, group: updatedGroup };
  };

  // Get unit by ID
  const getUnitById = (unitId: string) => {
    return units.find(unit => unit.id === unitId);
  };

  // Get documents for a unit
  const getUnitDocuments = (unitId: string) => {
    return documents.filter(doc => doc.unitId === unitId);
  };

  // Get announcements for a unit
  const getUnitAnnouncements = (unitId: string) => {
    return announcements.filter(ann => ann.unitId === unitId);
  };

  // Get assignments for a unit
  const getUnitAssignments = (unitId: string) => {
    return assignments.filter(ass => ass.unitId === unitId);
  };

  // Get groups for a unit
  const getUnitGroups = (unitId: string) => {
    return groups.filter(group => group.unitId === unitId);
  };

  // Get performance data for a specific student and unit
  const getStudentPerformance = (studentId: string, unitId: string) => {
    return performanceData.find(
      perf => perf.studentId === studentId && perf.unitId === unitId
    );
  };

  // Get all performance data for a student
  const getStudentPerformanceData = (studentId: string) => {
    return performanceData.filter(perf => perf.studentId === studentId);
  };

  // Calculate overall performance summary for a student
  const getStudentOverallPerformance = (studentId: string) => {
    const studentPerf = getStudentPerformanceData(studentId);
    if (studentPerf.length === 0) return null;

    const totalUnits = studentPerf.length;
    const avgGrade = studentPerf.reduce((sum, perf) => sum + perf.overallGrade, 0) / totalUnits;
    const totalAssignments = studentPerf.reduce((sum, perf) => sum + perf.totalAssignments, 0);
    const completedAssignments = studentPerf.reduce((sum, perf) => sum + perf.assignmentsCompleted, 0);
    const avgAttendance = studentPerf.reduce((sum, perf) => sum + perf.attendanceRate, 0) / totalUnits;

    return {
      totalUnits,
      averageGrade: Math.round(avgGrade),
      totalAssignments,
      completedAssignments,
      averageAttendance: Math.round(avgAttendance),
      assignmentCompletionRate: totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0,
    };
  };

  return {
    loading,
    units,
    documents,
    announcements,
    assignments,
    groups,
    performanceData,
    getUserUnits,
    createUnit,
    joinUnit,
    addDocument,
    createAnnouncement,
    createAssignment,
    createGroup,
    joinGroup,
    getUnitById,
    getUnitDocuments,
    getUnitAnnouncements,
    getUnitAssignments,
    getUnitGroups,
    getStudentPerformance,
    getStudentPerformanceData,
    getStudentOverallPerformance,
  };
});