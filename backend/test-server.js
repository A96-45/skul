// Minimal test server to check if basic setup works
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
});

// Basic route
fastify.get('/', async (request, reply) => {
  return { message: 'Skola Backend Test Server', timestamp: new Date().toISOString() };
});

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', message: 'Server is healthy' };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Test server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
