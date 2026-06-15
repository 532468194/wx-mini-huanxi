#!/bin/bash
# 欢喜天珠 - 一键启动脚本

echo ""
echo "================================================================"
echo "  欢喜天珠 · HUANXI TIANZHU"
echo "  戴的是气场 · 求的是心安"
echo "================================================================"
echo ""

# Check if node_modules exist, install if not
if [ ! -d "server/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd server && npm install && cd ..
fi

if [ ! -d "web/node_modules" ]; then
    echo "📦 安装前台依赖..."
    cd web && npm install && cd ..
fi

if [ ! -d "admin/node_modules" ]; then
    echo "📦 安装管理后台依赖..."
    cd admin && npm install && cd ..
fi

echo ""
echo "🚀 启动所有服务..."
echo ""

# Start backend
echo "📡 启动后端 API (port: 3001)..."
cd server && npm run dev &
SERVER_PID=$!
cd ..

sleep 2

# Start web frontend
echo "🌐 启动前台网页 (port: 5173)..."
cd web && npm run dev &
WEB_PID=$!
cd ..

# Start admin
echo "🔧 启动管理后台 (port: 5174)..."
cd admin && npm run dev &
ADMIN_PID=$!
cd ..

echo ""
echo "================================================================"
echo "  ✅ 所有服务已启动！"
echo ""
echo "  🌐 前台展示:    http://localhost:5173"
echo "  🔧 管理后台:    http://localhost:5174"
echo "  📡 API 服务:    http://localhost:3001"
echo ""
echo "  🔐 管理员账号:  admin / huanxi2024"
echo "  微信：HUANXITIANZHU | 电话：13188888888"
echo "================================================================"
echo ""
echo "按 Ctrl+C 停止所有服务..."

# Wait for interrupt
trap "kill $SERVER_PID $WEB_PID $ADMIN_PID; exit" INT TERM
wait
