#!/bin/bash

# Script to run frontend and backend together

echo "Starting frontend and backend..."

# Start backend in background
echo "Starting backend..."
(cd backend && go run ./cmd/server) &
BACKEND_PID=$!

# Start frontend in background
echo "Starting frontend..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

# Function to kill processes on exit
cleanup() {
    echo "Stopping all processes..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up trap to catch Ctrl+C and other signals
trap cleanup SIGINT SIGTERM

echo "Frontend running on http://localhost:3000"
echo "Backend API (Go)    : http://localhost:8080"
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait

#testing config new email