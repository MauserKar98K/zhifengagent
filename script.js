// 全局变量
let currentCaptcha = '';
let sessionTimeout;
let sessionWarningTimeout;

// 全局潜在商机数据
const potentialOpportunities = [
    { id: 1, time: '2025-12-23 10:20', company: '深圳电子科技有限公司', industry: '电子行业', region: '华南', type: '新工厂投产', priority: '高', status: '待跟进' },
    { id: 2, time: '2025-12-23 09:15', company: '上海汽车零部件有限公司', industry: '汽车行业', region: '华东', type: '出口需求增加', priority: '高', status: '跟进中' },
    { id: 3, time: '2025-12-22 16:30', company: '广州机械制造有限公司', industry: '机械行业', region: '华南', type: '海外项目招标', priority: '中', status: '待跟进' },
    { id: 4, time: '2025-12-22 14:45', company: '苏州纺织有限公司', industry: '纺织行业', region: '华东', type: '新客户开发', priority: '中', status: '待跟进' },
    { id: 5, time: '2025-12-21 11:30', company: '北京化工有限公司', industry: '化工行业', region: '华北', type: '产品出口扩张', priority: '高', status: '已转化' }
];

// 页面导航函数
function navigateTo(pageName) {
    const pageMap = {
        'dashboard': 'dashboard.html',
        'competitor': 'dashboard.html', // 竞争对手监测现在是首页
        'opportunity': 'opportunity.html',
        'marketing': 'marketing.html',
        'system': 'system.html'
    };
    
    const targetUrl = pageMap[pageName];
    if (targetUrl) {
        window.location.href = targetUrl;
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    // 根据当前页面调用相应的初始化函数
    const path = window.location.pathname;
    if (path.includes('login.html')) {
        initLoginPage();
    } else if (path.includes('dashboard.html')) {
        initCompetitorPage(); // 首页现在显示竞争对手监测
    } else if (path.includes('competitor.html')) {
        initCompetitorPage();
    } else if (path.includes('competitor-detail.html')) {
        initCompetitorDetailPage();
    } else if (path.includes('opportunity.html')) {
        initOpportunityPage();
    } else if (path.includes('marketing.html')) {
        initMarketingPage();
    } else if (path.includes('system.html')) {
        initSystemPage();
    } else if (path.includes('opportunity-detail.html')) {
        initOpportunityDetailPage();
    }
    
    // 初始化智能助手
    initSmartAssistant();
});

// 智能助手初始化函数
function initSmartAssistant() {
    console.log('智能助手初始化函数被调用');
    // 元素获取
    const assistantBtn = document.getElementById('assistantBtn');
    const functionLayer = document.getElementById('functionLayer');
    const chatPage = document.getElementById('chatPage');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatContent = document.getElementById('chatContent');
    const minimizeBtn = document.querySelector('.minimize-btn');
    const sessionItems = document.querySelectorAll('.session-item');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const functionItems = document.querySelectorAll('.function-item');
    
    console.log('assistantBtn:', assistantBtn);
    console.log('functionLayer:', functionLayer);
    console.log('chatPage:', chatPage);
    
    // 状态管理
    let isLayerOpen = false;
    let isChatOpen = false;
    
    // 如果元素不存在，说明当前页面没有智能助手，直接返回
    if (!assistantBtn) {
        console.log('智能助手元素不存在');
        return;
    }
    
    // 悬浮入口点击事件
    assistantBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFunctionLayer();
    });
    
    // 显示/隐藏功能浮层
    function toggleFunctionLayer() {
        isLayerOpen = !isLayerOpen;
        functionLayer.classList.toggle('show', isLayerOpen);
    }
    
    // 点击页面其他地方关闭功能浮层
    document.addEventListener('click', function(e) {
        if (!assistantBtn.contains(e.target) && !functionLayer.contains(e.target)) {
            isLayerOpen = false;
            functionLayer.classList.remove('show');
        }
        
        // 点击页面其他地方关闭聊天窗口（保留聊天记录）
        if (isChatOpen && !chatPage.contains(e.target) && !assistantBtn.contains(e.target)) {
            minimizeChatPage();
        }
    });
    
    // 功能选择项点击事件
    functionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.dataset.action;
            
            if (action === 'chat') {
                openChatPage();
            } else if (action === 'quick') {
                showQuickFunctions();
            }
            
            // 关闭功能浮层
            isLayerOpen = false;
            functionLayer.classList.remove('show');
        });
    });
    
    // 打开对话页面
    function openChatPage() {
        isChatOpen = true;
        chatPage.classList.add('show');
        // 滚动到底部
        setTimeout(() => {
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 300);
    }
    
    // 收起对话页面
    function minimizeChatPage() {
        isChatOpen = false;
        chatPage.classList.remove('show');
    }
    
    // 显示常用功能
    function showQuickFunctions() {
        // 这里可以实现常用功能的显示逻辑
        alert('常用功能：客户洞察卡、情报快报等将在此处显示');
    }
    
    // 收起按钮点击事件
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            minimizeChatPage();
        });
    }
    
    // 发送消息功能
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // 创建用户消息元素
        const userMessage = createMessageElement('user', message);
        chatContent.appendChild(userMessage);
        
        // 清空输入框
        chatInput.value = '';
        
        // 滚动到底部
        chatContent.scrollTop = chatContent.scrollHeight;
        
        // 模拟助手回复
        setTimeout(() => {
            const assistantReply = createMessageElement('assistant', '感谢您的提问，我正在为您查询相关信息...');
            chatContent.appendChild(assistantReply);
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 1000);
    }
    
    // 发送按钮点击事件
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // 输入框回车事件
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // 创建消息元素
    function createMessageElement(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.innerHTML = content;
        
        messageDiv.appendChild(bubbleDiv);
        return messageDiv;
    }
    
    // 会话列表切换
    sessionItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有活跃状态
            sessionItems.forEach(i => i.classList.remove('active'));
            // 添加当前活跃状态
            this.classList.add('active');
        });
    });
    
    // 快捷按钮点击事件
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.textContent;
            chatInput.value = question;
            // 可以自动发送，也可以让用户手动发送
            // sendMessage();
        });
    });
    
    // 关联工具卡片点击事件
    const cardBtns = document.querySelectorAll('.card-btn');
    cardBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent;
            alert(`执行操作：${action}`);
        });
    });
}

// 登录页面初始化
function initLoginPage() {
    // 生成验证码
    refreshCaptcha();
    
    // 绑定密码显示/隐藏切换
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });
    
    // 绑定登录表单提交事件
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // 记住用户名功能
    const usernameInput = document.getElementById('username');
    const rememberCheckbox = document.getElementById('rememberUsername');
    
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
    }
    
    rememberCheckbox.addEventListener('change', function() {
        if (this.checked) {
            localStorage.setItem('rememberedUsername', usernameInput.value);
        } else {
            localStorage.removeItem('rememberedUsername');
        }
    });
    
    usernameInput.addEventListener('input', function() {
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedUsername', this.value);
        }
    });
}

// 生成验证码
function refreshCaptcha() {
    const canvas = document.getElementById('captchaImage');
    const ctx = canvas.getContext('2d');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const captchaLength = 4;
    
    // 生成随机验证码
    currentCaptcha = '';
    for (let i = 0; i < captchaLength; i++) {
        currentCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // 绘制验证码
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景色
    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制干扰线
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // 绘制验证码文本
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < captchaLength; i++) {
        const x = (canvas.width / captchaLength) * (i + 0.5);
        const y = canvas.height / 2;
        const rotation = (Math.random() - 0.5) * 0.4; // 随机旋转角度
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // 随机颜色
        const r = Math.floor(Math.random() * 100) + 100;
        const g = Math.floor(Math.random() * 100) + 100;
        const b = Math.floor(Math.random() * 100) + 100;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        
        ctx.fillText(currentCaptcha[i], 0, 0);
        ctx.restore();
    }
}

// 处理登录逻辑
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const captcha = document.getElementById('captcha').value;
    const errorDiv = document.getElementById('loginError');
    
    // 前端验证
    if (!username || !password || !captcha) {
        errorDiv.textContent = '请填写所有必填字段';
        return;
    }
    
    // 验证验证码
    if (captcha.toLowerCase() !== currentCaptcha.toLowerCase()) {
        errorDiv.textContent = '验证码错误';
        refreshCaptcha();
        return;
    }
    
    // 验证用户名和密码 (模拟后端验证)
    if (username === 'admin' && password === 'Asd123') {
        // 登录成功，跳转到仪表盘
        window.location.href = 'dashboard.html';
    } else {
        errorDiv.textContent = '用户名或密码错误';
        refreshCaptcha();
    }
}

// 仪表盘页面初始化
function initDashboardPage() {
    // 初始化导航高亮
    addNavHighlight('dashboard');
    
    // 初始化会话管理
    startSessionTimer();
    
    // 初始化数据卡片
    initDataCards();
    
    // 初始化待办事项
    initTodoList();
    
    // 初始化监测预警
    initMonitoringAlerts();
    
    // 初始化最新公告
    initLatestAnnouncements();
}

// 竞争对手监测页面初始化
function initCompetitorPage() {
    // 初始化导航高亮
    addNavHighlight('competitor');
    
    // 初始化会话管理
    startSessionTimer();
    
    // 初始化筛选器
    initCompetitorFilters();
    
    // 初始化竞争对手动态列表
    initCompetitorList();
    
    // 初始化竞争对手分析图表
    initCompetitorChart();
}

// 潜在商机挖掘页面初始化
function initOpportunityPage() {
    // 初始化导航高亮
    addNavHighlight('opportunity');
    
    // 初始化会话管理
    startSessionTimer();
    
    // 初始化筛选器
    initOpportunityFilters();
    
    // 初始化商机列表
    initOpportunityList();
}

// 营销方案生成页面初始化
function initMarketingPage() {
    // 初始化导航高亮
    addNavHighlight('marketing');
    
    // 初始化会话管理
    startSessionTimer();
    
    // 初始化方案生成表单
    initMarketingForm();
    
    // 初始化方案库
    initMarketingLibrary();
}

// 系统管理页面初始化
function initSystemPage() {
    // 初始化导航高亮
    addNavHighlight('system');
    
    // 初始化会话管理
    startSessionTimer();
    
    // 初始化用户管理
    initUserManagement();
}

// 添加导航高亮
function addNavHighlight(pageName) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 查看竞争对手动态详情
function viewCompetitorDetail(dynamicId) {
    // 跳转到详情页面，并传递动态ID
    window.location.href = `competitor-detail.html?id=${dynamicId}`;
}

// 开始会话计时器
function startSessionTimer() {
    // 30分钟后显示警告
    sessionWarningTimeout = setTimeout(showSessionWarning, 30 * 60 * 1000);
    
    // 45分钟后自动退出
    sessionTimeout = setTimeout(forceLogout, 45 * 60 * 1000);
    
    // 监听用户活动，重置计时器
    document.addEventListener('mousemove', resetSessionTimer);
    document.addEventListener('keypress', resetSessionTimer);
    document.addEventListener('click', resetSessionTimer);
}

// 重置会话计时器
function resetSessionTimer() {
    clearTimeout(sessionWarningTimeout);
    clearTimeout(sessionTimeout);
    
    startSessionTimer();
}

// 显示会话警告
function showSessionWarning() {
    if (confirm('会话即将过期，是否继续？')) {
        resetSessionTimer();
    } else {
        logout();
    }
}

// 强制退出登录
function forceLogout() {
    alert('会话已过期，请重新登录');
    logout();
}

// 退出登录
function logout() {
    // 清除会话数据
    clearTimeout(sessionWarningTimeout);
    clearTimeout(sessionTimeout);
    
    // 跳转到登录页
    window.location.href = 'login.html';
}

// 初始化数据卡片
function initDataCards() {
    // 模拟数据
    const dataCards = [
        { title: '本周新增商机', value: 24, change: '+12%', positive: true },
        { title: '核心竞争对手动态', value: 86, change: '-3%', positive: false },
        { title: '待跟进商机', value: 15, change: '+5%', positive: true },
        { title: '已生成方案', value: 32, change: '+18%', positive: true }
    ];
    
    const container = document.querySelector('.data-cards');
    if (container) {
        container.innerHTML = '';
        dataCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'data-card';
            cardElement.innerHTML = `
                <div class="data-card-title">${card.title}</div>
                <div class="data-card-value">${card.value}</div>
                <div class="data-card-change ${card.positive ? 'change-positive' : 'change-negative'}">
                    <span>${card.positive ? '↑' : '↓'}</span>
                    ${card.change}
                </div>
            `;
            container.appendChild(cardElement);
        });
    }
}

// 初始化待办事项
function initTodoList() {
    // 模拟数据
    const todos = [
        { id: 1, title: '跟进高优先级商机 - 宁德时代电池出口', due: '今天 16:00', priority: 'high' },
        { id: 2, title: '查看竞争对手价格策略更新', due: '今天 14:30', priority: 'medium' },
        { id: 3, title: '完善东北农产品出口商营销方案', due: '明天 10:00', priority: 'medium' },
        { id: 4, title: '参加营销周会', due: '明天 14:00', priority: 'low' }
    ];
    
    const container = document.getElementById('todo-list');
    if (container) {
        container.innerHTML = '';
        todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = 'todo-item';
            todoElement.innerHTML = `
                <div class="todo-content">
                    <h4>${todo.title}</h4>
                    <p>截止时间: ${todo.due}</p>
                </div>
                <div class="todo-priority ${todo.priority}"></div>
            `;
            container.appendChild(todoElement);
        });
    }
}

// 初始化监测预警
function initMonitoringAlerts() {
    // 模拟数据
    const alerts = [
        { id: 1, company: '马士基', type: '价格策略', content: '宣布大幅下调亚洲-美西航线运价', time: '2小时前' },
        { id: 2, company: '地中海航运', type: '新航线', content: '开通上海-汉堡快线服务', time: '5小时前' },
        { id: 3, company: '达飞轮船', type: '合作签约', content: '与沃尔玛签订长期运输协议', time: '1天前' }
    ];
    
    const container = document.getElementById('monitoring-alerts');
    if (container) {
        container.innerHTML = '';
        alerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = 'alert-item';
            alertElement.innerHTML = `
                <div class="alert-header">
                    <span class="alert-company">${alert.company}</span>
                    <span class="alert-time">${alert.time}</span>
                </div>
                <div class="alert-content">
                    <span class="alert-type">${alert.type}</span>
                    <p>${alert.content}</p>
                </div>
            `;
            container.appendChild(alertElement);
        });
    }
}

// 初始化最新公告
function initLatestAnnouncements() {
    // 模拟数据
    const announcements = [
        { id: 1, title: '系统版本更新通知', content: '知风智能体V1.0已上线，新增营销方案生成功能', time: '2025-12-22' },
        { id: 2, title: '使用培训安排', content: '12月25日下午2点将进行系统使用培训，请准时参加', time: '2025-12-20' }
    ];
    
    const container = document.getElementById('latest-announcements');
    if (container) {
        container.innerHTML = '';
        announcements.forEach(announcement => {
            const announcementElement = document.createElement('div');
            announcementElement.className = 'announcement-item';
            announcementElement.innerHTML = `
                <div class="announcement-header">
                    <h4>${announcement.title}</h4>
                    <span class="announcement-time">${announcement.time}</span>
                </div>
                <p>${announcement.content}</p>
            `;
            container.appendChild(announcementElement);
        });
    }
}

// 初始化竞争对手筛选器
function initCompetitorFilters() {
    const filterForm = document.getElementById('competitor-filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 处理筛选逻辑
            filterCompetitorData();
        });
    }
}

// 重置筛选条件
function resetFilters() {
    document.getElementById('competitor-select').value = '';
    document.getElementById('time-range').value = '';
    document.getElementById('dynamic-type').value = '';
    document.getElementById('emotion-type').value = '';
    
    // 重新加载数据
    initCompetitorList();
}

// 筛选竞争对手数据
function filterCompetitorData() {
    const competitor = document.getElementById('competitor-select').value;
    const timeRange = document.getElementById('time-range').value;
    const dynamicType = document.getElementById('dynamic-type').value;
    const emotionType = document.getElementById('emotion-type').value;
    
    // 重新加载并过滤数据
    initCompetitorList({ competitor, timeRange, dynamicType, emotionType });
}

// 初始化竞争对手动态列表
function initCompetitorList(filters = {}) {
    // 模拟数据
    const dynamics = [
        { id: 1, company: '马士基', time: '2025-12-23 09:30', type: '价格策略', content: '亚洲至美西航线运价下调15%-20%', source: '马士基官网', emotion: '挑战' },
        { id: 2, company: '地中海航运', time: '2025-12-22 16:45', type: '新航线', content: '新增3条亚洲至欧洲直达航线', source: '地中海航运官网', emotion: '挑战' },
        { id: 3, company: '达飞轮船', time: '2025-12-21 14:20', type: '战略合作', content: '与上海港集团达成战略合作', source: '达飞轮船官网', emotion: '中性' },
        { id: 4, company: '长荣海运', time: '2025-12-20 10:15', type: '服务升级', content: '推出全新数字化货物跟踪系统', source: '长荣海运官网', emotion: '机遇' },
        { id: 5, company: '赫伯罗特', time: '2025-12-19 08:40', type: '运力投放', content: '新增5艘18000TEU集装箱船', source: '赫伯罗特官网', emotion: '挑战' },
        { id: 6, company: '马士基', time: '2025-12-18 13:20', type: '服务升级', content: '推出数字化集装箱跟踪服务', source: '马士基官网', emotion: '机遇' },
        { id: 7, company: '地中海航运', time: '2025-12-17 11:05', type: '价格策略', content: '调整亚洲-非洲航线运价结构', source: '航运界', emotion: '挑战' },
        { id: 8, company: '达飞轮船', time: '2025-12-16 15:40', type: '新航线', content: '开通越南-欧洲直达航线', source: '国际船舶网', emotion: '中性' }
    ];
    
    // 应用筛选条件
    let filteredDynamics = [...dynamics];
    
    if (filters.competitor) {
        filteredDynamics = filteredDynamics.filter(dynamic => dynamic.company === filters.competitor);
    }
    
    if (filters.dynamicType) {
        filteredDynamics = filteredDynamics.filter(dynamic => dynamic.type === filters.dynamicType);
    }
    
    if (filters.emotionType) {
        filteredDynamics = filteredDynamics.filter(dynamic => dynamic.emotion === filters.emotionType);
    }
    
    if (filters.timeRange) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        filteredDynamics = filteredDynamics.filter(dynamic => {
            const dynamicDate = new Date(dynamic.time);
            
            switch (filters.timeRange) {
                case 'today':
                    return dynamicDate >= today;
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);
                    return dynamicDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    return dynamicDate >= monthAgo;
                case 'quarter':
                    const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                    return dynamicDate >= quarterAgo;
                default:
                    return true;
            }
        });
    }
    
    const tbody = document.getElementById('competitor-dynamics-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        filteredDynamics.forEach(dynamic => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dynamic.time}</td>
                <td>${dynamic.company}</td>
                <td>${dynamic.type}</td>
                <td>${dynamic.content}</td>
                <td>${dynamic.source}</td>
                <td><span class="tag ${dynamic.emotion}">${dynamic.emotion}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="viewCompetitorDetail(${dynamic.id})">查看详情</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// 初始化竞争对手分析图表
function initCompetitorChart() {
    // 这里可以添加图表初始化逻辑
    console.log('初始化竞争对手分析图表');
}

// 返回上一页
function goBack() {
    window.history.back();
}

// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 初始化竞争对手动态详情页
function initCompetitorDetailPage() {
    // 初始化导航高亮
    addNavHighlight('competitor');
    
    // 初始化会话管理
    startSessionTimer();
    
    // 获取动态ID
    const dynamicId = getUrlParameter('id');
    
    // 加载动态详情数据
    loadCompetitorDetail(dynamicId);
}

// 初始化潜在商机详情页
function initOpportunityDetailPage() {
    // 初始化导航高亮
    addNavHighlight('opportunity');
    
    // 初始化会话管理
    startSessionTimer();
    
    // 获取商机ID
    const opportunityId = getUrlParameter('id');
    
    // 加载商机详情数据
    loadOpportunityDetail(opportunityId);
}

// 加载潜在商机详情数据
function loadOpportunityDetail(opportunityId) {
    // 强制转换为数字类型
    const id = Number(opportunityId);
    
    // 获取商机数据
    const opportunity = getOpportunityById(id);
    
    if (opportunity) {
        // 填充基础信息
        document.getElementById('detail-time').textContent = opportunity.time;
        document.getElementById('detail-company').textContent = opportunity.company;
        document.getElementById('detail-industry').textContent = opportunity.industry;
        document.getElementById('detail-region').textContent = opportunity.region;
        document.getElementById('detail-type').textContent = opportunity.type;
        document.getElementById('detail-priority').textContent = opportunity.priority;
        document.getElementById('detail-status').textContent = opportunity.status;
        document.getElementById('detail-source').textContent = opportunity.source;
        document.getElementById('detail-content').textContent = opportunity.content;
        document.getElementById('detail-email').textContent = opportunity.email ? opportunity.email.join(', ') : '暂无邮箱信息';
        
        // 填充AI推演分析
        document.getElementById('ai-demand-analysis').textContent = opportunity.aiAnalysis.demandAnalysis;
        document.getElementById('ai-decision-chain').innerHTML = opportunity.aiAnalysis.decisionChain;
        document.getElementById('ai-competition-analysis').textContent = opportunity.aiAnalysis.competitionAnalysis;
        document.getElementById('ai-suggestion').innerHTML = opportunity.aiAnalysis.suggestion;
        
        // 渲染抓到的邮箱列表
        const capturedEmailsList = document.getElementById('captured-emails-list');
        if (capturedEmailsList) {
            capturedEmailsList.innerHTML = '';
            if (opportunity.email && opportunity.email.length > 0) {
                opportunity.email.forEach(email => {
                    const emailItem = document.createElement('div');
                    emailItem.className = 'email-item';
                    emailItem.innerHTML = `
                        <span class="email-address">${email}</span>
                        <button class="btn btn-sm btn-secondary" onclick="selectEmail('${email}')">选择</button>
                    `;
                    capturedEmailsList.appendChild(emailItem);
                });
            } else {
                capturedEmailsList.innerHTML = '<div class="no-email">暂无邮箱信息</div>';
            }
        }
        
        // 渲染邮件触达记录
        const emailReachList = document.getElementById('email-reach-list');
        if (emailReachList) {
            emailReachList.innerHTML = '';
            if (opportunity.emailReachRecords && opportunity.emailReachRecords.length > 0) {
                opportunity.emailReachRecords.forEach(record => {
                    const recordItem = document.createElement('div');
                    recordItem.className = 'reach-item';
                    recordItem.innerHTML = `
                        <div class="reach-time">${record.time}</div>
                        <div class="reach-content">
                            <div class="reach-to">收件人：${record.to}</div>
                            <div class="reach-subject">主题：${record.subject}</div>
                        </div>
                        <div class="reach-status">
                            <span class="status-${record.status}">${record.status}</span>
                        </div>
                    `;
                    emailReachList.appendChild(recordItem);
                });
            } else {
                emailReachList.innerHTML = '<div class="no-reach">暂无邮件触达记录</div>';
            }
        }
    }
}

// 加载竞争对手动态详情数据
function loadCompetitorDetail(dynamicId) {
    // 模拟数据
    const dynamics = [
        {
            id: 1,
            title: '马士基宣布大幅下调亚洲-美西航线运价',
            company: '马士基',
            type: '价格策略',
            publishTime: '2025-12-23 09:30',
            crawlTime: '2025-12-23 10:00',
            source: '马士基官网',
            sourceUrl: 'https://www.maersk.com/news',
            emotion: '挑战',
            content: '马士基航运今日宣布，从2026年1月1日起，亚洲至美西航线的运价将下调15%-20%，以应对市场竞争压力。此次降价主要针对旺季附加费，预计将引发同行在亚美航线上的价格竞争。马士基表示，这一策略旨在巩固其在该航线的市场份额，并为客户提供更具竞争力的价格。',
            impact: '1. 市场影响：此降价策略针对旺季附加费下调15%-20%，将直接影响亚美航线的运价水平，可能引发新一轮价格战；2. 竞争影响：预计将对我司在亚美航线的市场份额产生3-5%的潜在冲击，尤其在电子产品货类；3. 应对建议：建议我司在保持服务质量的同时，针对VIP客户推出差异化价格方案，并密切关注竞争对手的跟进动作。',
            entities: {
                routes: ['亚洲-美西'],
                ports: ['上海港', '洛杉矶港'],
                cargoTypes: ['电子产品'],
                companies: ['马士基航运']
            },
            analysisBasis: [
                { type: 'internal', dynamic_id: 'DT-20251220001', description: '内部数据分析显示我司在亚美航线的报价竞争力' },
                { type: 'external', text_snippet: 'SCFI指数显示该航线市场运价呈下降趋势', source: '上海航运交易所官网' }
            ]
        },
        {
            id: 2,
            title: '地中海航运新增3条亚洲-欧洲航线',
            company: '地中海航运',
            type: '新航线',
            publishTime: '2025-12-22 16:45',
            crawlTime: '2025-12-22 17:00',
            source: '地中海航运官网',
            sourceUrl: 'https://www.msccargo.cn/en/newsroom',
            emotion: '挑战',
            content: '地中海航运今日宣布，将于2026年1月新增3条亚洲至欧洲的直达航线，进一步提升运力。这三条新航线将覆盖中国、越南、泰国等亚洲国家，并直达荷兰鹿特丹、德国汉堡等欧洲主要港口。地中海航运表示，这一扩张计划旨在满足不断增长的欧亚贸易需求。',
            impact: '1. 市场影响：地中海航运新增3条亚洲-欧洲航线，将增加该航线12%的运力供应，可能导致运价下降5-8%；2. 竞争影响：我司在欧亚航线的市场份额可能面临4-6%的压力，尤其在上海港-鹿特丹港航段；3. 应对建议：建议加强与欧洲主要港口的合作，优化航线网络布局，提升中转效率以保持竞争力。',
            entities: {
                routes: ['亚洲-欧洲'],
                ports: ['上海港', '鹿特丹港', '汉堡港'],
                cargoTypes: ['全货种'],
                companies: ['地中海航运']
            },
            analysisBasis: [
                { type: 'internal', dynamic_id: 'DT-20251219002', description: '内部航线运力分析报告' },
                { type: 'external', text_snippet: '欧亚航线贸易量预计增长8.5%', source: '中国海关总署' }
            ]
        },
        {
            id: 3,
            title: '达飞轮船与港口集团达成战略合作',
            company: '达飞轮船',
            type: '战略合作',
            publishTime: '2025-12-21 14:20',
            crawlTime: '2025-12-21 15:00',
            source: '达飞轮船官网',
            sourceUrl: 'https://www.cma-cgm.com/news',
            emotion: '中性',
            content: '达飞轮船今日宣布与上海港集团达成战略合作，将共同投资建设自动化码头，提升运营效率。该自动化码头预计将于2027年投入使用，年处理能力将达到400万TEU。达飞轮船表示，这一合作将进一步加强其在中国市场的地位。',
            impact: '1. 运营影响：达飞轮船与上海港合作建设自动化码头，将提升其在华东地区的作业效率30%以上，缩短船舶周转时间；2. 竞争影响：我司在上海港的船舶靠泊效率和货物处理速度可能面临竞争压力，影响客户满意度；3. 应对建议：建议加快与主要港口的自动化改造合作，优化内部作业流程，并考虑推出差异化的港口服务方案。',
            entities: {
                routes: [],
                ports: ['上海港'],
                cargoTypes: [],
                companies: ['达飞轮船', '上海港集团']
            },
            analysisBasis: [
                { type: 'internal', dynamic_id: 'DT-20251218003', description: '我司华东地区港口服务效率评估' },
                { type: 'external', text_snippet: '自动化码头将提升作业效率30%', source: '上海国际港务集团官网' }
            ]
        }
    ];
    
    // 查找对应的动态数据
    const dynamic = dynamics.find(item => item.id == dynamicId) || dynamics[0];
    
    // 填充页面数据
    document.getElementById('detail-title').textContent = dynamic.title;
    document.getElementById('detail-company').textContent = dynamic.company;
    document.getElementById('detail-type').textContent = dynamic.type;
    document.getElementById('detail-publish-time').textContent = dynamic.publishTime;
    document.getElementById('detail-crawl-time').textContent = dynamic.crawlTime;
    document.getElementById('detail-source').innerHTML = `<a href="${dynamic.sourceUrl}" target="_blank">${dynamic.source}</a>`;
    document.getElementById('detail-content').textContent = dynamic.content;
    document.getElementById('detail-impact').textContent = dynamic.impact;
    
    // 设置情感标签
    const emotionElement = document.querySelector('#detail-emotion .tag');
    if (emotionElement) {
        emotionElement.className = `tag ${dynamic.emotion}`;
        emotionElement.textContent = dynamic.emotion;
    } else {
        const emotionContainer = document.getElementById('detail-emotion');
        emotionContainer.innerHTML = `<span class="tag ${dynamic.emotion}">${dynamic.emotion}</span>`;
    }
    
    // 生成实体标签
    const entityTagsContainer = document.querySelector('.entity-tags');
    if (entityTagsContainer) {
        entityTagsContainer.innerHTML = '';
        
        if (dynamic.entities.routes.length > 0) {
            const routeTag = document.createElement('span');
            routeTag.className = 'entity-tag';
            routeTag.innerHTML = `<span class="entity-label">涉及航线</span><span class="entity-value">${dynamic.entities.routes.join('、')}</span>`;
            entityTagsContainer.appendChild(routeTag);
        }
        
        if (dynamic.entities.ports.length > 0) {
            const portTag = document.createElement('span');
            portTag.className = 'entity-tag';
            portTag.innerHTML = `<span class="entity-label">涉及港口</span><span class="entity-value">${dynamic.entities.ports.join('、')}</span>`;
            entityTagsContainer.appendChild(portTag);
        }
        
        if (dynamic.entities.cargoTypes.length > 0) {
            const cargoTag = document.createElement('span');
            cargoTag.className = 'entity-tag';
            cargoTag.innerHTML = `<span class="entity-label">涉及货类</span><span class="entity-value">${dynamic.entities.cargoTypes.join('、')}</span>`;
            entityTagsContainer.appendChild(cargoTag);
        }
        
        if (dynamic.entities.companies.length > 0) {
            const companyTag = document.createElement('span');
            companyTag.className = 'entity-tag';
            companyTag.innerHTML = `<span class="entity-label">关联公司</span><span class="entity-value">${dynamic.entities.companies.join('、')}</span>`;
            entityTagsContainer.appendChild(companyTag);
        }
    }
    
    // 生成相关动态推荐
    const relatedContainer = document.querySelector('.related-dynamics');
    if (relatedContainer) {
        relatedContainer.innerHTML = '';
        
        // 过滤出相关的动态（同一公司或同一类型，但不包括当前动态）
        const relatedDynamics = dynamics.filter(item => 
            item.id !== dynamic.id && (item.company === dynamic.company || item.type === dynamic.type)
        ).slice(0, 3); // 最多显示3条
        
        relatedDynamics.forEach(related => {
            const relatedItem = document.createElement('div');
            relatedItem.className = 'related-item';
            relatedItem.innerHTML = `
                <div class="related-content">
                    <h5>${related.title}</h5>
                    <p>${related.content.substring(0, 100)}...</p>
                </div>
                <div class="related-meta">
                    <span class="related-date">${related.publishTime}</span>
                    <span class="tag ${related.emotion}">${related.emotion}</span>
                </div>
            `;
            relatedContainer.appendChild(relatedItem);
        });
    }
    
    // 渲染分析依据
    const analysisBasisContainer = document.getElementById('analysis-basis-list');
    if (analysisBasisContainer) {
        analysisBasisContainer.innerHTML = '';
        
        if (dynamic.analysisBasis && dynamic.analysisBasis.length > 0) {
            dynamic.analysisBasis.forEach((basis, index) => {
                const basisItem = document.createElement('div');
                basisItem.className = 'basis-item';
                
                let basisContent = '';
                if (basis.type === 'internal') {
                    basisContent = `
                        <div class="basis-type internal">内部关联</div>
                        <div class="basis-content">
                            <div class="basis-dynamic-id">动态ID: ${basis.dynamic_id}</div>
                            <div class="basis-description">${basis.description}</div>
                        </div>
                    `;
                } else {
                    basisContent = `
                        <div class="basis-type external">外部引用</div>
                        <div class="basis-content">
                            <div class="basis-snippet">${basis.text_snippet}</div>
                            ${basis.source ? `<div class="basis-source">来源: ${basis.source}</div>` : ''}
                        </div>
                    `;
                }
                
                basisItem.innerHTML = `
                    <div class="basis-index">[${index + 1}]</div>
                    ${basisContent}
                `;
                
                analysisBasisContainer.appendChild(basisItem);
            });
        } else {
            analysisBasisContainer.innerHTML = '<div class="no-basis">暂无分析依据</div>';
        }
    }
}

// 初始化商机筛选器
function initOpportunityFilters() {
    const filterForm = document.getElementById('opportunity-filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 处理筛选逻辑
            filterOpportunityData();
        });
    }
}

// 筛选商机数据
function filterOpportunityData() {
    const industry = document.getElementById('industry-select').value;
    const region = document.getElementById('region-select').value;
    
    // 重新加载并过滤数据
    initOpportunityList({ industry, region });
}

// 重置商机筛选条件
function resetOpportunityFilters() {
    document.getElementById('industry-select').value = '';
    document.getElementById('region-select').value = '';
    
    // 重新加载数据
    initOpportunityList();
}

// 查看商机详情
function viewOpportunityDetail(opportunityId) {
    // 跳转到详情页面，并传递商机ID
    window.location.href = `opportunity-detail.html?id=${opportunityId}`;
}

// 关闭商机详情
function closeOpportunityDetail() {
    const modal = document.getElementById('opportunity-detail-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        console.log('模态框已关闭');
    }
}

// 生成营销方案
function generateMarketingPlanFromOpportunity() {
    // 这里可以传递商机ID到营销方案生成页面
    alert('将跳转到营销方案生成页面，基于当前商机信息');
    // 实际实现可以使用：window.location.href = `marketing.html?opportunityId=${opportunityId}`;
}

// 测试模态框显示
function testModalDisplay() {
    console.log('testModalDisplay被调用');
    const modal = document.getElementById('opportunity-detail-modal');
    if (!modal) {
        console.log('未找到模态框元素');
        return;
    }
    
    // 强制显示模态框
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.zIndex = '9999';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    
    // 确保modal-content也显示
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.display = 'block';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.zIndex = '10000';
    }
    
    console.log('测试模态框显示结果:', {
        modalExists: !!modal,
        modalDisplay: modal.style.display,
        computedDisplay: window.getComputedStyle(modal).display
    });
}

// 根据ID获取商机数据
function getOpportunityById(opportunityId) {
    // 模拟带详细信息的商机数据
    const opportunities = [
        {
            id: 1,
            time: '2025-12-23 10:20',
            company: '深圳电子科技有限公司',
            industry: '电子行业',
            region: '华南',
            type: '新工厂投产',
            priority: '高',
            status: '待跟进',
            source: '某新能源汽车官网新闻',
            content: '该公司在合肥新建的新能源汽车工厂预计明年3月投产，年产能将达到20万辆，主要生产高端电动汽车。',
            email: ['info@szet.com', 'contact@szet.com', 'logistics@szet.com'],
            emailReachRecords: [
                { id: 1, time: '2025-12-23 14:30', to: 'info@szet.com', subject: '海运服务合作意向', status: '已发送' },
                { id: 2, time: '2025-12-24 09:15', to: 'logistics@szet.com', subject: '新工厂物流解决方案', status: '已读' }
            ],
            aiAnalysis: {
                demandAnalysis: '该工厂主要生产电动汽车，预计核心零部件（如电池、芯片）需从日韩/欧洲进口，成品车可能出口至欧美。会产生稳定的集装箱海运需求，货类为精密仪器、汽车零部件和整车。',
                decisionChain: '潜在决策部门：采购部、物流部、计划部<br>可能的关键联系人：采购经理、物流总监<br>决策流程：调研供应商 → 比价 → 制定运输方案 → 签订合同',
                competitionAnalysis: '根据监测，竞争对手B近期在该区域有活跃的销售活动，已与当地两家汽车零部件企业建立合作关系。',
                suggestion: '1. 重点关注工厂投产节点，提前1-2个月联系潜在客户<br>2. 推荐公司亚洲-欧美精品航线及端到端物流解决方案<br>3. 针对汽车零部件运输提供专业化服务方案<br>4. 考虑为新客户提供首单优惠政策'
            }
        },
        {
            id: 2,
            time: '2025-12-23 09:15',
            company: '上海汽车零部件有限公司',
            industry: '汽车行业',
            region: '华东',
            type: '出口需求增加',
            priority: '高',
            status: '跟进中',
            source: '企业财报',
            content: '公司前三季度出口额同比增长25%，预计第四季度将进一步扩大海外市场份额，尤其是北美和欧洲市场。',
            email: ['export@shauto.com', 'logistics@shauto.com'],
            emailReachRecords: [
                { id: 1, time: '2025-12-23 11:20', to: 'export@shauto.com', subject: '出口运输服务方案', status: '已读' }
            ],
            aiAnalysis: {
                demandAnalysis: '该公司主要生产汽车零部件，出口需求增加将带动海运需求增长。预计需要大量40英尺和20英尺集装箱，主要航线为亚洲至北美和欧洲。',
                decisionChain: '潜在决策部门：国际物流部、采购部<br>可能的关键联系人：物流经理、采购主管<br>决策流程：评估现有供应商 → 分析新航线 → 谈判价格 → 签订长期合同',
                competitionAnalysis: '竞争对手A和C已在为该公司提供服务，需突出我司在时效性和可靠性方面的优势。',
                suggestion: '1. 分析竞争对手报价，提供更具竞争力的价格方案<br>2. 强调我司在汽车零部件运输方面的专业经验<br>3. 提供定制化的物流解决方案，包括仓储和配送服务<br>4. 安排专人跟进，建立长期合作关系'
            }
        },
        {
            id: 3,
            time: '2025-12-22 16:30',
            company: '广州机械制造有限公司',
            industry: '机械行业',
            region: '华南',
            type: '海外项目招标',
            priority: '中',
            status: '待跟进',
            source: '国际招标平台',
            content: '公司正在为海外某大型基础设施项目招标国际物流服务提供商，项目总价值约5000万美元。',
            aiAnalysis: {
                demandAnalysis: '该项目需要运输大型机械设备和工程物资，涉及特种柜和散杂货运输。运输路线可能涉及亚洲至中东、非洲等地区。',
                decisionChain: '潜在决策部门：项目管理部、物流部<br>可能的关键联系人：项目物流经理、采购负责人<br>决策流程：资格预审 → 技术方案评审 → 价格谈判 → 确定供应商',
                competitionAnalysis: '已有多家国际物流巨头参与竞标，竞争激烈。',
                suggestion: '1. 组建专业团队，制定详细的技术方案<br>2. 突出我司在大型项目物流方面的成功案例<br>3. 提供灵活的报价方案，包括包干价和分项报价<br>4. 提前与客户沟通，了解其具体需求和关注点'
            }
        },
        {
            id: 4,
            time: '2025-12-22 14:45',
            company: '苏州纺织有限公司',
            industry: '纺织行业',
            region: '华东',
            type: '新客户开发',
            priority: '中',
            status: '待跟进',
            source: '行业展会',
            content: '公司计划扩大海外市场，特别是东南亚和南美市场，需要寻找可靠的海运服务提供商。',
            aiAnalysis: {
                demandAnalysis: '该公司主要生产纺织品，出口需求具有季节性特点。需要定期的集装箱海运服务，主要航线为亚洲至东南亚和南美。',
                decisionChain: '潜在决策部门：进出口部、物流部<br>可能的关键联系人：进出口经理、物流主管<br>决策流程：市场调研 → 供应商筛选 → 样品运输测试 → 签订合作协议',
                competitionAnalysis: '当地已有多家货代公司为其提供服务，但缺乏直接与船公司合作的优势。',
                suggestion: '1. 提供具有竞争力的海运价格，尤其是淡季价格<br>2. 强调我司在纺织品运输方面的专业知识和经验<br>3. 提供门到门的一站式物流服务<br>4. 制定灵活的运输计划，满足季节性需求'
            }
        },
        {
            id: 5,
            time: '2025-12-21 11:30',
            company: '北京化工有限公司',
            industry: '化工行业',
            region: '华北',
            type: '产品出口扩张',
            priority: '高',
            status: '已转化',
            source: '公司官网',
            content: '公司宣布扩大化工产品出口规模，新增多条国际航线，预计年出口额将增长30%。',
            aiAnalysis: {
                demandAnalysis: '该公司生产的化工产品需要特殊运输条件，涉及危险品运输。新增航线包括亚洲至欧洲、北美和澳洲。',
                decisionChain: '潜在决策部门：安全环保部、物流部<br>可能的关键联系人：物流总监、安全经理<br>决策流程：评估运输风险 → 筛选合格供应商 → 谈判合同条款 → 实施运输计划',
                competitionAnalysis: '竞争对手D在危险品运输方面有一定优势，需突出我司的安全管理体系和应急处理能力。',
                suggestion: '1. 详细介绍我司在危险品运输方面的资质和经验<br>2. 提供完善的安全管理方案和应急预案<br>3. 安排专业人员进行对接，解答客户关于安全运输的疑问<br>4. 提供具有竞争力的价格，同时保证服务质量'
            }
        }
    ];
    
    return opportunities.find(opp => opp.id == opportunityId);
}

// 初始化商机列表
function initOpportunityList(filters = {}) {
    // 应用筛选条件
    let filteredOpportunities = [...potentialOpportunities];
    
    if (filters.industry) {
        filteredOpportunities = filteredOpportunities.filter(opportunity => opportunity.industry === filters.industry);
    }
    
    if (filters.region) {
        filteredOpportunities = filteredOpportunities.filter(opportunity => opportunity.region === filters.region);
    }
    
    const tbody = document.getElementById('opportunity-list-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        filteredOpportunities.forEach(opportunity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${opportunity.time}</td>
                <td>${opportunity.company}</td>
                <td>${opportunity.industry}</td>
                <td>${opportunity.region}</td>
                <td>${opportunity.type}</td>
                <td>
                    <button class="btn btn-primary btn-sm view-detail-btn">查看详情</button>
                </td>
            `;
            
            // 添加事件监听器
            const btn = row.querySelector('.view-detail-btn');
            btn.addEventListener('click', () => {
                console.log('按钮点击事件触发，商机ID:', opportunity.id);
                viewOpportunityDetail(opportunity.id);
            });
            
            tbody.appendChild(row);
        });
    }
}

// 初始化营销方案生成表单
function initMarketingForm() {
    const form = document.getElementById('marketing-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 处理方案生成逻辑
            generateMarketingPlan();
        });
    }
    
    // 初始化目标客户智能输入
    initCompanyAutoComplete();
}

// 初始化目标客户智能输入
function initCompanyAutoComplete() {
    const companyInput = document.getElementById('marketing-company');
    const suggestionsContainer = document.getElementById('company-suggestions');
    
    if (!companyInput || !suggestionsContainer) {
        return;
    }
    
    // 添加输入事件监听器
    companyInput.addEventListener('input', function() {
        const inputValue = this.value.trim();
        
        // 清空建议列表
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
        
        if (inputValue.length < 1) {
            return;
        }
        
        // 从潜在商机数据中筛选匹配的公司名称（不区分大小写）
        const matchingCompanies = potentialOpportunities.filter(opportunity => 
            opportunity.company.toLowerCase().includes(inputValue.toLowerCase())
        );
        
        if (matchingCompanies.length > 0) {
            // 显示建议列表
            suggestionsContainer.style.display = 'block';
            
            // 创建建议项
            matchingCompanies.forEach(opportunity => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.textContent = opportunity.company;
                
                // 添加点击事件
                suggestionItem.addEventListener('click', function() {
                    // 将选中的公司名称填入输入框
                    companyInput.value = opportunity.company;
                    // 清空并隐藏建议列表
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.style.display = 'none';
                });
                
                suggestionsContainer.appendChild(suggestionItem);
            });
        }
    });
    
    // 点击页面其他地方关闭建议列表
    document.addEventListener('click', function(e) {
        if (!companyInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    });
}

// 选择邮箱
function selectEmail(email) {
    const emailToInput = document.getElementById('email-to');
    const currentEmails = emailToInput.value;
    if (currentEmails) {
        // 如果已有邮箱，用英文分号分隔添加新邮箱
        emailToInput.value = currentEmails + ';' + email;
    } else {
        // 如果没有邮箱，直接设置新邮箱
        emailToInput.value = email;
    }
}

// 抓取邮箱
function crawlEmails() {
    const website = document.getElementById('company-website').value;
    if (!website) {
        alert('请输入公司官网地址');
        return;
    }
    
    // 模拟邮箱抓取过程
    alert('正在抓取邮箱...');
    
    // 模拟抓取结果
    setTimeout(() => {
        const simulatedEmails = ['info@szet.com', 'contact@szet.com', 'logistics@szet.com'];
        
        // 更新UI显示
        const capturedEmailsList = document.getElementById('captured-emails-list');
        capturedEmailsList.innerHTML = '';
        
        simulatedEmails.forEach(email => {
            const emailItem = document.createElement('div');
            emailItem.className = 'email-item';
            emailItem.innerHTML = `
                <span class="email-address">${email}</span>
                <button class="btn btn-sm btn-secondary" onclick="selectEmail('${email}')">选择</button>
            `;
            capturedEmailsList.appendChild(emailItem);
        });
        
        alert('邮箱抓取完成！');
    }, 1500);
}

// 生成洽谈邮件
function generateEmail() {
    const opportunityId = getUrlParameter('id');
    const opportunity = getOpportunityById(opportunityId);
    
    if (!opportunity) {
        alert('无法获取商机信息');
        return;
    }
    
    // 根据商机信息生成邮件内容
    const emailSubject = `关于${opportunity.company}海运服务合作的洽谈`;
    const professionalDemandAnalysis = opportunity.aiAnalysis.demandAnalysis.replace(
        '该工厂主要生产电动汽车，预计核心零部件（如电池、芯片）需从日韩/欧洲进口，成品车可能出口至欧美。会产生稳定的集装箱海运需求，货类为精密仪器、汽车零部件和整车。',
        '作为专业的海运物流解决方案提供商，我们深入研究了贵公司的业务模式与发展规划。基于贵公司在电动汽车领域的战略布局，我们精准识别到：\n\n✓ 核心零部件（电池、芯片等）需从日韩/欧洲进口的国际供应链需求\n✓ 成品车出口至欧美市场的全球物流布局需求\n✓ 稳定且规模化的集装箱海运服务需求，涵盖精密仪器、汽车零部件及整车等多种货类\n\n我们了解，对于贵公司这样的高端电动汽车制造商而言，供应链的稳定性、运输的安全性与时效性直接影响到市场竞争力。'
    );
    const emailContent = `尊敬的${opportunity.company}采购/物流负责人：

您好！

我是[您的姓名]，[您的职位]，专注于为高端制造企业提供定制化海运物流解决方案。近期，我们密切关注到贵公司在${opportunity.type}方面的战略动态，凭借我们在汽车供应链领域15年的专业经验，我们有信心能为贵公司的全球化发展提供强有力的物流支持。

${professionalDemandAnalysis}

基于对贵公司需求的精准把握，我司能够为您量身定制：
${opportunity.aiAnalysis.suggestion.replace(/<br>/g, '\n')}

我们的服务优势包括：
- 与全球50+港口建立深度合作关系，确保货物快速通关
- 专业的汽车物流团队，全程温控与安全监控
- 灵活的运价策略与舱位保障，应对市场波动
- 24/7实时追踪系统，让您随时掌握货物动态

我诚挚邀请您安排15-20分钟的线上会议，我们可以更详细地了解贵公司的具体需求，并提供一份定制化的解决方案。您可以通过邮件回复或直接拨打我的电话[您的联系方式]与我预约。

期待能与贵公司携手，共同构建高效、稳定的全球供应链体系！

祝商祺！
[您的姓名]
[您的职位]
[您的公司名称]
[您的联系方式]
[您的公司官网]
`;
    
    // 更新邮件编辑器
    document.getElementById('email-subject').value = emailSubject;
    document.getElementById('email-content').value = emailContent;
    
    alert('邮件生成完成！');
}

// 翻译邮件
function translateEmail() {
    const emailContent = document.getElementById('email-content').value;
    if (!emailContent) {
        alert('请先生成或输入邮件内容');
        return;
    }
    
    const languageSelect = document.getElementById('target-language');
    const targetLanguage = languageSelect.value;
    
    if (!targetLanguage) {
        alert('请选择目标语言');
        return;
    }
    
    alert(`正在将邮件内容翻译为${targetLanguage}...`);
    
    // 模拟翻译过程
    setTimeout(() => {
        // 简单模拟翻译结果（实际项目中应该调用翻译API）
        const translatedContent = `${targetLanguage}翻译版本：\n\n${emailContent}`;
        document.getElementById('email-content').value = translatedContent;
        
        alert(`邮件内容已翻译为${targetLanguage}！`);
    }, 1500);
}

// 发送邮件
function sendEmail() {
    const to = document.getElementById('email-to').value;
    const subject = document.getElementById('email-subject').value;
    const content = document.getElementById('email-content').value;
    
    if (!to || !subject || !content) {
        alert('请填写完整的邮件信息');
        return;
    }
    
    alert('正在发送邮件...');
    
    // 模拟邮件发送过程
    setTimeout(() => {
        // 更新邮件触达记录
        const emailReachList = document.getElementById('email-reach-list');
        const currentTime = new Date().toLocaleString('zh-CN');
        
        const newRecord = document.createElement('div');
        newRecord.className = 'reach-item';
        newRecord.innerHTML = `
            <div class="reach-time">${currentTime}</div>
            <div class="reach-content">
                <div class="reach-to">收件人：${to}</div>
                <div class="reach-subject">主题：${subject}</div>
            </div>
            <div class="reach-status">
                <span class="status-已发送">已发送</span>
            </div>
        `;
        
        // 插入到列表开头
        if (emailReachList.firstChild) {
            emailReachList.insertBefore(newRecord, emailReachList.firstChild);
        } else {
            emailReachList.appendChild(newRecord);
        }
        
        alert('邮件发送成功！');
    }, 1500);
}

// 保存邮件模板
function saveEmailTemplate() {
    const subject = document.getElementById('email-subject').value;
    const content = document.getElementById('email-content').value;
    
    if (!subject || !content) {
        alert('请填写完整的邮件信息');
        return;
    }
    
    // 模拟保存过程
    alert('正在保存邮件模板...');
    
    setTimeout(() => {
        alert('邮件模板保存成功！');
    }, 1000);
}

// 生成营销方案
function generateMarketingPlan() {
    const company = document.getElementById('marketing-company').value;
    const industry = document.getElementById('marketing-industry').value;
    
    // 前端验证
    if (!company || !industry) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 模拟方案生成过程
    const progressCard = document.getElementById('progressCard');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressCard) {
        progressCard.style.display = 'block';
    }
    
    let progress = 0;
    const interval = setInterval(function() {
        progress += 10;
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressText) {
            if (progress < 30) {
                progressText.textContent = '正在分析客户需求...';
            } else if (progress < 60) {
                progressText.textContent = '正在匹配最优航线...';
            } else if (progress < 90) {
                progressText.textContent = '正在生成方案内容...';
            } else {
                progressText.textContent = '方案生成完成！';
            }
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(function() {
                alert('营销方案已生成完成！');
                if (progressCard) {
                    progressCard.style.display = 'none';
                }
                // 重置表单
                document.getElementById('marketing-form').reset();
                // 更新方案库
                initMarketingLibrary();
            }, 1000);
        }
    }, 300);
}

// 营销方案数据（全局变量，用于方案查看页面）
const marketingPlans = [
    {
        id: 'MP20251223001', 
        time: '2025-12-23 09:45', 
        name: '深圳电子科技海运方案', 
        customer: '深圳电子科技有限公司', 
        status: '已生成',
        industry: '电子',
        route: '中国-美国',
        cargo: '电子产品、半导体',
        volume: '1000TEU/月',
        focus: '时效',
        content: `# 深圳电子科技有限公司海运方案

## 一、客户需求分析
深圳电子科技有限公司主要生产电子产品和半导体组件，需要稳定的海运服务从中国运往美国市场。客户对时效要求较高，希望货物能够快速到达目的地，同时对运输安全也有严格要求。

## 二、推荐航线方案
**推荐航线：** 深圳盐田港 - 洛杉矶港
**预计时效：** 14-16天
**承运船公司：** 中远海运
**服务优势：** 每周三班固定航班，准点率高达95%以上

## 三、价格方案
| 集装箱类型 | 单价（USD） | 月供应量 |
|------------|-------------|----------|
| 20GP       | 1800        | 300个    |
| 40HQ       | 2800        | 200个    |

## 四、增值服务
1. **货物追踪：** 提供全程货物追踪服务
2. **报关服务：** 专业报关团队，确保清关顺畅
3. **保险服务：** 提供货物运输保险，保障货物安全
4. **仓储服务：** 提供目的地仓储服务，方便客户分拨

## 五、实施计划
1. 签订合同后3个工作日内安排首航
2. 每周五提供下周船期安排
3. 每月提供运输分析报告

## 六、联系方式
如有任何疑问，请联系：
联系人：张经理
电话：138-0000-0000
邮箱：zhang@shipping.com`
    },
    {
        id: 'MP20251222001', 
        time: '2025-12-22 16:30', 
        name: '上海汽车零部件运输方案', 
        customer: '上海汽车零部件有限公司', 
        status: '已生成',
        industry: '汽车',
        route: '中国-欧洲',
        cargo: '汽车零部件、发动机',
        volume: '800TEU/月',
        focus: '稳定性',
        content: `# 上海汽车零部件有限公司海运方案

## 一、客户需求分析
上海汽车零部件有限公司主要生产汽车零部件和发动机，需要从中国运往欧洲各国。客户对运输稳定性要求较高，希望能够按时交付，避免生产延误。

## 二、推荐航线方案
**推荐航线：** 上海洋山港 - 汉堡港
**预计时效：** 25-28天
**承运船公司：** 中远海运
**服务优势：** 固定航线，稳定船期，适合长期合作

## 三、价格方案
| 集装箱类型 | 单价（USD） | 月供应量 |
|------------|-------------|----------|
| 40HQ       | 3200        | 200个    |
| 20GP       | 2000        | 100个    |

## 四、增值服务
1. **定制包装：** 提供专业的汽车零部件包装服务
2. **温控运输：** 部分敏感零部件提供温控运输
3. **供应链管理：** 提供供应链优化建议
4. **紧急处理：** 提供24小时紧急情况处理服务

## 五、实施计划
1. 提前7天确认船期
2. 货物装船后实时更新运输状态
3. 目的地提供配送服务

## 六、联系方式
如有任何疑问，请联系：
联系人：李经理
电话：139-0000-0000
邮箱：li@shipping.com`
    },
    {
        id: 'MP20251221001', 
        time: '2025-12-21 14:20', 
        name: '广州机械制造出口方案', 
        customer: '广州机械制造有限公司', 
        status: '已生成',
        industry: '机械',
        route: '中国-东南亚',
        cargo: '机械设备、五金工具',
        volume: '1200TEU/月',
        focus: '价格',
        content: `# 广州机械制造有限公司海运方案

## 一、客户需求分析
广州机械制造有限公司主要生产机械设备和五金工具，需要从中国运往东南亚各国。客户对价格比较敏感，希望能够获得具有竞争力的运输价格。

## 二、推荐航线方案
**推荐航线：** 广州南沙港 - 新加坡港
**预计时效：** 7-10天
**承运船公司：** 中远海运
**服务优势：** 价格优惠，覆盖东南亚主要港口

## 三、价格方案
| 集装箱类型 | 单价（USD） | 月供应量 |
|------------|-------------|----------|
| 40HQ       | 2200        | 300个    |
| 20GP       | 1400        | 400个    |

## 四、增值服务
1. **集港服务：** 提供上门集港服务
2. **简易包装：** 免费提供简易包装材料
3. **清关代理：** 提供目的港清关代理服务
4. **灵活付款：** 提供多种付款方式

## 五、实施计划
1. 每周提供最新价格更新
2. 根据货量灵活调整舱位
3. 提供月度费用汇总报告

## 六、联系方式
如有任何疑问，请联系：
联系人：王经理
电话：137-0000-0000
邮箱：wang@shipping.com`
    }
];

// 初始化方案库
function initMarketingLibrary() {
    const tbody = document.getElementById('marketing-plan-library-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        marketingPlans.forEach(plan => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plan.time}</td>
                <td>${plan.name}</td>
                <td>${plan.customer}</td>
                <td>${plan.status}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="viewMarketingPlan('${plan.id}')">查看</button>
                    <button class="btn btn-secondary btn-sm" onclick="editMarketingPlan('${plan.id}')">编辑</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMarketingPlan('${plan.id}')">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// 初始化系统管理页面
function initSystemPage() {
    // 初始化导航高亮
    addNavHighlight('system');
    
    // 初始化会话管理
    startSessionTimer();
    
    // 初始化系统管理功能
    initSystemTabs();
    initUserManagement();
}

// 初始化系统管理标签页
function initSystemTabs() {
    const tabs = document.querySelectorAll('.system-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签和内容的激活状态
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加当前标签和内容的激活状态
            this.classList.add('active');
            const target = this.dataset.target;
            document.getElementById(target).classList.add('active');
        });
    });
}

// 初始化用户管理
function initUserManagement() {
    // 初始化用户列表
    initUserList();
    
    // 初始化添加用户模态框
    initAddUserModal();
}

// 初始化用户列表
function initUserList() {
    // 模拟数据
    const users = [
        { id: 1, username: 'admin', realName: '系统管理员', department: '技术部', role: '管理员', status: '启用', createTime: '2025-12-01' },
        { id: 2, username: 'zhangsan', realName: '张三', department: '营销部', role: '营销经理', status: '启用', createTime: '2025-12-05' },
        { id: 3, username: 'lisi', realName: '李四', department: '营销部', role: '营销专员', status: '启用', createTime: '2025-12-10' },
        { id: 4, username: 'wangwu', realName: '王五', department: '市场部', role: '市场专员', status: '禁用', createTime: '2025-12-15' }
    ];
    
    const tbody = document.getElementById('user-list-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.realName}</td>
                <td>${user.department}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>${user.createTime}</td>
                <td>
                    <button class="btn btn-primary btn-sm">编辑</button>
                    <button class="btn ${user.status === '启用' ? 'btn-danger' : 'btn-success'} btn-sm">
                        ${user.status === '启用' ? '禁用' : '启用'}
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// 初始化添加用户模态框
function initAddUserModal() {
    const addBtn = document.getElementById('add-user-btn');
    const modal = document.getElementById('add-user-modal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('add-user-form');
    
    if (addBtn && modal) {
        addBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // 点击模态框外部关闭
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // 表单提交
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 处理添加用户逻辑
            addUser();
        });
    }
}

// 隐藏添加用户模态框
function hideAddUserModal() {
    const modal = document.getElementById('add-user-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 添加用户
function addUser() {
    const username = document.getElementById('new-username').value;
    const realName = document.getElementById('new-realname').value;
    const department = document.getElementById('new-department').value;
    const role = document.getElementById('new-role').value;
    const password = document.getElementById('new-password').value;
    
    // 前端验证
    if (!username || !realName || !department || !role || !password) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 模拟添加用户过程
    alert('用户添加成功！');
    
    // 关闭模态框并重置表单
    const modal = document.getElementById('add-user-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.getElementById('add-user-form').reset();
    
    // 重新加载用户列表
    initUserList();
}

// 添加导航高亮
function addNavHighlight(pageName) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        }
    });
}

// 查看营销方案
function viewMarketingPlan(planId) {
    console.log('查看营销方案:', planId);
    window.location.href = `marketing-detail.html?id=${encodeURIComponent(planId)}`;
}

// 编辑营销方案
function editMarketingPlan(planId) {
    console.log('编辑营销方案:', planId);
    alert('编辑营销方案功能即将实现');
}

// 删除营销方案
function deleteMarketingPlan(planId) {
    console.log('删除营销方案:', planId);
    alert('删除营销方案功能即将实现');
}

// 解析URL参数
function getUrlParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams.entries()) {
        params[key] = decodeURIComponent(value);
    }
    return params;
}

// 初始化营销方案详情页面
function initMarketingDetailPage() {
    // 初始化导航高亮
    addNavHighlight('marketing');
    
    // 获取URL参数
    const params = getUrlParams();
    const planId = params.id;
    
    if (!planId) {
        alert('方案ID无效');
        return;
    }
    
    // 查找对应的方案
    const plan = marketingPlans.find(p => p.id === planId);
    
    if (!plan) {
        alert('未找到对应的营销方案');
        return;
    }
    
    // 填充方案信息
    document.getElementById('plan-time').textContent = plan.time;
    document.getElementById('plan-name').textContent = plan.name;
    document.getElementById('plan-customer').textContent = plan.customer;
    document.getElementById('plan-industry').textContent = plan.industry;
    document.getElementById('plan-route').textContent = plan.route;
    document.getElementById('plan-cargo').textContent = plan.cargo;
    document.getElementById('plan-volume').textContent = plan.volume;
    document.getElementById('plan-focus').textContent = plan.focus;
    
    // 填充方案详细内容（将Markdown格式转换为HTML显示）
    const contentElement = document.getElementById('plan-content');
    if (contentElement) {
        // 简单的Markdown转换
        let htmlContent = plan.content
            // 标题
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            // 粗体
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
        // 处理表格
        htmlContent = parseMarkdownTable(htmlContent);
        
        // 处理有序列表
        htmlContent = htmlContent.replace(/(?:^\d+\.\s+(.*$)\n?)+/gm, (match) => {
            const items = match.replace(/^\d+\.\s+(.*$)/gm, '<li>$1</li>');
            return `<ol>${items}</ol>`;
        });
        
        // 处理无序列表
        htmlContent = htmlContent.replace(/(?:^-\s+(.*$)\n?)+/gm, (match) => {
            const items = match.replace(/^-\s+(.*$)/gm, '<li>$1</li>');
            return `<ul>${items}</ul>`;
        });
        
        // 处理段落（排除已处理的表格和列表内容）
        htmlContent = htmlContent.replace(/^(?!<h|<table|<tr|<td|<th|<ul|<ol|<li|<\/|\s*$)(.*$)/gm, '<p>$1</p>');
        contentElement.innerHTML = htmlContent;
    }
}

// 返回方案库
function goBack() {
    window.location.href = 'marketing.html';
}

// 解析Markdown表格为HTML
function parseMarkdownTable(content) {
    // 查找表格结构
    // 表格通常由多行组成，每行以|开头和结尾，包含表头和数据行
    const tableRegex = /(?:^\|.*\|$\n?)+/gm;
    
    return content.replace(tableRegex, (table) => {
        // 分割成行
        const rows = table.split('\n').filter(row => row.trim() !== '');
        if (rows.length < 2) return table; // 至少需要表头和分隔线
        
        // 解析表头
        const headerRow = rows[0];
        const headers = headerRow.split('|')
            .map(h => h.trim())
            .filter(h => h !== '');
        
        // 解析数据行
        const dataRows = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            
            // 检查是否是分隔线（包含---）
            if (/---/.test(row)) {
                continue;
            }
            
            // 解析单元格
            const cells = row.split('|')
                .map(cell => cell.trim())
                .filter(cell => cell !== '');
            
            if (cells.length > 0) {
                dataRows.push(cells);
            }
        }
        
        // 构建HTML表格
        let htmlTable = '<table class="marketing-table">';
        
        // 添加表头
        htmlTable += '<thead><tr>';
        headers.forEach(header => {
            htmlTable += `<th>${header}</th>`;
        });
        htmlTable += '</tr></thead>';
        
        // 添加数据行
        htmlTable += '<tbody>';
        dataRows.forEach(row => {
            htmlTable += '<tr>';
            row.forEach(cell => {
                htmlTable += `<td>${cell}</td>`;
            });
            htmlTable += '</tr>';
        });
        htmlTable += '</tbody>';
        
        htmlTable += '</table>';
        
        return htmlTable;
    });
}