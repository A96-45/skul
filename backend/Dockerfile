# Skola Backend Production Dockerfile
# Multi-stage build for optimized production image

# Build stage
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY bun.lock ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine AS production

# Install only runtime dependencies
RUN apk add --no-cache \
    postgresql-client \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S skola -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --omit=dev && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=skola:nodejs /app/src ./src
COPY --from=builder --chown=skola:nodejs /app/db ./db

# Create necessary directories with proper permissions
RUN mkdir -p uploads logs && \
    chown -R skola:nodejs /app

# Switch to non-root user
USER skola

# Environment variables (can be overridden)
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health/check || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["npm", "start"]
