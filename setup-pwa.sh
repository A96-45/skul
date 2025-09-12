#!/bin/bash

# 🚀 Skola PWA Setup Script
# One-command setup for Progressive Web App deployment

set -e

echo "🚀 Setting up Skola PWA..."
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed and running
print_status "Checking Docker installation..."
if ! command -v docker >/dev/null 2>&1; then
    print_error "Docker is not installed."
    print_status "Installing Docker..."

    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh

    # Start Docker service
    sudo systemctl start docker
    sudo systemctl enable docker

    print_status "Docker installed and started ✓"
else
    print_status "Docker is already installed ✓"
fi

# Check if Docker is running
if ! sudo docker info >/dev/null 2>&1; then
    print_error "Docker is not running."
    print_status "Starting Docker..."
    sudo systemctl start docker
    sleep 2

    if ! sudo docker info >/dev/null 2>&1; then
        print_error "Failed to start Docker. Please start it manually:"
        print_status "sudo systemctl start docker"
        exit 1
    fi
fi

print_status "Docker is running ✓"

# Build Docker images
print_status "Building Docker images..."
sudo docker build -t skola-pwa:latest .
sudo docker build -t skola-backend:latest ./backend
print_status "Docker images built ✓"

# Create necessary directories
print_status "Setting up directories..."
mkdir -p backend/uploads
mkdir -p backend/logs
sudo chmod 755 backend/uploads
sudo chmod 755 backend/logs
print_status "Directories created ✓"

# Start the PWA services
print_status "Starting PWA services..."
sudo docker-compose -f docker-compose.pwa.yml up -d
print_status "Services started ✓"

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

# Check if services are running
print_status "Checking service status..."
if sudo docker-compose -f docker-compose.pwa.yml ps | grep -q "Up"; then
    print_status "All services are running ✓"
else
    print_warning "Some services may not be running. Checking..."
    sudo docker-compose -f docker-compose.pwa.yml ps
fi

# Test health endpoints
print_status "Testing health endpoints..."
if curl -f http://localhost:3000/health/check >/dev/null 2>&1; then
    print_status "Backend API is healthy ✓"
else
    print_warning "Backend API health check failed"
fi

if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    print_status "PWA frontend is healthy ✓"
else
    print_warning "PWA frontend health check failed"
fi

print_status ""
print_status "🎉 SKOLA PWA SETUP COMPLETE!"
print_status "============================="
echo ""
echo -e "${BLUE}🌐 Your Skola PWA is ready!${NC}"
echo ""
echo -e "${GREEN}📱 Access your PWA:${NC} http://localhost:8080"
echo -e "${GREEN}🔗 Backend API:${NC} http://localhost:3000"
echo -e "${GREEN}📊 Health Check:${NC} http://localhost:3000/health/check"
echo ""

# Check if user wants admin panel
read -p "Do you want to start the database admin panel? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting database admin panel..."
    sudo docker-compose -f docker-compose.pwa.yml --profile with-admin up -d
    echo -e "${GREEN}📊 PgAdmin:${NC} http://localhost:5050"
    echo -e "${YELLOW}   Email: admin@skola.local${NC}"
    echo -e "${YELLOW}   Password: admin123${NC}"
    echo ""
fi

echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Click 'Install Skola' when prompted"
echo "3. Enjoy your installable PWA!"
echo ""

echo -e "${BLUE}🛠️ Management Commands:${NC}"
echo -e "${YELLOW}   View logs: sudo docker-compose -f docker-compose.pwa.yml logs -f${NC}"
echo -e "${YELLOW}   Stop services: sudo docker-compose -f docker-compose.pwa.yml down${NC}"
echo -e "${YELLOW}   Restart: sudo docker-compose -f docker-compose.pwa.yml restart${NC}"
echo ""

echo -e "${GREEN}🎉 Your Skola PWA is now live and installable!${NC}"
echo ""
echo -e "${BLUE}📖 For detailed instructions, see: PWA_SETUP_GUIDE.md${NC}"
