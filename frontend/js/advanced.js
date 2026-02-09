let confidenceThreshold = 25;
let animationsEnabled = true;
let currentTheme = 'blue';
window.showAnnotations = true;

const diseaseDatabase = {
    '龋齿': {
        title: '龋齿（蛀牙）',
        icon: 'fa-tooth',
        gradient: 'var(--gradient-1)',
        description: '龋齿是由于细菌感染导致牙齿硬组织破坏的疾病，是最常见的口腔疾病之一。',
        symptoms: [
            '牙齿表面出现黑色或棕色斑点',
            '对冷热酸甜食物敏感',
            '咀嚼时出现疼痛',
            '牙齿表面可见小洞或凹陷'
        ],
        causes: [
            '口腔卫生习惯不良',
            '高糖高酸饮食',
            '缺乏氟化物保护',
            '细菌滋生和牙菌斑堆积'
        ],
        treatments: [
            '早期：使用含氟牙膏，定期洁牙',
            '中期：补牙治疗，使用树脂或银汞合金材料',
            '严重：根管治疗或拔牙后修复',
            '预防：每天刷牙两次，使用牙线，定期口腔检查'
        ],
        prevention: [
            '保持良好的口腔卫生习惯',
            '减少糖分摄入，避免酸性食物',
            '使用含氟牙膏和漱口水',
            '定期进行口腔检查和洁牙',
            '使用牙线清洁牙缝'
        ],
        severity: 'medium',
        accuracy: '95%+'
    },
    '牙周炎': {
        title: '牙周炎',
        icon: 'fa-heartbeat',
        gradient: 'var(--gradient-2)',
        description: '牙周炎是牙龈和牙周组织的炎症性疾病，可能导致牙齿松动甚至脱落。',
        symptoms: [
            '牙龈红肿、出血',
            '口臭明显',
            '牙龈退缩，牙根暴露',
            '咀嚼无力，牙齿松动',
            '牙龈有脓液流出'
        ],
        causes: [
            '牙菌斑和牙结石堆积',
            '口腔卫生不良',
            '吸烟和饮酒',
            '糖尿病等全身性疾病',
            '遗传因素'
        ],
        treatments: [
            '轻度：专业洁牙，改善口腔卫生',
            '中度：龈下刮治，抗生素治疗',
            '重度：牙周手术，骨移植',
            '维护：定期复查，持续口腔清洁'
        ],
        prevention: [
            '每天刷牙两次，使用牙线',
            '定期进行专业洁牙',
            '戒烟限酒',
            '控制血糖水平',
            '使用抗菌漱口水'
        ],
        severity: 'high',
        accuracy: '92%+'
    },
    '牙结石': {
        title: '牙结石',
        icon: 'fa-gem',
        gradient: 'var(--gradient-3)',
        description: '牙结石是钙化沉积在牙齿表面的硬质物质，主要由牙菌斑矿化形成。',
        symptoms: [
            '牙齿表面可见黄色或棕色沉积物',
            '牙龈边缘有硬质物质',
            '口臭问题',
            '刷牙时牙龈出血',
            '牙齿表面粗糙不平'
        ],
        causes: [
            '长期未彻底清洁牙齿',
            '牙菌斑长期堆积',
            '唾液成分影响',
            '饮食习惯（高钙食物）',
            '口腔pH值异常'
        ],
        treatments: [
            '专业超声波洁牙',
            '手动洁牙工具清除',
            '抛光牙面',
            '牙龈炎症治疗',
            '后续口腔卫生指导'
        ],
        prevention: [
            '每天正确刷牙2-3次',
            '使用牙线清洁牙缝',
            '定期（每6个月）专业洁牙',
            '使用抗菌漱口水',
            '减少粘性食物摄入'
        ],
        severity: 'low',
        accuracy: '98%+'
    }
};

const themes = {
    blue: {
        primary: '#0ea5e9',
        primaryDark: '#0284c7',
        primaryLight: '#7dd3fc',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    green: {
        primary: '#10b981',
        primaryDark: '#059669',
        primaryLight: '#34d399',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    purple: {
        primary: '#8b5cf6',
        primaryDark: '#7c3aed',
        primaryLight: '#a78bfa',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)'
    }
};

function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

function initSettingsPanel() {
    const settingsToggle = document.getElementById('settings-toggle-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');
    const toggleAnnotations = document.getElementById('toggle-annotations-setting');
    const confidenceSlider = document.getElementById('confidence-threshold');
    const confidenceValue = document.getElementById('confidence-value');
    const toggleAnimations = document.getElementById('toggle-animations');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
        settingsToggle.classList.toggle('active');
    });
    
    closeSettings.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
        settingsToggle.classList.remove('active');
    });
    
    toggleAnnotations.addEventListener('click', () => {
        toggleAnnotations.classList.toggle('active');
        window.showAnnotations = toggleAnnotations.classList.contains('active');
        if (currentDetections) {
            drawAnnotations();
        }
        Toast.show(window.showAnnotations ? '标注已显示' : '标注已隐藏', 'info');
    });
    
    confidenceSlider.addEventListener('input', (e) => {
        confidenceThreshold = parseInt(e.target.value);
        confidenceValue.textContent = confidenceThreshold + '%';
    });
    
    confidenceSlider.addEventListener('change', () => {
        Toast.show(`置信度阈值已设置为 ${confidenceThreshold}%`, 'success');
    });
    
    toggleAnimations.addEventListener('click', () => {
        toggleAnimations.classList.toggle('active');
        animationsEnabled = toggleAnimations.classList.contains('active');
        document.body.style.setProperty('--animations-enabled', animationsEnabled ? 'true' : 'false');
        Toast.show(animationsEnabled ? '动画已启用' : '动画已禁用', 'info');
    });
    
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            setTheme(theme);
            
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            Toast.show(`主题已切换为${option.querySelector('span').textContent}`, 'success');
        });
    });
}

function setTheme(theme) {
    currentTheme = theme;
    const themeConfig = themes[theme];
    
    document.documentElement.style.setProperty('--primary-color', themeConfig.primary);
    document.documentElement.style.setProperty('--primary-dark', themeConfig.primaryDark);
    document.documentElement.style.setProperty('--primary-light', themeConfig.primaryLight);
    
    localStorage.setItem('theme', theme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'blue';
    setTheme(savedTheme);
    
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        if (option.dataset.theme === savedTheme) {
            option.classList.add('active');
        }
    });
}

function initDiseaseModal() {
    const modal = document.getElementById('disease-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalBody = document.getElementById('modal-body');
    
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    window.showDiseaseDetail = function(diseaseName) {
        const disease = diseaseDatabase[diseaseName];
        if (!disease) return;
        
        modalTitle.textContent = disease.title;
        modalSubtitle.textContent = disease.description;
        
        let html = `
            <div class="disease-detail">
                <h4><i class="fas fa-exclamation-triangle"></i> 主要症状</h4>
                <ul>
                    ${disease.symptoms.map(s => `<li><i class="fas fa-check-circle"></i> ${s}</li>`).join('')}
                </ul>
            </div>
            
            <div class="disease-detail">
                <h4><i class="fas fa-search"></i> 病因分析</h4>
                <ul>
                    ${disease.causes.map(c => `<li><i class="fas fa-arrow-right"></i> ${c}</li>`).join('')}
                </ul>
            </div>
            
            <div class="treatment-card">
                <h4><i class="fas fa-medkit"></i> 治疗方案</h4>
                <ul>
                    ${disease.treatments.map(t => `<li><i class="fas fa-prescription"></i> ${t}</li>`).join('')}
                </ul>
            </div>
            
            <div class="disease-detail">
                <h4><i class="fas fa-shield-alt"></i> 预防措施</h4>
                <ul>
                    ${disease.prevention.map(p => `<li><i class="fas fa-check"></i> ${p}</li>`).join('')}
                </ul>
            </div>
            
            <div class="stats-chart">
                <h4><i class="fas fa-chart-line"></i> 检测统计</h4>
                <div class="chart-container">
                    <div class="chart-item">
                        <div class="chart-value">${disease.accuracy}</div>
                        <div class="chart-label">检测准确率</div>
                        <div class="chart-bar">
                            <div class="chart-bar-fill" style="width: ${parseFloat(disease.accuracy)}%;"></div>
                        </div>
                    </div>
                    <div class="chart-item">
                        <div class="chart-value">${disease.severity === 'high' ? '高' : disease.severity === 'medium' ? '中' : '低'}</div>
                        <div class="chart-label">严重程度</div>
                        <div class="chart-bar">
                            <div class="chart-bar-fill" style="width: ${disease.severity === 'high' ? '90%' : disease.severity === 'medium' ? '60%' : '30%'}; background: ${disease.severity === 'high' ? 'var(--danger-color)' : disease.severity === 'medium' ? 'var(--accent-color)' : 'var(--secondary-color)'};"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modalBody.innerHTML = html;
        modal.classList.add('active');
    };
}

function initAdvancedFeatures() {
    initParticles();
    initSettingsPanel();
    initDiseaseModal();
    loadSavedTheme();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initAdvancedFeatures();
    }
});
