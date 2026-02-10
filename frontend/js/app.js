let currentImageFile = null;
let currentDetections = null;
window.showAnnotations = true;
let isBackendConnected = false;

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initImageDetection();
    initVideoDetection();
    initHistory();
    initMobileMenu();
    checkBackendConnection();
    initKeyboardShortcuts();
    initShortcutsHelp();
});

function checkBackendConnection() {
    const connectionStatus = document.createElement('div');
    connectionStatus.id = 'connection-status';
    connectionStatus.className = 'connection-status checking';
    connectionStatus.innerHTML = `
        <div class="status-indicator checking"></div>
        <span class="status-text">连接中...</span>
    `;
    document.body.appendChild(connectionStatus);
    
    api.checkHealth()
        .then(data => {
            isBackendConnected = true;
            updateConnectionStatus('connected');
            Toast.show('后端服务已连接', 'success');
        })
        .catch(error => {
            isBackendConnected = false;
            updateConnectionStatus('disconnected');
            Toast.show('后端服务未连接，请检查服务是否启动', 'error');
        });
    
    setInterval(() => {
        api.checkHealth()
            .then(data => {
                if (!isBackendConnected) {
                    isBackendConnected = true;
                    updateConnectionStatus('connected');
                    Toast.show('后端服务已恢复', 'success');
                }
            })
            .catch(error => {
                if (isBackendConnected) {
                    isBackendConnected = false;
                    updateConnectionStatus('disconnected');
                    Toast.show('后端服务已断开', 'error');
                }
            });
    }, 30000);
}

function updateConnectionStatus(status) {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;
    
    statusEl.className = `connection-status ${status}`;
    
    const statusConfig = {
        checking: {
            text: '连接中...',
            icon: 'fa-spinner fa-spin'
        },
        connected: {
            text: '已连接',
            icon: 'fa-check-circle'
        },
        disconnected: {
            text: '未连接',
            icon: 'fa-times-circle'
        }
    };
    
    const config = statusConfig[status];
    statusEl.innerHTML = `
        <div class="status-indicator ${status}"></div>
        <span class="status-text">${config.text}</span>
    `;
}

function initShortcutsHelp() {
    const shortcutsToggle = document.getElementById('shortcuts-toggle');
    const shortcutsHelp = document.getElementById('shortcuts-help');
    const closeShortcuts = document.getElementById('close-shortcuts');
    
    shortcutsToggle.addEventListener('click', () => {
        shortcutsHelp.classList.toggle('hidden');
        shortcutsToggle.classList.toggle('hidden');
    });
    
    closeShortcuts.addEventListener('click', () => {
        shortcutsHelp.classList.add('hidden');
        shortcutsToggle.classList.remove('hidden');
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F1') {
            e.preventDefault();
            shortcutsHelp.classList.toggle('hidden');
            shortcutsToggle.classList.toggle('hidden');
        }
    });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'i':
                    e.preventDefault();
                    navigateToSection('image-detection');
                    break;
                case 'v':
                    e.preventDefault();
                    navigateToSection('video-detection');
                    break;
                case 'h':
                    e.preventDefault();
                    navigateToSection('history');
                    break;
                case 'a':
                    e.preventDefault();
                    navigateToSection('about');
                    break;
                case 's':
                    e.preventDefault();
                    toggleSettingsPanel();
                    break;
                case 'r':
                    e.preventDefault();
                    if (currentImageFile) {
                        resetImageDetection();
                        Toast.show('已重置检测', 'info');
                    }
                    break;
                case 'd':
                    e.preventDefault();
                    if (currentImageFile && currentDetections) {
                        downloadResult();
                    }
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            closeAllModals();
        }
        
        if (e.key === 'Enter' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            const activeSection = document.querySelector('.section.active');
            if (activeSection && activeSection.id === 'image-detection') {
                const uploadArea = document.getElementById('image-upload-area');
                if (uploadArea) {
                    uploadArea.click();
                }
            }
        }
        
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const activeSection = document.querySelector('.section.active');
            if (activeSection && activeSection.id === 'history') {
                const clearBtn = document.getElementById('clear-history');
                if (clearBtn && clearBtn.style.display !== 'none') {
                    if (confirm('确定要清空所有历史记录吗？')) {
                        historyManager.clearHistory();
                        renderHistory();
                        Toast.show('历史记录已清空', 'success');
                    }
                }
            }
        }
    });
}

function navigateToSection(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
    
    const sectionNames = {
        'image-detection': '图片检测',
        'video-detection': '视频检测',
        'history': '历史记录',
        'about': '关于'
    };
    
    Toast.show(`已切换到${sectionNames[sectionId]}`, 'info');
}

function toggleSettingsPanel() {
    const settingsPanel = document.getElementById('settings-panel');
    const settingsToggle = document.getElementById('settings-toggle-btn');
    
    if (settingsPanel && settingsToggle) {
        settingsPanel.classList.toggle('active');
        settingsToggle.classList.toggle('active');
    }
}

function closeAllModals() {
    const modal = document.getElementById('disease-modal');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsToggle = document.getElementById('settings-toggle-btn');
    const shortcutsHelp = document.getElementById('shortcuts-help');
    const shortcutsToggle = document.getElementById('shortcuts-toggle');
    
    if (modal) modal.classList.remove('active');
    if (settingsPanel) settingsPanel.classList.remove('active');
    if (settingsToggle) settingsToggle.classList.remove('active');
    if (shortcutsHelp) shortcutsHelp.classList.add('hidden');
    if (shortcutsToggle) shortcutsToggle.classList.remove('hidden');
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .premium-button');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
}

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

function initImageDetection() {
    const uploadArea = document.getElementById('image-upload-area');
    const imageInput = document.getElementById('image-input');
    const previewArea = document.getElementById('image-preview-area');
    const previewImage = document.getElementById('preview-image');
    const imageCanvas = document.getElementById('image-canvas');
    const resultsPanel = document.getElementById('image-results');
    const clearButton = document.getElementById('clear-image');
    const toggleButton = document.getElementById('toggle-annotations');
    const downloadButton = document.getElementById('download-result');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            window.showAnnotations = !window.showAnnotations;
            toggleButton.innerHTML = window.showAnnotations 
                ? '<i class="fas fa-eye"></i> 显示标注'
                : '<i class="fas fa-eye-slash"></i> 隐藏标注';
            if (currentDetections) {
                drawAnnotations();
            }
            Toast.show(window.showAnnotations ? '标注已显示' : '标注已隐藏', 'info');
        });
    }

    uploadArea.addEventListener('click', () => imageInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleImageUpload(files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    clearButton.addEventListener('click', () => {
        resetImageDetection();
    });

    downloadButton.addEventListener('click', () => {
        downloadResult();
    });

    function resetImageDetection() {
        previewArea.style.display = 'none';
        uploadArea.style.display = 'block';
        previewImage.src = '';
        resultsPanel.innerHTML = '';
        imageCanvas.width = 0;
        imageCanvas.height = 0;
        currentImageFile = null;
        currentDetections = null;
        imageInput.value = '';
    }

    async function handleImageUpload(file) {
        if (!isBackendConnected) {
            Toast.show('后端服务未连接，请检查服务状态', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            Toast.show('文件大小不能超过10MB', 'error');
            return;
        }

        currentImageFile = file;
        const reader = new FileReader();
        reader.onload = async function(e) {
            previewImage.src = e.target.result;
            uploadArea.style.display = 'none';
            previewArea.style.display = 'block';
            resultsPanel.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div class="loading"></div>
                    <p style="margin-top: 1rem; color: var(--text-light);">正在分析中...</p>
                </div>
            `;
            
            try {
                const result = await api.detectImage(file);
                currentDetections = result;
                displayImageResults(result);
                historyManager.addRecord('image', result);
                Toast.show('检测完成！', 'success');
            } catch (error) {
                console.error('检测失败:', error);
                resultsPanel.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #ef4444;">
                        <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <p>检测失败: ${error.message || '网络错误'}</p>
                        <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 1rem;">
                            ${error.message && error.message.includes('Failed to fetch') ? 
                                '检测时间较长，请耐心等待（首次检测需要1-2分钟）<br>如果多次失败，请稍后重试' : 
                                '请检查后端服务是否正常运行'}
                        </p>
                    </div>
                `;
                Toast.show('检测失败，请重试', 'error');
            }
        };
        reader.readAsDataURL(file);
    }

    function displayImageResults(result) {
        if (result.success && result.detections.length > 0) {
            let html = '<h4 style="margin-bottom: 1.5rem; font-size: 1.25rem; font-weight: 700;"><i class="fas fa-search"></i> 检测到以下问题:</h4>';
            result.detections.forEach((detection, index) => {
                const severity = getSeverity(detection.confidence);
                html += `
                    <div class="result-item" style="border-left-color: ${severity.color};">
                        <div class="result-class">
                            <i class="fas fa-tooth"></i>
                            ${detection.class_name}
                            <span style="margin-left: auto; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; background: ${severity.bg}; color: ${severity.color};">${severity.label}</span>
                        </div>
                        <div class="result-confidence">
                            置信度: <span class="value">${(detection.confidence * 100).toFixed(2)}%</span>
                        </div>
                        <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
                            <small style="color: var(--text-light);">${getDiseaseInfo(detection.class_name)}</small>
                        </div>
                    </div>
                `;
            });
            resultsPanel.innerHTML = html;
            drawAnnotations();
        } else if (result.success && result.detections.length === 0) {
            resultsPanel.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--secondary-color); margin-bottom: 1rem;"></i>
                    <h4 style="color: var(--secondary-color); font-size: 1.25rem; margin-bottom: 0.5rem;">未检测到异常</h4>
                    <p style="color: var(--text-light);">您的牙齿状况良好，请继续保持！</p>
                </div>
            `;
        } else {
            resultsPanel.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #ef4444;">
                    <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>${result.message || '检测失败'}</p>
                </div>
            `;
        }
    }

    function drawAnnotations() {
        if (!previewImage.src || !currentDetections || !currentDetections.detections) return;
        
        const ctx = imageCanvas.getContext('2d');
        const img = previewImage;
        
        imageCanvas.width = img.naturalWidth || img.width;
        imageCanvas.height = img.naturalHeight || img.height;
        
        ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        
        if (!window.showAnnotations) return;
        
        currentDetections.detections.forEach(detection => {
            const bbox = detection.bbox;
            const [x1, y1, x2, y2] = bbox;
            
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(x1, y1 - 25, 150, 25);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`${detection.class_name} ${(detection.confidence * 100).toFixed(0)}%`, x1 + 5, y1 - 7);
        });
    }

    function downloadResult() {
        if (!previewImage.src) return;
        
        const link = document.createElement('a');
        link.download = `detection_result_${Date.now()}.png`;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imageCanvas.width;
        tempCanvas.height = imageCanvas.height;
        const ctx = tempCanvas.getContext('2d');
        
        ctx.drawImage(previewImage, 0, 0);
        if (window.showAnnotations && imageCanvas.width > 0) {
            ctx.drawImage(imageCanvas, 0, 0);
        }
        
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
        Toast.show('图片已下载', 'success');
    }

    previewImage.onload = function() {
        drawAnnotations();
    };
}

function initVideoDetection() {
    const uploadArea = document.getElementById('video-upload-area');
    const videoInput = document.getElementById('video-input');
    const previewArea = document.getElementById('video-preview-area');
    const videoStream = document.getElementById('video-stream');
    const clearButton = document.getElementById('clear-video');

    uploadArea.addEventListener('click', () => videoInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('video/')) {
            handleVideoUpload(files[0]);
        }
    });

    videoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleVideoUpload(e.target.files[0]);
        }
    });

    clearButton.addEventListener('click', () => {
        videoStream.src = '';
        previewArea.style.display = 'none';
        uploadArea.style.display = 'block';
        videoInput.value = '';
        Toast.show('已停止视频检测', 'info');
    });

    async function handleVideoUpload(file) {
        if (!isBackendConnected) {
            Toast.show('后端服务未连接，请检查服务状态', 'error');
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            Toast.show('文件大小不能超过100MB', 'error');
            return;
        }

        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        videoStream.src = '';
        
        Toast.show('正在处理视频，请稍候...', 'info');
        
        try {
            const response = await api.detectVideo(file);
            if (response.ok) {
                videoStream.src = `${API_BASE_URL}/detect/video`;
                Toast.show('视频检测已启动', 'success');
                historyManager.addRecord('video', { message: '视频检测完成' });
            } else {
                throw new Error('视频处理失败');
            }
        } catch (error) {
            console.error('视频检测失败:', error);
            Toast.show(`视频检测失败: ${error.message || '网络错误'}`, 'error');
            previewArea.style.display = 'none';
            uploadArea.style.display = 'block';
        }
    }
}

function initHistory() {
    const historyList = document.getElementById('history-list');
    const historyEmpty = document.getElementById('history-empty');
    const clearHistoryBtn = document.getElementById('clear-history');
    
    renderHistory();
    
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有历史记录吗？')) {
            historyManager.clearHistory();
            renderHistory();
            Toast.show('历史记录已清空', 'success');
        }
    });
    
    function renderHistory() {
        const history = historyManager.getHistory();
        
        if (history.length === 0) {
            historyEmpty.style.display = 'block';
            historyList.innerHTML = '';
            clearHistoryBtn.style.display = 'none';
            return;
        }
        
        historyEmpty.style.display = 'none';
        clearHistoryBtn.style.display = 'block';
        
        let html = '';
        history.forEach(item => {
            const icon = item.type === 'image' ? 'fa-image' : 'fa-video';
            const resultText = item.result.success 
                ? (item.result.detections && item.result.detections.length > 0 
                    ? `检测到 ${item.result.detections.length} 个问题` 
                    : '未检测到异常')
                : '检测失败';
            
            html += `
                <div class="history-item">
                    <div class="history-info">
                        <div class="history-date">
                            <i class="fas fa-clock"></i> ${item.date}
                        </div>
                        <div class="history-type">
                            <i class="fas ${icon}"></i> ${item.type === 'image' ? '图片检测' : '视频检测'}
                        </div>
                        <div class="history-result">${resultText}</div>
                    </div>
                    <div class="history-actions">
                        <button class="btn btn-small btn-outline" onclick="deleteHistoryItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        historyList.innerHTML = html;
    }
}

window.deleteHistoryItem = function(id) {
    const history = historyManager.getHistory();
    const newHistory = history.filter(item => item.id !== id);
    historyManager.history = newHistory;
    historyManager.saveHistory();
    renderHistory();
    Toast.show('记录已删除', 'success');
};

function getSeverity(confidence) {
    if (confidence >= 0.8) {
        return { label: '高', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
    } else if (confidence >= 0.5) {
        return { label: '中', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
    } else {
        return { label: '低', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    }
}

function getDiseaseInfo(className) {
    const diseaseInfo = {
        '龋齿': '牙齿表面出现黑色或棕色斑点，可能引起疼痛和敏感。建议及时就医治疗。',
        '牙周炎': '牙龈红肿、出血，可能伴有口臭。建议保持口腔卫生，定期洁牙。',
        '牙结石': '牙齿表面形成黄色或棕色硬质沉积物。建议定期洁牙，预防牙周疾病。',
        '牙菌斑': '牙齿表面形成软质粘性薄膜。建议每天刷牙两次，使用牙线清洁。',
        '牙龈炎': '牙龈发炎、红肿、易出血。建议加强口腔清洁，使用消炎漱口水。',
        '牙齿缺损': '牙齿表面出现破损或缺失。建议尽快就医修复，避免进一步损伤。'
    };
    
    return diseaseInfo[className] || '建议咨询专业牙医进行详细检查。';
}
