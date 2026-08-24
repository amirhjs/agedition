/**
 * AGEDITION - Core Vanilla JavaScript Engine
 * GitHub Pages Ready - Pure Client-side
 */

// Initialize state and listeners
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCopyCard();
    initNotificationSystem();
    highlightActiveNav();
});

// Toast notification helper
function showToast(message, type = 'success', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'check_circle';
    let iconColor = 'text-primary';
    if (type === 'error') {
        icon = 'error';
        iconColor = 'text-error';
        toast.style.borderColor = 'var(--error)';
    } else if (type === 'info') {
        icon = 'info';
        iconColor = 'text-secondary';
    }

    toast.innerHTML = `
        <span class="material-symbols-outlined ${iconColor}">${icon}</span>
        <div class="flex-1">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Navigation Drawer
function initNavigation() {
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const navDrawer = document.getElementById('nav-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');

    if (!navDrawer) return;

    function openDrawer() {
        navDrawer.classList.add('open');
        if (drawerOverlay) {
            drawerOverlay.classList.remove('hidden');
            drawerOverlay.classList.add('open');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        navDrawer.classList.remove('open');
        if (drawerOverlay) {
            drawerOverlay.classList.remove('open');
            setTimeout(() => {
                drawerOverlay.classList.add('hidden');
            }, 300);
        }
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
}

// Highlight Active Nav Link
function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('a[data-page]');
    
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPath || (currentPath === '' && page === 'index.html')) {
            link.classList.add('text-primary');
            link.classList.remove('text-on-surface-variant');
            const icon = link.querySelector('.material-symbols-outlined');
            if (icon) icon.classList.add('fill-1');
        }
    });
}

// Copy Card Number to clipboard
function initCopyCard() {
    const copyBtns = document.querySelectorAll('[data-copy-card]');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cardNumber = btn.getAttribute('data-copy-card') || '6037997512345678';
            navigator.clipboard.writeText(cardNumber).then(() => {
                showToast('شماره کارت با موفقیت کپی شد: ' + cardNumber, 'success');
            }).catch(() => {
                // Fallback
                const temp = document.createElement('input');
                temp.value = cardNumber;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
                showToast('شماره کارت کپی شد: ' + cardNumber, 'success');
            });
        });
    });
}

// Notification Drawer / Modal
function initNotificationSystem() {
    const notifBtns = document.querySelectorAll('[data-notif-btn]');
    notifBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('شما ۲ اعلان جدید دارید: دوره جدید DLS 2019 با تخفیف فعال شد!', 'info');
        });
    });
}

// Telegram Order Link Builder
function openTelegramOrder(orderData) {
    const adminUsername = 'AgeditionAdmin'; // Telegram Admin Username
    const defaultData = {
        name: localStorage.getItem('agedition_user_name') || 'کاربر گرامی',
        phone: localStorage.getItem('agedition_user_phone') || 'ثبت نشده',
        course: 'دوره آموزش ساخت ادیشن Dream League Soccer 2019 + پکیج ابزارها',
        price: '۴۰۰,۰۰۰ تومان',
        orderId: localStorage.getItem('agedition_order_id') || ('AG-' + Math.floor(10000 + Math.random() * 90000))
    };

    const data = Object.assign(defaultData, orderData || {});
    
    const text = encodeURIComponent(
`سلام و احترام 👋
درخواست ثبت سفارش و دریافت پکیج ادیشن AGEDITION:

👤 نام و نام خانوادگی: ${data.name}
📱 شماره تماس: ${data.phone}
📦 محصول: ${data.course}
💳 مبلغ: ${data.price}
🔖 کد سفارش: ${data.orderId}

تصویر رسید پرداخت ضمیمه خواهد شد.`
    );

    const telegramUrl = `https://t.me/${adminUsername}?text=${text}`;
    window.open(telegramUrl, '_blank');
}

// Handle Registration Flow
function handleRegistrationSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('[name="fullname"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim() || '';

    if (!name || !phone) {
        showToast('لطفاً نام و شماره موبایل را وارد نمایید.', 'error');
        return;
    }

    const orderId = 'AG-' + Math.floor(10000 + Math.random() * 90000);

    localStorage.setItem('agedition_user_name', name);
    localStorage.setItem('agedition_user_phone', phone);
    localStorage.setItem('agedition_user_email', email);
    localStorage.setItem('agedition_order_id', orderId);

    const regView = document.getElementById('registration-view');
    const loadingView = document.getElementById('loading-view');
    const paymentView = document.getElementById('payment-view');

    if (regView && loadingView && paymentView) {
        regView.classList.add('animate-fade-out');
        setTimeout(() => {
            regView.classList.add('hidden');
            loadingView.classList.remove('hidden');
            loadingView.classList.add('animate-fade-in');

            setTimeout(() => {
                loadingView.classList.remove('animate-fade-in');
                loadingView.classList.add('animate-fade-out');

                setTimeout(() => {
                    loadingView.classList.add('hidden');
                    paymentView.classList.remove('hidden');
                    paymentView.classList.add('animate-fade-in');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 400);
            }, 1200);
        }, 300);
    } else {
        window.location.href = 'products.html';
    }
}

// Handle Receipt File Selection
function handleReceiptFileSelect(event) {
    const file = event.target.files[0];
    const placeholder = document.getElementById('upload-placeholder');
    const preview = document.getElementById('upload-preview');
    const previewImg = document.getElementById('preview-image');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (previewImg) previewImg.src = e.target.result;
            if (placeholder) placeholder.classList.add('hidden');
            if (preview) preview.classList.remove('hidden');
            showToast('تصویر رسید با موفقیت انتخاب شد.', 'info');
        };
        reader.readAsDataURL(file);
    }
}

// Submit Receipt Form
function submitReceiptPayment(btn) {
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> در حال اعتبارسنجی و ثبت...';
    btn.style.opacity = '0.8';

    setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined">check</span> رسید با موفقیت ثبت شد';
        btn.classList.remove('btn-primary');
        btn.classList.add('bg-tertiary-container', 'text-on-tertiary-container');
        btn.style.opacity = '1';

        showToast('رسید شما ثبت شد و به داشبورد کاربری هدایت می‌شوید.', 'success');

        // Save order as completed in localStorage
        localStorage.setItem('agedition_order_status', 'active');
        localStorage.setItem('agedition_course_enrolled', 'true');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1200);
}

// Download Toolkit Action
function triggerToolkitDownload() {
    showToast('در حال آماده‌سازی پکیج ابزارها Design_Toolkit_V2.zip (حجم: 1.2 گیگابایت)...', 'info', 4000);
    
    setTimeout(() => {
        // Create mock blob for instant download
        const blob = new Blob([
            "AGEDITION Dream League Soccer 2019 Toolkit\n\n" +
            "1. DLS 19 APK Editor Tools\n" +
            "2. High-Res Stadium Textures & Grass Shaders\n" +
            "3. 2024/2025 HD Kits & Numbers Font Templates (.png / .psd)\n" +
            "4. Game UI & HUD Custom Themes (Dark Obsidian, Neon Emerald)\n" +
            "5. Custom Commentary & Soundtrack Patching Guide\n" +
            "6. Data Transfer & Profile.dat Master Unlocker\n\n" +
            "پشتیبانی مستقیم تلگرام: @AgeditionAdmin\nکانال اختصاصی: @Agedition_Official"
        ], { type: 'text/plain;charset=utf-8' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AGEDITION_DLS19_Toolkit_Guide.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('فایل راهنما و لینک دانلود سرور پرسرعت تلگرام فعال شد.', 'success');
    }, 1500);
}

// Video Player Modal
function openVideoModal(title, url) {
    let modal = document.getElementById('video-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'video-modal';
        modal.className = 'fixed inset-0 z-[100] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="glass-card rounded-2xl p-6 max-w-2xl w-full relative">
                <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                    <h3 id="video-modal-title" class="font-bold text-lg text-primary">مشاهده ویدیوی آموزشی</h3>
                    <button onclick="closeVideoModal()" class="text-text-muted hover:text-white p-1 rounded-full">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="relative aspect-video rounded-xl bg-obsidian-deep overflow-hidden border border-white/10 flex items-center justify-center">
                    <video id="video-element" class="w-full h-full object-cover" controls poster="https://lh3.googleusercontent.com/aida-public/AB6AXuAFneTEQpKE2OQIaFJ9Az8k9ZDt2Ki97yI7qiPedUGU0kAuVcs6_03D24-Vr3U7shfGD6O0NKY85SrNG1n1GIbav51WkYJDM18RebY5FOK0hMzEGE3WaDIR-I6voyZLl_20XRorp1ZUCFS_M4zdcqnfvtYKHiGmUZmyqKYdSx4qCdygLx8jYCw8jd7dJjktb12LpxxZ4NX-8b9FkrCDp8NFVAymJqunoJSYIlLLMiPqZn9IhpbzlM2brw">
                        <source src="" type="video/mp4">
                        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                    </video>
                </div>
                <p class="text-xs text-text-muted mt-3 text-center">کیفیت 1080p Full HD با توضیحات گام‌به‌گام فارسی</p>
            </div>
        `;
        document.body.appendChild(modal);
    }
    document.getElementById('video-modal-title').innerText = title || 'ویدیوی آموزش دوره';
    modal.classList.remove('hidden');
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        const vid = modal.querySelector('video');
        if (vid) vid.pause();
        modal.classList.add('hidden');
    }
}
