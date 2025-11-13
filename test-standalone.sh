#!/bin/bash
# test-standalone.sh - Test the standalone build (Railway-style)
# This script replicates how Railway deploys and runs the application

set -e

echo "=========================================="
echo "🧪 Testing Standalone Build (Railway Mode)"
echo "=========================================="
echo ""

# Build schema package
echo "📦 Step 1/5: Building schema package..."
cd packages/schema
if [ ! -d "node_modules" ]; then
  echo "   Installing schema dependencies..."
  npm install
fi
npm run build
echo "   ✓ Schema built successfully"
echo ""

# Install frontend dependencies
cd ../../frontend
echo "📦 Step 2/5: Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
  npm install
else
  echo "   ✓ Dependencies already installed"
fi
echo ""

# Build Next.js with standalone output
echo "🏗️  Step 3/5: Building Next.js application (standalone mode)..."
npm run build
echo ""

# Verify standalone build exists
echo "🔍 Step 4/5: Verifying standalone build..."
if [ ! -f ".next/standalone/server.js" ]; then
  echo "❌ ERROR: Standalone build not found!"
  echo "   Check that next.config.js has: output: 'standalone'"
  exit 1
fi
echo "   ✓ Standalone server found at: frontend/.next/standalone/server.js"
echo ""

# Start the standalone server (Railway-style)
echo "=========================================="
echo "🚀 Step 5/5: Starting standalone server"
echo "=========================================="
echo ""
echo "📍 This is EXACTLY how Railway runs your app"
echo "   Command: node server.js"
echo "   Port: 3000"
echo "   Press Ctrl+C to stop"
echo ""

cd .next/standalone
NODE_ENV=production PORT=3000 HOSTNAME="0.0.0.0" node server.js
