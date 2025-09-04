import Database from 'sqlite3';
import { drizzle } from 'drizzle-orm/sqlite3';
import * as schema from './schema.js';

// Create SQLite database connection
const sqlite = new Database('./db/skola.db');

// Enable WAL mode for better concurrency
sqlite.run('PRAGMA journal_mode = WAL');

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Test database connection
export const testConnection = async () => {
  try {
    const result = await db.run(sqlite.raw('SELECT 1 as test'));
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export default db;
