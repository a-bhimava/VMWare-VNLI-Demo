// Navigation and Screen Management
class ScreenManager {
    constructor() {
        this.currentScreen = 'landing';
        this.currentJourney = null;
        this.currentStep = 0;
        this.beforeScreens = ['before-1', 'before-2', 'before-3', 'before-4', 'before-5', 'before-6', 'before-7'];
        this.afterScreens = ['after-1', 'after-2', 'after-3', 'after-4', 'after-5', 'after-6', 'after-7'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createAllScreens();
        this.showScreen('landing');
    }

    setupEventListeners() {
        // Landing page buttons
        document.getElementById('start-before')?.addEventListener('click', () => {
            this.startJourney('before');
        });

        document.getElementById('start-after')?.addEventListener('click', () => {
            this.startJourney('after');
        });

        // Navigation buttons - context-aware realistic actions
        document.addEventListener('click', (e) => {
            // Start Over button in menubar
            if (e.target.id === 'start-over-btn') {
                this.showScreen('landing');
                return;
            }

            // Handle realistic action buttons
            const action = e.target.getAttribute('data-action');
            const target = e.target.getAttribute('data-target');

            if (action === 'next') {
                this.nextScreen();
            } else if (action === 'complete') {
                this.showScreen('landing');
            } else if (action === 'switch-journey') {
                if (target) {
                    this.switchJourney(target);
                }
            }

            // Handle clickable interface elements
            if (e.target.closest('.clickable-notification')) {
                this.nextScreen();
            } else if (e.target.closest('.clickable-alert')) {
                this.nextScreen();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Don't interfere with typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case 'ArrowRight':
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.nextScreen();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousScreen();
                    break;
                case 'Escape':
                case 'Home':
                    e.preventDefault();
                    this.showScreen('landing');
                    break;
                case '1':
                    if (this.currentJourney) {
                        e.preventDefault();
                        this.switchJourney('before');
                    }
                    break;
                case '2':
                    if (this.currentJourney) {
                        e.preventDefault();
                        this.switchJourney('after');
                    }
                    break;
            }
        });

        // ROI overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('roi-close') || e.target.id === 'roi-overlay') {
                this.hideROI();
            } else if (e.target.classList.contains('roi-share-btn')) {
                this.shareROI();
            }
        });

        // ROI calculator inputs
        this.setupROICalculator();
    }

    createAllScreens() {
        const app = document.getElementById('app');
        
        // Create all before screens
        this.beforeScreens.forEach((screenId, index) => {
            if (!document.getElementById(screenId)) {
                const screen = this.createBeforeScreen(screenId, index + 1);
                app.appendChild(screen);
            }
        });

        // Create all after screens
        this.afterScreens.forEach((screenId, index) => {
            if (!document.getElementById(screenId)) {
                const screen = this.createAfterScreen(screenId, index + 1);
                app.appendChild(screen);
            }
        });
    }

    createBeforeScreen(screenId, stepNumber) {
        const screen = document.createElement('div');
        screen.id = screenId;
        screen.className = 'screen before-screen';
        
        const content = this.getBeforeScreenContent(stepNumber);
        screen.innerHTML = `
            <div class="screen-container">
                <div class="screen-content">
                    <div class="content-main">
                        ${content.html}
                    </div>
                </div>
            </div>
        `;
        
        return screen;
    }

    createAfterScreen(screenId, stepNumber) {
        const screen = document.createElement('div');
        screen.id = screenId;
        screen.className = 'screen after-screen';
        
        const content = this.getAfterScreenContent(stepNumber);
        screen.innerHTML = `
            <div class="screen-container">
                <div class="screen-content">
                    <div class="content-main">
                        ${content.html}
                    </div>
                </div>
            </div>
        `;
        
        return screen;
    }

    getBeforeScreenContent(step) {
        const contents = {
            1: {
                time: '3:17 AM',
                html: `
                    <div class="phone-mockup">
                        <div class="notification clickable-notification" data-action="next">
                            <div class="notification-header">
                                <div class="app-icon">📱</div>
                                <div class="notification-title">VMware Alert</div>
                                <div class="notification-time">now</div>
                            </div>
                            <div class="notification-body">
                                <strong>CRITICAL: Production VM cluster CPU > 95%</strong><br>
                                Cluster: PROD-CLUSTER-01<br>
                                Affected VMs: 15 critical services
                            </div>
                        </div>
                        <div class="phone-caption">Sarah's phone buzzes at 3:17 AM</div>
                        <div class="interaction-hint">
                            <div class="tap-indicator">👆 Tap notification to check vCenter</div>
                        </div>
                    </div>
                `
            },
            2: {
                time: '3:25 AM',
                html: `
                    <div class="vcenter-mockup">
                        <div class="vcenter-header">
                            <div class="vcenter-logo">VMware vSphere Client</div>
                            <div class="vcenter-user">sarah.admin@company.com</div>
                        </div>
                        <div class="vcenter-body">
                            <div style="background: #2d3748; padding: 2rem; text-align: center; border-radius: 8px;">
                                <div style="margin-bottom: 2rem;">
                                    <div style="font-size: 1.5rem; margin-bottom: 1rem;">🔐</div>
                                    <div style="font-size: 1.2rem; margin-bottom: 1rem; color: #a0aec0;">Connecting to vcenter-prod.company.com</div>
                                    <div class="loading-spinner" style="margin: 0 auto;"></div>
                                </div>
                                <div style="color: #e53e3e; font-size: 0.9rem; margin-bottom: 2rem;">Connection timeout... retrying...</div>
                                <button class="realistic-btn connect-btn" data-action="next">
                                    🔄 Retry Connection
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem; color: #a0aec0; font-style: italic;">
                        Sarah waits frustratingly for the slow VPN connection
                    </div>
                `
            },
            3: {
                time: '3:32 AM',
                html: `
                    <div class="vcenter-mockup">
                        <div class="vcenter-header">
                            <div class="vcenter-logo">VMware vSphere Client</div>
                            <div class="vcenter-user">sarah.admin@company.com</div>
                        </div>
                        <div class="vcenter-body">
                            <div class="vcenter-sidebar">
                                <div class="sidebar-section">
                                    <div class="sidebar-title">Inventory</div>
                                    <div class="sidebar-item active">Hosts and Clusters</div>
                                    <div class="sidebar-item">VMs and Templates</div>
                                    <div class="sidebar-item">Storage</div>
                                    <div class="sidebar-item">Networks</div>
                                </div>
                            </div>
                            <div class="vcenter-main">
                                <div class="vcenter-alerts">
                                    <div class="alert-item clickable-alert" data-action="next">
                                        <div class="alert-icon">⚠️</div>
                                        <div class="alert-content">
                                            <div class="alert-title">Critical: High CPU Usage</div>
                                            <div class="alert-details">PROD-CLUSTER-01 - 15 VMs affected</div>
                                        </div>
                                        <div class="alert-action">👆 Click to investigate</div>
                                    </div>
                                    <div class="alert-item">
                                        <div class="alert-icon">⚠️</div>
                                        <div class="alert-content">
                                            <div class="alert-title">Warning: Memory Usage</div>
                                            <div class="alert-details">Multiple hosts above 85%</div>
                                        </div>
                                    </div>
                                    <div class="alert-item">
                                        <div class="alert-icon">⚠️</div>
                                        <div class="alert-content">
                                            <div class="alert-title">Critical: Storage Latency</div>
                                            <div class="alert-details">Datastore performance degraded</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem; color: #a0aec0; font-style: italic;">
                        Sarah clicks on the critical alert to get more details
                    </div>
                `
            },
            4: {
                time: '3:45 AM',
                html: `
                    <div class="terminal-mockup">
                        <div class="terminal-header">
                            <div class="terminal-dots">
                                <div class="terminal-dot red"></div>
                                <div class="terminal-dot yellow"></div>
                                <div class="terminal-dot green"></div>
                            </div>
                            <div class="terminal-title">PowerShell - PowerCLI</div>
                        </div>
                        <div class="terminal-line">
                            <span class="terminal-prompt">PS C:\\></span>
                            <span class="terminal-command">Get-VM | Where-Object {$_.PowerState -eq 'PoweredOn'} | Get-Stat -Stat cpu.usage.average -Start (Get-Date).AddHours(-1)</span>
                        </div>
                        <div class="terminal-output">
                            Get-Stat : Cannot validate argument on parameter 'Entity'. The argument is null or empty.
                        </div>
                        <div class="terminal-line">
                            <span class="terminal-prompt">PS C:\\></span>
                            <span class="terminal-command">Get-VM -Location "PROD-CLUSTER-01" | Get-Stat -Stat cpu.usage.average</span>
                        </div>
                        <div class="terminal-output">
                            Syntax error at line 1: Unexpected token '-Location'
                        </div>
                        <div class="terminal-line">
                            <span class="terminal-prompt">PS C:\\></span>
                            <span class="terminal-command typing-animation">Get-Cluster "PROD-CLUSTER-01" | Get-VM | Get-Stat -Stat cpu.usage.average -Start (Get-Date).AddMinutes(-30)<span class="terminal-cursor"></span></span>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="realistic-btn terminal-btn" data-action="next">
                            ⌨️ Try Different Command Approach
                        </button>
                        <div style="color: #a0aec0; font-style: italic; margin-top: 1rem;">
                            Sarah gives up on PowerCLI and searches for help
                        </div>
                    </div>
                `
            },
            5: {
                time: '4:15 AM',
                html: `
                    <div style="background: #2d3748; border-radius: 12px; padding: 2rem; margin: 2rem auto; max-width: 900px;">
                        <h3 style="color: #fff; margin-bottom: 2rem; text-align: center;">📚 Documentation Search Session</h3>
                        <div style="background: #1a202c; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
                            <div style="color: #a0aec0; font-size: 0.9rem; margin-bottom: 0.5rem;">Browser Tab 1:</div>
                            <div style="color: #4299e1;">VMware vSphere PowerCLI Reference - Get-Stat</div>
                        </div>
                        <div style="background: #1a202c; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
                            <div style="color: #a0aec0; font-size: 0.9rem; margin-bottom: 0.5rem;">Browser Tab 2:</div>
                            <div style="color: #4299e1;">Stack Overflow: "PowerCLI CPU usage monitoring script"</div>
                        </div>
                        <div style="background: #1a202c; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
                            <div style="color: #a0aec0; font-size: 0.9rem; margin-bottom: 0.5rem;">Browser Tab 3:</div>
                            <div style="color: #4299e1;">Company Wiki: "Emergency VM Performance Procedures"</div>
                        </div>
                        <div style="background: #1a202c; border-radius: 8px; padding: 1.5rem;">
                            <div style="color: #a0aec0; font-size: 0.9rem; margin-bottom: 0.5rem;">Browser Tab 4:</div>
                            <div style="color: #4299e1;">VMware Communities: "High CPU usage troubleshooting"</div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="realistic-btn search-btn" data-action="next">
                            🔍 Search More Resources
                        </button>
                        <div style="color: #a0aec0; font-style: italic; margin-top: 1rem;">
                            Still no clear solution - try manual resource allocation
                        </div>
                    </div>
                `
            },
            6: {
                time: '5:30 AM',
                html: `
                    <div class="vcenter-mockup">
                        <div class="vcenter-header">
                            <div class="vcenter-logo">VMware vSphere Client</div>
                            <div class="vcenter-user">sarah.admin@company.com</div>
                        </div>
                        <div style="padding: 2rem;">
                            <h3 style="color: #fff; margin-bottom: 2rem;">Manual Resource Allocation</h3>
                            <div style="background: #1a202c; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
                                <div style="margin-bottom: 1.5rem;">
                                    <label style="color: #a0aec0; display: block; margin-bottom: 0.5rem;">VM: PROD-WEB-01</label>
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <span style="color: #fff;">CPU: 2 vCPU</span>
                                        <input type="range" min="1" max="8" value="4" style="flex: 1;">
                                        <span style="color: #00b388;">4 vCPU</span>
                                    </div>
                                </div>
                                <div style="margin-bottom: 1.5rem;">
                                    <label style="color: #a0aec0; display: block; margin-bottom: 0.5rem;">Memory:</label>
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <span style="color: #fff;">4 GB</span>
                                        <input type="range" min="2" max="16" value="8" style="flex: 1;">
                                        <span style="color: #00b388;">8 GB</span>
                                    </div>
                                </div>
                                <button class="realistic-btn apply-btn" data-action="next" style="background: #0091da; border: none; color: white; padding: 0.75rem 2rem; border-radius: 6px; cursor: pointer;">Apply Changes</button>
                            </div>
                            <div style="color: #ffa500; font-style: italic; text-align: center; margin-top: 1rem;">
                                ⚠️ Changes require VM restart - 15 VMs to configure manually
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 2rem; color: #a0aec0; font-style: italic;">
                            Sarah hopes this trial-and-error approach will work
                        </div>
                    </div>
                `
            },
            7: {
                time: '7:02 AM',
                html: `
                    <div style="text-align: center; padding: 3rem 2rem;">
                        <div style="font-size: 6rem; margin-bottom: 2rem;">😴</div>
                        <h2 style="font-size: 2.5rem; color: #00b388; margin-bottom: 1rem;">Problem Finally Resolved</h2>
                        <div style="background: #2d3748; border-radius: 12px; padding: 2rem; margin: 2rem auto; max-width: 600px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                                <div>
                                    <div style="font-size: 2rem; color: #e53e3e; font-weight: bold;">3h 45m</div>
                                    <div style="color: #a0aec0;">Total Time</div>
                                </div>
                                <div>
                                    <div style="font-size: 2rem; color: #e53e3e; font-weight: bold;">$612</div>
                                    <div style="color: #a0aec0;">Overtime + Downtime</div>
                                </div>
                            </div>
                            <div style="background: #0091da; color: white; padding: 1rem; border-radius: 8px;">
                                ✅ All VMs back to normal performance
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 2rem;">
                            <button class="realistic-btn complete-btn" data-action="complete">
                                😴 Finally Fixed - Back to Sleep
                            </button>
                            <div style="color: #a0aec0; font-style: italic; margin-top: 1rem;">
                                Sarah is exhausted but relieved - until the next alert
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 2rem;">
                            <button class="journey-switch-btn" data-action="switch-journey" data-target="after">
                                🔄 See how VNLI handles this same scenario
                            </button>
                        </div>
                    </div>
                `
            }
        };
        
        return contents[step] || { time: '3:17 AM', html: '<div>Screen content loading...</div>' };
    }

    getAfterScreenContent(step) {
        const contents = {
            1: {
                time: '3:17 AM',
                html: `
                    <div class="phone-mockup">
                        <div class="notification clickable-notification" data-action="next">
                            <div class="notification-header">
                                <div class="app-icon">📱</div>
                                <div class="notification-title">VMware Alert</div>
                                <div class="notification-time">now</div>
                            </div>
                            <div class="notification-body">
                                <strong>CRITICAL: Production VM cluster CPU > 95%</strong><br>
                                Cluster: PROD-CLUSTER-01<br>
                                Affected VMs: 15 critical services
                            </div>
                        </div>
                        <div class="phone-caption">Sarah's phone buzzes at 3:17 AM<br><strong style="color: #00b388;">But now she has VNLI...</strong></div>
                        <div class="interaction-hint">
                            <div class="tap-indicator">👆 Tap notification to open VNLI</div>
                        </div>
                    </div>
                `
            },
            2: {
                time: '3:18 AM',
                html: `
                    <div class="vnli-interface">
                        <div class="vnli-header">
                            <div class="vnli-logo">VNLI</div>
                            <div class="vnli-subtitle">VMware Natural Language Intelligence</div>
                        </div>
                        <div class="chat-interface">
                            <div class="chat-message">
                                <div class="message-avatar">👩</div>
                                <div class="message-content">
                                    "What's causing the production cluster alert?"
                                </div>
                            </div>
                            <div class="chat-input">
                                <button class="mic-btn" data-action="next">🎤 Ask VNLI</button>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem; color: #a0aec0; font-style: italic;">
                        Sarah speaks naturally to VNLI - no complex commands needed
                    </div>
                `
            },
            3: {
                time: '3:18 AM',
                html: `
                    <div class="ai-analysis">
                        <div class="analysis-header">
                            <div class="analysis-icon">🤖</div>
                            <div class="analysis-title">AI Analysis in Progress</div>
                        </div>
                        <div class="analysis-progress">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="analysis-results">
                            <div class="result-item">
                                <div class="result-icon">📊</div>
                                <div class="result-content">
                                    <div class="result-title">Analyzing 2,847 VMs across 12 clusters</div>
                                    <div class="result-description">Real-time performance data processing</div>
                                </div>
                            </div>
                            <div class="result-item">
                                <div class="result-icon">🔍</div>
                                <div class="result-content">
                                    <div class="result-title">Pattern recognition complete</div>
                                    <div class="result-description">Correlating metrics and dependencies</div>
                                </div>
                            </div>
                            <div class="result-item">
                                <div class="result-icon">⚡</div>
                                <div class="result-content">
                                    <div class="result-title">Root cause identified</div>
                                    <div class="result-description">Solution recommendations ready</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="realistic-btn analysis-btn" data-action="next">
                            ⚡ Analysis Complete - View Results
                        </button>
                        <div style="color: #a0aec0; font-style: italic; margin-top: 1rem;">
                            AI processed thousands of data points in seconds
                        </div>
                    </div>
                `
            },
            4: {
                time: '3:18 AM',
                html: `
                    <div class="vnli-interface">
                        <div class="vnli-header">
                            <div class="vnli-logo">VNLI</div>
                            <div class="vnli-subtitle">Intelligent Diagnosis</div>
                        </div>
                        <div class="chat-interface">
                            <div class="chat-message">
                                <div class="message-avatar">🤖</div>
                                <div class="message-content">
                                    <strong>Root Cause Identified:</strong><br><br>
                                    VM-PROD-47 is running a memory leak in the backup service process. This VM is consuming 94% CPU and affecting 14 other VMs on the same host.<br><br>
                                    <strong>Recommended Action:</strong> Restart the backup service on VM-PROD-47 (safe operation, 30-second downtime).
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="realistic-btn diagnosis-btn" data-action="next">
                            🎯 View Root Cause & Solution
                        </button>
                        <div style="color: #a0aec0; font-style: italic; margin-top: 1rem;">
                            Clear diagnosis with actionable solution provided
                        </div>
                    </div>
                `
            },
            5: {
                time: '3:19 AM',
                html: `
                    <div class="vnli-interface">
                        <div class="vnli-header">
                            <div class="vnli-logo">VNLI</div>
                            <div class="vnli-subtitle">One-Click Remediation</div>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 2rem; margin: 2rem 0;">
                            <h3 style="color: white; text-align: center; margin-bottom: 2rem;">Proposed Solution</h3>
                            <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
                                <div style="color: white; margin-bottom: 1rem;"><strong>Action:</strong> Restart backup service on VM-PROD-47</div>
                                <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: 1rem;"><strong>Impact:</strong> 30-second service interruption</div>
                                <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: 1rem;"><strong>Risk:</strong> Low - Safe operation</div>
                                <div style="color: #00b388;"><strong>Expected Result:</strong> 95% performance improvement</div>
                            </div>
                            <div style="display: flex; gap: 1rem; justify-content: center;">
                                <button class="realistic-btn execute-btn" data-action="next" style="background: #00b388; border: none; color: white; padding: 1rem 2rem; border-radius: 25px; font-size: 1.1rem; cursor: pointer; font-weight: bold;">✓ Execute Fix</button>
                                <button style="background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); color: white; padding: 1rem 2rem; border-radius: 25px; font-size: 1.1rem; cursor: pointer;">Show Details</button>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem; color: #a0aec0; font-style: italic;">
                        Safe, one-click solution with clear impact assessment
                    </div>
                `
            },
            6: {
                time: '3:20 AM',
                html: `
                    <div class="vnli-interface">
                        <div class="vnli-header">
                            <div class="vnli-logo">VNLI</div>
                            <div class="vnli-subtitle">Automated Resolution</div>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 2rem;">
                            <div style="text-align: center; margin-bottom: 2rem;">
                                <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
                                <h3 style="color: white; margin-bottom: 1rem;">Executing Resolution</h3>
                            </div>
                            <div style="background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 1.5rem; font-family: monospace; color: #00ff00; margin-bottom: 2rem;">
                                <div>✓ Connecting to VM-PROD-47...</div>
                                <div>✓ Stopping backup service...</div>
                                <div>✓ Clearing memory allocation...</div>
                                <div>✓ Restarting service...</div>
                                <div style="color: #00b388;">✓ Service restored successfully</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #00b388; font-size: 1.2rem; font-weight: bold;">✅ Resolution Complete</div>
                                <div style="color: rgba(255, 255, 255, 0.8); margin-top: 0.5rem;">Cluster performance restored to normal</div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="realistic-btn monitor-btn" data-action="next">
                            📊 Monitor Progress Complete
                        </button>
                        <div style="color: #a0aec0; font-style: italic; margin-top: 1rem;">
                            Automated resolution with real-time monitoring
                        </div>
                    </div>
                `
            },
            7: {
                time: '3:21 AM',
                html: `
                    <div style="text-align: center; padding: 3rem 2rem;">
                        <div style="font-size: 6rem; margin-bottom: 2rem;">😴</div>
                        <h2 style="font-size: 2.5rem; color: #00b388; margin-bottom: 1rem;">Back to Sleep</h2>
                        <div style="background: linear-gradient(135deg, #0091DA, #00B388); border-radius: 12px; padding: 2rem; margin: 2rem auto; max-width: 600px; color: white;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                                <div>
                                    <div style="font-size: 2rem; font-weight: bold;">4 min</div>
                                    <div style="opacity: 0.9;">Total Time</div>
                                </div>
                                <div>
                                    <div style="font-size: 2rem; font-weight: bold;">$608</div>
                                    <div style="opacity: 0.9;">Cost Saved</div>
                                </div>
                            </div>
                            <div style="background: rgba(255, 255, 255, 0.2); padding: 1rem; border-radius: 8px;">
                                ✅ Problem resolved with confidence in AI-powered monitoring
                            </div>
                        </div>
                        <div style="color: #a0aec0; font-style: italic; margin-top: 2rem;">
                            Sarah returns to sleep knowing VNLI is watching
                        </div>
                        <div style="text-align: center; margin-top: 2rem;">
                            <button class="realistic-btn sleep-btn" data-action="complete">
                                😴 Back to Sleep with Confidence
                            </button>
                            <div style="color: #a0aec0; font-style: italic; margin-top: 1rem;">
                                Sarah sleeps peacefully knowing VNLI is monitoring
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 2rem;">
                            <button class="roi-btn" onclick="screenManager.showROI()" style="background: #0091da; border: none; color: white; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-size: 1.1rem;">
                                💰 View ROI Impact
                            </button>
                        </div>
                        <div style="text-align: center; margin-top: 2rem;">
                            <button class="journey-switch-btn" data-action="switch-journey" data-target="before">
                                🔄 See how the old way handles this scenario
                            </button>
                        </div>
                    </div>
                `
            }
        };
        
        return contents[step] || { time: '3:17 AM', html: '<div>Screen content loading...</div>' };
    }

    createProgressDots(currentStep, totalSteps) {
        let dots = '';
        for (let i = 1; i <= totalSteps; i++) {
            const activeClass = i === currentStep ? ' active' : '';
            dots += `<span class="dot${activeClass}"></span>`;
        }
        return dots;
    }

    startJourney(journey) {
        this.currentJourney = journey;
        this.currentStep = 1;
        const screenId = journey === 'before' ? 'before-1' : 'after-1';
        this.showScreen(screenId);
    }

    nextScreen(journey = this.currentJourney) {
        if (!journey) return;
        
        // Add visual feedback for button press
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('realistic-btn')) {
            this.addClickFeedback(activeElement);
        }
        
        if (this.currentStep < 7) {
            this.currentStep++;
            const screenId = `${journey}-${this.currentStep}`;
            this.showScreen(screenId);
        } else {
            // Journey complete - return to landing or show completion
            this.showScreen('landing');
        }
    }

    addClickFeedback(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 150);
    }

    previousScreen(journey = this.currentJourney) {
        if (!journey) return;
        
        if (this.currentStep > 1) {
            this.currentStep--;
            const screenId = `${journey}-${this.currentStep}`;
            this.showScreen(screenId);
        } else {
            this.showScreen('landing');
        }
    }

    switchJourney(newJourney) {
        const oldJourney = this.currentJourney;
        this.currentJourney = newJourney;
        const screenId = `${newJourney}-${this.currentStep}`;
        this.showScreen(screenId);
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // Update journey tracking
            if (screenId.startsWith('before-') || screenId.startsWith('after-')) {
                const parts = screenId.split('-');
                this.currentJourney = parts[0];
                this.currentStep = parseInt(parts[1]);
                this.updateMenubar();
            } else {
                this.hideMenubar();
            }
        }
    }

    updateMenubar() {
        const menubar = document.getElementById('menubar');
        const journeyIndicator = document.getElementById('menubar-journey-indicator');
        const timestamp = document.getElementById('menubar-timestamp');
        const currentStepEl = document.getElementById('menubar-current-step');
        const totalStepsEl = document.getElementById('menubar-total-steps');
        const progressFill = document.getElementById('menubar-progress-fill');

        if (!menubar) return;

        // Show menubar
        menubar.classList.remove('hidden');

        // Update journey indicator and styling
        if (this.currentJourney === 'before') {
            journeyIndicator.textContent = 'The Current Nightmare';
            journeyIndicator.className = 'menubar-journey-indicator before-journey';
        } else if (this.currentJourney === 'after') {
            journeyIndicator.textContent = 'The VNLI Transformation';
            journeyIndicator.className = 'menubar-journey-indicator after-journey';
        }

        // Update timestamp based on current step
        const timeStamps = {
            before: ['3:17 AM', '3:25 AM', '3:32 AM', '3:45 AM', '4:15 AM', '5:30 AM', '7:02 AM'],
            after: ['3:17 AM', '3:18 AM', '3:18 AM', '3:18 AM', '3:19 AM', '3:20 AM', '3:21 AM']
        };
        
        if (timestamp && timeStamps[this.currentJourney]) {
            timestamp.textContent = timeStamps[this.currentJourney][this.currentStep - 1] || '3:17 AM';
        }

        // Update progress
        if (currentStepEl) currentStepEl.textContent = this.currentStep;
        if (totalStepsEl) totalStepsEl.textContent = '7';
        if (progressFill) {
            const progressPercent = (this.currentStep / 7) * 100;
            progressFill.style.width = progressPercent + '%';
        }
    }

    hideMenubar() {
        const menubar = document.getElementById('menubar');
        if (menubar) {
            menubar.classList.add('hidden');
        }
    }

    showROI() {
        const overlay = document.getElementById('roi-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideROI() {
        const overlay = document.getElementById('roi-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    setupROICalculator() {
        const inputs = ['incidents-per-month', 'hourly-rate', 'team-size'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.calculateROI());
            }
        });
    }

    calculateROI() {
        const incidents = parseInt(document.getElementById('incidents-per-month')?.value) || 10;
        const hourlyRate = parseInt(document.getElementById('hourly-rate')?.value) || 85;
        const teamSize = parseInt(document.getElementById('team-size')?.value) || 5;

        // Time saved per incident: 3h 41m = 3.68 hours
        const timeSavedPerIncident = 3.68;
        const costSavedPerIncident = timeSavedPerIncident * hourlyRate;
        
        const monthlySavings = incidents * costSavedPerIncident * teamSize;
        const annualSavings = monthlySavings * 12;

        // Update display
        const monthlyElement = document.getElementById('monthly-savings');
        const annualElement = document.getElementById('annual-savings');
        
        if (monthlyElement) {
            monthlyElement.textContent = this.formatCurrency(monthlySavings);
        }
        if (annualElement) {
            annualElement.textContent = this.formatCurrency(annualSavings);
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    shareROI() {
        const incidents = document.getElementById('incidents-per-month')?.value || 10;
        const hourlyRate = document.getElementById('hourly-rate')?.value || 85;
        const teamSize = document.getElementById('team-size')?.value || 5;
        const annualSavings = document.getElementById('annual-savings')?.textContent || '$380,160';

        const shareText = `VNLI ROI Impact:
        
📊 Our Analysis:
• ${incidents} critical incidents/month
• ${teamSize} person team
• $${hourlyRate}/hour IT rate

💰 Potential Annual Savings: ${annualSavings}

⏱️ Time saved per incident: 3h 41m
🎯 98% faster resolution with AI-powered VMware management

#VNLI #VMware #DigitalTransformation`;

        if (navigator.share) {
            navigator.share({
                title: 'VNLI ROI Impact',
                text: shareText
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                // Show success message
                const btn = document.querySelector('.roi-share-btn');
                const originalText = btn.textContent;
                btn.textContent = '✅ Copied to Clipboard!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        }
    }
}

// Initialize the application
let screenManager;
document.addEventListener('DOMContentLoaded', () => {
    screenManager = new ScreenManager();
});

// Make screenManager globally accessible for button clicks
window.screenManager = screenManager;