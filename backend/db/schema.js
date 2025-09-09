/**
 * 🗄️ DATABASE SCHEMA - Skola Data Model Definition
 *
 * Purpose: Complete database schema for Skola university management system
 * Database: SQLite with Drizzle ORM for type-safe queries
 * Features:
 * - User authentication and profiles
 * - Unit/course management with enrollment
 * - Assignment submission and grading
 * - Announcements and notifications
 * - Document sharing and file management
 * - Study groups and collaboration
 * - Timetable and scheduling
 *
 * Relationships:
 * - Users → Units (lecturer relationship)
 * - Units ↔ Students (many-to-many enrollment)
 * - Units → Assignments, Announcements, Documents
 * - Assignments → Submissions (with grading)
 * - Users → Groups (collaboration spaces)
 *
 * @file backend/db/schema.js
 * @location Database schema, used by Drizzle Kit for migrations
 */

import { pgTable, text, integer, index, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table - Authentication and profile data
export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('student'), // 'student' | 'lecturer'
  profileComplete: integer('profile_complete').notNull().default(0),
  admissionNumber: text('admission_number'),
  department: text('department'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Units table
export const units = pgTable('units', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  description: text('description'),
  university: text('university').notNull(),
  time: text('time'),
  date: text('date'),
  venue: text('venue'),
  lecturerId: integer('lecturer_id').references(() => users.id),
  createdBy: integer('created_by').notNull().references(() => users.id),
  restrictedTo: text('restricted_to').array(), // JSON array of admission number patterns
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  lecturerIdx: index('units_lecturer_idx').on(table.lecturerId),
  createdByIdx: index('units_created_by_idx').on(table.createdBy),
}));

// Unit Students (many-to-many relationship)
export const unitStudents = pgTable('unit_students', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  unitId: integer('unit_id').notNull().references(() => units.id),
  studentId: integer('student_id').notNull().references(() => users.id),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
}, (table) => ({
  unitStudentIdx: index('unit_students_unit_student_idx').on(table.unitId, table.studentId),
}));

// Unit Invitations
export const unitInvitations = pgTable('unit_invitations', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  unitId: integer('unit_id').notNull().references(() => units.id),
  code: text('code').notNull().unique(),
  createdBy: integer('created_by').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Groups
export const groups = pgTable('groups', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  unitId: integer('unit_id').notNull().references(() => units.id),
  creatorId: integer('creator_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Group Members
export const groupMembers = pgTable('group_members', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  groupId: integer('group_id').notNull().references(() => groups.id),
  userId: integer('user_id').notNull().references(() => users.id),
  role: text('role').notNull().default('member'), // 'admin' | 'member'
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
}, (table) => ({
  groupUserIdx: index('group_members_group_user_idx').on(table.groupId, table.userId),
}));

// Assignments
export const assignments = pgTable('assignments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  description: text('description'),
  unitId: integer('unit_id').notNull().references(() => units.id),
  dueDate: timestamp('due_date'),
  createdBy: integer('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  maxScore: integer('max_score'),
  attachments: text('attachments').array(),
});

// Submissions
export const submissions = pgTable('submissions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  assignmentId: integer('assignment_id').notNull().references(() => assignments.id),
  studentId: integer('student_id').notNull().references(() => users.id),
  content: text('content'),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
  files: text('files').array(),
  comment: text('comment'),
  score: integer('score'),
  feedback: text('feedback'),
});

// Announcements
export const announcements = pgTable('announcements', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  unitId: integer('unit_id').notNull().references(() => units.id),
  createdBy: integer('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  important: integer('important').notNull().default(0),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('info'), // 'info' | 'warning' | 'success' | 'error'
  read: integer('read').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  data: text('data'), // JSON data for additional context
});

// Documents
export const documents = pgTable('documents', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  unitId: integer('unit_id').references(() => units.id),
  uploadedBy: integer('uploaded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  type: text('type').notNull(),
  description: text('description'),
});

// Timetable entries
export const timetableEntries = pgTable('timetable_entries', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  unitId: integer('unit_id').notNull().references(() => units.id),
  day: text('day').notNull(), // 'monday', 'tuesday', etc.
  startTime: text('start_time').notNull(), // '09:00'
  endTime: text('end_time').notNull(), // '10:30'
  venue: text('venue').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
