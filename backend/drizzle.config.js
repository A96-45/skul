import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.js',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://skola_user:skola_password_2024_secure@localhost:5432/skola_prod',
  },
});
