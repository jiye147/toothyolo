from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import cv2
import numpy as np
from pathlib import Path
import tempfile
import time
from services.yolo_service import YOLOService

app = FastAPI(
    title="Tooth YOLO Detection API",
    description="YOLO目标检测API服务",
    version="1.0.0"
)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

MODEL_PATH = os.getenv("MODEL_PATH", "best.pt")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.25"))
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", "10485760"))

yolo_service = YOLOService(MODEL_PATH)

class DetectionResult(BaseModel):
    class_name: str
    confidence: float
    bbox: List[float]

class ImageDetectionResponse(BaseModel):
    success: bool
    detections: List[DetectionResult]
    image_path: Optional[str] = None
    message: Optional[str] = None
    process_time: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Tooth YOLO Detection API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": yolo_service.is_loaded()}

@app.post("/detect/image", response_model=ImageDetectionResponse)
async def detect_image(file: UploadFile = File(...)):
    start_time = time.time()
    
    try:
        if file.size > MAX_UPLOAD_SIZE:
            return ImageDetectionResponse(
                success=False,
                detections=[],
                message=f"文件大小超过限制 ({MAX_UPLOAD_SIZE} 字节)"
            )
        
        file_path = UPLOAD_DIR / file.filename
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        detections = yolo_service.detect_image(str(file_path), CONFIDENCE_THRESHOLD)
        
        process_time = time.time() - start_time
        print(f"图片检测完成: {len(detections)}个目标, 耗时: {process_time:.2f}秒")
        
        return ImageDetectionResponse(
            success=True,
            detections=detections,
            image_path=str(file_path),
            process_time=f"{process_time:.2f}s"
        )
    except Exception as e:
        print(f"图片检测错误: {str(e)}")
        return ImageDetectionResponse(
            success=False,
            detections=[],
            message=str(e)
        )

@app.post("/detect/video")
async def detect_video(file: UploadFile = File(...)):
    try:
        temp_video = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        temp_video.write(await file.read())
        temp_video.close()
        
        cap = cv2.VideoCapture(temp_video.name)
        
        def generate_frames():
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                detections = yolo_service.detect_frame(frame)
                
                for det in detections:
                    bbox = det["bbox"]
                    x1, y1, x2, y2 = map(int, bbox)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, f"{det['class_name']} {det['confidence']:.2f}", 
                               (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                ret, buffer = cv2.imencode('.jpg', frame)
                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
            cap.release()
            os.unlink(temp_video.name)
        
        return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace;boundary=frame")
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
