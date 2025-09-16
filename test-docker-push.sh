#!/bin/bash

# Test Docker Push to Docker Hub
# This script tests the Docker build and push process locally

set -e

echo "🧪 Testing Docker Push to Docker Hub"
echo "==================================="

# Check if Docker access token is provided
if [ -z "$DOCKER_ACCESS_TOKEN" ]; then
    echo "❌ DOCKER_ACCESS_TOKEN environment variable not set"
    echo "   Please set it with: export DOCKER_ACCESS_TOKEN=your_token_here"
    exit 1
fi

# Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo "$DOCKER_ACCESS_TOKEN" | docker login -u a96-45 --password-stdin

# Build and push backend
echo "🏗️  Building and pushing backend image..."
docker build -f backend/Dockerfile -t a96-45-skola-backend:test ./backend
docker push a96-45-skola-backend:test

# Build and push frontend
echo "🏗️  Building and pushing frontend image..."
docker build -f Dockerfile.frontend -t a96-45-skola-frontend:test .
docker push a96-45-skola-frontend:test

echo ""
echo "✅ Docker images pushed successfully!"
echo ""
echo "📋 Verify on Docker Hub:"
echo "   Backend:  https://hub.docker.com/r/a96-45/skola-backend/tags"
echo "   Frontend: https://hub.docker.com/r/a96-45/skola-frontend/tags"
echo ""
echo "🔄 For production deployment:"
echo "   1. Set DOCKER_ACCESS_TOKEN secret in GitHub: https://github.com/A96-45/skul/settings/secrets/actions"
echo "   2. Go to GitHub Actions → Docker Build → Run workflow"
echo "   3. Or create a new release to trigger automatic builds"
echo ""
echo "🚀 Ready for automated deployment!"
