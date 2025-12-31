"""
Admin API Router - 管理后台接口
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import os
import secrets

from ..database import get_db
from ..models import Wish
from ..schemas import AdminStats, MessageResponse, WishListResponse, WishResponse

router = APIRouter(prefix="/api/admin", tags=["admin"])

# 从环境变量读取管理员密码，必须设置！
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
if not ADMIN_PASSWORD:
    print("⚠️  警告: 未设置 ADMIN_PASSWORD 环境变量，管理后台将无法登录！")
    print("   请设置环境变量: ADMIN_PASSWORD=你的密码")
    ADMIN_PASSWORD = None  # 不设置默认值，强制要求配置

# 简单的 token 存储（生产环境建议使用 Redis 或 JWT）
admin_tokens = set()


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: str


@router.post("/login", response_model=LoginResponse)
def admin_login(request: LoginRequest):
    """管理员登录"""
    # 检查是否配置了密码
    if not ADMIN_PASSWORD:
        raise HTTPException(status_code=503, detail="管理后台未配置，请设置 ADMIN_PASSWORD 环境变量")
    
    if request.password == ADMIN_PASSWORD:
        # 生成一个安全的 token
        token = secrets.token_urlsafe(32)
        admin_tokens.add(token)
        return LoginResponse(
            success=True, 
            token=token, 
            message="登录成功"
        )
    raise HTTPException(status_code=401, detail="密码错误")


@router.post("/logout", response_model=MessageResponse)
def admin_logout(x_admin_token: Optional[str] = Header(default=None)):
    """管理员登出"""
    if x_admin_token and x_admin_token in admin_tokens:
        admin_tokens.discard(x_admin_token)
    return MessageResponse(success=True, message="已登出")


def verify_admin(x_admin_token: Optional[str] = Header(default=None)):
    """验证管理员身份"""
    # 支持 token 验证和直接密码验证（向后兼容）
    if x_admin_token in admin_tokens or x_admin_token == ADMIN_PASSWORD:
        return True
    raise HTTPException(status_code=401, detail="需要管理员权限")



@router.get("/stats", response_model=AdminStats)
def get_stats(
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin)
):
    """
    获取统计数据
    """
    # 总祝福数
    total_wishes = db.query(Wish).count()
    
    # 总点赞数
    total_likes = db.query(func.sum(Wish.likes)).scalar() or 0
    
    # 今日祝福数
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    wishes_today = db.query(Wish).filter(Wish.created_at >= today_start).count()
    
    # 按类型统计
    by_tag = {}
    for tag in ["祝福", "回顾", "期许"]:
        count = db.query(Wish).filter(Wish.tag == tag).count()
        by_tag[tag] = count
    
    return AdminStats(
        total_wishes=total_wishes,
        total_likes=total_likes,
        wishes_today=wishes_today,
        by_tag=by_tag
    )


@router.get("/wishes", response_model=WishListResponse)
def get_all_wishes(
    skip: int = 0,
    limit: int = 100,
    include_hidden: bool = True,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin)
):
    """
    获取所有祝福（包括隐藏的）
    """
    query = db.query(Wish)
    if not include_hidden:
        query = query.filter(Wish.is_hidden == False)
    
    total = query.count()
    wishes = query.order_by(Wish.created_at.desc()).offset(skip).limit(limit).all()
    
    wish_responses = [WishResponse.model_validate(w) for w in wishes]
    return WishListResponse(wishes=wish_responses, total=total)


@router.post("/wishes/{wish_id}/hide", response_model=MessageResponse)
def hide_wish(
    wish_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin)
):
    """
    隐藏祝福（不删除）
    """
    wish = db.query(Wish).filter(Wish.id == wish_id).first()
    if not wish:
        raise HTTPException(status_code=404, detail="祝福不存在")
    
    wish.is_hidden = True
    db.commit()
    
    return MessageResponse(success=True, message="已隐藏")


@router.post("/wishes/{wish_id}/show", response_model=MessageResponse)
def show_wish(
    wish_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin)
):
    """
    显示祝福
    """
    wish = db.query(Wish).filter(Wish.id == wish_id).first()
    if not wish:
        raise HTTPException(status_code=404, detail="祝福不存在")
    
    wish.is_hidden = False
    db.commit()
    
    return MessageResponse(success=True, message="已显示")


@router.delete("/wishes/{wish_id}", response_model=MessageResponse)
def admin_delete_wish(
    wish_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin)
):
    """
    管理员删除祝福
    """
    wish = db.query(Wish).filter(Wish.id == wish_id).first()
    if not wish:
        raise HTTPException(status_code=404, detail="祝福不存在")
    
    db.delete(wish)
    db.commit()
    
    return MessageResponse(success=True, message="删除成功")
