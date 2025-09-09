import { router, publicProcedure } from './create-context.js';
import { authRouter } from './auth-router.js';
import { unitsRouter } from './units-router.js';
import { uploadRouter } from './upload-router.js';

// Create main router
const appRouter = router({
  // Health check with detailed monitoring
  health: router({
    check: publicProcedure.query(async ({ ctx }) => {
      const startTime = Date.now();
      let dbStatus = 'unknown';

      try {
        // Test database connection
        await ctx.db.execute('SELECT 1 as health_check');
        dbStatus = 'healthy';
      } catch (error) {
        dbStatus = 'unhealthy';
        console.error('Database health check failed:', error);
      }

      const responseTime = Date.now() - startTime;

      return {
        status: 'ok',
        message: 'Skola API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus,
        responseTime: `${responseTime}ms`,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0',
      };
    }),

    // Detailed system metrics
    metrics: publicProcedure.query(() => {
      const memUsage = process.memoryUsage();
      const uptime = process.uptime();

      return {
        system: {
          uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
          memory: {
            rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
            heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
            external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
          },
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          port: process.env.PORT,
          database: process.env.DATABASE_URL ? 'configured' : 'not configured',
        },
      };
    }),
  }),

  // Authentication routes
  auth: authRouter,

  // Units management routes
  units: unitsRouter,

  // File upload routes
  upload: uploadRouter,

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
