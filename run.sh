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

# Kill any process running on port 3000
echo "🔍 Checking for processes on port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "⚠️  Killing existing process on port 3000..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
  sleep 1
else
  echo "✅ Port 3000 is available"
fi

# Start dev server
echo "🎨 Starting development server..."
cd frontend
npm run dev
