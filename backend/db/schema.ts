import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["student", "lecturer"] }).notNull(),
  profilePicture: text("profile_picture"),
  admissionNumber: text("admission_number"),
  department: text("department"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const units = sqliteTable("units", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  university: text("university").notNull(),
  time: text("time").notNull(),
  date: text("date").notNull(),
  venue: text("venue"),
  lecturerId: text("lecturer_id"),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  restrictedTo: text("restricted_to", { mode: "json" }).$type<string[]>(),
});

export const unitStudents = sqliteTable("unit_students", {
  id: text("id").primaryKey(),
  unitId: text("unit_id").notNull(),
  studentId: text("student_id").notNull(),
  joinedAt: integer("joined_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const unitInvitations = sqliteTable("unit_invitations", {
  id: text("id").primaryKey(),
  unitId: text("unit_id").notNull(),
  lecturerId: text("lecturer_id").notNull(),
  status: text("status", { enum: ["pending", "accepted", "declined"] }).default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  unitId: text("unit_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  type: text("type").notNull(),
});

export const announcements = sqliteTable("announcements", {
  id: text("id").primaryKey(),
  unitId: text("unit_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  important: integer("important", { mode: "boolean" }).default(false),
});

export const assignments = sqliteTable("assignments", {
  id: text("id").primaryKey(),
  unitId: text("unit_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  attachments: text("attachments", { mode: "json" }).$type<string[]>(),
  maxScore: integer("max_score"),
});

export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey(),
  assignmentId: text("assignment_id").notNull(),
  studentId: text("student_id").notNull(),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  files: text("files", { mode: "json" }).$type<string[]>().notNull(),
  comment: text("comment"),
  score: integer("score"),
  feedback: text("feedback"),
});

export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  unitId: text("unit_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const groupMembers = sqliteTable("group_members", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull(),
  userId: text("user_id").notNull(),
  joinedAt: integer("joined_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type", { enum: ["unit_invitation", "assignment_due", "announcement", "general"] }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: text("data", { mode: "json" }),
  read: integer("read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const timetableEntries = sqliteTable("timetable_entries", {
  id: text("id").primaryKey(),
  unitId: text("unit_id").notNull(),
  userId: text("user_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  venue: text("venue"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type TimetableEntry = typeof timetableEntries.$inferSelect;
export type NewTimetableEntry = typeof timetableEntries.$inferInsert;