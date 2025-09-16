#!/bin/bash

# Skola University Management System - Desktop Installer
# Run with: curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/skola/main/install.sh | bash
#
# This script installs Skola for universities/institutions who want to run their own instance.
# For mobile users: Download APK/IPA files directly from GitHub Releases.

set -e

echo "🎓 Installing Skola University Management System (Desktop/Server)..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   - Download from: https://docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Desktop."
    exit 1
fi

# Download docker-compose.yml from the release
echo "📥 Downloading application files..."
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/skola/v1.0.0/docker-compose.prod.yml -o docker-compose.yml

# Create necessary directories
mkdir -p uploads logs

# Start the application
echo "🚀 Starting Skola..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Skola is now running!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:8085"
    echo "   API:      http://localhost:3000"
    echo ""
    echo "🛑 To stop: docker-compose down"
    echo "📝 To view logs: docker-compose logs -f"
    echo ""
    echo "📱 For mobile users: Download APK/IPA from https://github.com/YOUR_USERNAME/skola/releases"
else
    echo "❌ Something went wrong. Check logs with: docker-compose logs"
    exit 1
fi
