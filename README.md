# 🌙 Lunar Whispers - 新年祝福网站

一个精美的新年祝福共享平台，让人们互相传递温暖与祝福。

> *"Keep the warmth, pass it on."*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10+-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

## ✨ 功能特性

- 🎁 精美的红包开场动画 + 随机签文
- 🌌 极光背景 + 金粉粒子效果
- 📝 三种祝福类型：祝福 / 回顾 / 期许
- ❤️ 点赞互动
- 🔐 管理后台（隐藏/删除祝福、统计数据）
- 📱 移动端响应式设计
- 🛡️ 请求频率限制

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| **后端** | Python 3.10+ / FastAPI / SQLAlchemy / SQLite |
| **前端** | React 18 / Vite / Tailwind CSS / Lucide Icons |

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/June0721/lunar_whispers_2026.git
cd lunar_whispers_2026
```

### 2. 启动后端

```bash
cd backend
pip install -r requirements.txt

# 设置管理员密码（必须！）
# Windows PowerShell:
$env:ADMIN_PASSWORD="你的密码"; uvicorn app.main:app --host 0.0.0.0 --port 8000

# Linux/Mac:
ADMIN_PASSWORD="你的密码" uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API 文档: http://localhost:8000/docs

### 3. 启动前端（开发模式）

```bash
cd frontend
npm install
npm run dev
```

访问: http://localhost:5173

## 📦 生产部署

### 构建前端

```bash
cd frontend
npm run build
```

### 复制到后端静态目录

```bash
# Windows PowerShell
Remove-Item -Path "backend/static/*" -Recurse -Force
Copy-Item -Path "frontend/dist/*" -Destination "backend/static/" -Recurse

# Linux/Mac
rm -rf backend/static/*
cp -r frontend/dist/* backend/static/
```

### 启动生产服务

```bash
cd backend
ADMIN_PASSWORD="你的安全密码" uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

然后只需访问 http://localhost:8000 即可。

## ⚙️ 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `ADMIN_PASSWORD` | 管理后台登录密码 | ✅ 是 |

## 📁 项目结构

```
lunar-whispers/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI 入口
│   │   ├── models.py        # 数据模型
│   │   ├── schemas.py       # API Schema
│   │   ├── database.py      # 数据库配置
│   │   └── routers/
│   │       ├── wishes.py    # 祝福 API
│   │       └── admin.py     # 管理 API
│   ├── static/              # 前端构建产物
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # 主组件
│   │   └── components/      # UI 组件
│   └── package.json
└── README.md
```

## 🔧 API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/wishes` | 获取祝福列表 |
| POST | `/api/wishes` | 创建祝福 |
| POST | `/api/wishes/{id}/like` | 点赞 |
| DELETE | `/api/wishes/{id}` | 删除（仅创建者） |
| POST | `/api/admin/login` | 管理员登录 |
| GET | `/api/admin/stats` | 统计数据 |

## 📝 频率限制

- 创建祝福: 30 条/小时
- 点赞: 200 次/小时

## 🌐 宝塔面板部署

1. 安装 Nginx + Python项目管理器
2. 创建网站并绑定域名
3. 终端执行 `git clone` 拉取代码
4. Python项目管理器添加项目，设置 `ADMIN_PASSWORD` 环境变量
5. 配置 Nginx 反向代理

详细步骤请参考项目文档。

## 📄 开源协议

MIT License © 2026 Apocania
