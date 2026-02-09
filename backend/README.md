# Tooth YOLO Detection API

基于YOLO的目标检测API服务，支持图片和视频检测。

## 功能特性

- 图片目标检测
- 视频实时检测
- RESTful API接口
- CORS支持
- 自动模型加载

## 安装依赖

```bash
pip install -r requirements.txt
```

## 启动服务

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
python main.py
```

服务将在 `http://localhost:8000` 启动

## API端点

### 健康检查
```
GET /health
```

### 图片检测
```
POST /detect/image
Content-Type: multipart/form-data
```

参数：
- file: 图片文件

返回：
```json
{
  "success": true,
  "detections": [
    {
      "class_name": "tooth",
      "confidence": 0.95,
      "bbox": [x1, y1, x2, y2]
    }
  ],
  "image_path": "uploads/image.jpg"
}
```

### 视频检测
```
POST /detect/video
Content-Type: multipart/form-data
```

参数：
- file: 视频文件

返回：视频流（MJPEG格式）

## API文档

启动服务后访问 `http://localhost:8000/docs` 查看完整的API文档。

## 项目结构

```
backend/
├── main.py              # FastAPI应用主文件
├── requirements.txt     # Python依赖
├── best.pt             # YOLO模型文件
├── services/
│   ├── __init__.py
│   └── yolo_service.py  # YOLO推理服务
└── uploads/            # 上传文件存储目录
```

## 技术栈

- FastAPI - Web框架
- Ultralytics YOLO - 目标检测模型
- OpenCV - 图像/视频处理
- Uvicorn - ASGI服务器
