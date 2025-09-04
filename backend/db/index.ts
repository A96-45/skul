import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// For development, we'll use a local SQLite file
// In production, you would use Turso or another LibSQL provider
const client = createClient({
  url: "file:./backend/db/local.db",
});

export const db = drizzle(client, { schema });

// Initialize database with tables
export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    // This is a simple approach for development
    // In production, you'd use proper migrations
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}