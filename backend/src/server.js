import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './routes/app-router.js';
import { createContext } from './routes/create-context.js';
import superjson from 'superjson';

// Create Fastify instance
const fastify = Fastify({
  logger: true,
  // Disable request timeout for development
  disableRequestLogging: false,
  ignoreTrailingSlash: true,
});

// Register plugins
await fastify.register(cors, {
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
});

// Register tRPC plugin
await fastify.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext: createContext,
    transformer: superjson,
  },
});

// Health check endpoint
fastify.get('/', async (request, reply) => {
  return {
    status: 'ok',
    message: 'Skola Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🚀 Skola Backend Server listening on http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/`);
    console.log(`🔗 tRPC endpoint: http://${host}:${port}/trpc`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
