# Lunar Whispers - 新年祝福网站

一个精美的新年祝福共享平台，让人们互相传递温暖与祝福。

## 技术栈

- **后端**: Python 3.10+ / FastAPI / SQLAlchemy / SQLite
- **前端**: React 18 / Vite / Tailwind CSS / Lucide Icons

## 快速开始

### 1. 启动后端

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API 文档: http://localhost:8000/docs

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

访问: http://localhost:5173

## 功能特性

- 🎁 精美的红包开场动画
- 🌌 极光背景 + 金粉粒子效果
- 📝 三种祝福类型：祝福 / 回顾 / 期许
- ❤️ 点赞互动
- 🔐 简单的管理后台
- 📱 移动端响应式设计

## 部署

详见 `docs/deployment.md`
