/**
 * 🧩 COMPONENT LIBRARY - Reusable UI Components
 *
 * Purpose: Centralized export of all reusable components
 * Usage: Import components from this index for consistency
 * Maintenance: Add new components here when created
 *
 * @file components/index.ts
 * @location Main component library entry point
 */

// Core UI Components
export { default as Button } from './Button';
export { default as Input } from './Input';

// Card Components
export { default as UnitCard } from './UnitCard';
export { default as AnnouncementCard } from './AnnouncementCard';
export { default as AssignmentCard } from './AssignmentCard';
export { default as GroupCard } from './GroupCard';

// Layout Components
export { default as EmptyState } from './EmptyState';
export { default as TimetableWidget } from './TimetableWidget';

// Utility Components
export { default as UserSearch } from './UserSearch';
export { default as DocumentCard } from './DocumentCard';

// Re-export types for convenience
export type { Unit } from '@/types';
export type { Announcement } from '@/types';
export type { Assignment } from '@/types';
