@echo off
echo Starting Document QA System...
echo.

echo Starting Backend Server...
cd backend
start cmd /k "node server.js"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause
