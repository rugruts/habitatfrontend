@echo off
echo 🚀 Starting Habitat Lobby Development Environment
echo.

echo 📧 Starting Email API Backend...
cd backend
start "Email API Backend" cmd /k "npm run dev"
cd ..

echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo 🌐 Starting Frontend Development Server...
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo 📧 Email API: http://localhost:3001
echo 🌐 Frontend: http://localhost:8081 (or check terminal)
echo.
echo Press any key to exit...
pause > nul
