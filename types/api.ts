// Frontend API Types - Defines the expected tRPC API structure
// This file provides type safety for the frontend without importing backend code

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'lecturer';
  profileComplete?: boolean;
  admissionNumber?: string;
  department?: string;
}

export interface Unit {
  id: string;
  name: string;
  code: string;
  description?: string;
  university: string;
  time?: string;
  date?: string;
  venue?: string;
  lecturerId?: string;
  createdBy: string;
  restrictedTo?: string[];
  students: string[];
}

export interface Announcement {
  id: string;
  unitId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: number;
  important?: boolean;
}

export interface Assignment {
  id: string;
  unitId: string;
  title: string;
  description: string;
  dueDate: number;
  createdBy: string;
  createdAt: number;
  maxScore?: number;
  attachments?: string[];
}

// tRPC Router Type Definition
// This matches the backend router structure
export interface AppRouter {
  health: {
    check: {
      query: () => Promise<{
        status: string;
        message: string;
        timestamp: string;
        environment: string;
        database: string;
        responseTime: string;
        uptime: number;
        memory: any;
        version: string;
      }>;
    };
    metrics: {
      query: () => Promise<{
        system: {
          uptime: string;
          memory: {
            rss: string;
            heapTotal: string;
            heapUsed: string;
            external: string;
          };
          platform: string;
          arch: string;
          nodeVersion: string;
        };
        environment: {
          nodeEnv: string;
          port: string;
          database: string;
        };
      }>;
    };
  };
  auth: any; // Will be defined when auth router is implemented
  units: any; // Will be defined when units router is implemented
  upload: any; // Will be defined when upload router is implemented
  example: {
    hello: {
      query: () => Promise<{
        message: string;
        timestamp: string;
      }>;
    };
  };
}
