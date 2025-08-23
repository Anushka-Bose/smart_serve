@echo off
echo Starting Smart Serve Services...
echo.

echo Starting ML API (Food Shelf Life Predictor)...
start "ML API" cmd /k "cd ml_ms && python shelf_life_predictor.py"

echo Waiting 3 seconds for ML API to start...
timeout /t 3 /nobreak > nul

echo Starting Backend Server...
start "Backend" cmd /k "cd last-try-backend && npm run dev"

echo Waiting 5 seconds for Backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services are starting...
echo.
echo ML API: http://localhost:8001
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul 