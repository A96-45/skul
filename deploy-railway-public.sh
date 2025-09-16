#!/bin/bash

# Skola PWA Deployment to Railway (Public Access)
# Alternative to Azure - deploys to Railway for global access

set -e

echo "🚂 Deploying Skola PWA to Railway..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_status "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
if ! railway whoami &> /dev/null; then
    print_warning "Please login to Railway:"
    echo "railway login"
    echo ""
    echo "After logging in, run this script again."
    exit 1
fi

print_success "Railway CLI ready!"

# Initialize Railway project
print_status "Initializing Railway project..."
railway init --name "skola-pwa"

# Add PostgreSQL database
print_status "Adding PostgreSQL database..."
railway add postgresql

# Deploy backend
print_status "Deploying backend..."
cd backend
railway deploy --service backend
cd ..

# Build PWA for production
print_status "Building PWA for production..."
npm run build

# Deploy PWA frontend
print_status "Deploying PWA frontend..."
railway add --name frontend
railway deploy --service frontend --build-command "npm run build" --start-command "npx serve dist -l 3000"

# Get deployment URLs
print_status "Getting deployment information..."
railway domain

print_success "Railway deployment complete!"
echo ""
echo "🎉 Your Skola PWA is now live on Railway!"
echo ""
echo "📱 Access your app:"
echo "   🌐 Visit the Railway domain shown above"
echo "   📱 Works on any device - desktop, tablet, mobile"
echo ""
echo "🔧 Management:"
echo "   View logs: railway logs"
echo "   Open dashboard: railway open"
echo "   View services: railway services"

