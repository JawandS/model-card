#!/bin/bash
set -e

echo "🏗️  Building Healthcare Model Card Generator..."

# Build schema package
echo "📦 Building schema package..."
cd packages/schema
npm install
npm run build
cd ../..

# Build frontend
echo "🎨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build complete!"
