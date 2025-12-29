"""
SQLAlchemy ORM Models
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from .database import Base


class Wish(Base):
    """
    祝福数据模型
    """
    __tablename__ = "wishes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(500), nullable=False)
    name = Column(String(50), default="匿名")
    tag = Column(String(20), default="祝福")  # 祝福 / 回顾 / 期许
    likes = Column(Integer, default=0)
    client_id = Column(String(64), nullable=True)  # 用于标识用户（基于浏览器指纹）
    is_hidden = Column(Boolean, default=False)  # 管理员隐藏
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "name": self.name,
            "tag": self.tag,
            "likes": self.likes,
            "client_id": self.client_id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class RateLimit(Base):
    """
    简单的速率限制记录
    """
    __tablename__ = "rate_limits"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String(64), nullable=False, index=True)
    action = Column(String(20), nullable=False)  # "create" / "like"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
