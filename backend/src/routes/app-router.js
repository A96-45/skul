import { router, publicProcedure } from './create-context.js';

// Create main router
const appRouter = router({
  // Health check
  health: router({
    check: publicProcedure.query(() => {
      return {
        status: 'ok',
        message: 'Skola API is running',
        timestamp: new Date().toISOString(),
      };
    }),
  }),

  // Example route (you can expand this with auth, timetable, etc.)
  example: router({
    hello: publicProcedure.query(() => {
      return {
        message: 'Hello from Skola Backend!',
        timestamp: new Date().toISOString(),
      };
    }),
  }),
});

// Export the router instance
export { appRouter };
