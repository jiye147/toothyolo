# 牙齿疾病智能检测系统 - 公网部署指南

本指南帮助你将牙齿疾病智能检测系统部署到公网，让所有人都可以访问。

## 📋 部署方案概览

### 方案1: 免费云平台部署（推荐新手）
- **前端**: Vercel（完全免费）
- **后端**: Render（免费套餐）
- **优点**: 完全免费、自动HTTPS、全球CDN、自动部署
- **缺点**: 后端可能有冷启动延迟

### 方案2: 付费云服务器部署（推荐生产环境）
- **平台**: 阿里云 / 腾讯云 / AWS / DigitalOcean
- **优点**: 完全控制、性能好、可扩展
- **缺点**: 需要付费、需要配置

### 方案3: Docker容器化部署
- **平台**: 任何支持Docker的云平台
- **优点**: 环境一致、易于迁移
- **缺点**: 需要Docker知识

## 🚀 快速开始（推荐方案1）

### 前提条件
- GitHub账号
- Vercel账号
- Render账号
- 项目代码已推送到GitHub

## 📝 步骤1: 准备GitHub仓库

### 1.1 创建GitHub仓库

1. 访问 https://github.com/new
2. 创建新仓库，命名为 `toothyolo`
3. 选择公开仓库（Public）
4. 不要初始化README（如果已有代码）

### 1.2 推送代码到GitHub

```bash
# 初始化git仓库（如果还没有）
cd d:\toothyolo
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: 牙齿疾病智能检测系统"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/toothyolo.git

# 推送到GitHub
git push -u origin main
```

### 1.3 创建.gitignore文件

在项目根目录创建 `.gitignore` 文件：

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
venv/
ENV/
env/

# 后端
backend/uploads/*
backend/logs/*
backend/.env

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

## 🌐 步骤2: 部署前端到Vercel

### 2.1 注册Vercel

1. 访问 https://vercel.com/signup
2. 使用GitHub账号登录
3. 完成注册流程

### 2.2 连接GitHub仓库

1. 登录Vercel后，点击 "Add New Project"
2. 选择 "Continue with GitHub"
3. 授权Vercel访问你的GitHub
4. 选择 `toothyolo` 仓库

### 2.3 配置项目设置

在项目配置页面：

```yaml
Framework Preset: Other
Root Directory: frontend
Build Command: (留空)
Output Directory: (留空)
```

### 2.4 部署

1. 点击 "Deploy" 按钮
2. 等待部署完成（约1-2分钟）
3. 部署成功后，你会获得一个类似 `https://toothyolo.vercel.app` 的URL

### 2.5 配置自定义域名（可选）

1. 在Vercel项目设置中，点击 "Domains"
2. 添加你的域名（如 `www.yourdomain.com`）
3. 按照提示配置DNS记录
4. 等待SSL证书自动生成

### 2.6 更新前端API地址

编辑 `frontend/js/api.js`：

```javascript
// 开发环境
const API_BASE_URL = 'http://localhost:8000';

// 生产环境（Vercel部署后使用）
const API_BASE_URL = 'https://your-backend-api.onrender.com';
```

## 🔧 步骤3: 部署后端到Render

### 3.1 注册Render

1. 访问 https://render.com/register
2. 使用GitHub账号登录
3. 完成注册流程

### 3.2 创建Web Service

1. 登录Render后，点击 "New +"
2. 选择 "Web Service"
3. 选择 "Connect" 连接你的GitHub仓库
4. 选择 `toothyolo` 仓库

### 3.3 配置后端设置

```yaml
Name: toothyolo-backend
Environment: Python 3
Build Command: cd backend && pip install -r requirements.txt
Start Command: cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT main:app
```

### 3.4 配置环境变量

在 "Environment Variables" 部分添加：

```env
# 服务器配置
HOST=0.0.0.0
PORT=8000
DEBUG=False

# 模型配置
MODEL_PATH=models/best.pt
CONFIDENCE_THRESHOLD=0.25

# 文件上传配置
MAX_UPLOAD_SIZE=10485760
UPLOAD_DIR=uploads
ALLOWED_EXTENSIONS=.jpg,.jpeg,.png,.mp4,.avi,.mov

# CORS配置
CORS_ORIGINS=https://toothyolo.vercel.app,https://yourdomain.com
```

### 3.5 部署

1. 点击 "Create Web Service"
2. 等待部署完成（约3-5分钟）
3. 部署成功后，你会获得一个类似 `https://toothyolo-backend.onrender.com` 的URL

### 3.6 配置持久化存储（重要）

Render免费套餐的文件存储是临时的，重启后会丢失。如果需要持久化存储：

1. 在Render项目设置中，点击 "Disk"
2. 添加持久化磁盘
3. 挂载到 `/opt/render/project/backend/uploads`

## 🔗 步骤4: 连接前后端

### 4.1 更新前端API地址

编辑 `frontend/js/api.js`：

```javascript
const API_BASE_URL = 'https://toothyolo-backend.onrender.com';
```

### 4.2 更新CORS配置

确保后端的 `CORS_ORIGINS` 包含前端URL：

```env
CORS_ORIGINS=https://toothyolo.vercel.app
```

### 4.3 重新部署前端

1. 推送更改到GitHub
2. Vercel会自动重新部署
3. 等待部署完成

## 🧪 步骤5: 测试部署

### 5.1 测试前端

1. 访问 `https://toothyolo.vercel.app`
2. 检查页面是否正常加载
3. 测试所有导航和功能

### 5.2 测试后端

1. 访问 `https://toothyolo-backend.onrender.com/docs`
2. 检查API文档是否正常显示
3. 测试几个API端点

### 5.3 测试前后端连接

1. 在前端上传一张测试图片
2. 检查是否能正常检测
3. 查看浏览器控制台是否有错误

## 🌟 步骤6: 优化和监控

### 6.1 添加自定义域名

#### Vercel自定义域名
1. 在Vercel项目设置中添加域名
2. 配置DNS记录
3. 等待SSL证书生成

#### Render自定义域名
1. 在Render项目设置中添加域名
2. 配置DNS记录
3. 等待SSL证书生成

### 6.2 配置CDN

Vercel和Render都自带全球CDN，无需额外配置。

### 6.3 监控和日志

#### Vercel监控
- 访问Vercel项目仪表板
- 查看访问日志和错误日志
- 监控性能指标

#### Render监控
- 访问Render项目仪表板
- 查看服务状态和日志
- 监控资源使用情况

## 💰 成本估算

### 免费方案
- **Vercel**: 完全免费（100GB带宽/月）
- **Render**: 免费套餐（750小时/月，512MB RAM）
- **总成本**: $0/月

### 付费方案（推荐生产环境）

#### 阿里云
- **ECS服务器**: ¥50-200/月
- **带宽**: ¥0.8/GB
- **总成本**: 约¥100-500/月

#### 腾讯云
- **CVM服务器**: ¥50-200/月
- **带宽**: ¥0.8/GB
- **总成本**: 约¥100-500/月

#### AWS
- **EC2服务器**: $10-50/月
- **带宽**: $0.09/GB
- **总成本**: 约$20-100/月

## 🔒 安全建议

### 1. 启用HTTPS
- Vercel和Render都自动提供免费SSL证书
- 确保所有流量都通过HTTPS

### 2. 限制CORS
- 只允许受信任的域名访问API
- 定期审查CORS配置

### 3. 环境变量
- 不要在代码中硬编码敏感信息
- 使用环境变量存储密钥
- 定期轮换密钥

### 4. 文件上传限制
- 限制文件大小
- 限制文件类型
- 扫描上传文件

## 📊 性能优化

### 1. 前端优化
- 压缩CSS和JavaScript
- 使用图片懒加载
- 启用浏览器缓存
- 使用CDN加速

### 2. 后端优化
- 使用异步处理
- 添加结果缓存
- 优化数据库查询
- 使用GPU加速（如果可用）

## 🔄 自动部署

### Vercel自动部署
- 每次推送到GitHub，Vercel自动重新部署
- 无需手动操作
- 支持预览部署

### Render自动部署
- 每次推送到GitHub，Render自动重新部署
- 支持分支部署
- 支持预览环境

## 📞 故障排查

### 常见问题

#### 问题1: 前端无法访问后端
**症状**: CORS错误或连接失败

**解决方案**:
1. 检查后端的CORS配置
2. 确保前端URL在允许列表中
3. 检查后端服务是否正常运行

#### 问题2: 后端冷启动慢
**症状**: 首次请求响应慢

**解决方案**:
1. Render免费套餐有冷启动延迟
2. 升级到付费套餐可以减少延迟
3. 使用定时任务保持服务活跃

#### 问题3: 文件上传失败
**症状**: 上传文件时出错

**解决方案**:
1. 检查文件大小限制
2. 检查Render的磁盘空间
3. 查看后端日志

## 📚 其他资源

### 官方文档
- [Vercel文档](https://vercel.com/docs)
- [Render文档](https://render.com/docs)
- [GitHub文档](https://docs.github.com)

### 视频教程
- [Vercel部署教程](https://www.youtube.com/results?search_query=vercel+deployment)
- [Render部署教程](https://www.youtube.com/results?search_query=render+deployment)

### 社区支持
- [Vercel社区](https://vercel.com/community)
- [Render社区](https://community.render.com)
- [GitHub讨论](https://github.com/你的用户名/toothyolo/discussions)

## 🎉 部署完成检查清单

- [ ] 代码已推送到GitHub
- [ ] 前端已部署到Vercel
- [ ] 后端已部署到Render
- [ ] 前后端已连接
- [ ] HTTPS已启用
- [ ] 所有功能已测试
- [ ] 自定义域名已配置（可选）
- [ ] 监控已设置
- [ ] 备份策略已配置

---

**文档版本**: v1.0.0
**最后更新**: 2024-02-10
**适用平台**: Vercel, Render, GitHub
