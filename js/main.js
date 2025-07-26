// VENOM CLIENT - ОСНОВНЫЕ СКРИПТЫ

// DOM-элементы
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const loginBtn = document.getElementById('loginBtn');
const downloadBtn = document.getElementById('downloadBtn');
const userProfileMini = document.getElementById('userProfileMini');
const navUsername = document.getElementById('navUsername');
const navUserAvatar = document.getElementById('navUserAvatar');
const logoutBtn = document.getElementById('logoutBtn');

// Ключ для хранения данных текущего пользователя
const CURRENT_USER_KEY = 'venomCurrentUser';

// Проверка авторизации пользователя при загрузке страницы
function checkAuthStatus() {
    // Получаем данные текущего пользователя
    const userData = localStorage.getItem(CURRENT_USER_KEY);
    
    if (userData) {
        const user = JSON.parse(userData);
        
        // Пользователь авторизован, показываем мини-профиль
        showUserProfile(user);
        
        // Меняем обработчик кнопки скачивания
        enableDownloadBtn(user.id);
        
        return true;
    }
    
    return false;
}

// Показать профиль пользователя вместо кнопки входа
function showUserProfile(user) {
    if (loginBtn) {
        loginBtn.style.display = 'none';
    }
    
    if (userProfileMini) {
        userProfileMini.style.display = 'flex';
        navUsername.textContent = user.username;
        
        if (user.avatar) {
            navUserAvatar.src = user.avatar;
        }
    }
}

// Скрыть профиль пользователя и показать кнопку входа
function hideUserProfile() {
    if (userProfileMini) {
        userProfileMini.style.display = 'none';
    }
    
    if (loginBtn) {
        loginBtn.style.display = 'inline-block';
    }
}

// Разблокировать кнопку скачивания
function enableDownloadBtn(userId) {
    if (downloadBtn) {
        downloadBtn.setAttribute('href', './downloads/venom-client-1.16.5.zip');
        
        // Убираем старый обработчик
        const newDownloadBtn = downloadBtn.cloneNode(true);
        downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);
        
        // Добавляем новый обработчик
        newDownloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Добавляем запись о скачивании
            if (userId) {
                venomDB.addDownload(userId, '2.1.3');
            }
            
            // Уведомляем пользователя
            alert('Начинается загрузка Venom Client для Minecraft 1.16.5');
            
            // Инициируем скачивание
            window.location.href = './downloads/venom-client-1.16.5.zip';
        });
    }
}

// Мобильное меню
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// Закрытие мобильного меню при клике на ссылку
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// Симуляция загрузки при клике на кнопку скачивания
if (downloadBtn && !checkAuthStatus()) {
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Если пользователь не авторизован, открываем модальное окно входа
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'block';
            
            // Показываем уведомление о необходимости авторизации
            const notificationsContainer = document.getElementById('notifications');
            if (notificationsContainer) {
                simpleNotification('info', 'Требуется авторизация', 'Для скачивания клиента необходимо войти в аккаунт.');
            }
        }
    });
}

// Обработка выхода из аккаунта
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Удаляем данные пользователя
        localStorage.removeItem(CURRENT_USER_KEY);
        
        // Скрываем профиль пользователя
        hideUserProfile();
        
        // Обновляем обработчик кнопки скачивания
        if (downloadBtn) {
            const newDownloadBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);
            
            newDownloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Открываем модальное окно входа
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.style.display = 'block';
                }
            });
        }
        
        // Перезагружаем страницу
        window.location.reload();
    });
}

// Эффекты при прокрутке
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    
    // Изменение стиля шапки при прокрутке
    if (scrollPosition > 50) {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.8)';
        header.style.boxShadow = 'none';
    }
    
    // Анимация при скролле - находим элементы, которые должны появляться
    const animatedElements = document.querySelectorAll('.feature-card, .screenshot, .download-box');
    
    animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        
        // Если элемент входит в видимую область
        if (elementPosition < screenHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Настройка начальных состояний для анимации при скролле
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем авторизацию пользователя
    checkAuthStatus();
    
    // Устанавливаем начальные стили для анимируемых элементов
    const animatedElements = document.querySelectorAll('.feature-card, .screenshot, .download-box');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.5s ease';
    });
    
    // Симуляция события прокрутки для загрузки начальных элементов
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    // Добавляем симбиотический эффект для курсора
    const symbioteFollower = document.createElement('div');
    symbioteFollower.classList.add('symbiote-follower');
    document.body.appendChild(symbioteFollower);
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        symbioteFollower.style.left = mouseX + 'px';
        symbioteFollower.style.top = mouseY + 'px';
    });
    
    // Обработка редиректа после авторизации
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect === 'download' && checkAuthStatus()) {
        // Если пользователь пришел с редиректа и уже авторизован, скроллим к разделу скачивания
        const downloadSection = document.getElementById('download');
        if (downloadSection) {
            window.scrollTo({
                top: downloadSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
});

// Плавный скролл для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70, // Учитываем высоту шапки
                behavior: 'smooth'
            });
        }
    });
});

// Основной JavaScript файл для главной страницы Venom Client

document.addEventListener('DOMContentLoaded', function() {
    
    // Плавная прокрутка до якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // Учитываем высоту шапки
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Анимация появления элементов при скролле
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .screenshot, .download-box');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Запускаем анимацию при загрузке и при скролле
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Счетчик загрузок (демонстрационный)
    const downloadCounter = document.querySelector('.info-item:nth-child(3) span');
    
    if (downloadCounter) {
        const count = parseInt(downloadCounter.textContent.replace(/[^0-9]/g, ''));
        const incrementDownloads = function() {
            if (Math.random() < 0.1) { // Случайно увеличиваем счетчик
                const newCount = count + Math.floor(Math.random() * 5) + 1;
                downloadCounter.textContent = `Загрузок: ${newCount.toLocaleString()}`;
            }
        };
        
        // Обновляем счетчик каждые 30 секунд
        setInterval(incrementDownloads, 30000);
    }
});

// Вспомогательная функция для отображения уведомлений
function simpleNotification(type, title, message) {
    const notificationsContainer = document.getElementById('notifications');
    
    if (!notificationsContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let iconClass = 'info-circle';
    switch (type) {
        case 'success': iconClass = 'check-circle'; break;
        case 'error': iconClass = 'times-circle'; break;
        case 'warning': iconClass = 'exclamation-triangle'; break;
    }
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${iconClass}"></i>
        </div>
        <div class="notification-content">
            <h4 class="notification-title">${title}</h4>
            <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notificationsContainer.appendChild(notification);
    
    // Добавляем обработчик для закрытия уведомления
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.add('removing');
            setTimeout(() => {
                notificationsContainer.removeChild(notification);
            }, 300);
        });
    }
    
    // Автоматически скрываем уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentNode === notificationsContainer) {
            notification.classList.add('removing');
            setTimeout(() => {
                if (notification.parentNode === notificationsContainer) {
                    notificationsContainer.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
} 