@echo off
chcp 65001 >nul
echo 开始启动所有微前端应用...

REM 检查是否已安装依赖
if not exist "main\node_modules" (
    echo 检测到未安装依赖，开始安装...
    call npm run install:all
)

REM 启动所有应用
echo 启动主应用和子应用...
call npm run start:all

pause
