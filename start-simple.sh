#!/bin/bash

# Libre WebUI - Simple Start (without Ollama requirement)
echo "🚀 Starting Libre WebUI (UI only)..."

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start backend
echo "🔧 Starting backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Start frontend  
echo "🔧 Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers started!"
echo "🌐 Frontend: http://localhost:5173"
echo "🌐 Backend:  http://localhost:3001"
echo ""
echo "ℹ️  Note: You'll need Ollama installed and running to chat with models"
echo "   Install Ollama from: https://ollama.ai"
echo "   Then run: ollama serve && ollama pull llama3.2:1b"
echo ""
echo "🛑 To stop: kill $BACKEND_PID $FRONTEND_PID"
