import type { User, Unit, Announcement, Assignment, Document, Group } from './api/models';

export interface AuthStore {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface UnitsStore {
  units: Unit[];
  documents: Document[];
  announcements: Announcement[];
  assignments: Assignment[];
  groups: Group[];
  loading: boolean;
}
