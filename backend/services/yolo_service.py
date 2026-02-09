from ultralytics import YOLO
from typing import List, Dict
import cv2
import numpy as np

class YOLOService:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.load_model()
    
    def load_model(self):
        try:
            self.model = YOLO(self.model_path)
            print(f"YOLO模型加载成功: {self.model_path}")
        except Exception as e:
            print(f"YOLO模型加载失败: {e}")
            self.model = None
    
    def is_loaded(self) -> bool:
        return self.model is not None
    
    def detect_image(self, image_path: str, conf_threshold: float = 0.25) -> List[Dict]:
        if not self.is_loaded():
            raise Exception("YOLO模型未加载")
        
        try:
            results = self.model(image_path, conf=conf_threshold)
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
            
            return detections
        except Exception as e:
            print(f"图像检测失败: {e}")
            raise
    
    def detect_frame(self, frame: np.ndarray, conf_threshold: float = 0.25) -> List[Dict]:
        if not self.is_loaded():
            raise Exception("YOLO模型未加载")
        
        try:
            results = self.model(frame, conf=conf_threshold)
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
            
            return detections
        except Exception as e:
            print(f"帧检测失败: {e}")
            raise
