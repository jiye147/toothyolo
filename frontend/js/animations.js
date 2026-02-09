let mouseX = 0;
let mouseY = 0;
let isCursorTrailEnabled = true;
let particleSystem = null;

function initMouseAnimations() {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (isCursorTrailEnabled) {
            createCursorTrail(e.clientX, e.clientY);
        }
    });

    document.addEventListener('click', (e) => {
        createRipple(e.clientX, e.clientY);
    });

    initMagneticButtons();
    initParallaxEffect();
}

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0)';
    }, 100);
    
    setTimeout(() => {
        trail.remove();
    }, 600);
}

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = (x - 10) + 'px';
    ripple.style.top = (y - 10) + 'px';
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.style.opacity = '0';
    }, 500);
    
    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .nav-link, .disease-premium-card, .elegant-card');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * 0.3;
            const deltaY = (e.clientY - centerY) * 0.3;
            
            button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

function initParallaxEffect() {
    const cards = document.querySelectorAll('.stat-card, .feature-card, .disease-premium-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / 50;
            const deltaY = (e.clientY - centerY) / 50;
            
            card.style.transform = `perspective(1000px) rotateY(${deltaY}deg) rotateX(${deltaX}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.stat-card, .feature-card, .disease-premium-card, .about-card, .premium-button');
    animatedElements.forEach(el => observer.observe(el));
}

function initTypewriterEffect() {
    const titles = document.querySelectorAll('.premium-title, .elegant-title, .disease-premium-title');
    
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        let index = 0;
        
        const typeWriter = setInterval(() => {
            if (index < text.length) {
                title.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeWriter);
            }
        }, 50);
        
        title.addEventListener('mouseenter', () => {
            clearInterval(typeWriter);
            title.textContent = text;
        });
    });
}

function initCounterAnimation() {
    const statValues = document.querySelectorAll('.stat-number, .premium-stat-value, .disease-premium-stat-value');
    
    statValues.forEach(stat => {
        const targetValue = stat.textContent;
        const hasPercentage = targetValue.includes('%');
        const hasPlus = targetValue.includes('+');
        const hasLessThan = targetValue.includes('<');
        
        let numericValue = parseFloat(targetValue.replace(/[^0-9.]/g, ''));
        let suffix = '';
        
        if (hasLessThan) {
            const match = targetValue.match(/<([0-9.]+)(.*)$/);
            numericValue = match ? parseFloat(match[1]) : 0;
            suffix = match ? match[2] : '';
        }
        
        let currentValue = 0;
        const duration = 2000;
        const increment = numericValue / 40;
        
        const animateCounter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(animateCounter);
            }
            
            const displayValue = currentValue.toFixed(currentValue % 1 !== 0 ? 0 : 0);
            if (hasPercentage) {
                stat.textContent = displayValue + '%' + (hasPlus ? '+' : '');
            } else if (hasPlus) {
                stat.textContent = displayValue + '+';
            } else if (hasLessThan) {
                stat.textContent = '<' + displayValue + suffix;
            } else if (!isNaN(numericValue)) {
                stat.textContent = displayValue;
            }
        }, duration / 40);
    });
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.chart-bar-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

function initStaggeredAnimation() {
    const containers = document.querySelectorAll('.premium-stats, .symmetrical-features, .symmetrical-diseases');
    
    containers.forEach((container, index) => {
        const children = container.querySelectorAll(':scope > *');
        
        children.forEach((child, childIndex) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                child.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, (index * 200) + (childIndex * 150));
        });
    });
}

function initHoverEffects() {
    const hoverElements = document.querySelectorAll('.nav-link, .btn, .stat-card, .feature-card, .disease-premium-card, .about-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.classList.add('hover-active');
        });
        
        el.addEventListener('mouseleave', () => {
            el.classList.remove('hover-active');
        });
    });
}

function initBackgroundEffects() {
    const hero = document.querySelector('.hero');
    
    hero.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const moveX = (x - 0.5) * 30;
        const moveY = (y - 0.5) * 30;
        
        hero.style.backgroundPosition = `${moveX}px ${moveY}px`;
    });
}

function initLoadingAnimations() {
    const loadingElements = document.querySelectorAll('.loading');
    
    loadingElements.forEach(el => {
        const dots = el.textContent || '...';
        let dotCount = 0;
        
        setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            el.textContent = '.'.repeat(dotCount);
        }, 500);
    });
}

function initButtonPressEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

function initScrollProgress() {
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (windowHeight + rect.height)));
            
            section.style.setProperty('--scroll-progress', progress);
        });
    });
}

function initParticleBackground() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.getElementById('particles-container');
    
    if (!hero || !particlesContainer) return;
    
    const particleCount = 30;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(59, 130, 246, ${Math.random() * 0.15 + 0.05})`;
        particle.style.borderRadius = '50%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
        particles.push(particle);
    }
    
    hero.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        particles.forEach(particle => {
            const moveX = (x - 0.5) * 20;
            const moveY = (y - 0.5) * 20;
            
            particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

function initAdvancedAnimations() {
    initMouseAnimations();
    initScrollAnimations();
    initTypewriterEffect();
    initCounterAnimation();
    initProgressBars();
    initStaggeredAnimation();
    initHoverEffects();
    initBackgroundEffects();
    initLoadingAnimations();
    initButtonPressEffect();
    initScrollProgress();
    initParticleBackground();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initAdvancedAnimations();
    }
});
