#!/bin/bash

# Skola Production Deployment Script
# Deploys the complete system with Docker

set -e

echo "🚀 Starting Skola Production Deployment..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose >/dev/null 2>&1; then
    print_error "docker-compose is not installed."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p nginx/ssl

# Set proper permissions
print_status "Setting file permissions..."
chmod 755 backend/uploads
chmod 755 backend/logs

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true

# Build and start containers
print_status "Building and starting containers..."
docker-compose up -d --build

# Wait for services to be healthy
print_status "Waiting for services to start..."
sleep 10

# Check PostgreSQL health
print_status "Checking PostgreSQL health..."
if docker-compose exec -T postgres pg_isready -U skola_user -d skola_prod >/dev/null 2>&1; then
    print_status "✅ PostgreSQL is healthy"
else
    print_error "❌ PostgreSQL health check failed"
    docker-compose logs postgres
    exit 1
fi

# Check backend health
print_status "Checking backend health..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3000/health/check >/dev/null 2>&1; then
        print_status "✅ Backend is healthy"
        break
    fi

    if [ $attempt -eq $max_attempts ]; then
        print_error "❌ Backend health check failed after $max_attempts attempts"
        docker-compose logs backend
        exit 1
    fi

    print_warning "Backend not ready yet, attempt $attempt/$max_attempts..."
    sleep 5
    ((attempt++))
done

# Check frontend health
print_status "Checking frontend health..."
max_attempts=20
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:8085/health >/dev/null 2>&1; then
        print_status "✅ Frontend is healthy"
        break
    fi

    if [ $attempt -eq $max_attempts ]; then
        print_error "❌ Frontend health check failed after $max_attempts attempts"
        docker-compose logs frontend
        exit 1
    fi

    print_warning "Frontend not ready yet, attempt $attempt/$max_attempts..."
    sleep 3
    ((attempt++))
done

# Run database migrations
print_status "Running database migrations..."
cd backend
if bun run db:push; then
    print_status "✅ Database migrations completed"
else
    print_error "❌ Database migration failed"
    exit 1
fi
cd ..

print_status ""
print_status "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
print_status "====================================="
echo ""
echo -e "${BLUE}🌐 Access Your Application:${NC}"
echo -e "  📱 Frontend (Web): ${GREEN}http://localhost:8085${NC}"
echo -e "  🔗 Backend API: ${GREEN}http://localhost:3000${NC}"
echo -e "  📊 Health Check: ${GREEN}http://localhost:3000/health/check${NC}"
echo -e "  📈 API Metrics: ${GREEN}http://localhost:3000/health/metrics${NC}"
echo ""
echo -e "${BLUE}🗄️ Database Access:${NC}"
echo -e "  🐘 PostgreSQL: ${GREEN}localhost:5432${NC}"
echo -e "  👤 User: ${YELLOW}skola_user${NC} | DB: ${YELLOW}skola_prod${NC}"
echo ""
echo -e "${BLUE}📋 Management Commands:${NC}"
echo -e "  📊 View all logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "  📊 View backend logs: ${YELLOW}docker-compose logs -f backend${NC}"
echo -e "  📊 View frontend logs: ${YELLOW}docker-compose logs -f frontend${NC}"
echo -e "  🛑 Stop all services: ${YELLOW}docker-compose down${NC}"
echo -e "  🔄 Restart services: ${YELLOW}docker-compose restart${NC}"
echo -e "  🧹 Clean restart: ${YELLOW}docker-compose down && docker-compose up -d${NC}"
echo ""
echo -e "${BLUE}🔧 Database Management:${NC}"
echo -e "  🗄️ Connect to DB: ${YELLOW}docker-compose exec postgres psql -U skola_user -d skola_prod${NC}"
echo -e "  📊 Database Studio: ${YELLOW}cd backend && npm run db:studio${NC}"
echo ""
echo -e "${BLUE}📱 Development Options:${NC}"
echo -e "  🌐 Local Frontend Dev: ${YELLOW}npm run start${NC} (in separate terminal)"
echo -e "  📱 Expo Go Mobile: ${YELLOW}Scan QR code from Expo DevTools${NC}"
echo ""
echo -e "${GREEN}🎉 Your complete Skola system is now running!${NC}"
echo -e "${GREEN}🚀 Ready to serve students and lecturers worldwide!${NC}"
