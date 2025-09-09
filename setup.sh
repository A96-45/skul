#!/bin/bash

# Skola Complete Setup Script
# Supports both local development and Docker deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}🚀 SKOLA SETUP - University Communication Platform${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Main setup function
main_setup() {
    print_header

    # Detect setup mode
    if [ "$1" = "--docker" ] || [ "$1" = "-d" ]; then
        setup_docker
    elif [ "$1" = "--production" ] || [ "$1" = "-p" ]; then
        setup_production
    else
        setup_local
    fi
}

# Local development setup
setup_local() {
    print_status "Setting up for LOCAL DEVELOPMENT..."
    echo ""

    # Check prerequisites
    check_prerequisites

    # Install dependencies
    install_dependencies

    # Setup database
    setup_database_local

    # Create environment file
    setup_environment

    print_success "Local development setup completed!"
    print_next_steps_local
}

# Docker development setup
setup_docker() {
    print_status "Setting up with DOCKER (Development)..."
    echo ""

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed."
        echo "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi

    # Create necessary directories
    create_directories

    # Create environment file
    setup_environment

    print_success "Docker development setup completed!"
    print_next_steps_docker
}

# Production Docker setup
setup_production() {
    print_status "Setting up for PRODUCTION DEPLOYMENT..."
    echo ""

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is required for production deployment."
        exit 1
    fi

    # Create necessary directories
    create_directories

    # Setup production environment
    setup_production_env

    print_success "Production setup completed!"
    print_next_steps_production
}

# Check prerequisites for local development
check_prerequisites() {
    print_status "Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi

    # Check if bun is available (optional but recommended)
    if command -v bun &> /dev/null; then
        print_status "✅ Bun is available (recommended)"
        USE_BUN=true
    else
        print_warning "Bun is not installed. Using npm instead (slower)"
        USE_BUN=false
    fi

    print_status "✅ Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."

    # Install root dependencies
    if [ "$USE_BUN" = true ]; then
        bun install
    else
        npm install
    fi

    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    if [ "$USE_BUN" = true ]; then
        bun install
    else
        npm install
    fi
    cd ..

    print_status "✅ Dependencies installed"
}

# Setup local database
setup_database_local() {
    print_status "Setting up database..."

    cd backend

    # Generate database schema
    print_status "Generating database schema..."
    if [ "$USE_BUN" = true ]; then
        bun run db:generate
    else
        npm run db:generate
    fi

    # Push schema to create database
    print_status "Creating database tables..."
    if [ "$USE_BUN" = true ]; then
        bun run db:push
    else
        npm run db:push
    fi

    cd ..
    print_status "✅ Database setup completed"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."

    mkdir -p backend/uploads
    mkdir -p backend/logs
    mkdir -p nginx/ssl

    # Set proper permissions
    chmod 755 backend/uploads
    chmod 755 backend/logs

    print_status "✅ Directories created"
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."

    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "⚠️  .env file created from .env.example"
        print_warning "   Please edit .env file with your actual configuration values"
        echo ""
        print_warning "   Key settings to update:"
        echo -e "     ${YELLOW}- DATABASE_URL${NC}"
        echo -e "     ${YELLOW}- JWT_SECRET${NC}"
        echo -e "     ${YELLOW}- CORS_ORIGIN${NC}"
    else
        print_status "✅ .env file already exists"
    fi
}

# Setup production environment
setup_production_env() {
    print_status "Setting up production environment..."

    if [ ! -f .env ]; then
        cp .env.example .env.production
        print_warning "⚠️  .env.production file created"
        print_warning "   Please configure production settings in .env.production"
        echo ""
        print_warning "   Important production settings:"
        echo -e "     ${YELLOW}- Strong DATABASE_URL password${NC}"
        echo -e "     ${YELLOW}- Unique JWT_SECRET (64+ characters)${NC}"
        echo -e "     ${YELLOW}- HTTPS CORS_ORIGIN${NC}"
        echo -e "     ${YELLOW}- SSL certificates for HTTPS${NC}"
    else
        print_status "✅ Environment file already exists"
    fi
}

# Print next steps for local development
print_next_steps_local() {
    echo ""
    echo -e "${BLUE}🚀 NEXT STEPS - Local Development:${NC}"
    echo ""
    echo -e "1. ${GREEN}Start Backend API:${NC}"
    echo -e "   cd backend && npm run dev"
    echo ""
    echo -e "2. ${GREEN}Start Frontend (in new terminal):${NC}"
    echo -e "   npm run start"
    echo ""
    echo -e "3. ${GREEN}Access your application:${NC}"
    echo -e "   📱 Frontend: ${PURPLE}http://localhost:8085${NC}"
    echo -e "   🔗 Backend API: ${PURPLE}http://localhost:3000${NC}"
    echo ""
    echo -e "${BLUE}📚 Useful commands:${NC}"
    echo -e "   🗄️  Database Studio: ${YELLOW}npm run db:studio${NC}"
    echo -e "   📊 View logs: ${YELLOW}npm run backend:logs${NC}"
    echo ""
    echo -e "${GREEN}🎉 Happy coding!${NC}"
}

# Print next steps for Docker development
print_next_steps_docker() {
    echo ""
    echo -e "${BLUE}🚀 NEXT STEPS - Docker Development:${NC}"
    echo ""
    echo -e "1. ${GREEN}Start all services:${NC}"
    echo -e "   docker-compose -f docker-compose.dev.yml up -d"
    echo ""
    echo -e "2. ${GREEN}View service status:${NC}"
    echo -e "   docker-compose -f docker-compose.dev.yml ps"
    echo ""
    echo -e "3. ${GREEN}Access your application:${NC}"
    echo -e "   📱 Frontend: ${PURPLE}http://localhost:8085${NC}"
    echo -e "   🔗 Backend API: ${PURPLE}http://localhost:3000${NC}"
    echo -e "   🗄️  PgAdmin: ${PURPLE}http://localhost:5050${NC} (admin@skola.dev / admin123)"
    echo ""
    echo -e "4. ${GREEN}View logs:${NC}"
    echo -e "   docker-compose -f docker-compose.dev.yml logs -f"
    echo ""
    echo -e "${BLUE}📚 Docker commands:${NC}"
    echo -e "   🛑 Stop services: ${YELLOW}docker-compose -f docker-compose.dev.yml down${NC}"
    echo -e "   🔄 Restart: ${YELLOW}docker-compose -f docker-compose.dev.yml restart${NC}"
    echo -e "   🧹 Clean up: ${YELLOW}docker-compose -f docker-compose.dev.yml down -v${NC}"
    echo ""
    echo -e "${GREEN}🎉 Your Skola system is now running with Docker!${NC}"
}

# Print next steps for production
print_next_steps_production() {
    echo ""
    echo -e "${BLUE}🚀 NEXT STEPS - Production Deployment:${NC}"
    echo ""
    echo -e "1. ${GREEN}Deploy with Docker:${NC}"
    echo -e "   ./deploy.sh"
    echo ""
    echo -e "2. ${GREEN}Or deploy manually:${NC}"
    echo -e "   docker-compose up -d --build"
    echo ""
    echo -e "3. ${GREEN}Check service health:${NC}"
    echo -e "   curl http://localhost:3000/health/check"
    echo ""
    echo -e "${BLUE}🔒 Security reminders:${NC}"
    echo -e "   ${YELLOW}• Change default passwords in .env${NC}"
    echo -e "   ${YELLOW}• Use strong JWT secrets${NC}"
    echo -e "   ${YELLOW}• Configure SSL certificates${NC}"
    echo -e "   ${YELLOW}• Restrict CORS origins${NC}"
    echo ""
    echo -e "${GREEN}🎉 Ready for production deployment!${NC}"
}

# Show usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --local, -l       Setup for local development (default)"
    echo "  --docker, -d      Setup with Docker for development"
    echo "  --production, -p  Setup for production deployment"
    echo "  --help, -h        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                 # Local development setup"
    echo "  $0 --docker        # Docker development setup"
    echo "  $0 --production    # Production setup"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_usage
        exit 0
        ;;
    --local|-l|"")
        main_setup "local"
        ;;
    --docker|-d)
        main_setup "docker"
        ;;
    --production|-p)
        main_setup "production"
        ;;
    *)
        print_error "Unknown option: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
