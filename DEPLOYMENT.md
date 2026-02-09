# 牙齿疾病智能检测系统 - 部署指南

本文档提供了牙齿疾病智能检测系统的详细部署指南，包括开发环境、测试环境和生产环境的配置。

## 目录

- [环境要求](#环境要求)
- [开发环境部署](#开发环境部署)
- [生产环境部署](#生产环境部署)
- [服务器配置](#服务器配置)
- [安全配置](#安全配置)
- [性能优化](#性能优化)
- [监控和日志](#监控和日志)
- [故障排查](#故障排查)

## 环境要求

### 硬件要求

#### 最低配置
- CPU: 2核心
- 内存: 4GB RAM
- 存储: 20GB 可用空间
- GPU: 可选（推荐用于加速）

#### 推荐配置
- CPU: 4核心或更高
- 内存: 8GB RAM或更高
- 存储: 50GB SSD
- GPU: NVIDIA GPU（支持CUDA 11.0+）

### 软件要求

#### 后端
- Python 3.8+
- pip 20.0+
- 虚拟环境（推荐）

#### 前端
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）
- Web服务器（Nginx, Apache等）

#### 系统
- Linux（Ubuntu 20.04+, CentOS 7+）
- Windows Server 2016+
- macOS 10.15+

## 开发环境部署

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/toothyolo.git
cd toothyolo
```

### 2. 后端设置

#### 2.1 创建虚拟环境

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
# 或
venv\Scripts\activate  # Windows
```

#### 2.2 安装依赖

```bash
pip install -r requirements.txt
```

#### 2.3 配置环境变量

创建 `.env` 文件：

```env
# 服务器配置
HOST=0.0.0.0
PORT=8000
DEBUG=True

# 模型配置
MODEL_PATH=models/best.pt
CONFIDENCE_THRESHOLD=0.25

# 文件上传配置
MAX_UPLOAD_SIZE=10485760
UPLOAD_DIR=uploads
ALLOWED_EXTENSIONS=.jpg,.jpeg,.png,.mp4,.avi,.mov

# CORS配置
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### 2.4 启动后端服务

```bash
python main.py
```

后端将在 http://localhost:8000 启动

### 3. 前端设置

#### 3.1 安装依赖

前端不需要额外的依赖，只需要一个Web服务器。

#### 3.2 配置API地址

编辑 `frontend/js/api.js`：

```javascript
const API_BASE_URL = 'http://localhost:8000';
```

#### 3.3 启动前端服务

```bash
cd frontend
python -m http.server 3000
```

前端将在 http://localhost:3000 启动

### 4. 访问应用

- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 生产环境部署

### 1. 服务器准备

#### 1.1 更新系统

```bash
sudo apt update && sudo apt upgrade -y
```

#### 1.2 安装必要软件

```bash
sudo apt install -y python3-pip python3-venv nginx
```

### 2. 后端部署

#### 2.1 使用Gunicorn部署

```bash
cd backend
source venv/bin/activate
pip install gunicorn

gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app
```

#### 2.2 使用Systemd管理服务

创建服务文件 `/etc/systemd/system/toothyolo-backend.service`：

```ini
[Unit]
Description=ToothYolo Backend Service
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/toothyolo/backend
Environment="PATH=/var/www/toothyolo/backend/venv/bin"
ExecStart=/var/www/toothyolo/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl enable toothyolo-backend
sudo systemctl start toothyolo-backend
sudo systemctl status toothyolo-backend
```

### 3. 前端部署

#### 3.1 使用Nginx部署

创建Nginx配置文件 `/etc/nginx/sites-available/toothyolo`：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 前端
    location / {
        root /var/www/toothyolo/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 上传文件大小限制
    client_max_body_size 100M;
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/toothyolo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3.2 配置HTTPS

使用Let's Encrypt免费SSL证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 4. 防火墙配置

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 服务器配置

### 1. 数据库配置（可选）

如果需要数据库，配置PostgreSQL：

```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres createuser toothyolo
sudo -u postgres createdb toothyolo -O toothyolo
```

### 2. 缓存配置

使用Redis缓存：

```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### 3. 负载均衡

使用Nginx负载均衡：

```nginx
upstream backend {
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
}

server {
    location /api/ {
        proxy_pass http://backend;
    }
}
```

## 安全配置

### 1. 环境变量

生产环境必须设置：

```env
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com
```

### 2. CORS配置

限制CORS来源：

```env
CORS_ORIGINS=https://yourdomain.com
```

### 3. 文件上传安全

- 限制文件类型
- 限制文件大小
- 病毒扫描
- 文件隔离存储

### 4. API限流

使用FastAPI限流：

```python
from fastapi.middleware import Middleware

app.add_middleware(
    Middleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=3600,
)
```

## 性能优化

### 1. 后端优化

#### 1.1 使用异步处理

```python
@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    result = await process_image(file)
    return result
```

#### 1.2 结果缓存

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_model():
    return YOLO("models/best.pt")
```

#### 1.3 图片压缩

```python
from PIL import Image

def compress_image(image_path):
    img = Image.open(image_path)
    img.save(image_path, quality=85, optimize=True)
```

### 2. 前端优化

#### 2.1 资源压缩

```bash
# 压缩CSS
npm install -g clean-css-cli
cleancss -o style.min.css style.css

# 压缩JavaScript
npm install -g terser
terser -o app.min.js app.js
```

#### 2.2 CDN加速

使用CDN加载第三方库：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@6.4.0/css/all.min.css">
```

#### 2.3 懒加载

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadResource(entry.target);
        }
    });
});
```

## 监控和日志

### 1. 日志配置

#### 1.1 后端日志

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
```

#### 1.2 Nginx日志

```nginx
access_log /var/log/nginx/toothyolo_access.log;
error_log /var/log/nginx/toothyolo_error.log;
```

### 2. 监控工具

#### 2.1 Prometheus监控

```python
from prometheus_fastapi_instrumentator import Instrumentator

Instrumentator().instrument(app).expose(app)
```

#### 2.2 健康检查

```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}
```

### 3. 告警配置

使用Prometheus Alertmanager配置告警规则。

## 故障排查

### 1. 常见问题

#### 问题1: 后端无法启动

**症状**: `gunicorn` 命令失败

**解决方案**:
```bash
# 检查端口占用
sudo lsof -i :8000

# 检查权限
sudo chown -R www-data:www-data /var/www/toothyolo

# 检查日志
sudo journalctl -u toothyolo-backend -f
```

#### 问题2: 前端无法访问

**症状**: 502 Bad Gateway

**解决方案**:
```bash
# 检查后端服务
sudo systemctl status toothyolo-backend

# 检查Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

#### 问题3: 文件上传失败

**症状**: 413 Request Entity Too Large

**解决方案**:
```nginx
client_max_body_size 100M;
```

#### 问题4: CORS错误

**症状**: 浏览器控制台CORS错误

**解决方案**:
```env
CORS_ORIGINS=https://yourdomain.com
```

### 2. 性能问题

#### 问题1: 响应慢

**解决方案**:
- 启用GPU加速
- 使用异步处理
- 添加缓存
- 优化数据库查询

#### 问题2: 内存占用高

**解决方案**:
- 限制并发请求
- 使用模型量化
- 定期清理缓存

### 3. 日志分析

```bash
# 查看错误日志
sudo tail -f /var/log/nginx/toothyolo_error.log

# 查看访问日志
sudo tail -f /var/log/nginx/toothyolo_access.log

# 查看应用日志
sudo tail -f /var/www/toothyolo/backend/logs/app.log
```

## 备份和恢复

### 1. 数据备份

```bash
# 备份上传文件
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# 备份数据库
pg_dump toothyolo > db_backup_$(date +%Y%m%d).sql
```

### 2. 自动备份

创建cron任务：

```bash
# 编辑crontab
crontab -e

# 每天凌晨2点备份
0 2 * * * * /path/to/backup.sh
```

## 更新和维护

### 1. 滚动更新

```bash
# 拉取最新代码
git pull origin main

# 更新依赖
pip install -r requirements.txt --upgrade

# 重启服务
sudo systemctl restart toothyolo-backend
```

### 2. 版本回滚

```bash
# 回滚到上一个版本
git checkout HEAD~1

# 重启服务
sudo systemctl restart toothyolo-backend
```

## 联系支持

如遇到部署问题，请联系：

- 邮箱: support@toothyolo.com
- 电话: 400-888-8888
- 文档: http://docs.toothyolo.com

---

**文档版本**: v1.0.0
**最后更新**: 2024-02-10
