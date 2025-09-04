import { Announcement, Assignment, Document, Group, Unit, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    email: "jane.smith@university.edu",
    role: "lecturer",
    department: "Computer Science",
  },
  {
    id: "2",
    name: "Prof. Michael Johnson",
    email: "michael.johnson@university.edu",
    role: "lecturer",
    department: "Engineering",
  },
  {
    id: "3",
    name: "John Doe",
    email: "john.doe@student.university.edu",
    role: "student",
    admissionNumber: "CS2023001",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@student.university.edu",
    role: "student",
    admissionNumber: "CS2023002",
  },
  {
    id: "5",
    name: "David Chen",
    email: "david.chen@student.university.edu",
    role: "student",
    admissionNumber: "ENG2023001",
  },
];

export const mockUnits: Unit[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    description: "Fundamental concepts of computer science and programming",
    university: "Machakos University",
    time: "10:00 AM - 12:00 PM",
    date: "Monday, Wednesday, Friday",
    venue: "Computer Lab 1",
    lecturerId: "1",
    createdBy: "3", // Created by student John Doe
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    restrictedTo: ["CS2023"],
    students: ["3", "4"],
  },
  {
    id: "2",
    code: "ENG202",
    name: "Advanced Engineering Principles",
    description: "Study of advanced engineering concepts and applications",
    university: "Machakos University",
    time: "2:00 PM - 4:00 PM",
    date: "Tuesday, Thursday",
    venue: "Engineering Hall",
    lecturerId: "2",
    createdBy: "5", // Created by student David Chen
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    restrictedTo: ["ENG2023"],
    students: ["5"],
  },
  {
    id: "3",
    code: "CS202",
    name: "Data Structures and Algorithms",
    description: "Study of fundamental data structures and algorithms",
    university: "Machakos University",
    time: "8:00 AM - 10:00 AM",
    date: "Monday, Wednesday, Friday",
    venue: "Computer Lab 2",
    lecturerId: "1",
    createdBy: "3", // Created by student John Doe
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    restrictedTo: ["CS2023"],
    students: ["3", "4"],
  },
  {
    id: "4",
    code: "MATH101",
    name: "Calculus I",
    description: "Introduction to differential and integral calculus",
    university: "Machakos University",
    time: "11:00 AM - 1:00 PM",
    date: "Tuesday, Thursday",
    venue: "Mathematics Building",
    lecturerId: "", // No lecturer assigned yet
    createdBy: "4", // Created by student Sarah Williams
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    restrictedTo: ["CS2023", "ENG2023"],
    students: ["4"],
  },
];

export const mockDocuments: Document[] = [
  {
    id: "1",
    unitId: "1",
    name: "Course Syllabus",
    description: "Complete course outline and requirements",
    url: "https://example.com/syllabus.pdf",
    uploadedBy: "1",
    uploadedAt: Date.now() - 29 * 24 * 60 * 60 * 1000,
    type: "pdf",
  },
  {
    id: "2",
    unitId: "1",
    name: "Lecture 1 Slides",
    description: "Introduction to programming concepts",
    url: "https://example.com/lecture1.pptx",
    uploadedBy: "1",
    uploadedAt: Date.now() - 28 * 24 * 60 * 60 * 1000,
    type: "pptx",
  },
  {
    id: "3",
    unitId: "2",
    name: "Engineering Handbook",
    description: "Reference guide for the course",
    url: "https://example.com/handbook.pdf",
    uploadedBy: "2",
    uploadedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    type: "pdf",
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    unitId: "1",
    title: "Welcome to CS101",
    content: "Welcome to Introduction to Computer Science! Please review the syllabus and prepare for our first lecture.",
    createdBy: "1",
    createdAt: Date.now() - 29 * 24 * 60 * 60 * 1000,
    important: true,
  },
  {
    id: "2",
    unitId: "1",
    title: "Class Canceled Tomorrow",
    content: "Due to unforeseen circumstances, tomorrow's class is canceled. We will resume next week.",
    createdBy: "1",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    important: true,
  },
  {
    id: "3",
    unitId: "2",
    title: "Lab Session Reminder",
    content: "Don't forget that we have a lab session this Friday at 2 PM in Room E201.",
    createdBy: "2",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    important: false,
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: "1",
    unitId: "1",
    title: "Programming Assignment 1",
    description: "Implement a simple calculator using the concepts learned in class.",
    dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    createdBy: "1",
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    maxScore: 100,
  },
  {
    id: "2",
    unitId: "2",
    title: "Engineering Design Project",
    description: "Design a solution to the problem statement provided in class.",
    dueDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
    createdBy: "2",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    maxScore: 150,
  },
];

export const mockGroups: Group[] = [
  {
    id: "1",
    unitId: "1",
    name: "Study Group A",
    description: "Group for weekly study sessions",
    members: ["3", "4"],
    createdBy: "3",
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
  },
  {
    id: "2",
    unitId: "2",
    name: "Project Team 1",
    description: "Team for the final project",
    members: ["5"],
    createdBy: "5",
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
  },
];

export const mockSubmissions = [
  {
    id: "1",
    assignmentId: "1",
    studentId: "3",
    submittedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    files: ["https://example.com/submission1.pdf"],
    comment: "Completed all requirements",
  },
  {
    id: "2",
    assignmentId: "2",
    studentId: "5",
    submittedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    files: ["https://example.com/submission2.pdf", "https://example.com/design.jpg"],
    comment: "Please review the design document as well",
  },
];