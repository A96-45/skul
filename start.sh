#!/bin/bash

# Skola Application Startup Script
# This script starts both backend and frontend services

echo "🚀 Starting Skola University Management System..."
echo "=================================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker/Podman is available
if command_exists podman; then
    DOCKER_CMD="podman"
    COMPOSE_CMD="podman-compose"
elif command_exists docker; then
    DOCKER_CMD="docker"
    COMPOSE_CMD="docker-compose"
else
    echo "⚠️  Docker not found. Using local development mode..."
    DOCKER_AVAILABLE=false
fi

# Choose startup mode
if [ "$DOCKER_AVAILABLE" = false ]; then
    echo "🏠 Using LOCAL DEVELOPMENT MODE"
    echo "==============================="

    # Check if ports are in use and free them
    echo "🔍 Checking for port conflicts..."
    if lsof -i :3000 >/dev/null 2>&1; then
        echo "⚠️  Port 3000 is in use. Stopping conflicting processes..."
        pkill -f "node.*server.js" 2>/dev/null || true
        pkill -f "node.*hono.ts" 2>/dev/null || true
    fi

    if lsof -i :8085 >/dev/null 2>&1; then
        echo "⚠️  Port 8085 is in use. Stopping conflicting processes..."
        pkill -f "expo.*start" 2>/dev/null || true
    fi

    # Wait a moment for processes to stop
    sleep 2

    echo "🔧 Starting Backend Service..."
    cd backend && bun run dev &
    BACKEND_PID=$!

    echo "🌐 Starting Frontend Service..."
    cd .. && npx expo start --tunnel &
    FRONTEND_PID=$!

    # Wait for services to start
    sleep 5

    echo ""
    echo "✅ Skola Application Started Successfully!"
    echo "=========================================="
    echo "🔧 Backend: Running (PID: $BACKEND_PID)"
    echo "🌐 Frontend: Running (PID: $FRONTEND_PID)"
    echo ""
    echo "📱 Mobile Testing:"
    echo "   1. Install Expo Go app on your phone"
    echo "   2. Look for QR code in terminal above"
    echo "   3. Scan QR code with Expo Go"
    echo ""
    echo "🌐 Web Access:"
    echo "   Frontend: Check terminal for tunnel URL"
    echo "   Backend:  http://localhost:3000"
    echo ""
    echo "🛠️  Development Commands:"
    echo "   Stop all:    pkill -f 'bun\|expo'"
    echo "   Backend logs: Check backend terminal"
    echo "   Frontend logs: Check expo terminal"
    echo ""
    echo "🎉 Your university management system is ready!"
    echo ""
    echo "Press Ctrl+C to stop all services..."

    # Wait for user to stop
    wait $BACKEND_PID $FRONTEND_PID

else
    echo "📦 Using $DOCKER_CMD for containerization"

    # Stop any existing containers
    echo "🧹 Cleaning up existing containers..."
    $COMPOSE_CMD -f docker-compose.dev.yml down --remove-orphans 2>/dev/null || true

    # Check if ports are in use and free them
    echo "🔍 Checking for port conflicts..."
    if lsof -i :3000 >/dev/null 2>&1; then
        echo "⚠️  Port 3000 is in use. Stopping conflicting processes..."
        pkill -f "node.*server.js" 2>/dev/null || true
        pkill -f "node.*hono.ts" 2>/dev/null || true
    fi

    if lsof -i :8085 >/dev/null 2>&1; then
        echo "⚠️  Port 8085 is in use. Stopping conflicting processes..."
        pkill -f "expo.*start" 2>/dev/null || true
    fi

    # Wait a moment for processes to stop
    sleep 2

    # Start the application
    echo "🏗️  Building and starting containers..."
    $COMPOSE_CMD -f docker-compose.dev.yml up -d --build

    # Check if containers started successfully
    sleep 5
    if $COMPOSE_CMD -f docker-compose.dev.yml ps | grep -q "Up"; then
        echo ""
        echo "✅ Skola Application Started Successfully!"
        echo "=========================================="
        echo "🌐 Frontend (Web):    http://localhost:8085"
        echo "🔧 Backend API:       http://localhost:3000"
        echo "📊 Database:          SQLite (persistent)"
        echo ""
        echo "📱 Mobile Testing:"
        echo "   1. Install Expo Go app on your phone"
        echo "   2. Run: npx expo start --tunnel"
        echo "   3. Scan QR code with Expo Go"
        echo ""
        echo "🛠️  Development Commands:"
        echo "   View logs:    $COMPOSE_CMD -f docker-compose.dev.yml logs -f"
        echo "   Stop app:    $COMPOSE_CMD -f docker-compose.dev.yml down"
        echo "   Restart:     $COMPOSE_CMD -f docker-compose.dev.yml restart"
        echo ""
        echo "🎉 Your university management system is ready!"
    else
        echo ""
        echo "⚠️  Docker containers had issues, switching to local mode..."
        echo "=========================================================="

        # Fallback to local mode
        echo "🔧 Starting Backend Service..."
        cd backend && npm run dev &
        BACKEND_PID=$!

        echo "🌐 Starting Frontend Service..."
        cd .. && npx expo start --tunnel &
        FRONTEND_PID=$!

        sleep 5

        echo ""
        echo "✅ Skola Application Started Successfully (Local Mode)!"
        echo "======================================================"
        echo "🔧 Backend: Running (PID: $BACKEND_PID)"
        echo "🌐 Frontend: Running (PID: $FRONTEND_PID)"
        echo ""
        echo "📱 Mobile Testing:"
        echo "   1. Install Expo Go app on your phone"
        echo "   2. Look for QR code in terminal above"
        echo "   3. Scan QR code with Expo Go"
        echo ""
        echo "🎉 Your university management system is ready!"
        echo ""
        echo "Press Ctrl+C to stop all services..."

        wait $BACKEND_PID $FRONTEND_PID
    fi
fi
