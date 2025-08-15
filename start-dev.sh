#!/bin/bash

echo "🚀 Starting Habitat Lobby Development Environment"
echo ""

echo "📧 Starting Email API Backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "⏳ Waiting 3 seconds for backend to start..."
sleep 3

echo "🌐 Starting Frontend Development Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting!"
echo "📧 Email API: http://localhost:3001"
echo "🌐 Frontend: http://localhost:8081 (or check terminal)"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
