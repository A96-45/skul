#!/bin/bash

# Skola Development Startup Script
# Starts all services for local development

set -e

echo "🚀 Starting Skola Development Environment..."
echo "==========================================="

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

# Check if PostgreSQL is running locally
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    print_error "PostgreSQL is not running locally."
    echo "Please start PostgreSQL:"
    echo "  sudo systemctl start postgresql"
    exit 1
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    print_status "Installing backend dependencies..."
    cd backend && bun install && cd ..
fi

# Start backend in background
print_status "Starting backend server..."
cd backend && bun run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
print_status "Starting frontend..."
npx expo start --tunnel &
FRONTEND_PID=$!

# Wait for services
sleep 5

print_status ""
print_status "🎉 DEVELOPMENT ENVIRONMENT STARTED!"
print_status "==================================="
echo ""
echo -e "${BLUE}Services:${NC}"
echo -e "  🚀 Backend: ${GREEN}http://localhost:3000${NC} (PID: $BACKEND_PID)"
echo -e "  🌐 Frontend: ${GREEN}Expo Dev Server${NC} (PID: $FRONTEND_PID)"
echo -e "  🐘 Database: ${GREEN}PostgreSQL running${NC}"
echo ""
echo -e "${BLUE}Test URLs:${NC}"
echo -e "  📊 Health Check: ${GREEN}http://localhost:3000/health/check${NC}"
echo -e "  📈 Metrics: ${GREEN}http://localhost:3000/health/metrics${NC}"
echo ""
echo -e "${BLUE}Demo Accounts:${NC}"
echo -e "  👨‍🏫 Lecturer: ${YELLOW}jane.smith@university.edu${NC} / ${YELLOW}password${NC}"
echo -e "  🎓 Student: ${YELLOW}john.doe@student.university.edu${NC} / ${YELLOW}password${NC}"
echo ""
echo -e "${BLUE}Stop Development:${NC}"
echo -e "  🛑 Press ${YELLOW}Ctrl+C${NC} or run: ${YELLOW}kill $BACKEND_PID $FRONTEND_PID${NC}"
echo ""
echo -e "${GREEN}🚀 Happy coding! Your Skola development environment is ready!${NC}"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
