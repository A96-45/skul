import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('student'), // 'student' | 'lecturer'
  profileComplete: integer('profile_complete', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Units table
export const units = sqliteTable('units', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').notNull(),
  lecturerId: integer('lecturer_id').notNull().references(() => users.id),
  schedule: text('schedule', { mode: 'json' }), // JSON schedule data
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  lecturerIdx: index('units_lecturer_idx').on(table.lecturerId),
}));

// Unit Students (many-to-many relationship)
export const unitStudents = sqliteTable('unit_students', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  unitId: integer('unit_id').notNull().references(() => units.id),
  studentId: integer('student_id').notNull().references(() => users.id),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  unitStudentIdx: index('unit_students_unit_student_idx').on(table.unitId, table.studentId),
}));

// Unit Invitations
export const unitInvitations = sqliteTable('unit_invitations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  unitId: integer('unit_id').notNull().references(() => units.id),
  code: text('code').notNull().unique(),
  createdBy: integer('created_by').notNull().references(() => users.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Groups
export const groups = sqliteTable('groups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  creatorId: integer('creator_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Group Members
export const groupMembers = sqliteTable('group_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupId: integer('group_id').notNull().references(() => groups.id),
  userId: integer('user_id').notNull().references(() => users.id),
  role: text('role').notNull().default('member'), // 'admin' | 'member'
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  groupUserIdx: index('group_members_group_user_idx').on(table.groupId, table.userId),
}));

// Assignments
export const assignments = sqliteTable('assignments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  unitId: integer('unit_id').notNull().references(() => units.id),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Submissions
export const submissions = sqliteTable('submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assignmentId: integer('assignment_id').notNull().references(() => assignments.id),
  studentId: integer('student_id').notNull().references(() => users.id),
  content: text('content'),
  submittedAt: integer('submitted_at', { mode: 'timestamp' }).notNull(),
});

// Announcements
export const announcements = sqliteTable('announcements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  unitId: integer('unit_id').notNull().references(() => units.id),
  authorId: integer('author_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Notifications
export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('info'), // 'info' | 'warning' | 'success' | 'error'
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Documents
export const documents = sqliteTable('documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  unitId: integer('unit_id').references(() => units.id),
  uploadedBy: integer('uploaded_by').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Timetable entries
export const timetableEntries = sqliteTable('timetable_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  unitId: integer('unit_id').notNull().references(() => units.id),
  day: text('day').notNull(), // 'monday', 'tuesday', etc.
  startTime: text('start_time').notNull(), // '09:00'
  endTime: text('end_time').notNull(), // '10:30'
  venue: text('venue').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
