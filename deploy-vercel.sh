#!/bin/bash

# Quick PWA Deployment to Vercel (Frontend Only)
# Fastest way to get your PWA publicly accessible

set -e

echo "⚡ Deploying Skola PWA to Vercel..."
echo "================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    print_warning "Please login to Vercel:"
    echo "vercel login"
    echo ""
    echo "After logging in, run this script again."
    exit 1
fi

print_success "Vercel CLI ready!"

# Create vercel.json for PWA configuration
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
EOF

# Create environment variables file
cat > .env.production << 'EOF'
# Add your production environment variables here
# REACT_APP_API_URL=https://your-backend-url.com
EOF

print_status "Deploying to Vercel..."
vercel --prod

print_success "Vercel deployment complete!"
echo ""
echo "🎉 Your Skola PWA is now live on Vercel!"
echo ""
echo "📱 Next steps:"
echo "   1. Copy the Vercel URL shown above"
echo "   2. Share it with anyone - works on any device!"
echo "   3. For full functionality, deploy backend separately"
echo ""
echo "🔧 Management:"
echo "   View dashboard: vercel --open"
echo "   View logs: vercel logs"
echo ""
print_warning "Note: This deploys frontend only. For backend, use Azure or Railway deployment."

