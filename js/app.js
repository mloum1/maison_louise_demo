const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle?.addEventListener('click', () => navMenu.classList.toggle('active'));

document.addEventListener('click', (e) => {
    if (!navToggle?.contains(e.target) && !navMenu?.contains(e.target)) {
        navMenu?.classList.remove('active');
    }
});

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

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

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval;

function showHeroSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextHeroSlide() {
    showHeroSlide(currentSlide + 1);
}

function prevHeroSlide() {
    showHeroSlide(currentSlide - 1);
}

function startSlideshow() {
    slideInterval = setInterval(nextHeroSlide, 5000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showHeroSlide(index);
        stopSlideshow();
        startSlideshow();
    });
});

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        stopSlideshow();
        startSlideshow();
    } else if (e.key === 'ArrowRight') {
        nextHeroSlide();
        stopSlideshow();
        startSlideshow();
    }
});

if (slides.length > 0) {
    showHeroSlide(0);
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


const filterButtons = document.querySelectorAll('.filter-btn');
const avisCards = document.querySelectorAll('.avis-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        avisCards.forEach(card => {
            if (filter === 'tous') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                if (card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});

const helpfulButtons = document.querySelectorAll('.btn-helpful');

helpfulButtons.forEach(button => {
    button.addEventListener('click', () => {
        const text = button.textContent;
        const match = text.match(/\d+/);

        if (match) {
            const currentCount = parseInt(match[0]);
            const newCount = currentCount + 1;
            button.textContent = `👍 Utile (${newCount})`;

            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);

            button.disabled = true;
            button.style.opacity = '0.7';
        }
    });
});

const loadMoreBtn = document.getElementById('loadMoreBtn');
let visibleCount = 6;

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        showNotification('✅ Tous les avis sont affichés !', 'success');
        loadMoreBtn.style.display = 'none';
    });
}

const avisForm = document.getElementById('avisForm');
const avisComment = document.getElementById('avis-comment');
const charCount = document.querySelector('.char-count');

if (avisComment && charCount) {
    avisComment.addEventListener('input', () => {
        const length = avisComment.value.length;
        charCount.textContent = `${length} / 500 caractères`;

        if (length > 450) {
            charCount.style.color = '#e74c3c';
        } else {
            charCount.style.color = 'var(--text-light)';
        }
    });
}

if (avisForm) {
    avisForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = {
            name: form.name.value,
            eventType: form.eventType.value,
            rating: form.rating.value,
            comment: form.comment.value
        };

        if (!formData.rating) {
            showNotification('⭐ Veuillez sélectionner une note', 'error');
            return;
        }

        if (formData.comment.length < 50) {
            showNotification('📝 Votre avis doit contenir au moins 50 caractères', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publication...';
        btn.disabled = true;

        try {
            // REMPLACER PAR VOTRE API
            // const response = await fetch('https://api.maisonlouise.sn/avis', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify(formData)
            // });
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newAvisCard = createAvisCard(formData);
            const avisGrid = document.querySelector('.avis-grid');
            avisGrid.insertBefore(newAvisCard, avisGrid.firstChild);

            setTimeout(() => {
                newAvisCard.style.opacity = '1';
                newAvisCard.style.transform = 'translateY(0)';
            }, 10);

            showNotification('✅ Merci pour votre avis ! Il sera publié après modération.', 'success');
            form.reset();
            charCount.textContent = '0 / 500 caractères';

            newAvisCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            showNotification('❌ Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        }

        btn.innerHTML = btnText;
        btn.disabled = false;
    });
}

function createAvisCard(data) {
    const card = document.createElement('div');
    card.className = 'avis-card neomorph-card';
    card.dataset.category = data.eventType;
    card.style.opacity = '0';
    card.style.transform = 'translateY(-20px)';
    card.style.transition = 'all 0.5s';

    const emojiMap = {
        'mariage': '💍',
        'corporate': '💼',
        'prive': '🎉'
    };

    const labelMap = {
        'mariage': '💍 Mariage',
        'corporate': '💼 Corporate',
        'prive': '🎉 Privé'
    };

    const stars = '⭐'.repeat(parseInt(data.rating));

    card.innerHTML = `
        <div class="avis-header">
            <div class="avis-avatar">${emojiMap[data.eventType]}</div>
            <div class="avis-info">
                <h4 class="avis-name">${data.name}</h4>
                <div class="avis-meta">
                    <span class="avis-event">${labelMap[data.eventType]}</span>
                    <span class="avis-date">À l'instant</span>
                </div>
            </div>
            <div class="avis-rating">
                <div class="stars">${stars}</div>
            </div>
        </div>
        <p class="avis-text">${data.comment}</p>
        <div class="avis-helpful">
            <button class="btn-helpful">👍 Utile (0)</button>
        </div>
    `;

    return card;
}
// ===== DATA AVIS =====
const avisData = [
  { id: 1, avatar: '👰', name: 'Fatou Diop', category: 'mariage', event: '💍 Mariage', date: 'Il y a 2 semaines', stars: 5, text: 'Service absolument exceptionnel pour notre mariage ! L\'équipe de Maison Louise a su créer une ambiance magique. Les plats étaient délicieux et la présentation impeccable. Nos invités ne tarissent pas d\'éloges !', likes: 12 },
  { id: 2, avatar: '👨‍💼', name: 'Mamadou Sarr', category: 'corporate', event: '💼 Corporate', date: 'Il y a 1 mois', stars: 5, text: 'Nous avons fait appel à Maison Louise pour notre séminaire d\'entreprise. Professionnalisme, ponctualité et qualité au rendez-vous. Le bar mobile a fait sensation auprès de nos collaborateurs !', likes: 8 },
  { id: 3, avatar: '🎉', name: 'Aminata Kane', category: 'prive', event: '🎉 Anniversaire', date: 'Il y a 3 semaines', stars: 5, text: 'Pour les 50 ans de mon père, Maison Louise a créé une expérience inoubliable. Les cocktails signatures étaient un vrai régal et le service impeccable. Je recommande à 100% !', likes: 15 },
  { id: 4, avatar: '🤵', name: 'Ibrahima Ndiaye', category: 'mariage', event: '💍 Mariage', date: 'Il y a 1 mois', stars: 5, text: 'Un grand merci à toute l\'équipe ! Du premier contact jusqu\'à la fin de la soirée, tout était parfait. La coordination était au top et nos invités ont adoré le menu personnalisé.', likes: 10 },
  { id: 5, avatar: '👩‍💼', name: 'Aïssatou Seck', category: 'corporate', event: '💼 Lancement produit', date: 'Il y a 2 mois', stars: 5, text: 'Service professionnel et discret pour le lancement de notre nouveau produit. La qualité des mets et la présentation ont impressionné nos clients. Nous referons appel à eux !', likes: 6 },
  { id: 6, avatar: '🎊', name: 'Moussa Fall', category: 'prive', event: '🎉 Baptême', date: 'Il y a 3 semaines', stars: 5, text: 'Excellente prestation pour le baptême de notre fille. L\'équipe était réactive, les plats délicieux et le service irréprochable. Rapport qualité-prix imbattable !', likes: 9 }
];

let filteredAvis = [...avisData];
let currentIndex = 0;
let cardsPerView = 3; // Desktop par défaut

// ===== CALCULER CARDS PER VIEW =====
function calculateCardsPerView() {
  const width = window.innerWidth;
  if (width <= 768) {
    cardsPerView = 1;
  } else if (width <= 1200) {
    cardsPerView = 2;
  } else {
    cardsPerView = 3;
  }
}

// ===== RENDER AVIS =====
function renderAvis() {
  const track = document.getElementById('carouselTrack');
  if (!track) {
    console.error('❌ Element #carouselTrack non trouvé !');
    return;
  }

  track.innerHTML = '';

  filteredAvis.forEach(avis => {
    const card = `
      <div class="avis-card neomorph-card" data-category="${avis.category}">
        <div class="avis-header">
          <div class="avis-avatar">${avis.avatar}</div>
          <div class="avis-info">
            <h4 class="avis-name">${avis.name}</h4>
            <div class="avis-meta">
              <span class="avis-event">${avis.event}</span>
              <span class="avis-date">${avis.date}</span>
            </div>
          </div>
          <div class="avis-rating">
            <div class="stars">${'⭐'.repeat(avis.stars)}</div>
          </div>
        </div>
        <p class="avis-text">"${avis.text}"</p>
        <div class="avis-helpful">
          <button class="btn-helpful">👍 Utile (${avis.likes})</button>
        </div>
      </div>
    `;
    track.innerHTML += card;
  });

  console.log(`✅ ${filteredAvis.length} cartes générées`);

  // Attendre que le DOM se mette à jour
  setTimeout(() => {
    createDots();
    updateCarousel();
  }, 100);
}

// ===== DOTS =====
function createDots() {
  const dotsContainer = document.getElementById('carouselDots');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';

  const numPages = Math.ceil(filteredAvis.length / cardsPerView);

  for (let i = 0; i < numPages; i++) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToPage(i));
    dotsContainer.appendChild(dot);
  }

  console.log(`✅ ${numPages} dots créés`);
}

// ===== UPDATE CAROUSEL =====
function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  const firstCard = track.querySelector('.avis-card');

  if (!firstCard) {
    console.error('❌ Aucune carte trouvée dans le carousel');
    return;
  }

  const cardWidth = firstCard.offsetWidth;
  const gap = 32; // 2rem
  const slideDistance = (cardWidth + gap) * cardsPerView;

  track.style.transform = `translateX(-${currentIndex * slideDistance}px)`;

  console.log(`🎯 Carousel mis à jour: index=${currentIndex}, slideDistance=${slideDistance}px`);

  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

// ===== NAVIGATION =====
function goToPage(index) {
  const numPages = Math.ceil(filteredAvis.length / cardsPerView);
  currentIndex = Math.max(0, Math.min(index, numPages - 1));
  updateCarousel();
}

function nextSlide() {
  const numPages = Math.ceil(filteredAvis.length / cardsPerView);
  currentIndex = (currentIndex + 1) % numPages;
  updateCarousel();
}

function prevSlide() {
  const numPages = Math.ceil(filteredAvis.length / cardsPerView);
  currentIndex = (currentIndex - 1 + numPages) % numPages;
  updateCarousel();
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM chargé, initialisation...');

  // Navigation
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
    });
  }

  // Filtres
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (filter === 'tous') {
        filteredAvis = [...avisData];
      } else {
        filteredAvis = avisData.filter(avis => avis.category === filter);
      }

      const totalAvisEl = document.getElementById('totalAvis');
      if (totalAvisEl) {
        totalAvisEl.textContent = filteredAvis.length;
      }

      currentIndex = 0;
      renderAvis();
    });
  });

  // Modal
  const modal = document.getElementById('avisModal');
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const avisForm = document.getElementById('avisForm');
  const commentInput = document.getElementById('avis-comment');
  const charCount = document.querySelector('.char-count');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('show');
      // Ne pas bloquer le scroll du body
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  }

  if (commentInput && charCount) {
    commentInput.addEventListener('input', () => {
      charCount.textContent = `${commentInput.value.length} / 500 caractères`;
    });
  }

  if (avisForm && modal) {
    avisForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('✅ Merci pour votre avis !');
      modal.classList.remove('show');
      avisForm.reset();
      if (charCount) {
        charCount.textContent = '0 / 500 caractères';
      }
    });
  }
  window.addEventListener('resize', () => {
    calculateCardsPerView();
    updateCarousel();
  });
  calculateCardsPerView();
  renderAvis();

  console.log('✅ Initialisation terminée !');
});


const quoteModal = document.getElementById('quoteModal');
const openQuoteBtn = document.getElementById('openQuoteBtn');
const closeQuoteBtn = document.getElementById('closeQuoteBtn');
const cancelQuoteBtn = document.getElementById('cancelQuoteBtn');
const messageInput = document.getElementById('message');
const charCountSpan = document.getElementById('charCount');

// Ouvrir modal
openQuoteBtn.addEventListener('click', () => {
  quoteModal.classList.add('show');
  document.body.style.overflow = 'hidden';
});

// Fermer modal
function closeModal() {
  quoteModal.classList.remove('show');
  document.body.style.overflow = '';
}

closeQuoteBtn.addEventListener('click', closeModal);
cancelQuoteBtn.addEventListener('click', closeModal);

// Fermer au clic sur overlay
quoteModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('quote-modal-overlay')) {
    closeModal();
  }
});

// Compteur caractères
if (messageInput && charCountSpan) {
  messageInput.addEventListener('input', () => {
    const length = messageInput.value.length;
    charCountSpan.textContent = length;

    if (length > 450) {
      charCountSpan.style.color = '#e74c3c';
    } else {
      charCountSpan.style.color = 'var(--text-light)';
    }
  });
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: contactForm.name.value,
    email: contactForm.email.value,
    phone: contactForm.phone.value,
    company: contactForm.company.value,
    event: contactForm.event.value,
    date: contactForm.date.value,
    guests: contactForm.guests.value,
    budget: contactForm.budget.value,
    services: Array.from(contactForm.querySelectorAll('input[name="services[]"]:checked')).map(cb => cb.value),
    message: contactForm.message.value
  };

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

  try {
    // REMPLACER PAR TON API EmailJS ou Backend
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Succès
    showNotification('✅ Demande envoyée ! Nous vous répondrons sous 24h.', 'success');
    contactForm.reset();
    charCountSpan.textContent = '0';
    closeModal();

  } catch (error) {
    showNotification('❌ Erreur d\'envoi. Veuillez réessayer ou nous appeler.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && quoteModal.classList.contains('show')) {
    closeModal();
  }
});
