@echo off
chcp 65001 >nul
title 欢喜天珠 - 系统启动

echo.
echo ================================================================
echo   欢喜天珠 · HUANXI TIANZHU
echo   戴的是气场 · 求的是心安
echo ================================================================
echo.

:: Install dependencies if needed
if not exist "server\node_modules" (
    echo 安装后端依赖...
    cd server && npm install && cd ..
)
if not exist "web\node_modules" (
    echo 安装前台依赖...
    cd web && npm install && cd ..
)
if not exist "admin\node_modules" (
    echo 安装管理后台依赖...
    cd admin && npm install && cd ..
)

echo.
echo 启动所有服务...
echo.

:: Start backend in new window
start "欢喜-后端API" cmd /k "cd /d %~dp0server && npm run dev"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start web frontend in new window
start "欢喜-前台" cmd /k "cd /d %~dp0web && npm run dev"

:: Start admin in new window
start "欢喜-管理后台" cmd /k "cd /d %~dp0admin && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ================================================================
echo   所有服务已启动！
echo.
echo   前台展示:    http://localhost:5173
echo   管理后台:    http://localhost:5174
echo   API 服务:    http://localhost:3001
echo.
echo   管理员账号:  admin / huanxi2024
echo   微信：HUANXITIANZHU   电话：13188888888
echo ================================================================
echo.

start http://localhost:5173

pause
