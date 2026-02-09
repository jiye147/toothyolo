@echo off
echo Starting Frontend Server...
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API is running at: http://localhost:8000
echo.
python -m http.server 3000
