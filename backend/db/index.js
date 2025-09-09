import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// PostgreSQL connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://skola_user:skola_password_2024_secure@localhost:5432/skola_prod';

// Create PostgreSQL connection
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Idle connection timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Test database connection
export const testConnection = async () => {
  try {
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Closing database connection...');
  await client.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Closing database connection...');
  await client.end();
  process.exit(0);
});

export default db;
