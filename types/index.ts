export type UserRole = 'student' | 'lecturer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  admissionNumber?: string; // For students
  department?: string; // For lecturers
}

export interface Unit {
  id: string;
  code: string;
  name: string;
  description: string;
  university: string;
  time: string;
  date: string;
  venue?: string;
  lecturerId: string; // Empty initially, filled when lecturer joins
  createdBy: string; // Student who created the unit card
  createdAt: number;
  restrictedTo?: string[]; // Admission number patterns
  students: string[];
  invitedLecturers?: string[]; // Lecturers invited to join
}

export interface Document {
  id: string;
  unitId: string;
  name: string;
  description?: string;
  url: string;
  uploadedBy: string;
  uploadedAt: number;
  type: string;
}

export interface Announcement {
  id: string;
  unitId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: number;
  important: boolean;
}

export interface Assignment {
  id: string;
  unitId: string;
  title: string;
  description: string;
  dueDate: number;
  createdBy: string;
  createdAt: number;
  attachments?: string[];
  maxScore?: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: number;
  files: string[];
  comment?: string;
  score?: number;
  feedback?: string;
}

export interface Group {
  id: string;
  unitId: string;
  name: string;
  description?: string;
  members: string[];
  createdBy: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'unit_invitation' | 'assignment_due' | 'announcement' | 'general';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: number;
}