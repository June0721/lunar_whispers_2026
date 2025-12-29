"""
Database configuration for SQLAlchemy
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# 获取当前文件所在目录的上级目录（backend目录）
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'wishes.db')}"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}  # SQLite 需要这个参数
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    数据库会话依赖注入
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
