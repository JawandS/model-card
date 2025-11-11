#!/bin/bash

# Model Card Generator - Setup Script
# Automates installation and setup of all dependencies

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Model Card Generator - Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    echo "Please install Node.js and npm first: https://nodejs.org/"
    exit 1
fi

# Display Node and npm versions
echo -e "${BLUE}Node version:${NC} $(node --version)"
echo -e "${BLUE}npm version:${NC} $(npm --version)"
echo ""

# Step 1: Install and build schema package
echo -e "${GREEN}[1/3] Installing schema package dependencies...${NC}"
cd packages/schema
npm install

echo -e "${GREEN}[2/3] Building schema package...${NC}"
npm run build
cd ../..

# Step 2: Install frontend dependencies
echo -e "${GREEN}[3/3] Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

# Step 3: Check for .env.local file
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Configuration Check${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}Note: .env.local file not found${NC}"
    echo ""
    echo "To enable AI assistance features, create frontend/.env.local with:"
    echo "  OPENAI_API_KEY=your-api-key-here"
    echo ""
    echo "See frontend/.env.local.example for reference"
    echo ""
else
    echo -e "${GREEN}✓ .env.local file found${NC}"
    echo ""
fi

# Success message
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo -e "  ${BLUE}1.${NC} Start the development server:"
echo "     ./run.sh"
echo "     or"
echo "     npm run dev"
echo ""
echo -e "  ${BLUE}2.${NC} Open your browser to:"
echo "     http://localhost:3000"
echo ""
echo -e "  ${BLUE}3.${NC} (Optional) Enable AI assistance:"
echo "     Create frontend/.env.local with your OPENAI_API_KEY"
echo ""
echo "For more information, see README.md"
echo ""
