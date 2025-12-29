"""
Pydantic Schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class WishCreate(BaseModel):
    """创建祝福的请求体"""
    content: str = Field(..., min_length=1, max_length=500, description="祝福内容")
    name: Optional[str] = Field(default="神秘人", max_length=50, description="署名")
    tag: str = Field(default="祝福", description="类型: 祝福/回顾/期许")
    client_id: Optional[str] = Field(default=None, max_length=64, description="客户端标识")


class WishResponse(BaseModel):
    """祝福响应"""
    id: int
    content: str
    name: str
    tag: str
    likes: int
    client_id: Optional[str] = None
    created_at: Optional[datetime] = None
    is_owner: bool = False  # 是否是当前用户创建的

    class Config:
        from_attributes = True


class WishListResponse(BaseModel):
    """祝福列表响应"""
    wishes: list[WishResponse]
    total: int


class LikeResponse(BaseModel):
    """点赞响应"""
    success: bool
    likes: int
    message: str = ""


class AdminStats(BaseModel):
    """管理员统计数据"""
    total_wishes: int
    total_likes: int
    wishes_today: int
    by_tag: dict


class MessageResponse(BaseModel):
    """通用消息响应"""
    success: bool
    message: str
