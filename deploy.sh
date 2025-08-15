#!/bin/bash

# Habitat Lobby Deployment Script for Hostinger
echo "🚀 Starting Habitat Lobby deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🔧 Building for production..."
npm run build

echo "📁 Build completed! Files are in the 'dist' directory."
echo ""
echo "📋 Next steps for Hostinger deployment:"
echo "1. Upload all files from the 'dist' directory to your Hostinger public_html folder"
echo "2. Make sure .htaccess file is uploaded to handle routing"
echo "3. Update your domain in .env.production file"
echo "4. Test your site at your domain"
echo ""
echo "✅ Build ready for deployment!"

# Optional: Create a zip file for easy upload
if command -v zip &> /dev/null; then
    echo "📦 Creating deployment zip file..."
    cd dist
    zip -r ../habitat-lobby-deployment.zip .
    cd ..
    echo "✅ Created habitat-lobby-deployment.zip for easy upload"
fi
