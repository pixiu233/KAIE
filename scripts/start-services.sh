#!/bin/zsh

# ============================================
# KAIE 全服务启动脚本
# ============================================

set -e

echo "🚀 启动 KAIE 所有服务..."
echo ""

# PostgreSQL
echo "📦 启动 PostgreSQL..."
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

if brew services list | grep -q "postgresql@15 started"; then
    echo "✅ PostgreSQL 已启动"
else
    brew services start postgresql@15
    echo "✅ PostgreSQL 启动完成"
fi

# 显示 PostgreSQL 日志
echo ""
echo "📋 PostgreSQL 日志 (实时):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
tail -f /opt/homebrew/var/log/postgresql@15/postgresql-*.log 2>/dev/null &
PG_LOG_PID=$!
echo "   (日志 PID: $PG_LOG_PID)"

# Redis
echo ""
echo "📦 启动 Redis..."

if brew services list | grep -q "redis started"; then
    echo "✅ Redis 已启动"
else
    brew services start redis
    echo "✅ Redis 启动完成"
fi

# 验证 Redis 连接
echo ""
echo "🔍 验证 Redis 连接..."
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis 连接正常 (PONG)"
else
    echo "⚠️  Redis 连接失败"
fi

# 验证 PostgreSQL 连接
echo ""
echo "🔍 验证 PostgreSQL 连接..."
if psql -U songsikai -d kaie -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ PostgreSQL 连接正常"
else
    echo "⚠️  PostgreSQL 连接失败"
fi

# 启动后端 API
echo ""
echo "🚀 启动后端 API..."
cd /Users/songsikai/Desktop/work/KAIE/apps/api

# 检查是否已在运行
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  端口 3000 已被占用，跳过启动"
else
    # 在后台启动
    export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
    export https_proxy="http://127.0.0.1:7897"
    export http_proxy="http://127.0.0.1:7897"
    pnpm start:dev &
    API_PID=$!
    echo "✅ 后端 API 已在后台启动 (PID: $API_PID)"
fi

# 启动前端
echo ""
echo "🚀 启动前端..."
cd /Users/songsikai/Desktop/work/KAIE/apps/desktop

# 检查是否已在运行
if lsof -i :5173 > /dev/null 2>&1; then
    echo "⚠️  端口 5173 已被占用，跳过启动"
else
    # 在后台启动
    export https_proxy="http://127.0.0.1:7897"
    export http_proxy="http://127.0.0.1:7897"
    pnpm run dev:vite &
    FRONTEND_PID=$!
    echo "✅ 前端已在后台启动 (PID: $FRONTEND_PID)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 所有服务启动完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 访问地址："
echo "   🌐 前端:     http://localhost:5173"
echo "   🔧 API:      http://localhost:3000"
echo "   📚 Swagger:  http://localhost:3000/docs"
echo ""
echo "💡 查看后端日志："
echo "   tail -f /Users/songsikai/Desktop/work/KAIE/apps/api/logs/app.log"
echo ""
echo "🛑 停止日志查看: ctrl+c"
echo ""

# 等待用户中断
wait
