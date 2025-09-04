import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
// import { db } from '../../db/index.js'; // Temporarily disabled

// Initialize tRPC
const t = initTRPC.create({
  transformer: superjson,
});

// Create context function
export const createContext = async ({ req, res }) => {
  // Get user from JWT token if present
  let user = null;

  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      // In a real app, you'd verify the JWT token here
      // user = verifyToken(token);
    }
  } catch (error) {
    // Token is invalid or missing
  }

  return {
    req,
    res,
    // db, // Temporarily disabled
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
