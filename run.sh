#!/bin/bash
set -e

echo "🚀 Starting Healthcare Model Card Generator..."

# Check if schema package is built
if [ ! -d "packages/schema/dist" ]; then
  echo "📦 Schema package not built. Building..."
  cd packages/schema
  npm install
  npm run build
  cd ../..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
  echo "📥 Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
fi

# Start dev server
echo "🎨 Starting development server..."
cd frontend
npm run dev
