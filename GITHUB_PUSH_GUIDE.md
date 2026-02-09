# GitHub推送指南

本指南帮助你将牙齿疾病智能检测系统代码推送到GitHub，为公网部署做准备。

## 📋 前提条件

1. **GitHub账号**
   - 访问 https://github.com/signup 注册
   - 完成邮箱验证

2. **Git安装**
   - Windows: 下载 https://git-scm.com/download/win
   - macOS: `brew install git`
   - Linux: `sudo apt install git`

3. **项目准备**
   - 确保项目在 `d:\toothyolo` 目录
   - 确保所有文件已保存

## 🚀 快速开始（5分钟完成）

### 步骤1: 创建GitHub仓库（2分钟）

1. **访问GitHub**
   - 打开浏览器，访问 https://github.com/new

2. **创建新仓库**
   - Repository name: `toothyolo`
   - Description: `牙齿疾病智能检测系统 - 基于YOLO深度学习技术`
   - 选择 **Public**（公开仓库）
   - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

3. **记录仓库地址**
   - 你的仓库地址类似：`https://github.com/你的用户名/toothyolo.git`

### 步骤2: 初始化本地Git仓库（1分钟）

打开命令提示符或PowerShell：

```bash
# 进入项目目录
cd d:\toothyolo

# 初始化git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: 牙齿疾病智能检测系统 v1.0.9"
```

### 步骤3: 连接GitHub仓库（1分钟）

```bash
# 添加远程仓库（替换为你的GitHub用户名）
git remote add origin https://github.com/你的用户名/toothyolo.git

# 推送到GitHub
git push -u origin main
```

如果遇到错误，尝试：

```bash
# 设置主分支名称
git branch -M main

# 再次推送
git push -u origin main
```

### 步骤4: 验证推送（1分钟）

1. 访问你的GitHub仓库页面
2. 检查所有文件是否已上传
3. 确认 `README.md`、`frontend/`、`backend/` 等目录都在

## 📝 详细步骤

### 步骤1: 检查Git是否已安装

```bash
git --version
```

如果显示版本号（如 `git version 2.40.0`），说明已安装。

如果没有安装，访问 https://git-scm.com/download/win 下载安装。

### 步骤2: 配置Git用户信息

```bash
# 设置用户名（替换为你的名字）
git config --global user.name "Your Name"

# 设置邮箱（替换为你的邮箱）
git config --global user.email "your.email@example.com"
```

### 步骤3: 创建.gitignore文件

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
backend/__pycache__/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# 临时文件
*.tmp
*.log
```

### 步骤4: 检查项目结构

```bash
# 查看项目文件
dir
```

确保以下目录存在：
- `frontend/` - 前端代码
- `backend/` - 后端代码
- `README.md` - 项目说明
- `PROJECT_COMPLETION.md` - 完成文档
- `TESTING.md` - 测试文档
- `DEPLOYMENT.md` - 部署文档
- `PUBLIC_DEPLOYMENT.md` - 公网部署文档

### 步骤5: 添加文件到Git

```bash
# 查看未跟踪的文件
git status

# 添加所有文件
git add .

# 再次查看状态
git status
```

你应该看到所有文件都被标记为绿色（已添加）。

### 步骤6: 提交更改

```bash
# 提交所有更改
git commit -m "Initial commit: 牙齿疾病智能检测系统 v1.0.9

Features:
- 图片检测（拖拽上传、实时预览、检测标注、结果下载）
- 视频检测（视频上传、流式检测）
- 历史记录（本地存储、记录管理）
- 疾病详情（症状、病因、治疗、预防）
- 系统设置（标注控制、阈值调节、主题切换）

Bug Fixes:
- 修复主页按钮跳转问题
- 修复统计数据显示问题
- 修复响应时间显示问题
- 优化文字表述"
```

### 步骤7: 推送到GitHub

```bash
# 推送到GitHub
git push -u origin main
```

如果遇到认证错误：

```bash
# 使用个人访问令牌（推荐）
# 1. 访问 https://github.com/settings/tokens
# 2. 生成新的Personal Access Token
# 3. 选择权限：repo
# 4. 复制令牌
# 5. 推送时使用令牌作为密码

git push -u origin main
# 用户名：你的GitHub用户名
# 密码：你的Personal Access Token
```

## 🔐 使用SSH密钥（推荐）

### 步骤1: 生成SSH密钥

```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your.email@example.com"

# 按Enter使用默认路径
# 可以设置密码（可选）
```

### 步骤2: 添加SSH密钥到GitHub

1. 复制公钥
```bash
# Windows
type %USERPROFILE%\.ssh\id_ed25519.pub

# macOS/Linux
cat ~/.ssh/id_ed25519.pub
```

2. 添加到GitHub
   - 访问 https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥
   - 点击 "Add SSH key"

### 步骤3: 使用SSH连接GitHub

```bash
# 测试SSH连接
ssh -T git@github.com

# 如果看到 "Hi username! You've successfully authenticated..."，说明成功

# 使用SSH地址推送
git remote set-url origin git@github.com:你的用户名/toothyolo.git

# 推送
git push -u origin main
```

## 🔄 后续更新

### 更新代码后推送

```bash
# 查看更改
git status

# 添加更改的文件
git add .

# 提交更改
git commit -m "Update: 修复某个bug"

# 推送到GitHub
git push
```

### 拉取最新代码

```bash
# 拉取最新代码
git pull origin main
```

## 📞 常见问题

### 问题1: fatal: remote origin already exists

**解决方案**:
```bash
# 删除现有远程仓库
git remote remove origin

# 重新添加
git remote add origin https://github.com/你的用户名/toothyolo.git
```

### 问题2: fatal: not a git repository

**解决方案**:
```bash
# 确保在正确的目录
cd d:\toothyolo

# 初始化仓库
git init
```

### 问题3: error: failed to push some refs

**解决方案**:
```bash
# 强制推送（谨慎使用）
git push -f origin main

# 或先拉取再推送
git pull origin main --rebase
git push origin main
```

### 问题4: Connection refused

**解决方案**:
- 检查网络连接
- 检查GitHub是否可访问
- 尝试使用SSH而不是HTTPS

## 📚 相关资源

- [GitHub官方文档](https://docs.github.com)
- [Git官方文档](https://git-scm.com/doc)
- [Pro Git书籍](https://git-scm.com/book/zh/v2)

## ✅ 检查清单

- [ ] GitHub账号已创建
- [ ] Git已安装
- [ ] Git用户信息已配置
- [ ] .gitignore文件已创建
- [ ] GitHub仓库已创建
- [ ] 本地仓库已初始化
- [ ] 文件已添加到Git
- [ ] 更改已提交
- [ ] 代码已推送到GitHub
- [ ] GitHub仓库已验证

---

**文档版本**: v1.0.0
**最后更新**: 2024-02-10
