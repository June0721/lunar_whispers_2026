# 部署指南

## 第一步：部署后端到 Railway

1. 打开 https://railway.app
2. 使用 GitHub 登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择您的仓库，选择 `backend` 目录
5. Railway 会自动检测并部署
6. 部署成功后，点击 "Settings" → "Networking" → "Generate Domain"
7. 记下生成的域名（如 `xxx.railway.app`）

## 第二步：部署前端到 Vercel

1. 打开 https://vercel.com
2. 使用 GitHub 登录
3. 点击 "New Project" → 导入您的仓库
4. **Root Directory** 设置为 `frontend`
5. 添加环境变量：
   - Name: `VITE_API_URL`
   - Value: `https://您的railway域名/api`
6. 点击 Deploy

## 完成！

部署完成后您会得到一个 Vercel 链接，分享给朋友即可！
