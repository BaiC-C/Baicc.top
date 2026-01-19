// 弹幕数据 正常从数据库获取
const danmuMessages = [
    { author: "DoN", content: "网站设计得很棒！", time: "10:31", color: "#238636" },
    { author: "Panda", content: "猜猜我是谁", time: "11:15", color: "#58a6ff" },
    { author: "LKL_Awa", content: "前端技术很厉害", time: "13:45", color: "#f9826c" },
    { author: "OIOI_dd", content: "简洁明了", time: "14:20", color: "#c6bd7cff" },
    { author: "AWitur", content: "代码写得不错", time: "15:00", color: "#9e6fdd" },
    { author: "addrhhh", content: "UI设计很有感觉", time: "16:10", color: "#238636" },
    { author: "DNNM", content: "还没下班啊", time: "09:37", color: "#1da1f2" },
    { author: "Asas", content: "主题切换功能好用", time: "14:55", color: "#58a6ff" },
    { author: "V", content: "可以开源吗", time: "18:55", color: "#58a6ff" }
];

// 当前选中的颜色
let selectedColor = "#238636";

// 弹幕状态控制
let danmuEnabled = true;
let danmuInterval = null;

// ==================== 弹幕核心功能 ====================

// 创建弹幕轨道
function createDanmuTracks() {
    const container = document.getElementById('danmuContainer');
    const trackCount = Math.floor(window.innerHeight / 60); // 根据屏幕高度计算轨道数量
    const trackHTML = Array(trackCount).fill(0).map(() => 
        '<div class="danmu-row"></div>'
    ).join('');
    
    container.innerHTML = `<div class="danmu-track">${trackHTML}</div>`;
    
    return trackCount;
}

// 生成单个弹幕
function createDanmu(message) {
    if (!danmuEnabled) return null;
    
    const danmu = document.createElement('div');
    danmu.className = 'danmu-bubble';
    
    // 随机选择轨道
    const rows = document.querySelectorAll('.danmu-row');
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    
    // 随机垂直位置
    const topOffset = Math.floor(Math.random() * 30);
    danmu.style.top = `${topOffset}px`;
    
    // 随机动画持续时间（8-15秒）
    const duration = 8 + Math.random() * 7;
    danmu.style.animationDuration = `${duration}s`;
    danmu.style.animationName = 'danmuScroll';
    
    // 随机延迟开始（0-3秒）
    const delay = Math.random() * 3;
    danmu.style.animationDelay = `${delay}s`;
    
    // 设置弹幕内容
    danmu.innerHTML = `
        <div class="danmu-author">
            <i class="fas fa-user-circle" style="color: ${message.color};"></i>
            ${message.author}：
        </div>
        <div class="danmu-content">${message.content}</div>
        <div class="danmu-time">${message.time}</div>
    `;
    
    // 添加到轨道
    randomRow.appendChild(danmu);
    
    // 动画结束后移除元素 - 增加延迟确保完全离开屏幕
    setTimeout(() => {
        if (danmu.parentNode) {
            danmu.parentNode.removeChild(danmu);
        }
    }, (duration + delay + 1) * 1000); // 增加1秒确保完全离开
    
    return danmu;
}

// 发送弹幕函数
function sendDanmu(name, content, color) {
    if (!name.trim()) {
        alert('请输入你的名字！');
        return;
    }
    
    if (!content.trim()) {
        alert('请输入弹幕内容！');
        return;
    }
    
    // 获取当前时间
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // 创建新弹幕对象
    const newDanmu = {
        author: name,
        content: content,
        time: timeString,
        color: color
    };
    
    // 发送弹幕
    createDanmu(newDanmu);
    
    // 添加到弹幕列表
    danmuMessages.push(newDanmu);
    
    // 清空表单
    document.getElementById('danmuName').value = '';
    document.getElementById('danmuContent').value = '';
    
    // 显示成功消息
    const previewElement = document.getElementById('danmuPreview');
    previewElement.textContent = '弹幕发送成功！';
    previewElement.style.color = '#238636';
    
    // 3秒后恢复预览区域
    setTimeout(() => {
        previewElement.textContent = '弹幕预览将显示在这里';
        previewElement.style.color = '';
    }, 3000);
}

// 连续生成弹幕
function startDanmu() {
    if (!danmuEnabled) return;
    
    // 清除之前的定时器
    if (danmuInterval) {
        clearInterval(danmuInterval);
        danmuInterval = null;
    }
    
    const trackCount = createDanmuTracks();
    
    // 初始生成一些弹幕
    for (let i = 0; i < Math.min(10, danmuMessages.length); i++) {
        setTimeout(() => {
            createDanmu(danmuMessages[i]);
        }, i * 800);
    }
    
    // 持续生成弹幕
    let index = 10;
    danmuInterval = setInterval(() => {
        if (!danmuEnabled) return;
        
        if (index >= danmuMessages.length) index = 0;
        
        createDanmu(danmuMessages[index]);
        index++;
    }, 2000);
}

// 处理窗口大小变化
function handleResize() {
    if (!danmuEnabled) return;
    
    // 清除当前所有弹幕
    const danmuElements = document.querySelectorAll('.danmu-bubble');
    danmuElements.forEach(el => el.remove());
    
    // 重新启动弹幕系统
    startDanmu();
}

// 使用防抖技术优化 resize 事件
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 300);
});

// ==================== 弹幕开关控制 ====================

// 切换弹幕显示状态
function toggleDanmu() {
    danmuEnabled = !danmuEnabled;
    const danmuToggle = document.getElementById('danmuToggle');
    const danmuIcon = danmuToggle.querySelector('i');
    
    if (danmuEnabled) {
        // 启用弹幕
        danmuToggle.classList.remove('disabled');
        danmuIcon.classList.remove('fa-comment-slash');
        danmuIcon.classList.add('fa-comments');
        
        // 恢复弹幕
        const container = document.getElementById('danmuContainer');
        container.style.display = 'block';
        
        // 重新启动弹幕
        startDanmu();
        
        // 显示提示
        showToast('弹幕已开启');
    } else {
        // 禁用弹幕
        danmuToggle.classList.add('disabled');
        danmuIcon.classList.remove('fa-comments');
        danmuIcon.classList.add('fa-comment-slash');
        
        // 停止弹幕
        if (danmuInterval) {
            clearInterval(danmuInterval);
            danmuInterval = null;
        }
        
        // 清空现有弹幕
        const container = document.getElementById('danmuContainer');
        container.style.display = 'none';
        
        // 显示提示
        showToast('弹幕已关闭');
    }
    
    // 保存状态到本地存储
    localStorage.setItem('danmuEnabled', danmuEnabled);
}

// 加载弹幕状态
function loadDanmuState() {
    const savedDanmuState = localStorage.getItem('danmuEnabled');
    if (savedDanmuState !== null) {
        danmuEnabled = savedDanmuState === 'true';
    }
    
    const danmuToggle = document.getElementById('danmuToggle');
    const danmuIcon = danmuToggle.querySelector('i');
    
    if (!danmuEnabled) {
        danmuToggle.classList.add('disabled');
        danmuIcon.classList.remove('fa-comments');
        danmuIcon.classList.add('fa-comment-slash');
        
        const container = document.getElementById('danmuContainer');
        container.style.display = 'none';
        
        // 确保清除间隔器
        if (danmuInterval) {
            clearInterval(danmuInterval);
            danmuInterval = null;
        }
    }
}

// ==================== 弹幕表单功能 ====================

// 更新弹幕预览
function updateDanmuPreview() {
    const name = document.getElementById('danmuName').value || '访客';
    const content = document.getElementById('danmuContent').value || '弹幕内容';
    
    const previewElement = document.getElementById('danmuPreview');
    previewElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-user-circle" style="color: ${selectedColor};"></i>
            <strong style="color: ${selectedColor};">${name}：</strong>
            <span>${content}</span>
        </div>
    `;
}

// 侧边栏功能初始化
function initSidebar() {
    const danmuSidebar = document.getElementById('danmuSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    // 切换侧边栏展开状态
    sidebarToggle.addEventListener('click', function() {
        danmuSidebar.classList.toggle('expanded');
    });
    
    // 颜色选择功能
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有选项的选中状态
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // 添加当前选项的选中状态
            this.classList.add('selected');
            
            // 更新选中颜色
            selectedColor = this.getAttribute('data-color');
            
            // 更新预览
            updateDanmuPreview();
        });
    });
    
    // 表单输入实时预览
    document.getElementById('danmuName').addEventListener('input', updateDanmuPreview);
    document.getElementById('danmuContent').addEventListener('input', updateDanmuPreview);
    
    // 预览按钮
    document.getElementById('previewBtn').addEventListener('click', updateDanmuPreview);
    
    // 表单提交
    document.getElementById('danmuForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('danmuName').value;
        const content = document.getElementById('danmuContent').value;
        
        sendDanmu(name, content, selectedColor);
    });
}

// ==================== 主题切换功能 ====================

// 加载主题
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDarkTheme = savedTheme === 'dark';
    
    // 应用主题
    document.body.classList.toggle('dark-theme', isDarkTheme);
    
    // 更新图标
    const themeIcon = document.querySelector('#themeToggle i');
    if (isDarkTheme) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// 切换主题
function toggleTheme() {
    const isDarkTheme = document.body.classList.toggle('dark-theme');
    const themeIcon = document.querySelector('#themeToggle i');
    
    // 更新图标
    if (isDarkTheme) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
}

// ==================== 下班倒计时功能 ====================

function updateCountdown() {
    const now = new Date();
    const targetHour = 17;
    let targetTime = new Date();

    targetTime.setHours(targetHour, 0, 0, 0);

    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeDiff = targetTime - now;
    const countdownTimer = document.getElementById('countdownTimer');
    const countdownMessage = document.getElementById('countdownMessage');

    if (timeDiff <= 0) {
        countdownTimer.textContent = "下班啦! 🎉";
        countdownTimer.classList.add('off-work');
        countdownMessage.textContent = "享受你的自由时间！";
        countdownMessage.classList.add('off-work');
        return;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    const formatTime = (time) => time.toString().padStart(2, '0');
    const timeString = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

    countdownTimer.textContent = timeString;
    countdownTimer.classList.remove('off-work');
    countdownMessage.classList.remove('off-work');

    if (hours < 1) {
        countdownMessage.textContent = `还有 ${minutes} 分钟就下班了，坚持住！`;
    } else if (hours < 4) {
        countdownMessage.textContent = `今天还有 ${hours} 小时 ${minutes} 分钟下班`;
    } else {
        countdownMessage.textContent = `今天还有 ${hours} 小时 ${minutes} 分钟下班`;
    }
}

// ==================== 辅助功能 ====================

// 显示提示信息
function showToast(message) {
    // 移除现有的提示
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新的提示
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 90px;
        right: 60px;
        background-color: #238686;
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: fadeInOut 2s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 2秒后移除提示
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// 添加涟漪动画效果
function initButtonEffects() {
    const linkButtons = document.querySelectorAll('.link-btn');
    linkButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建点击效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.1);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
            `;
            
            this.appendChild(ripple);
            
            // 移除涟漪元素
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ==================== 动画样式 ====================

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// ==================== 主初始化函数 ====================

// 页面加载完成后的初始化
function init() {
    // 初始化主题
    loadTheme();
    
    // 初始化弹幕状态
    loadDanmuState();
    
    // 初始化倒计时
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // 初始化侧边栏
    initSidebar();
    
    // 初始化按钮效果
    initButtonEffects();
    
    // 初始化预览
    updateDanmuPreview();
    
    // 启动弹幕系统
    startDanmu();
    
    // 添加事件监听器
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('danmuToggle').addEventListener('click', toggleDanmu);
}

// 页面加载完成后执行初始化
window.addEventListener('load', init);