// Animation Controller
class AnimationController {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupAnimationTriggers();
        this.setupTypingAnimations();
    }

    setupIntersectionObserver() {
        if (this.isReducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe elements that need scroll-triggered animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    setupAnimationTriggers() {
        // Listen for screen changes to trigger animations
        document.addEventListener('screenChange', (e) => {
            this.handleScreenChange(e.detail.screenId);
        });

        // Progress bar animations
        this.setupProgressAnimations();
        
        // Button hover effects
        this.setupButtonAnimations();
    }

    setupProgressAnimations() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('journey-btn')) {
                this.animateJourneyStart(e.target);
            }
        });
    }

    setupButtonAnimations() {
        document.querySelectorAll('.journey-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    this.animateButtonHover(btn);
                }
            });
        });
    }

    setupTypingAnimations() {
        // Animate terminal typing
        this.observeTerminalElements();
        
        // Animate AI analysis
        this.observeAnalysisElements();
    }

    observeTerminalElements() {
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTerminalTyping(entry.target);
                }
            });
        });

        document.querySelectorAll('.typing-animation').forEach(el => {
            terminalObserver.observe(el);
        });
    }

    observeAnalysisElements() {
        const analysisObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateAnalysisProgress(entry.target);
                }
            });
        });

        document.querySelectorAll('.progress-fill').forEach(el => {
            analysisObserver.observe(el);
        });
    }

    handleScreenChange(screenId) {
        if (this.isReducedMotion) return;

        // Trigger specific animations based on screen type
        if (screenId.includes('before-3') || screenId.includes('after-3')) {
            this.animateProgressBar();
        }
        
        if (screenId.includes('before-4')) {
            this.animateTerminalSession();
        }
        
        if (screenId.includes('after-2')) {
            this.animateVNLIInterface();
        }

        // Animate progress dots
        this.updateProgressDots();
    }

    animateJourneyStart(button) {
        if (this.isReducedMotion) return;

        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);

        // Add ripple effect
        this.createRippleEffect(button);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    animateButtonHover(button) {
        if (this.isReducedMotion) return;

        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        }, { once: true });
    }

    animateProgressBar() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = '85%';
            }, index * 200);
        });
    }

    animateTerminalTyping(element) {
        if (this.isReducedMotion) {
            element.textContent = element.textContent;
            return;
        }

        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50 + Math.random() * 100);
            } else {
                // Add blinking cursor
                const cursor = document.createElement('span');
                cursor.classList.add('terminal-cursor');
                element.appendChild(cursor);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    animateTerminalSession() {
        const commands = document.querySelectorAll('.terminal-command');
        commands.forEach((cmd, index) => {
            setTimeout(() => {
                this.animateTerminalTyping(cmd);
            }, index * 2000);
        });
    }

    animateVNLIInterface() {
        const vnliInterface = document.querySelector('.vnli-interface');
        if (vnliInterface && !this.isReducedMotion) {
            vnliInterface.style.opacity = '0';
            vnliInterface.style.transform = 'scale(0.9) translateY(20px)';
            
            setTimeout(() => {
                vnliInterface.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                vnliInterface.style.opacity = '1';
                vnliInterface.style.transform = 'scale(1) translateY(0)';
            }, 100);
        }

        // Animate chat messages
        this.animateChatMessages();
    }

    animateChatMessages() {
        const messages = document.querySelectorAll('.chat-message');
        messages.forEach((message, index) => {
            if (!this.isReducedMotion) {
                message.style.opacity = '0';
                message.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    message.style.transition = 'all 0.4s ease-out';
                    message.style.opacity = '1';
                    message.style.transform = 'translateY(0)';
                }, index * 300);
            }
        });
    }

    animateAnalysisProgress(progressElement) {
        if (this.isReducedMotion) {
            progressElement.style.width = '85%';
            return;
        }

        let width = 0;
        const targetWidth = 85;
        const increment = 2;
        
        const animate = () => {
            if (width < targetWidth) {
                width += increment;
                progressElement.style.width = width + '%';
                setTimeout(animate, 50);
            }
        };
        
        setTimeout(animate, 200);
    }

    updateProgressDots() {
        const dots = document.querySelectorAll('.progress-dots .dot');
        dots.forEach((dot, index) => {
            if (dot.classList.contains('active') && !this.isReducedMotion) {
                this.animateDot(dot);
            }
        });
    }

    animateDot(dot) {
        dot.style.transform = 'scale(1.2)';
        dot.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            dot.style.transform = 'scale(1)';
        }, 300);
    }

    triggerElementAnimation(element) {
        if (this.isReducedMotion) return;

        // Different animations based on element type
        if (element.classList.contains('notification')) {
            this.animateNotification(element);
        } else if (element.classList.contains('alert-item')) {
            this.animateAlert(element);
        } else if (element.classList.contains('result-item')) {
            this.animateResultItem(element);
        }
    }

    animateNotification(notification) {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.style.transition = 'all 0.4s ease-out';
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
    }

    animateAlert(alert) {
        alert.style.transform = 'translateX(-20px)';
        alert.style.opacity = '0';
        
        setTimeout(() => {
            alert.style.transition = 'all 0.4s ease-out';
            alert.style.transform = 'translateX(0)';
            alert.style.opacity = '1';
        }, 100);
    }

    animateResultItem(item) {
        item.style.transform = 'scale(0.95) translateY(10px)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease-out';
            item.style.transform = 'scale(1) translateY(0)';
            item.style.opacity = '1';
        }, 100);
    }

    // Loading state animations
    animateLoadingDots() {
        const loadingContainers = document.querySelectorAll('.loading-dots');
        loadingContainers.forEach(container => {
            const dots = container.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (!this.isReducedMotion) {
                    dot.style.animationDelay = (index * 0.2) + 's';
                }
            });
        });
    }

    // Typing indicator animation
    animateTypingIndicator() {
        const indicators = document.querySelectorAll('.typing-indicator');
        indicators.forEach(indicator => {
            const dots = indicator.querySelectorAll('.typing-dot');
            dots.forEach((dot, index) => {
                if (!this.isReducedMotion) {
                    dot.style.animationDelay = (index * 0.2) + 's';
                }
            });
        });
    }

    // ROI overlay animations
    animateROIOverlay(show = true) {
        const overlay = document.getElementById('roi-overlay');
        const content = overlay?.querySelector('.roi-content');
        
        if (!overlay || this.isReducedMotion) return;

        if (show) {
            overlay.classList.remove('hidden');
            overlay.style.opacity = '0';
            
            if (content) {
                content.style.transform = 'scale(0.9) translateY(50px)';
            }
            
            setTimeout(() => {
                overlay.style.transition = 'opacity 0.3s ease';
                overlay.style.opacity = '1';
                
                if (content) {
                    content.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    content.style.transform = 'scale(1) translateY(0)';
                }
            }, 10);
        } else {
            overlay.style.transition = 'opacity 0.3s ease';
            overlay.style.opacity = '0';
            
            if (content) {
                content.style.transition = 'transform 0.3s ease';
                content.style.transform = 'scale(0.9) translateY(50px)';
            }
            
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
        }
    }

    // Counter animation for statistics
    animateCounter(element, start = 0, end, duration = 2000) {
        if (this.isReducedMotion) {
            element.textContent = end;
            return;
        }

        const startTime = Date.now();
        const isTime = end.includes('h') || end.includes('m');
        const isCurrency = end.includes('$');
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            let current;
            if (isTime) {
                const minutes = parseInt(end.replace(/[^\d]/g, ''));
                current = Math.floor(progress * minutes);
                element.textContent = current + 'm';
            } else if (isCurrency) {
                const amount = parseInt(end.replace(/[^\d]/g, ''));
                current = Math.floor(progress * amount);
                element.textContent = '$' + current;
            } else {
                const num = parseInt(end.replace(/[^\d]/g, ''));
                current = Math.floor(progress * num);
                element.textContent = current + (end.includes('%') ? '%' : '');
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end;
            }
        };
        
        animate();
    }
}

// CSS for additional animations
const additionalStyles = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.terminal-cursor {
    display: inline-block;
    background: #00ff00;
    width: 2px;
    height: 1em;
    margin-left: 2px;
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

.glow-effect {
    animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
    from {
        filter: drop-shadow(0 0 5px rgba(0, 145, 218, 0.5));
    }
    to {
        filter: drop-shadow(0 0 20px rgba(0, 179, 136, 0.7));
    }
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize animation controller
let animationController;
document.addEventListener('DOMContentLoaded', () => {
    animationController = new AnimationController();
});

// Make animation controller globally accessible
window.animationController = animationController;