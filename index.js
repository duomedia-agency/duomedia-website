// ============ HEADER SCROLL SHRINK ============
const siteHeader = document.getElementById('site-header');

function onScroll() {
    if (window.scrollY > 80) {
        siteHeader.classList.add('header-scrolled');
    } else {
        siteHeader.classList.remove('header-scrolled');
    }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ============ MOBILE MENU ============
const menuToggle = document.getElementById('menu-toggle-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    menuToggle.querySelector('i').classList.replace('bi-list', 'bi-x');
}

function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    menuToggle.querySelector('i').classList.replace('bi-x', 'bi-list');
}

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
mobileOverlay.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// ============ DATA LOADING ============
// Reads from data.json and renders sections.

async function loadData() {
    try {
        const res = await fetch('./data.json');
        if (!res.ok) throw new Error('data.json not found');
        const data = await res.json();

        // Load Portfolio
        const portfolio = (data.portfolio || []).sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
        if (portfolio.length > 0) {
            const grid = document.getElementById('portfolio-grid');
            if (grid) {
                grid.innerHTML = '';
                portfolio.forEach(d => {
                    const card = document.createElement('div');
                    card.className = 'portfolio-card reveal-up';
                    card.innerHTML = `
                        <img src="${d.image}" alt="${d.title}" />
                        <div class="portfolio-overlay">
                            <h3>${d.title}</h3>
                            <p>${d.description || ''}</p>
                        </div>`;
                    grid.appendChild(card);
                });
            }
        }

        // Load Brands
        const brandsDocs = (data.brands || []).sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
        if (brandsDocs.length > 0) {
            const track = document.getElementById('brands-track');
            if (track) {
                track.innerHTML = '';
                // Original + duplicate for infinite scroll
                [...brandsDocs, ...brandsDocs].forEach(b => {
                    const a = document.createElement('a');
                    a.href = b.link || '#';
                    a.className = 'carousel-item';
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.innerHTML = `<img src="${b.logo}" alt="${b.name}" />`;
                    track.appendChild(a);
                });
            }
        }

        // Load Testimonials
        const testimonialsDocs = (data.testimonials || []).sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
        if (testimonialsDocs.length > 0) {
            const grid = document.getElementById('testimonials-grid');
            if (grid) {
                grid.innerHTML = '';
                testimonialsDocs.forEach(d => {
                    const card = document.createElement('div');
                    card.className = 'testimonial-card reveal-up';
                    card.innerHTML = `
                        <p>"${d.text}"</p>
                        <div class="testimonial-author">
                            <div class="testimonial-avatar"><img src="${d.photo || './assets/images/people/man.jpg'}" alt="${d.name}" /></div>
                            <div>
                                <div class="testimonial-name">${d.name}</div>
                                <div class="testimonial-role">${d.role || ''}</div>
                            </div>
                        </div>`;
                    grid.appendChild(card);
                });
            }
        }
    } catch (err) {
        console.warn('Data load error (using hardcoded fallback):', err.message);
    }
}

// Load data then init animations
loadData().then(() => {
    initAnimations();
});

// ============ GSAP ANIMATIONS ============
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial state
    gsap.set('.reveal-up', { opacity: 0, y: 50 });

    // Hero logo — visible at start, shrinks and fades on scroll
    const heroLogo = document.getElementById('hero-logo-wrapper');
    if (heroLogo) {
        // Make hero logo visible immediately (not part of reveal-up)
        gsap.set(heroLogo, { opacity: 1, y: 0, scale: 1 });

        gsap.to(heroLogo, {
            scale: 0.3,
            opacity: 0,
            ease: 'power2.in',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: '40% top',
                scrub: 1,
            }
        });
    }

    // Section reveals
    gsap.utils.toArray('section').forEach(section => {
        const elements = section.querySelectorAll('.reveal-up');
        if (elements.length === 0) return;

        gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'top 50%',
            }
        });
    });

    // Hero glow pulse
    gsap.to('.hero-glow', {
        scale: 1.15,
        opacity: 0.3,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
    });
}
