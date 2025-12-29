"""
Wishes API Router - 祝福相关接口
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime, timedelta

from ..database import get_db
from ..models import Wish, RateLimit
from ..schemas import (
    WishCreate, 
    WishResponse, 
    WishListResponse, 
    LikeResponse,
    MessageResponse
)

router = APIRouter(prefix="/api/wishes", tags=["wishes"])

# 速率限制配置（宽松）
RATE_LIMIT_CREATE = 10  # 每小时最多创建10条祝福
RATE_LIMIT_LIKE = 50    # 每小时最多点赞50次
RATE_LIMIT_WINDOW = 3600  # 1小时窗口（秒）


def get_client_id(x_client_id: Optional[str] = Header(default=None)) -> Optional[str]:
    """从请求头获取客户端标识"""
    return x_client_id


def check_rate_limit(db: Session, client_id: str, action: str, limit: int) -> bool:
    """
    检查速率限制
    返回 True 表示允许操作，False 表示超过限制
    """
    if not client_id:
        return True  # 没有 client_id 时不限制
    
    window_start = datetime.utcnow() - timedelta(seconds=RATE_LIMIT_WINDOW)
    count = db.query(RateLimit).filter(
        RateLimit.client_id == client_id,
        RateLimit.action == action,
        RateLimit.created_at >= window_start
    ).count()
    
    return count < limit


def record_action(db: Session, client_id: str, action: str):
    """记录用户操作"""
    if client_id:
        record = RateLimit(client_id=client_id, action=action)
        db.add(record)
        db.commit()


@router.get("", response_model=WishListResponse)
def get_wishes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    client_id: Optional[str] = Depends(get_client_id)
):
    """
    获取祝福列表
    - 按创建时间倒序排列
    - 不显示被隐藏的祝福
    """
    query = db.query(Wish).filter(Wish.is_hidden == False)
    total = query.count()
    wishes = query.order_by(Wish.created_at.desc()).offset(skip).limit(limit).all()
    
    # 标记当前用户的祝福
    wish_responses = []
    for wish in wishes:
        response = WishResponse.model_validate(wish)
        response.is_owner = (client_id and wish.client_id == client_id)
        wish_responses.append(response)
    
    return WishListResponse(wishes=wish_responses, total=total)


@router.post("", response_model=WishResponse)
def create_wish(
    wish_data: WishCreate,
    db: Session = Depends(get_db),
    client_id: Optional[str] = Depends(get_client_id)
):
    """
    创建新祝福
    """
    # 使用请求体中的 client_id 或 header 中的
    effective_client_id = wish_data.client_id or client_id
    
    # 检查速率限制
    if not check_rate_limit(db, effective_client_id, "create", RATE_LIMIT_CREATE):
        raise HTTPException(
            status_code=429, 
            detail="发送太频繁啦，休息一下吧~"
        )
    
    # 验证 tag
    valid_tags = ["祝福", "回顾", "期许"]
    tag = wish_data.tag if wish_data.tag in valid_tags else "祝福"
    
    # 创建祝福
    wish = Wish(
        content=wish_data.content.strip(),
        name=wish_data.name.strip() if wish_data.name else "神秘人",
        tag=tag,
        client_id=effective_client_id,
        likes=0
    )
    db.add(wish)
    db.commit()
    db.refresh(wish)
    
    # 记录操作
    record_action(db, effective_client_id, "create")
    
    response = WishResponse.model_validate(wish)
    response.is_owner = True
    return response


@router.post("/{wish_id}/like", response_model=LikeResponse)
def like_wish(
    wish_id: int,
    db: Session = Depends(get_db),
    client_id: Optional[str] = Depends(get_client_id)
):
    """
    点赞祝福
    """
    wish = db.query(Wish).filter(Wish.id == wish_id).first()
    if not wish:
        raise HTTPException(status_code=404, detail="祝福不存在")
    
    # 检查速率限制（宽松）
    if not check_rate_limit(db, client_id, "like", RATE_LIMIT_LIKE):
        return LikeResponse(
            success=False, 
            likes=wish.likes, 
            message="点赞太频繁啦~"
        )
    
    # 增加点赞数
    wish.likes += 1
    db.commit()
    db.refresh(wish)
    
    # 记录操作
    record_action(db, client_id, "like")
    
    return LikeResponse(success=True, likes=wish.likes, message="点赞成功！")


@router.delete("/{wish_id}", response_model=MessageResponse)
def delete_wish(
    wish_id: int,
    db: Session = Depends(get_db),
    client_id: Optional[str] = Depends(get_client_id)
):
    """
    删除自己的祝福
    """
    wish = db.query(Wish).filter(Wish.id == wish_id).first()
    if not wish:
        raise HTTPException(status_code=404, detail="祝福不存在")
    
    # 验证是否是创建者
    if not client_id or wish.client_id != client_id:
        raise HTTPException(status_code=403, detail="只能删除自己的祝福哦")
    
    db.delete(wish)
    db.commit()
    
    return MessageResponse(success=True, message="删除成功")
