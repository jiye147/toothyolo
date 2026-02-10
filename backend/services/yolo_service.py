from ultralytics import YOLO
from typing import List, Dict
import cv2
import numpy as np
from functools import lru_cache

class YOLOService:
    _instance = None
    _model = None
    
    def __new__(cls, model_path: str):
        if cls._instance is None:
            cls._instance = super(YOLOService, cls).__new__(cls)
            cls._instance.model_path = model_path
            cls._instance.load_model()
        return cls._instance
    
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.load_model()
    
    def load_model(self):
        if self.model is None:
            try:
                self.model = YOLO(self.model_path)
                self.model.fuse()
                print(f"YOLO模型加载成功: {self.model_path}")
            except Exception as e:
                print(f"YOLO模型加载失败: {e}")
                self.model = None
    
    def is_loaded(self) -> bool:
        return self.model is not None
    
    def detect_image(self, image_path: str, conf_threshold: float = 0.25) -> List[Dict]:
        if not self.is_loaded():
            self.load_model()
            if not self.is_loaded():
                raise Exception("YOLO模型未加载")
        
        try:
            image = cv2.imread(image_path)
            if image is None:
                raise Exception("无法读取图片")
            
            results = self.model(image, conf=conf_threshold, verbose=False, imgsz=640)
            detections = []
            
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    class_id = int(box.cls[0])
                    class_name = self.model.names[class_id]
                    confidence = float(box.conf[0])
                    bbox = box.xyxy[0].tolist()
                    
                    detections.append({
                        "class_name": class_name,
                        "confidence": confidence,
                        "bbox": bbox
                    })
            
            del results
            return detections
        except Exception as e:
            print(f"图像检测失败: {e}")
            raise
    
    def detect_frame(self, frame: np.ndarray, conf_threshold: float = 0.25) -> List[Dict]:
        if not self.is_loaded():
            self.load_model()
            if not self.is_loaded():
                raise Exception("YOLO模型未加载")
        
        try:
            results = self.model(frame, conf=conf_threshold, verbose=False, imgsz=640)
            detections = []
            
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    class_id = int(box.cls[0])
                    class_name = self.model.names[class_id]
                    confidence = float(box.conf[0])
                    bbox = box.xyxy[0].tolist()
                    
                    detections.append({
                        "class_name": class_name,
                        "confidence": confidence,
                        "bbox": bbox
                    })
            
            del results
            return detections
        except Exception as e:
            print(f"帧检测失败: {e}")
            raise
