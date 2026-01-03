#!/bin/bash

echo "🚀 Starting Dayflow HR Management System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if .env exists in backend directory
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "Creating from .env.example..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "✅ Created backend/.env - Please update with your Supabase credentials"
    else
        echo "❌ backend/.env.example not found. Please create backend/.env manually"
        exit 1
    fi
fi

echo "📦 Building and starting containers..."
echo ""

# Build and start containers
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Services are running!"
    echo ""
    echo "📍 Access points:"
    echo "   Frontend:  http://localhost"
    echo "   Backend:   http://localhost:5000"
    echo "   Health:    http://localhost:5000/api/health"
    echo ""
    echo "📊 View logs with: docker-compose logs -f"
    echo "🛑 Stop services with: docker-compose down"
    echo ""
else
    echo ""
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
