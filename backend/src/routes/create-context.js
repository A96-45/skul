import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';

// Initialize tRPC
const t = initTRPC.create({
  transformer: superjson,
});

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Create context function
export const createContext = async ({ req, res }) => {
  // Get user from JWT token if present
  let user = null;

  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');

      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch user from database
      if (decoded.userId) {
        const [userData] = await db
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            profileComplete: users.profileComplete,
            admissionNumber: users.admissionNumber,
            department: users.department,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(eq(users.id, decoded.userId))
          .limit(1);

        if (userData) {
          user = userData;
        }
      }
    }
  } catch (error) {
    // Token is invalid, expired, or user doesn't exist
    console.log('JWT verification failed:', error.message);
  }

  return {
    req,
    res,
    db,
    user,
  };
};

// Export tRPC helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('Not authenticated');
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
