# 一键部署指南

本指南提供详细的步骤和截图说明，帮助你快速部署到公网。

## 📋 前置检查清单

- [x] 代码已推送到GitHub
- [ ] GitHub账号已创建
- [ ] Vercel账号已创建
- [ ] Render账号已创建
- [ ] 浏览器已打开

## 🌐 步骤1: 部署前端到Vercel

### 1.1 打开Vercel

**操作步骤**:
1. 打开浏览器（Chrome、Firefox、Edge等）
2. 访问 https://vercel.com
3. 点击右上角的 "Sign Up" 或 "Log In"

### 1.2 登录Vercel

**操作步骤**:
1. 点击 "Continue with GitHub"
2. GitHub会要求授权Vercel访问你的仓库
3. 点击 "Authorize Vercel"
4. 等待跳转回Vercel页面

**预期结果**:
- ✅ 成功登录到Vercel
- ✅ 看到你的GitHub仓库列表

### 1.3 创建新项目

**操作步骤**:
1. 点击 "Add New Project" 按钮（页面顶部）
2. 在 "Import Git Repository" 部分
3. 找到并选择 `jiye147/toothyolo` 仓库
4. 点击 "Import" 按钮

### 1.4 配置项目设置

**操作步骤**:
在项目配置页面，填写以下信息：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Project Name** | toothyolo-frontend | 项目名称 |
| **Framework Preset** | Other | 不使用框架 |
| **Root Directory** | frontend | 前端代码目录 |
| **Build Command** | （留空） | 不需要构建命令 |
| **Output Directory** | （留空） | 输出目录 |

**重要提示**:
- 确保 "Root Directory" 设置为 `frontend`
- 其他选项保持默认

### 1.5 部署项目

**操作步骤**:
1. 检查所有配置是否正确
2. 点击页面底部的 "Deploy" 按钮
3. 等待部署完成（约1-2分钟）

**预期结果**:
- ✅ 看到 "Congratulations!" 消息
- ✅ 获得部署URL，例如：`https://toothyolo-vercel.vercel.app`
- ✅ 可以点击 "Visit" 按钮访问网站

### 1.6 记录部署地址

**操作步骤**:
1. 复制部署URL（例如：`https://toothyolo-xxxx.vercel.app`）
2. 保存到记事本或文档
3. 后续配置后端时需要用到

## 🔧 步骤2: 部署后端到Render

### 2.1 打开Render

**操作步骤**:
1. 打开浏览器（新标签页）
2. 访问 https://render.com
3. 点击右上角的 "Sign Up" 或 "Log In"

### 2.2 登录Render

**操作步骤**:
1. 点击 "Continue with GitHub"
2. GitHub会要求授权Render访问你的仓库
3. 点击 "Authorize render"
4. 等待跳转回Render页面

**预期结果**:
- ✅ 成功登录到Render
- ✅ 看到你的GitHub仓库列表

### 2.3 创建Web Service

**操作步骤**:
1. 点击页面顶部的 "New + " 按钮
2. 选择 "Web Service"
3. 在 "Connect a repository" 部分
4. 找到并选择 `jiye147/toothyolo` 仓库
5. 点击 "Connect" 按钮

### 2.4 配置服务设置

**操作步骤**:
在服务配置页面，填写以下信息：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Name** | toothyolo-backend | 服务名称 |
| **Region** | Singapore (推荐) | 服务器区域 |
| **Environment** | Python 3 | Python版本 |
| **Branch** | main | Git分支 |
| **Root Directory** | backend | 后端代码目录 |
| **Build Command** | `pip install -r requirements.txt` | 安装依赖 |
| **Start Command** | `gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT main:app` | 启动命令 |

**重要提示**:
- 确保 "Root Directory" 设置为 `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT main:app`

### 2.5 配置环境变量

**操作步骤**:
在页面下方的 "Environment Variables" 部分，添加以下变量：

| Key | Value | 说明 |
|-----|--------|------|
| HOST | 0.0.0.0 | 监听地址 |
| PORT | 8000 | 端口号 |
| DEBUG | False | 调试模式 |
| MODEL_PATH | best.pt | 模型路径 |
| CONFIDENCE_THRESHOLD | 0.25 | 置信度阈值 |
| MAX_UPLOAD_SIZE | 10485760 | 最大上传大小（10MB） |
| UPLOAD_DIR | uploads | 上传目录 |
| ALLOWED_EXTENSIONS | .jpg,.jpeg,.png,.mp4,.avi,.mov | 允许的文件类型 |
| CORS_ORIGINS | https://toothyolo-xxxx.vercel.app | 前端地址（替换为实际地址） |

**重要提示**:
- `CORS_ORIGINS` 必须设置为步骤1中获得的前端URL
- 所有变量必须准确填写
- 不要在Value中添加引号

### 2.6 配置持久化存储（可选但推荐）

**操作步骤**:
1. 在页面底部找到 "Disk" 部分
2. 点击 "Add Disk"
3. 配置以下信息：
   - **Name**: uploads
   - **Mount Path**: /opt/render/project/backend/uploads
   - **Size**: 1 GB
4. 点击 "Add"

**说明**:
- 持久化存储确保文件不会在重启后丢失
- 免费套餐支持1GB存储

### 2.7 部署服务

**操作步骤**:
1. 检查所有配置是否正确
2. 点击页面底部的 "Create Web Service" 按钮
3. 等待部署完成（约3-5分钟）

**预期结果**:
- ✅ 看到 "Live" 状态
- ✅ 获得服务URL，例如：`https://toothyolo-backend-xxxx.onrender.com`
- ✅ 可以点击URL访问API文档

### 2.8 记录部署地址

**操作步骤**:
1. 复制服务URL（例如：`https://toothyolo-backend-xxxx.onrender.com`）
2. 保存到记事本或文档
3. 后续连接前后端时需要用到

## 🔗 步骤3: 连接前后端

### 3.1 更新前端API地址

**操作步骤**:
1. 在本地打开文件 `d:\toothyolo\frontend\js\api.js`
2. 找到以下代码：

```javascript
const API_BASE_URL = 'http://localhost:8000';
```

3. 替换为Render的实际地址：

```javascript
const API_BASE_URL = 'https://toothyolo-backend-xxxx.onrender.com';
```

**重要提示**:
- 将 `xxxx` 替换为实际的Render服务名称
- 确保使用 `https://` 而不是 `http://`
- 不要在末尾添加斜杠 `/`

### 3.2 提交更改到GitHub

**操作步骤**:
打开命令提示符或PowerShell：

```bash
cd d:\toothyolo
git add frontend/js/api.js
git commit -m "Update: 更新API地址为Render地址"
git push
```

### 3.3 等待Vercel自动重新部署

**预期结果**:
- ✅ Vercel检测到GitHub更新
- ✅ 自动重新部署前端
- ✅ 部署完成后前端可以连接到后端

## 🧪 步骤4: 测试部署

### 4.1 测试前端

**操作步骤**:
1. 访问前端URL（例如：`https://toothyolo-xxxx.vercel.app`）
2. 检查页面是否正常加载
3. 测试导航功能

**预期结果**:
- ✅ 页面正常显示
- ✅ 样式和动画正常
- ✅ 导航功能正常

### 4.2 测试后端

**操作步骤**:
1. 访问API文档（例如：`https://toothyolo-backend-xxxx.onrender.com/docs`）
2. 检查API文档是否正常显示
3. 测试健康检查接口

**预期结果**:
- ✅ API文档正常显示
- ✅ 可以看到所有API端点
- ✅ 健康检查返回正常

### 4.3 测试图片检测

**操作步骤**:
1. 在前端点击"图片检测"
2. 上传一张测试图片
3. 等待检测结果

**预期结果**:
- ✅ 图片上传成功
- ✅ 检测结果正常显示
- ✅ 检测框标注正确

### 4.4 检查浏览器控制台

**操作步骤**:
1. 按F12打开开发者工具
2. 查看Console标签页
3. 检查是否有错误

**预期结果**:
- ✅ 没有CORS错误
- ✅ 没有网络错误
- ✅ API请求成功

## 🎉 部署完成检查清单

### 前端部署
- [x] 已登录Vercel
- [x] 已创建项目
- [x] 已配置Root Directory为frontend
- [x] 已成功部署
- [x] 已获得前端URL
- [x] 前端可正常访问

### 后端部署
- [x] 已登录Render
- [x] 已创建Web Service
- [x] 已配置环境变量
- [x] 已配置持久化存储
- [x] 已成功部署
- [x] 已获得后端URL
- [x] API文档可正常访问

### 连接测试
- [x] 已更新前端API地址
- [x] 已提交更改到GitHub
- [x] Vercel已自动重新部署
- [x] 前后端已连接
- [x] 图片检测功能正常
- [x] 没有CORS错误

## 📞 常见问题

### Q1: Vercel部署失败

**症状**: 部署时出现错误

**解决方案**:
1. 检查Root Directory是否设置为 `frontend`
2. 检查GitHub仓库是否公开
3. 查看Vercel的部署日志

### Q2: Render部署失败

**症状**: 部署时出现错误

**解决方案**:
1. 检查Build Command是否正确
2. 检查Start Command是否正确
3. 检查环境变量是否正确
4. 查看Render的部署日志

### Q3: 前端无法连接后端

**症状**: 上传图片时出现CORS错误

**解决方案**:
1. 检查后端的CORS_ORIGINS是否包含前端URL
2. 检查前端API地址是否正确
3. 检查后端服务是否正常运行

### Q4: 图片上传失败

**症状**: 上传图片时出错

**解决方案**:
1. 检查文件大小是否超过限制
2. 检查文件类型是否允许
3. 查看后端日志

## 📝 部署后的URL记录

### 前端URL
```
https://toothyolo-xxxx.vercel.app
```

### 后端URL
```
https://toothyolo-backend-xxxx.onrender.com
```

### API文档URL
```
https://toothyolo-backend-xxxx.onrender.com/docs
```

---

**文档版本**: v1.0.0
**最后更新**: 2024-02-10
