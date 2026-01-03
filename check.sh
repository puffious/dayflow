#!/bin/bash

# Pre-deployment checklist

echo "🔍 Dayflow HRMS - Pre-Deployment Checklist"
echo "=========================================="
echo ""

errors=0

# Check Docker
echo "✓ Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    ((errors++))
else
    echo "✅ Docker installed"
fi

# Check Docker Compose
echo "✓ Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not installed"
    ((errors++))
else
    echo "✅ Docker Compose installed"
fi

# Check backend files
echo "✓ Checking backend structure..."
if [ ! -f "backend/package.json" ]; then
    echo "❌ backend/package.json missing"
    ((errors++))
else
    echo "✅ Backend package.json exists"
fi

if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env missing - copy from .env.example"
    ((errors++))
else
    echo "✅ Backend .env configured"
fi

if [ ! -f "backend/index.js" ]; then
    echo "❌ backend/index.js missing"
    ((errors++))
else
    echo "✅ Backend entry point exists"
fi

# Check frontend files
echo "✓ Checking frontend structure..."
if [ ! -f "frontend/package.json" ]; then
    echo "❌ frontend/package.json missing"
    ((errors++))
else
    echo "✅ Frontend package.json exists"
fi

if [ ! -f "frontend/vite.config.ts" ]; then
    echo "❌ frontend/vite.config.ts missing"
    ((errors++))
else
    echo "✅ Frontend vite config exists"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env missing - will use .env.example"
else
    echo "✅ Frontend .env configured"
fi

# Check Docker files
echo "✓ Checking Docker configuration..."
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml missing"
    ((errors++))
else
    echo "✅ docker-compose.yml exists"
fi

if [ ! -f "backend/Dockerfile" ]; then
    echo "❌ backend/Dockerfile missing"
    ((errors++))
else
    echo "✅ Backend Dockerfile exists"
fi

if [ ! -f "frontend/Dockerfile" ]; then
    echo "❌ frontend/Dockerfile missing"
    ((errors++))
else
    echo "✅ Frontend Dockerfile exists"
fi

if [ ! -f "frontend/nginx.conf" ]; then
    echo "❌ frontend/nginx.conf missing"
    ((errors++))
else
    echo "✅ Nginx config exists"
fi

# Check documentation
echo "✓ Checking documentation..."
if [ ! -f "README.md" ]; then
    echo "⚠️  README.md missing"
else
    echo "✅ README.md exists"
fi

if [ ! -f "DEPLOYMENT.md" ]; then
    echo "⚠️  DEPLOYMENT.md missing"
else
    echo "✅ DEPLOYMENT.md exists"
fi

echo ""
echo "=========================================="
if [ $errors -eq 0 ]; then
    echo "✅ All checks passed! Ready to deploy."
    echo ""
    echo "Run: ./start.sh"
    exit 0
else
    echo "❌ Found $errors error(s). Please fix and try again."
    exit 1
fi
