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
});

// اضافه کردن افکت صوتی برای دکمه اطلاعات
infoContainer.addEventListener('mouseenter', () => {
    playSound(400, 0.2, 'sine');
});

// ==================== ثابت‌های رنگ‌ها ====================
const POINT_COLORS = {
    NORMAL: 'rgba(255, 255, 255, 0.36)',    // بسیار کمرنگ
    ACTIVE: 'rgba(255, 255, 255, 0.47)',    // کمی پررنگ‌تر هنگام فعال
    CORRECT: 'rgba(76, 175, 80, 0.9)',      // سبز پررنگ برای پاسخ صحیح
    WRONG: 'rgba(244, 67, 54, 0.9)',        // قرمز پررنگ برای پاسخ غلط
    SELECTED: 'rgba(255, 193, 7, 0.9)'      // زرد پررنگ برای استان انتخاب شده
};

// ==================== بخش اصلی بازی ====================
// متغیرهای بازی
let currentProvince = null;
let score = 0;
let hearts = 3;
let gameActive = false;
let stars = 0;
let currentTimeLimit = 0;
let timer = null;

// متغیرهای مرحله بازی
let currentGamePhase = 1;
let phase1Level = 1;
let phase2Level = 1;
let phase1CorrectAnswers = 0;
let phase2CorrectAnswers = 0;

// عناصر DOM
const iranMap = document.getElementById('iran-map');
const provinceMap = document.getElementById('province-map');
const messageEl = document.getElementById('message');
const startBtn = document.getElementById('start-btn');
const heartsEl = document.querySelectorAll('.heart');
const scoreEl = document.querySelector('.score-value');
const starsEl = document.querySelector('.stars');

// داده‌های استان‌های ایران با مختصات نقاط مرکزی و مسیر تصاویر
const provinces = [
    { id: 1, name: "آذربایجان شرقی", color: "#FF6B6B", x: 95, y: 50, shape: "pictures/provinces/east-azerbaijan.png" },
    { id: 2, name: "آذربایجان غربی", color: "#4ECDC4", x: 55, y: 55, shape: "pictures/provinces/west-azerbaijan.png" },
    { id: 3, name: "اردبیل", color: "#45B7D1", x: 130, y: 40, shape: "pictures/provinces/ardabil.png" },
    { id: 4, name: "اصفهان", color: "#96CEB4", x: 230, y: 180, shape: "pictures/provinces/isfahan.png" },
    { id: 5, name: "البرز", color: "#FFEAA7", x: 200, y: 106, shape: "pictures/provinces/alborz.png" },
    { id: 6, name: "ایلام", color: "#DDA0DD", x: 100, y: 180, shape: "pictures/provinces/ilam.png" },
    { id: 7, name: "بوشهر", color: "#98D8C8", x: 212, y: 295, shape: "pictures/provinces/booshehr.png" },
    { id: 8, name: "تهران", color: "#F7DC6F", x: 217, y: 117, shape: "pictures/provinces/tehran.png" },
    { id: 9, name: "چهارمحال و بختیاری", color: "#BB8FCE", x: 193, y: 210, shape: "pictures/provinces/chaharmahal-and-bakhtiari.png" },
    { id: 10, name: "خراسان جنوبی", color: "#85C1E9", x: 400, y: 195, shape: "pictures/provinces/south-khorasan.png" },
    { id: 11, name: "خراسان رضوی", color: "#F8C471", x: 400, y: 116, shape: "pictures/provinces/razavi-khorasan.png" },
    { id: 12, name: "خراسان شمالی", color: "#82E0AA", x: 344, y: 64, shape: "pictures/provinces/north-khorasan.png" },
    { id: 13, name: "خوزستان", color: "#F1948A", x: 156, y: 218, shape: "pictures/provinces/khuzestan.png" },
    { id: 14, name: "زنجان", color: "#C39BD3", x: 140, y: 90, shape: "pictures/provinces/zanjan.png" },
    { id: 15, name: "سمنان", color: "#7FB3D5", x: 280, y: 125, shape: "pictures/provinces/semnan.png" },
    { id: 16, name: "سیستان و بلوچستان", color: "#76D7C4", x: 440, y: 320, shape: "pictures/provinces/sistan-and-baluchestan.png" },
    { id: 17, name: "فارس", color: "#F7DC6F", x: 255, y: 285, shape: "pictures/provinces/fars.png" },
    { id: 18, name: "قزوین", color: "#BB8FCE", x: 172, y: 105, shape: "pictures/provinces/qazvin.png" },
    { id: 19, name: "قم", color: "#85C1E9", x: 203, y: 138, shape: "pictures/provinces/qom.png" },
    { id: 20, name: "کردستان", color: "#F8C471", x: 108, y: 115, shape: "pictures/provinces/kurdistan.png" },
    { id: 21, name: "کرمان", color: "#82E0AA", x: 350, y: 275, shape: "pictures/provinces/kerman.png" },
    { id: 22, name: "کرمانشاه", color: "#F1948A", x: 100, y: 148, shape: "pictures/provinces/kermanshah.png" },
    { id: 23, name: "کهگیلویه و بویراحمد", color: "#C39BD3", x: 200, y: 245, shape: "pictures/provinces/kohgiluyeh-and-boyer-ahmad.png" },
    { id: 24, name: "گلستان", color: "#7FB3D5", x: 293, y: 74, shape: "pictures/provinces/golestan.png" },
    { id: 25, name: "گیلان", color: "#76D7C4", x: 170, y: 74, shape: "pictures/provinces/gilan.png" },
    { id: 26, name: "لرستان", color: "#F7DC6F", x: 138, y: 170, shape: "pictures/provinces/lorestan.png" },
    { id: 27, name: "مازندران", color: "#BB8FCE", x: 235, y: 97, shape: "pictures/provinces/mazandaran.png" },
    { id: 28, name: "مرکزی", color: "#85C1E9", x: 168, y: 140, shape: "pictures/provinces/markazi.png" },
    { id: 29, name: "هرمزگان", color: "#F8C471", x: 328, y: 325, shape: "pictures/provinces/hormozgan.png" },
    { id: 30, name: "همدان", color: "#82E0AA", x: 140, y: 135, shape: "pictures/provinces/hamadan.png" },
    { id: 31, name: "یزد", color: "#F1948A", x: 300, y: 205, shape: "pictures/provinces/yazd.png" }
];

// ==================== مدیریت دکمه شروع/شروع مجدد ====================
startBtn.addEventListener('click', function() {
    if (!gameActive) {
        // اگر بازی فعال نیست، شروع کن
        startGame();
    } else {
        // اگر بازی فعال است، ریست کن
        resetGame();
    }
});

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

// ==================== تابع به‌روزرسانی رنگ نقطه ====================
function updatePointColor(pointElement, colorType) {
    const color = POINT_COLORS[colorType];
    if (!color || !pointElement) return;
    
    pointElement.style.background = color;
    pointElement.style.borderColor = color;
    pointElement.style.boxShadow = `0 0 15px ${color}`;
}

// ==================== توابع نقشه و نقاط قابل کلیک ====================
// ایجاد نقشه ایران با نقاط قابل کلیک
function createIranMap() {
    // پاک کردن محتوای قبلی نقشه
    iranMap.innerHTML = '';
    
    // ایجاد تصویر نقشه ایران
    const img = document.createElement("img");
    img.src = "pictures/iranmap.png";
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
    
    // تنظیم رنگ اولیه
    updatePointColor(point, 'NORMAL');
    
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
    
    // رویدادهای hover برای افکت بصری بهتر
    point.addEventListener('mouseenter', function() {
        if (gameActive && !this.classList.contains('correct') && !this.classList.contains('wrong')) {
            this.style.transform = 'translate(-50%, -50%) scale(1.3)';
            this.style.zIndex = '50';
        }
    });
    
    point.addEventListener('mouseleave', function() {
        if (gameActive && !this.classList.contains('correct') && !this.classList.contains('wrong')) {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
            this.style.zIndex = '10';
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
            updatePointColor(point, 'ACTIVE');
            point.style.cursor = 'pointer';
        } else {
            point.classList.remove('active');
            updatePointColor(point, 'NORMAL');
            point.style.cursor = 'not-allowed';
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

// دریافت محدوده زمانی بر اساس مرحله و سطح
function getTimeLimit() {
    if (currentGamePhase === 1) {
        // مرحله تشخیص شکل
        if (phase1Level === 1) return 15;
        if (phase1Level === 2) return 10;
        if (phase1Level === 3) return 5;
    } else {
        // مرحله تشخیص نام
        if (phase2Level === 1) return 15;
        if (phase2Level === 2) return 10;
        if (phase2Level === 3) return 5;
    }
    return 15; // مقدار پیش‌فرض
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

// ==================== توابع مدیریت مراحل بازی ====================
// تابع برای تغییر مرحله
function changeGamePhase(newPhase) {
    currentGamePhase = newPhase;
    
    if (newPhase === 1) {
        showFullScreenMessage(
            `🎯 مرحله اول: تشخیص استان از روی نام<br>
             <small>سطح ${phase1Level} - ${getTimeLimit()} ثانیه زمان دارید</small>`,
            'level-up',
            3000
        );
    } else {
        showFullScreenMessage(
            `🎯 مرحله دوم: تشخیص استان از روی شکل<br>
             <small>سطح ${phase2Level} - ${getTimeLimit()} ثانیه زمان دارید</small>`,
            'level-up',
            3000
        );
    }
    
    setTimeout(() => {
        if (gameActive) {
            selectRandomProvince();
            startTimer();
        }
    }, 1000);
}

// ارتقاء سطح در مرحله اول
function levelUpPhase1() {
    phase1Level++;
    phase1CorrectAnswers = 0;
    
    // بازگرداندن قلب‌ها به عنوان پاداش
    if (hearts < 3) {
        hearts = 3;
        updateHearts();
        createMultipleStars(5); // ستاره‌های اضافی برای پاداش قلب
        playSound(800, 0.5, 'triangle'); // صدای پاداش
    }
    
    if (phase1Level <= 3) {
        showFullScreenMessage(
            `🎉 تبریک! شما به سطح ${phase1Level} مرحله اول صعود کردید!<br>
             <small>در این سطح فقط ${getTimeLimit()} ثانیه زمان دارید!</small>
             ${hearts < 3 ? '<br><span style="color:#4CAF50; font-size:1.2rem;">🎁 پاداش: همه قلب‌های شما بازگردانده شد!</span>' : ''}`,
            'level-up',
            4000
        );
        
        createMultipleStars(15);
        playVictorySound();
        
        // بلافاصله استان جدید را انتخاب کن
        setTimeout(() => {
            if (gameActive) {
                selectRandomProvince();
                startTimer();
            }
        }, 1000);
    } else {
        // اتمام مرحله اول و رفتن به مرحله دوم
        changeGamePhase(2);
    }
}

// ارتقا سطح در مرحله دوم
function levelUpPhase2() {
    phase2Level++;
    phase2CorrectAnswers = 0;
    
    // بازگرداندن قلب‌ها به عنوان پاداش
    if (hearts < 3) {
        hearts = 3;
        updateHearts();
        createMultipleStars(5); // ستاره‌های اضافی برای پاداش قلب
        playSound(800, 0.5, 'triangle'); // صدای پاداش
    }
    
    if (phase2Level <= 3) {
        showFullScreenMessage(
            `🎉 تبریک! شما به سطح ${phase2Level} مرحله دوم صعود کردید!<br>
             <small>در این سطح فقط ${getTimeLimit()} ثانیه زمان دارید!</small>
             ${hearts < 3 ? '<br><span style="color:#4CAF50; font-size:1.2rem;">🎁 پاداش: همه قلب‌های شما بازگردانده شد!</span>' : ''}`,
            'level-up',
            4000
        );
        
        createMultipleStars(15);
        playVictorySound();
        
        // بلافاصله استان جدید را انتخاب کن
        setTimeout(() => {
            if (gameActive) {
                selectRandomProvince();
                startTimer();
            }
        }, 1000);
    } else {
        // برد نهایی و نمایش جام
        showTrophy();
        showFullScreenMessage(
            `🏆 شما قهرمان بازی شدید!<br>
             <span style="font-size: 4rem; display: block; margin: 20px 0;">🎯</span>
             امتیاز نهایی: <span style="color: #FFD700; font-size: 4rem;">${score}</span><br>
             <small style="font-size: 1.5rem; margin-top: 20px; display: block;">
                برای بازی مجدد روی دکمه "بازی جدید" کلیک کنید
             </small>`,
            'game-finished',
            5000
        );
        
        setTimeout(() => {
            endGame();
        }, 5000);
    }
}

// ==================== توابع اصلی بازی ====================
// انتخاب یک استان تصادفی
function selectRandomProvince() {
    const randomIndex = Math.floor(Math.random() * provinces.length);
    currentProvince = provinces[randomIndex];
    
    if (currentGamePhase === 1) {
        // مرحله اول: نمایش نام استان
        provinceMap.innerHTML = `
            <div class="selected-province" style="background-color: ${currentProvince.color}">
                <div class="game-phase-indicator">مرحله ۱: تشخیص نام (سطح ${phase1Level})</div>
                <h3>${currentProvince.name}</h3>
            </div>
        `;
    } else {
        // مرحله دوم: نمایش شکل استان 
        provinceMap.innerHTML = `
            <div class="selected-province">
                <div class="game-phase-indicator">مرحله ۲: تشخیص شکل (سطح ${phase2Level})</div>
                <div class="province-image-wrapper">
                    <img src="${currentProvince.shape}" 
                         alt="شکل استان ${currentProvince.name}" 
                         class="province-shape"
                         onload="centerProvinceImage(this)"
                         onerror="handleImageError(this, '${currentProvince.name}')">
                </div>
            </div>
        `;
    }
}

// تابع جدید برای مرکز کردن تصویر
function centerProvinceImage(imgElement) {
    // اگر تصویر خیلی کوچک است، آن را بزرگتر نشان بده
    const container = imgElement.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imgWidth = imgElement.naturalWidth;
    const imgHeight = imgElement.naturalHeight;
    
    // اگر تصویر خیلی کوچک است، سایز آن را افزایش بده
    if (imgWidth < containerWidth * 0.5 || imgHeight < containerHeight * 0.5) {
        imgElement.style.width = 'auto';
        imgElement.style.height = '80%';
        imgElement.style.objectFit = 'contain';
    }
}

// تابع برای مدیریت خطاهای تصویر
function handleImageError(imgElement, provinceName) {
    console.error(`تصویر استان ${provinceName} یافت نشد`);
    imgElement.parentElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <div style="font-size: 3rem; margin-bottom: 20px;">🗺️</div>
            <h3>${provinceName}</h3>
            <p style="color: #666; margin-top: 10px;">تصویر استان در دسترس نیست</p>
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
    
    if (currentGamePhase === 1) {
        phase1CorrectAnswers++;
    } else {
        phase2CorrectAnswers++;
    }
    
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
        correctPoint.classList.add('answered');
        updatePointColor(correctPoint, 'SELECTED');
        
        // انیمیشن پالس طلایی
        correctPoint.style.animation = 'pulse-gold 1s infinite';
        
        setTimeout(() => {
            correctPoint.classList.remove('correct');
            correctPoint.classList.remove('answered');
            correctPoint.style.animation = '';
            // برگشت به حالت عادی
            updatePointColor(correctPoint, 'NORMAL');
        }, 1000);
    }
    
    // ایجاد افکت ستاره در سراسر صفحه
    createMultipleStars(5);
    
    // پخش صدای تشویق
    playSound(800, 0.3, 'sine');
    
    // بررسی ارتقا سطح در هر مرحله
    if (currentGamePhase === 1) {
        if (phase1CorrectAnswers >= 10) {
            setTimeout(() => {
                levelUpPhase1();
            }, 1000);
        } else {
            setTimeout(() => {
                if (gameActive) {
                    selectRandomProvince();
                    startTimer();
                }
            }, 1000);
        }
    } else {
        if (phase2CorrectAnswers >= 10) {
            setTimeout(() => {
                levelUpPhase2();
            }, 1000);
        } else {
            setTimeout(() => {
                if (gameActive) {
                    selectRandomProvince();
                    startTimer();
                }
            }, 1000);
        }
    }
}

// مدیریت پاسخ نادرست
function handleWrongAnswer(provinceId, x, y) {
    hearts--;
    updateHearts();
    
    // 1. برجسته کردن نقطه اشتباه (قرمز)
    const wrongPoint = document.querySelector(`.province-point[data-id="${provinceId}"]`);
    if (wrongPoint) {
        wrongPoint.classList.add('wrong');
        wrongPoint.classList.add('answered');
        updatePointColor(wrongPoint, 'WRONG');
        
        // افزودن انیمیشن تکان خوردن
        wrongPoint.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            wrongPoint.classList.remove('wrong');
            wrongPoint.classList.remove('answered');
            wrongPoint.style.animation = '';
            // برگشت به حالت عادی بعد از 2 ثانیه
            updatePointColor(wrongPoint, 'NORMAL');
        }, 2000);
    }
    
    // 2. برجسته کردن نقطه صحیح (سبز)
    const correctPoint = document.querySelector(`.province-point[data-id="${currentProvince.id}"]`);
    if (correctPoint) {
        correctPoint.classList.add('correct');
        updatePointColor(correctPoint, 'CORRECT');
        
        // افزودن انیمیشن پالس برای نقطه صحیح
        correctPoint.style.animation = 'pulse-green 1s infinite';
        
        setTimeout(() => {
            correctPoint.classList.remove('correct');
            correctPoint.style.animation = '';
            // برگشت به حالت عادی بعد از 2 ثانیه
            updatePointColor(correctPoint, 'NORMAL');
        }, 2000);
    }
    
    // 3. ایجاد افکت قلب شکسته
    createEffect('broken-heart', x, y);
    
    // 4. پخش صدای شکستن قلب
    playSound(300, 0.7, 'sawtooth');
    
    if (hearts === 0) {
        setTimeout(() => {
            endGame();
        }, 2000);
    } else {
        setTimeout(() => {
            if (gameActive) {
                selectRandomProvince();
                startTimer(); // شروع مجدد تایمر
            }
        }, 2000);
    }
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
    phase1Level = 1;
    phase2Level = 1;
    phase1CorrectAnswers = 0;
    phase2CorrectAnswers = 0;
    currentGamePhase = 1; // شروع با مرحله اول
    
    // تغییر متن و استایل دکمه
    startBtn.textContent = 'شروع مجدد';
    startBtn.classList.add('playing');
    startBtn.classList.remove('game-over');
    
    updateScore();
    updateHearts();
    updateStars();
    
    // ایجاد نمایشگر تایمر
    if (!document.querySelector('.timer-display')) {
        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'timer-display';
        document.querySelector('.game-info').appendChild(timerDisplay);
    }
    
    // نمایش پیام شروع بازی
    showFullScreenMessage(
        '🎮 بازی شروع شد!<br>' +
        '<small>مرحله اول: تشخیص استان از روی نام<br>' +
        'سطح 1 - 15 ثانیه زمان دارید</small>',
        'success',
        2000
    );
    
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
    
    // تغییر متن و استایل دکمه برای حالت پایان بازی
    startBtn.textContent = 'بازی جدید';
    startBtn.classList.remove('playing');
    startBtn.classList.add('game-over');
    
    // نمایش پیام پایان بازی
    showGameOverMessage();
    
    // غیرفعال کردن نقاط
    toggleProvincePoints(false);
    
    // پخش صدای پایان بازی
    playSound(400, 0.7, 'sawtooth');
    setTimeout(() => playSound(300, 0.7, 'sawtooth'), 300);
    setTimeout(() => playSound(200, 0.7, 'sawtooth'), 600);
}

// نمایش پیام پایان بازی
function showGameOverMessage() {
    showFullScreenMessage(
        `🎯 بازی به پایان رسید!<br>
         <span style="font-size: 4rem; display: block; margin: 20px 0;">🏆</span>
         امتیاز نهایی شما: <span style="color: #FFD700; font-size: 4rem;">${score}</span><br>
         <small style="font-size: 1.5rem; margin-top: 20px; display: block;">
            برای بازی مجدد روی دکمه "بازی جدید" کلیک کنید
         </small>`,
        'game-finished',
        5000
    );
}

// تنظیم مجدد بازی
function resetGame() {
    // ابتدا تمام حالت‌ها را پاک کن
    gameActive = false;
    clearTimer();
    
    // نمایش پیام ریست
    showFullScreenMessage('🔄 در حال راه‌اندازی مجدد بازی...', 'success', 1000);
    
    // توقف کوتاه و سپس شروع مجدد
    setTimeout(() => {
        // ریست متغیرها
        score = 0;
        hearts = 3;
        stars = 0;
        phase1Level = 1;
        phase2Level = 1;
        phase1CorrectAnswers = 0;
        phase2CorrectAnswers = 0;
        currentGamePhase = 1;
        
        // به‌روزرسانی نمایش
        updateScore();
        updateHearts();
        updateStars();
        
        // حذف نمایشگر تایمر قدیمی
        const timerDisplay = document.querySelector('.timer-display');
        if (timerDisplay) {
            timerDisplay.remove();
        }
        
        // شروع بازی مجدد
        startGame();
    }, 1000);
}

// ==================== راه‌اندازی اولیه ====================
// مقداردهی اولیه
createIranMap();
updateScore();
updateHearts();

// تنظیم متن اولیه دکمه
startBtn.textContent = 'شروع بازی';