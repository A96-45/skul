#!/bin/bash

# Skola Mobile App Build Script
# Generates APK/IPA files for GitHub Releases

set -e

echo "🎓 Building Skola Mobile App for Distribution..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI is not installed. Install with: npm install -g @expo/eas-cli"
    exit 1
fi

# Check if user is logged in to Expo
if ! npx expo whoami &> /dev/null; then
    echo "❌ Not logged in to Expo. Run: npx expo login"
    exit 1
fi

echo "📱 Building for Android (APK)..."
eas build --platform android --profile production

echo "🍎 Building for iOS (IPA)..."
eas build --platform ios --profile production

echo ""
echo "✅ Builds submitted to EAS!"
echo ""
echo "📋 Next steps:"
echo "1. Wait for builds to complete in the EAS dashboard"
echo "2. Download APK/IPA files from build artifacts"
echo "3. Create a new GitHub release"
echo "4. Upload the APK/IPA files to the release"
echo "5. Update README.md with the correct download links"
echo ""
echo "🔗 EAS Dashboard: https://expo.dev/accounts/[your-account]/projects/skola/builds"
