// Функция для инициализации переключателя темы
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.type = 'button';
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.textContent = '🌙 Тема';
    
    // Добавляем кнопку в самое начало body
    document.body.insertBefore(themeToggle, document.body.firstChild);
    
    const KEY = 'theme';
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Автовыбор темы
    if (localStorage.getItem(KEY) === 'dark' || (!localStorage.getItem(KEY) && prefersDark)) {
        document.body.classList.add('theme-dark');
        themeToggle.setAttribute('aria-pressed', 'true');
        themeToggle.textContent = '☀️ Тема';
    }
    
    // Переключение темы
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('theme-dark');
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.textContent = isDark ? '☀️ Тема' : '🌙 Тема';
        localStorage.setItem(KEY, isDark ? 'dark' : 'light');
    });
}

// Функция для инициализации модального окна
function initModal() {
    const dlg = document.getElementById('contactDialog');
    const openBtn = document.getElementById('openDialog');
    const closeBtn = document.getElementById('closeDialog');
    const form = document.getElementById('contactForm');
    
    if (!dlg || !openBtn) return;
    
    let lastActive = null;
    
    openBtn.addEventListener('click', () => {
        lastActive = document.activeElement;
        dlg.showModal();
        dlg.querySelector('input,select,textarea,button')?.focus();
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => dlg.close('cancel'));
    }
    
    dlg.addEventListener('close', () => {
        lastActive?.focus();
    });
    
    if (form) {
        form.addEventListener('submit', (e) => {
            // 1) Сброс кастомных сообщений
            [...form.elements].forEach(el => el.setCustomValidity?.(''));
            
            // 2) Проверка встроенных ограничений
            if (!form.checkValidity()) {
                e.preventDefault();
                
                // Пример: таргетированное сообщение
                const email = form.elements.email;
                if (email?.validity.typeMismatch) {
                    email.setCustomValidity('Введите корректный e-mail, например name@example.com');
                }
                
                form.reportValidity();
                
                // A11y: подсветка проблемных полей
                [...form.elements].forEach(el => {
                    if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
                });
                
                return;
            }
            
            // 3) Успешная «отправка» (без сервера)
            e.preventDefault();
            dlg.close('success');
            form.reset();
        });
    }
}

// Функция для форматирования телефона
function initPhoneFormatting() {
    const phone = document.getElementById('phone');
    if (!phone) return;
    
    phone.addEventListener('input', () => {
        const digits = phone.value.replace(/\D/g,'').slice(0,11);
        const d = digits.replace(/^8/, '7');
        const parts = [];
        
        if (d.length > 0) parts.push('+7');
        if (d.length > 1) parts.push(' (' + d.slice(1,4));
        if (d.length >= 4) parts[parts.length - 1] += ')';
        if (d.length >= 5) parts.push(' ' + d.slice(4,7));
        if (d.length >= 8) parts.push('-' + d.slice(7,9));
        if (d.length >= 10) parts.push('-' + d.slice(9,11));
        
        phone.value = parts.join('');
    });
    
    // Строгая проверка
    phone.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initModal();
    initPhoneFormatting();
});