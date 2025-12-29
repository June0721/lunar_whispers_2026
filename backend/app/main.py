"""
Lunar Whispers - FastAPI 主应用
新年祝福网站后端服务
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from pathlib import Path
import os

from .database import engine, Base
from .routers import wishes, admin

# 静态文件目录（前端打包后的文件放这里）
STATIC_DIR = Path(__file__).parent.parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时创建数据库表
    Base.metadata.create_all(bind=engine)
    print("✨ Lunar Whispers API 启动成功!")
    print("📝 API 文档: http://localhost:8000/docs")
    
    # 检查是否存在静态文件目录
    if STATIC_DIR.exists():
        print(f"📁 静态文件目录: {STATIC_DIR}")
    else:
        print("⚠️  未找到静态文件目录，仅提供 API 服务")
    
    yield
    # 关闭时的清理工作（如有需要）
    print("👋 服务已停止")


app = FastAPI(
    title="Lunar Whispers API",
    description="新年祝福网站后端服务 - 让温暖传递",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 配置 - 允许前端跨域请求
# 生产环境可通过环境变量 CORS_ORIGINS 设置允许的域名
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册 API 路由（必须在静态文件之前）
app.include_router(wishes.router)
app.include_router(admin.router)


@app.get("/health")
def health_check():
    """健康检查端点"""
    return {"status": "healthy"}


# 静态文件托管（如果存在 static 目录）
if STATIC_DIR.exists():
    # 挂载静态资源（css, js, images 等）
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")
    
    # 处理根路径和所有其他路径（SPA fallback）
    @app.get("/")
    @app.get("/{path:path}")
    async def serve_spa(request: Request, path: str = ""):
        """SPA 路由 - 所有非 API 请求返回 index.html"""
        # 如果请求的是 API 路径，跳过（已经被上面的路由处理了）
        if path.startswith("api/") or path == "health":
            return None
        
        # 尝试返回静态文件
        file_path = STATIC_DIR / path
        if file_path.is_file():
            return FileResponse(file_path)
        
        # 默认返回 index.html（SPA 路由）
        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        
        return {"error": "Not found"}
else:
    # 没有静态文件时的根路径
    @app.get("/")
    def root():
        """根路径 - 服务健康检查"""
        return {
            "name": "Lunar Whispers API",
            "version": "1.0.0",
            "status": "running",
            "message": "🎊 新年快乐！祝福传递中..."
        }
