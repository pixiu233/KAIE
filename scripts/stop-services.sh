#!/bin/zsh

# ============================================
# KAIE 服务关闭脚本
# ============================================

echo "🚀 关闭 KAIE 所有服务..."

# 关闭后端 API
echo "🔄 关闭后端 API..."
if lsof -i :3000 > /dev/null 2>&1; then
    API_PID=$(lsof -t -i :3000)
    kill $API_PID 2>/dev/null || true
    echo "✅ 后端 API 已关闭 (PID: $API_PID)"
else
    echo "ℹ️  后端 API 未运行"
fi

# 关闭前端
echo "🔄 关闭前端..."
if lsof -i :5173 > /dev/null 2>&1; then
    FRONTEND_PID=$(lsof -t -i :5173)
    kill $FRONTEND_PID 2>/dev/null || true
    echo "✅ 前端已关闭 (PID: $FRONTEND_PID)"
else
    echo "ℹ️  前端未运行"
fi

# 关闭 Redis
echo "🔄 关闭 Redis..."
if brew services list | grep -q "redis started"; then
    brew services stop redis
    echo "✅ Redis 已关闭"
else
    echo "ℹ️  Redis 未运行"
fi

# 关闭 PostgreSQL
echo "🔄 关闭 PostgreSQL..."
if brew services list | grep -q "postgresql@15 started"; then
    brew services stop postgresql@15
    echo "✅ PostgreSQL 已关闭"
else
    echo "ℹ️  PostgreSQL 未运行"
fi

echo ""
echo "🎉 所有服务已关闭！"

