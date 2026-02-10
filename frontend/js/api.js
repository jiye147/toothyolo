const API_BASE_URL = 'https://toothyolo-backend.onrender.com';

class ToothDetectionAPI {
    async checkHealth() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error('健康检查失败:', error);
            throw error;
        }
    }

    async detectImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/detect/image`, {
                method: 'POST',
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('图片检测失败:', error);
            throw error;
        }
    }

    async detectVideo(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/detect/video`, {
                method: 'POST',
                body: formData
            });
            return response;
        } catch (error) {
            console.error('视频检测失败:', error);
            throw error;
        }
    }
}

const api = new ToothDetectionAPI();

class Toast {
    static show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

class HistoryManager {
    constructor() {
        this.history = this.loadHistory();
    }

    loadHistory() {
        const saved = localStorage.getItem('detectionHistory');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem('detectionHistory', JSON.stringify(this.history));
    }

    addRecord(type, result) {
        const record = {
            id: Date.now(),
            type: type,
            date: new Date().toLocaleString('zh-CN'),
            result: result
        };
        this.history.unshift(record);
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        this.saveHistory();
        return record;
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    getHistory() {
        return this.history;
    }
}

const historyManager = new HistoryManager();
