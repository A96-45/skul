#!/bin/bash

# Skola Application Stop Script
# This script stops all backend and frontend services

echo "🛑 Stopping Skola University Management System..."
echo "================================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Stop Docker containers if available
if command_exists podman; then
    echo "📦 Stopping Podman containers..."
    podman-compose -f docker-compose.dev.yml down --remove-orphans 2>/dev/null || true
elif command_exists docker; then
    echo "📦 Stopping Docker containers..."
    docker-compose -f docker-compose.dev.yml down --remove-orphans 2>/dev/null || true
fi

# Stop local processes
echo "🔧 Stopping local processes..."

# Stop backend processes
if pgrep -f "bun.*hono.ts" >/dev/null; then
    echo "🛑 Stopping backend (bun)..."
    pkill -f "bun.*hono.ts" 2>/dev/null || true
fi

if pgrep -f "node.*hono.ts" >/dev/null; then
    echo "🛑 Stopping backend (node)..."
    pkill -f "node.*hono.ts" 2>/dev/null || true
fi

# Stop frontend processes
if pgrep -f "expo.*start" >/dev/null; then
    echo "🛑 Stopping frontend (expo)..."
    pkill -f "expo.*start" 2>/dev/null || true
fi

# Stop any remaining bun processes
if pgrep -f "bun" >/dev/null; then
    echo "🛑 Stopping remaining bun processes..."
    pkill -f "bun" 2>/dev/null || true
fi

# Wait a moment for processes to stop
sleep 2

# Check if any processes are still running
RUNNING_PROCESSES=$(ps aux | grep -E "(bun|expo)" | grep -v grep | wc -l)

if [ "$RUNNING_PROCESSES" -eq 0 ]; then
    echo ""
    echo "✅ All Skola services stopped successfully!"
    echo "==========================================="
    echo "🧹 Cleaned up:"
    echo "   • Backend services"
    echo "   • Frontend services"
    echo "   • Docker containers (if running)"
    echo ""
    echo "🎉 Ready to restart with: ./start.sh"
else
    echo ""
    echo "⚠️  Some processes may still be running:"
    ps aux | grep -E "(bun|expo)" | grep -v grep
    echo ""
    echo "💡 Manual cleanup:"
    echo "   Kill all: pkill -9 -f 'bun\|expo'"
fi
