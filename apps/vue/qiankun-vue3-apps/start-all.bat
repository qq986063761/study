@echo off
echo Starting qiankun vue3 demo...

start "main" cmd /k "cd main && npm run dev"
timeout /t 3 /nobreak > nul

start "app1" cmd /k "cd app1 && npm run dev"
timeout /t 3 /nobreak > nul

start "app2" cmd /k "cd app2 && npm run dev"

echo All apps are starting.
echo main: http://localhost:5173
echo app1: http://localhost:5174
echo app2: http://localhost:5175
pause
