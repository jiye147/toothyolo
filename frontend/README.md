# 牙齿疾病智能检测系统 - 前端

基于YOLO深度学习技术的牙齿疾病检测Web应用。

## 功能特性

- 🦷 智能牙齿疾病检测
- 📷 图片上传检测
- 🎬 视频实时检测
- 🎨 现代化响应式设计
- 🌏 完全中文界面

## 快速开始

### 启动前端

#### Windows
```bash
start.bat
```

#### Linux/Mac
```bash
python -m http.server 3000
```

前端将在 `http://localhost:3000` 启动

### 启动后端

确保后端API服务已启动（运行在 `http://localhost:8000`）

```bash
cd backend
python main.py
```

## 使用说明

1. **首页** - 查看系统介绍和功能特点
2. **图片检测** - 上传牙齿图片进行疾病检测
3. **视频检测** - 上传视频文件进行实时检测
4. **关于** - 了解系统技术特点和使用方法

## 项目结构

```
frontend/
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件
├── js/
│   ├── api.js         # API调用服务
│   └── app.js         # 应用逻辑
└── start.bat          # Windows启动脚本
```

## 技术栈

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- Fetch API

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 注意事项

- 确保后端API服务已启动
- 支持的图片格式：JPG, PNG, JPEG
- 支持的视频格式：MP4, AVI, MOV
- 建议使用现代浏览器以获得最佳体验
