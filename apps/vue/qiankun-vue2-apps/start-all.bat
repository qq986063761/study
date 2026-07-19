@echo off
echo 启动微前端应用...

start "主应用" cmd /k "cd main && npm run serve"
timeout /t 3 /nobreak > nul

start "子应用1" cmd /k "cd child1 && npm run serve"
timeout /t 3 /nobreak > nul

start "子应用2" cmd /k "cd child2 && npm run serve"

echo 所有应用启动完成！
echo 主应用: http://localhost:8080
echo 子应用1: http://localhost:8081  
echo 子应用2: http://localhost:8082
pause
