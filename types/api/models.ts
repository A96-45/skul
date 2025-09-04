export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer';
  profilePicture?: string;
  admissionNumber?: string;
  department?: string;
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
  lecturerId: string;
  createdBy: string;
  createdAt: number;
  restrictedTo?: string[];
  students: string[];
  invitedLecturers?: string[];
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

export interface Group {
  id: string;
  unitId: string;
  name: string;
  description?: string;
  members: string[];
  createdBy: string;
  createdAt: number;
}
