/**
 * 🚀 SKOLA BACKEND SERVER - Main API Entry Point
 *
 * Purpose: Fastify server setup with tRPC integration for Skola API
 * Features:
 * - CORS configuration for cross-origin requests
 * - JWT authentication middleware
 * - tRPC plugin for type-safe API endpoints
 * - Health check endpoints
 * - Development-friendly logging
 *
 * Architecture: Fastify (high-performance) + tRPC (type safety)
 * Endpoints: /trpc/* (tRPC routes), / (health check)
 * Environment: Development server on port 3000
 *
 * @file backend/src/server.js
 * @location Main backend entry point, started by npm scripts
 */

import Fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './routes/app-router.js';
import { createContext } from './routes/create-context.js';
import superjson from 'superjson';

// Create Fastify instance with production configuration
const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development',
  disableRequestLogging: false,
  ignoreTrailingSlash: true,
  // Security: Trust proxy for rate limiting behind reverse proxy
  trustProxy: process.env.NODE_ENV === 'production',
});

// Security headers and CORS (basic implementation)
fastify.addHook('onRequest', async (request, reply) => {
  // CORS headers
  reply.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  reply.header('Access-Control-Allow-Credentials', 'true');

  // Security headers
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('X-XSS-Protection', '1; mode=block');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    reply.code(200).send();
    return;
  }
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
