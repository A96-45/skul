#!/bin/bash

echo "🚀 Setting up Skola - University Communication Platform"
echo "===================================================="

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first:"
    echo "curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "📦 Installing root dependencies..."
bun install

echo "📦 Setting up backend..."
cd backend
bun install

echo "🗄️ Setting up database..."
# Generate database schema
bun run db:generate

# Push schema to create database
bun run db:push

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Start Backend API (Terminal 1):"
echo "   cd backend && bun run dev"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   bun run start"
echo ""
echo "📱 Frontend will be available at: http://localhost:8085"
echo "🔗 Backend API will be available at: http://localhost:3001"
echo ""
echo "🎉 Happy coding!"
