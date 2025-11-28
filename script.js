// ==================== بخش راهنمای بازی ====================
// مدیریت پنجره پاپ‌آپ راهنما
const guideBtn = document.getElementById('guide-btn');
const modal = document.getElementById('guide-modal');
const closeBtn = document.querySelector('.close');

// باز کردن پنجره راهنما
guideBtn.onclick = () => {
    modal.style.display = 'block';
};

// بستن پنجره راهنما
closeBtn.onclick = () => {
    modal.style.display = 'none';
};

// بستن پنجره با کلیک بیرون از آن
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// ==================== مدیریت دکمه اطلاعات سازنده ====================
const infoContainer = document.querySelector('.info-container');

// برای اطمینان از موقعیت ثابت هنگام اسکرول
window.addEventListener('scroll', () => {
    // موقعیت ثابت می‌ماند به دلیل position: fixed
});

// اضافه کردن افکت صوتی برای دکمه اطلاعات
infoContainer.addEventListener('mouseenter', () => {
    playSound(400, 0.2, 'sine');
});

// اضافه کردن این تابع به توابع صوتی موجود
function playInfoSound() {
    playSound(500, 0.3, 'triangle');
}

// ==================== بخش اصلی بازی ====================
// متغیرهای بازی
let currentProvince = null;
let score = 0;
let hearts = 3;
let gameActive = false;
let stars = 0;
let correctAnswers = 0;
let currentTimeLimit = 0;
let timer = null;
let currentLevel = 1;

// عناصر DOM
const iranMap = document.getElementById('iran-map');
const provinceMap = document.getElementById('province-map');
const messageEl = document.getElementById('message');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const heartsEl = document.querySelectorAll('.heart');
const scoreEl = document.querySelector('.score-value');
const starsEl = document.querySelector('.stars');

// داده‌های استان‌های ایران با مختصات نقاط مرکزی
const provinces = [
    { id: 1, name: "آذربایجان شرقی", color: "#FF6B6B", x: 130, y: 70 },
    { id: 2, name: "آذربایجان غربی", color: "#4ECDC4", x: 100, y: 70 },
    { id: 3, name: "اردبیل", color: "#45B7D1", x: 155, y: 60 },
    { id: 4, name: "اصفهان", color: "#96CEB4", x: 240, y: 180 },
    { id: 5, name: "البرز", color: "#FFEAA7", x: 215, y: 123 },
    { id: 6, name: "ایلام", color: "#DDA0DD", x: 140, y: 180 },
    { id: 7, name: "بوشهر", color: "#98D8C8", x: 225, y: 270 },
    { id: 8, name: "تهران", color: "#F7DC6F", x: 236, y: 123 },
    { id: 9, name: "چهارمحال و بختیاری", color: "#BB8FCE", x: 205, y: 205 },
    { id: 10, name: "خراسان جنوبی", color: "#85C1E9", x: 370, y: 180 },
    { id: 11, name: "خراسان رضوی", color: "#F8C471", x: 360, y: 120 },
    { id: 12, name: "خراسان شمالی", color: "#82E0AA", x: 320, y: 80 },
    { id: 13, name: "خوزستان", color: "#F1948A", x: 176, y: 215 },
    { id: 14, name: "زنجان", color: "#C39BD3", x: 165, y: 105 },
    { id: 15, name: "سمنان", color: "#7FB3D5", x: 280, y: 125 },
    { id: 16, name: "سیستان و بلوچستان", color: "#76D7C4", x: 410, y: 290 },
    { id: 17, name: "فارس", color: "#F7DC6F", x: 260, y: 270 },
    { id: 18, name: "قزوین", color: "#BB8FCE", x: 190, y: 115 },
    { id: 19, name: "قم", color: "#85C1E9", x: 215, y: 150 },
    { id: 20, name: "کردستان", color: "#F8C471", x: 138, y: 125 },
    { id: 21, name: "کرمان", color: "#82E0AA", x: 335, y: 255 },
    { id: 22, name: "کرمانشاه", color: "#F1948A", x: 133, y: 150 },
    { id: 23, name: "کهگیلویه و بویراحمد", color: "#C39BD3", x: 210, y: 230 },
    { id: 24, name: "گلستان", color: "#7FB3D5", x: 290, y: 80 },
    { id: 25, name: "گیلان", color: "#76D7C4", x: 185, y: 92 },
    { id: 26, name: "لرستان", color: "#F7DC6F", x: 167, y: 174 },
    { id: 27, name: "مازندران", color: "#BB8FCE", x: 235, y: 110 },
    { id: 28, name: "مرکزی", color: "#85C1E9", x: 190, y: 150 },
    { id: 29, name: "هرمزگان", color: "#F8C471", x: 320, y: 300 },
    { id: 30, name: "همدان", color: "#82E0AA", x: 165, y: 140 },
    { id: 31, name: "یزد", color: "#F1948A", x: 300, y: 190 }
];

// ==================== توابع صوتی و بصری ====================
// ایجاد افکت صوتی با Web Audio API
function playSound(frequency, duration, type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log("مرورگر شما از Web Audio API پشتیبانی نمی‌کند");
    }
}

// پخش صدای تشویق و جیغ
function playVictorySound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // ایجاد چند نوت برای صدای تشویق
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 600 + (i * 100);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, i * 100);
        }
    } catch (e) {
        console.log("مرورگر شما از Web Audio API پشتیبانی نمی‌کند");
    }
}

// ایجاد افکت بصری
function createEffect(type, x, y) {
    const effect = document.createElement('div');
    effect.className = `effect ${type}-effect`;
    
    if (type === 'star') {
        effect.innerHTML = '★';
        effect.style.color = getRandomStarColor();
        playSound(800, 0.5, 'sine');
    } else if (type === 'heart') {
        effect.innerHTML = '❤️';
        playSound(600, 0.3, 'sine');
    } else if (type === 'broken-heart') {
        effect.innerHTML = '💔';
        playSound(300, 0.7, 'sawtooth');
    } else if (type === 'firework') {
        effect.innerHTML = '✨';
        effect.style.color = getRandomStarColor();
        effect.style.fontSize = '4rem';
    }
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    document.body.appendChild(effect);
    
    // حذف افکت پس از اتمام انیمیشن
    setTimeout(() => {
        effect.remove();
    }, 1500);
}

// رنگ تصادفی برای ستاره‌ها
function getRandomStarColor() {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ایجاد چندین ستاره در سراسر صفحه
function createMultipleStars(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createEffect('star', x, y);
        }, i * 100);
    }
}

// نمایش جام قهرمانی
function showTrophy() {
    const trophy = document.createElement('div');
    trophy.className = 'trophy-effect';
    trophy.innerHTML = '🏆';
    trophy.style.position = 'fixed';
    trophy.style.top = '50%';
    trophy.style.left = '50%';
    trophy.style.transform = 'translate(-50%, -50%)';
    trophy.style.fontSize = '10rem';
    trophy.style.zIndex = '2000';
    trophy.style.animation = 'trophyBounce 2s ease-in-out';
    
    document.body.appendChild(trophy);
    
    // ایجاد آتش بازی
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createEffect('firework', x, y);
        }, i * 150);
    }
    
    // پخش صدای تشویق
    playVictorySound();
    
    // حذف جام بعد از 3 ثانیه
    setTimeout(() => {
        trophy.remove();
    }, 2000);
}

// ==================== توابع پیام تمام صفحه ====================
// نمایش پیام تمام صفحه
function showFullScreenMessage(text, type = '', duration = 1000) {
    messageEl.innerHTML = `
        <div class="message-content">
            ${text}
        </div>
    `;
    messageEl.className = `message ${type} show`;
    
    // پنهان کردن پیام بعد از مدت مشخص
    setTimeout(() => {
        hideFullScreenMessage();
    }, duration);
}

// پنهان کردن پیام تمام صفحه
function hideFullScreenMessage() {
    messageEl.classList.remove('show');
    setTimeout(() => {
        messageEl.className = 'message';
        messageEl.innerHTML = '';
    }, 500);
}

// نمایش پیام پایان بازی
function showGameOverMessage() {
    showFullScreenMessage(
        `🎯 بازی به پایان رسید!<br>
         <span style="font-size: 4rem; display: block; margin: 20px 0;">🏆</span>
         امتیاز نهایی شما: <span style="color: #FFD700; font-size: 4rem;">${score}</span><br>
         <small style="font-size: 1.5rem; margin-top: 20px; display: block;">
            برای بازی مجدد روی دکمه "بازی مجدد" کلیک کنید
         </small>`,
        'game-finished',
        5000
    );
}

// ==================== توابع نقشه و نقاط قابل کلیک ====================
// ایجاد نقشه ایران با نقاط قابل کلیک
function createIranMap() {
    // پاک کردن محتوای قبلی نقشه
    iranMap.innerHTML = '';
    
    // ایجاد تصویر نقشه ایران
    const img = document.createElement("img");
    img.src = "iranmap.png";
    img.className = "iran-map-img";
    img.alt = "نقشه ایران";
    iranMap.appendChild(img);
    
    // ایجاد نقاط قابل کلیک برای هر استان
    provinces.forEach(province => {
        createProvincePoint(province);
    });
}

// ایجاد یک نقطه قابل کلیک برای استان
function createProvincePoint(province) {
    const point = document.createElement("div");
    point.className = "province-point";
    point.dataset.id = province.id;
    point.dataset.name = province.name;
    point.style.left = `${province.x}px`;
    point.style.top = `${province.y}px`;
    // عنوان استان هنگام هاور حذف شده است
    
    // رویداد کلیک
    point.addEventListener('click', function(e) {
        e.stopPropagation();
        if (gameActive) {
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            checkAnswer(province.id, x, y);
        }
    });
    
    iranMap.appendChild(point);
}

// فعال/غیرفعال کردن نقاط
function toggleProvincePoints(active) {
    const points = document.querySelectorAll('.province-point');
    points.forEach(point => {
        if (active) {
            point.classList.add('active');
        } else {
            point.classList.remove('active');
        }
    });
}

// ==================== توابع تایمر ====================
// شروع تایمر
function startTimer() {
    clearTimer();
    currentTimeLimit = getTimeLimit();
    updateTimerDisplay();
    
    timer = setInterval(() => {
        currentTimeLimit--;
        updateTimerDisplay();
        
        if (currentTimeLimit <= 0) {
            handleTimeUp();
        }
    }, 1000);
}

// دریافت محدوده زمانی بر اساس سطح
function getTimeLimit() {
    if (currentLevel === 1) return 15;
    if (currentLevel === 2) return 10;
    return 5; // سطح 3 و بالاتر
}

// پاک کردن تایمر
function clearTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// به‌روزرسانی نمایش تایمر
function updateTimerDisplay() {
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
        timerDisplay.textContent = `زمان: ${currentTimeLimit} ثانیه`;
        timerDisplay.className = `timer-display ${currentTimeLimit <= 5 ? 'warning' : ''}`;
    }
}

// مدیریت اتمام زمان
function handleTimeUp() {
    hearts--;
    updateHearts();
    
    // ایجاد افکت قلب شکسته
    createEffect('broken-heart', window.innerWidth / 2, window.innerHeight / 2);
    
    if (hearts === 0) {
        endGame();
    } else {
        setTimeout(() => {
            if (gameActive) {
                selectRandomProvince();
                startTimer();
            }
        }, 1000);
    }
}

// ==================== توابع اصلی بازی ====================
// انتخاب یک استان تصادفی
function selectRandomProvince() {
    const randomIndex = Math.floor(Math.random() * provinces.length);
    currentProvince = provinces[randomIndex];
    
    // نمایش استان انتخاب شده
    provinceMap.innerHTML = `
        <div class="selected-province" style="background-color: ${currentProvince.color}">
            <h3>${currentProvince.name}</h3>
            <p>این استان را در نقشه پیدا کنید و روی نقطه آن کلیک کنید</p>
        </div>
    `;
}

// بررسی پاسخ کاربر
function checkAnswer(provinceId, x, y) {
    if (!gameActive) return;
    
    // توقف تایمر هنگام پاسخ دادن
    clearTimer();
    
    if (provinceId === currentProvince.id) {
        // پاسخ صحیح
        handleCorrectAnswer(x, y);
    } else {
        // پاسخ نادرست
        handleWrongAnswer(provinceId, x, y);
    }
}

// مدیریت پاسخ صحیح
function handleCorrectAnswer(x, y) {
    score += 10;
    stars++;
    correctAnswers++;
    updateScore();
    updateStars();
    
    // اضافه کردن افکت درخشش به ستاره‌ها
    const starElements = document.querySelectorAll('.star');
    starElements.forEach(star => {
        star.classList.add('pulse-effect');
        setTimeout(() => {
            star.classList.remove('pulse-effect');
        }, 500);
    });
    
    // برجسته کردن نقطه صحیح (زرد درخشان)
    const correctPoint = document.querySelector(`.province-point[data-id="${currentProvince.id}"]`);
    if (correctPoint) {
        correctPoint.classList.add('correct');
        setTimeout(() => {
            correctPoint.classList.remove('correct');
        }, 1000);
    }
    
    // ایجاد افکت ستاره در سراسر صفحه
    createMultipleStars(8);
    
    // بررسی ارتقاء سطح
    if (correctAnswers >= 10) {
        levelUp();
    } else {
        // انتخاب استان جدید بعد از 1 ثانیه
        setTimeout(() => {
            if (gameActive) {
                selectRandomProvince();
                startTimer(); // شروع مجدد تایمر
            }
        }, 1000);
    }
}

// ارتقاء سطح
function levelUp() {
    currentLevel++;
    correctAnswers = 0;
    hearts = 3; // پر کردن مجدد قلب‌ها
    updateHearts();
    
    if (currentLevel <= 3) {
        // نمایش پیام تمام صفحه برای ارتقاء سطح
        showFullScreenMessage(
            `🎉 تبریک! شما به سطح ${currentLevel} صعود کردید!<br>
             <small>در این مرحله برای پیدا کردن هر استان فقط ${getTimeLimit()} ثانیه زمان دارید!</small>`,
            'level-up',
            4000
        );
        
        // ایجاد افکت‌های ویژه برای ارتقاء سطح
        createMultipleStars(15);
        
        // پخش صدای تشویق و جیغ
        playVictorySound();
        
        setTimeout(() => {
            if (gameActive) {
                selectRandomProvince();
                startTimer();
            }
        }, 4000);
    } else {
        // برد نهایی و نمایش جام
        showTrophy();
        showFullScreenMessage(
            `🏆 شما قهرمان بازی شدید!<br>
             <span style="font-size: 4rem; display: block; margin: 20px 0;">🎯</span>
             امتیاز نهایی: <span style="color: #FFD700; font-size: 4rem;">${score}</span><br>
             <small style="font-size: 1.5rem; margin-top: 20px; display: block;">
                برای بازی مجدد روی دکمه "بازی مجدد" کلیک کنید
             </small>`,
            'game-finished',
            5000
        );
        
        setTimeout(() => {
            endGame();
        }, 5000);
    }
}

// مدیریت پاسخ نادرست
function handleWrongAnswer(provinceId, x, y) {
    hearts--;
    updateHearts();
    
    // برجسته کردن نقطه غلط (قرمز)
    const wrongPoint = document.querySelector(`.province-point[data-id="${provinceId}"]`);
    if (wrongPoint) {
        wrongPoint.classList.add('wrong');
        setTimeout(() => {
            wrongPoint.classList.remove('wrong');
        }, 2000);
    }
    
    // ایجاد افکت قلب شکسته
    createEffect('broken-heart', x, y);
    
    if (hearts === 0) {
        endGame();
    } else {
        setTimeout(() => {
            if (gameActive) {
                selectRandomProvince();
                startTimer(); // شروع مجدد تایمر
            }
        }, 2000);
    }
}

// دریافت نام استان بر اساس ID
function getProvinceName(provinceId) {
    const province = provinces.find(p => p.id === provinceId);
    return province ? province.name : 'نامشخص';
}

// ==================== توابع به‌روزرسانی وضعیت بازی ====================
// به روزرسانی قلب‌ها
function updateHearts() {
    heartsEl.forEach((heart, index) => {
        if (index < hearts) {
            heart.style.opacity = '1';
            heart.style.transform = 'scale(1)';
            heart.innerHTML = '❤️';
        } else {
            heart.style.opacity = '0.3';
            heart.style.transform = 'scale(0.8)';
            heart.innerHTML = '💔'; // تبدیل به قلب شکسته
        }
    });
}

// به روزرسانی امتیاز
function updateScore() {
    scoreEl.textContent = score;
    // افکت پالس برای امتیاز
    scoreEl.classList.add('pulse');
    setTimeout(() => scoreEl.classList.remove('pulse'), 300);
}

// به روزرسانی ستاره‌ها
function updateStars() {
    starsEl.innerHTML = '';
    
    // نمایش حداکثر ۵ ستاره (نمادین)
    const maxDisplayStars = 5;
    const displayStars = Math.min(stars, maxDisplayStars);
    
    for (let i = 0; i < displayStars; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        starsEl.appendChild(star);
    }
    
    // اگر ستاره‌ها بیشتر از ۵ تا شدند، تعداد را نمایش بده
    if (stars > maxDisplayStars) {
        const count = document.createElement('span');
        count.className = 'star-count';
        count.textContent = ` +${stars - maxDisplayStars}`;
        count.style.fontSize = '1.2rem';
        count.style.color = '#FFD700';
        count.style.marginRight = '5px';
        starsEl.appendChild(count);
    }
    
    // افکت پالس برای ستاره‌ها
    starsEl.classList.add('pulse');
    setTimeout(() => starsEl.classList.remove('pulse'), 300);
}

// ==================== توابع مدیریت بازی ====================
// شروع بازی
function startGame() {
    gameActive = true;
    score = 0;
    hearts = 3;
    stars = 0;
    correctAnswers = 0;
    currentLevel = 1;
    updateScore();
    updateHearts();
    updateStars();
    
    // ایجاد نمایشگر تایمر
    if (!document.querySelector('.timer-display')) {
        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'timer-display';
        document.querySelector('.game-info').appendChild(timerDisplay);
    }
    
    // نمایش پیام شروع بازی به صورت تمام صفحه
    showFullScreenMessage('🎮 بازی شروع شد!', 'success', 2000);
    
    startBtn.disabled = true;
    
    // فعال کردن نقاط
    toggleProvincePoints(true);
    
    // شروع تایمر بعد از نمایش پیام
    setTimeout(() => {
        selectRandomProvince();
        startTimer();
    }, 2000);
    
    // پخش صدای شروع بازی
    playSound(500, 0.5, 'sine');
    setTimeout(() => playSound(600, 0.5, 'sine'), 200);
    setTimeout(() => playSound(700, 0.5, 'sine'), 400);
}

// پایان بازی
function endGame() {
    gameActive = false;
    clearTimer(); // توقف تایمر
    
    // نمایش پیام پایان بازی
    showGameOverMessage();
    
    startBtn.disabled = false;
    
    // غیرفعال کردن نقاط
    toggleProvincePoints(false);
    
    // پخش صدای پایان بازی
    playSound(400, 0.7, 'sawtooth');
    setTimeout(() => playSound(300, 0.7, 'sawtooth'), 300);
    setTimeout(() => playSound(200, 0.7, 'sawtooth'), 600);
}

// تنظیم مجدد بازی
function resetGame() {
    gameActive = false;
    clearTimer();
    score = 0;
    hearts = 3;
    stars = 0;
    correctAnswers = 0;
    currentLevel = 1;
    updateScore();
    updateHearts();
    updateStars();
    startBtn.disabled = false;
    
    // حذف نمایشگر تایمر
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
        timerDisplay.remove();
    }
    
    // غیرفعال کردن نقاط
    toggleProvincePoints(false);
    
    // پنهان کردن پیام تمام صفحه
    hideFullScreenMessage();
    
    // شروع خودکار بازی بعد از ریست
    setTimeout(() => {
        startGame();
    }, 500);
}

// ==================== راه‌اندازی اولیه ====================
// رویدادهای دکمه‌ها
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// مقداردهی اولیه
createIranMap();
updateScore();
updateHearts();

updateHearts(); // برای نمایش قلب‌های اولیه
