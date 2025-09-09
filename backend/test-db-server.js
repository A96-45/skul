// Test server with database connection
import Fastify from 'fastify';
import { db, testConnection } from './db/index.js';

const fastify = Fastify({
  logger: true
});

// Test database connection on startup
fastify.ready(async () => {
  console.log('🔍 Testing database connection...');
  const dbHealthy = await testConnection();
  if (dbHealthy) {
    console.log('✅ Database connection successful');
  } else {
    console.log('❌ Database connection failed');
  }
});

// Basic routes
fastify.get('/', async (request, reply) => {
  return {
    message: 'Skola Backend with Database',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL'
  };
});

// Health check
fastify.get('/health', async (request, reply) => {
  const dbHealthy = await testConnection();
  return {
    status: dbHealthy ? 'ok' : 'error',
    message: 'Server health check',
    database: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString()
  };
});

// Database test route
fastify.get('/db-test', async (request, reply) => {
  try {
    const result = await db.execute('SELECT 1 as test, NOW() as current_time');
    return {
      success: true,
      data: result,
      message: 'Database query successful'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Database query failed'
    };
  }
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3002;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Database test server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
