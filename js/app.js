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

// Scroll navbar
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Vidéo Hero Responsive + Bouton volume discret
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
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
        heroVideo.volume = 0.2;
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

// ============================================
// SUGGESTION 2 : Lazy Loading des images
// ============================================
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// SUGGESTION 3 : Scroll Animations améliorées
// ============================================
const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      animateOnScroll.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.neomorph-card, .section-header').forEach(el => {
  animateOnScroll.observe(el);
});

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
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const inputs = contactForm.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateInput(input);
      }
    });
  });
}

function validateInput(input) {
  const value = input.value.trim();
  let isValid = true;

  if (input.required && !value) {
    isValid = false;
  } else if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
  } else if (input.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    isValid = phoneRegex.test(value);
  }

  input.classList.toggle('error', !isValid);
  return isValid;
}

// Contact Form submission
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  // Valider tous les champs
  const inputs = form.querySelectorAll('input, textarea, select');
  let allValid = true;
  inputs.forEach(input => {
    if (!validateInput(input)) allValid = false;
  });

  if (!allValid) {
    showNotification('❌ Veuillez remplir tous les champs correctement', 'error');
    return;
  }

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
      // Google Analytics event (si configuré)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', { event_category: 'contact' });
      }
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

// ============================================
// Notification system amélioré
// ============================================
function showNotification(message, type = 'info') {
  // Supprimer les anciennes notifications
  document.querySelectorAll('.notification').forEach(n => n.remove());

  const notification = document.createElement('div');
  notification.className = 'notification';
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
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
    `;

  // Couleur selon le type
  if (type === 'success') {
    notification.style.borderLeft = '4px solid #D4AF37';
  } else if (type === 'error') {
    notification.style.borderLeft = '4px solid #e74c3c';
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  // Animation entrée
  setTimeout(() => notification.style.transform = 'translateX(0)', 10);

  // Animation sortie
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ============================================
// Smooth scroll amélioré
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 100;
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        navMenu?.classList.remove('active');

        history.pushState(null, null, href);
      }
    }
  });
});


const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

const shareButtons = document.querySelectorAll('[data-share]');
shareButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const shareData = {
      title: 'MAISON LOUISE - Traiteur Événementiel',
      text: 'Découvrez MAISON LOUISE, traiteur d\'exception à Dakar',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('🔗 Lien copié !', 'success');
    }
  });
});

if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⚡ Page loaded in ${pageLoadTime}ms`);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: 'load',
        value: pageLoadTime,
        event_category: 'Performance'
      });
    }
  });
}

const plateauxLinks = document.querySelectorAll('a[href="plateaux.html"]');
plateauxLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'prefetch';
    preloadLink.href = 'plateaux.html';
    document.head.appendChild(preloadLink);
  }, { once: true });
});

let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.keyCode);
  konamiCode = konamiCode.slice(-10);

  if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
    showNotification('🎉 Konami Code activé ! Vous êtes un vrai Gen Z ! 🔥', 'success');
    document.body.style.animation = 'rainbow 2s infinite';
  }
});

window.addEventListener('online', () => {
  showNotification('✅ Connexion rétablie !', 'success');
});

window.addEventListener('offline', () => {
  showNotification('⚠️ Vous êtes hors ligne', 'error');
});

const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const email = link.textContent;
    navigator.clipboard.writeText(email);
    showNotification(`📧 ${email} copié !`, 'success');
  });
});

const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-to-top';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: var(--gradient);
    border: none;
    border-radius: 50%;
    box-shadow: var(--shadow);
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    z-index: 1000;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    scrollTopBtn.style.opacity = '1';
    scrollTopBtn.style.visibility = 'visible';
  } else {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.visibility = 'hidden';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});

// ===== SLIDESHOW HERO =====
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval;

// Fonction pour changer de slide
function showSlide(index) {
    // Retirer active de tous
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Boucler si nécessaire
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Activer le slide et dot actuel
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Fonction pour slide suivant
function nextSlide() {
    showSlide(currentSlide + 1);
}

// Fonction pour slide précédent
function prevSlide() {
    showSlide(currentSlide - 1);
}

// Auto-play slideshow
function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000); // Change toutes les 5 secondes
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

// Click sur dots pour navigation manuelle
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        // Restart l'auto-play après click manuel
        stopSlideshow();
        startSlideshow();
    });
}); // ✅ ACCOLADE FERMANTE AJOUTÉE ICI !

// Pause au hover du hero
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);
}

// Navigation clavier (optionnel)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        stopSlideshow();
        startSlideshow();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopSlideshow();
        startSlideshow();
    }
});

if (slides.length > 0) {
    showSlide(0);
    startSlideshow();
}

// Pause slideshow quand l'onglet n'est pas visible (optimisation)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
});
