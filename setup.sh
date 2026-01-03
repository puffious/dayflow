#!/bin/bash

# Setup script - run this after cloning

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed!"
echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Run: ./start.sh"
