// Navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle?.addEventListener('click', () => navMenu.classList.toggle('active'));

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle?.contains(e.target) && !navMenu?.contains(e.target)) {
        navMenu?.classList.remove('active');
    }
});

// Vidéo Hero Responsive + Bouton volume discret
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
    // Créer bouton volume discret
    const volumeBtn = document.createElement('button');
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeBtn.className = 'volume-toggle';
    volumeBtn.style.cssText = `
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: rgba(224, 229, 236, 0.9);
        border: none;
        border-radius: 50%;
        box-shadow: 9px 9px 16px rgba(163,177,198,.6), -9px -9px 16px rgba(255,255,255,.5);
        cursor: pointer;
        font-size: 1.25rem;
        color: #2c3e50;
        transition: all 0.3s;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    volumeBtn.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        heroVideo.volume = 0.3;
        volumeBtn.innerHTML = heroVideo.muted ?
            '<i class="fas fa-volume-mute"></i>' :
            '<i class="fas fa-volume-up"></i>';

        if (!heroVideo.muted) {
            volumeBtn.style.background = 'linear-gradient(135deg, #D4AF37 0%, #E8C547 100%)';
            volumeBtn.style.color = '#1a2947';
        } else {
            volumeBtn.style.background = 'rgba(224, 229, 236, 0.9)';
            volumeBtn.style.color = '#2c3e50';
        }
    });

    volumeBtn.addEventListener('mouseenter', () => {
        volumeBtn.style.transform = 'scale(1.1)';
    });

    volumeBtn.addEventListener('mouseleave', () => {
        volumeBtn.style.transform = 'scale(1)';
    });

    document.querySelector('.hero').appendChild(volumeBtn);
}

// Scroll navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Stats counter
const animateCounter = (el) => {
    const target = +el.dataset.count || +el.textContent;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = Math.ceil(target);
            clearInterval(timer);
        } else {
            el.textContent = Math.ceil(current);
        }
    }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number[data-count]');
            numbers.forEach(animateCounter);
            statsObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.hero-stats').forEach(el => statsObserver.observe(el));

// Contact Form
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    btn.disabled = true;

    const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        event: form.event.value,
        guests: form.guests.value,
        date: form.date.value,
        message: form.message.value
    };

    try {
        // REMPLACER PAR VOTRE API
        const response = await fetch('https://api.maisonlouise.sn/contact', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showNotification('✅ Message envoyé ! Nous vous répondrons rapidement.', 'success');
            form.reset();
        } else {
            throw new Error('Erreur serveur');
        }
    } catch (error) {
        // Simulation pour développement
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification('✅ Message reçu ! (Mode démo)', 'success');
        form.reset();
    }

    btn.innerHTML = btnText;
    btn.disabled = false;
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: #e0e5ec;
        padding: 1.5rem 2rem;
        border-radius: 1rem;
        box-shadow: 9px 9px 16px rgba(163,177,198,.6), -9px -9px 16px rgba(255,255,255,.5);
        z-index: 10000;
        max-width: 400px;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 100;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({top: targetPosition, behavior: 'smooth'});
                navMenu?.classList.remove('active');
            }
        }
    });
});

// Active nav link
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
});
