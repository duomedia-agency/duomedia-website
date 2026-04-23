// ============ THEME MANAGEMENT ============
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
    } else {
        // Auto detect system theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.classList.add('light-theme');
        }
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) document.body.classList.add('light-theme');
            else document.body.classList.remove('light-theme');
        }
    });
}
initTheme();

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

// ============ DATA LOADING & RENDERING ============

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = (text || '').replace(/\\n/g, '<br>');
}

function renderSite(data) {
    if (!data) return;

    // HERO
    if (data.hero) {
        setText('hero-title-1', data.hero.titleLine1);
        setText('hero-title-2', data.hero.titleLine2);
        setText('hero-subtitle', data.hero.subtitle);
    }

    // SERVICES
    if (data.services) {
        setText('services-title', data.services.title);
        setText('services-subtitle', data.services.subtitle);
        
        const grid = document.getElementById('services-grid');
        if (grid && data.services.items) {
            grid.innerHTML = data.services.items.map(d => `
                <div class="service-card reveal-up">
                    <div class="service-icon-area"><i class="bi ${d.icon}"></i></div>
                    <div class="service-content">
                        <h3>${d.title}</h3>
                        <p>${d.description}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // WHY US
    if (data.whyUs) {
        setText('whyus-title', data.whyUs.title);
        const points = document.getElementById('whyus-points');
        if (points && data.whyUs.points) {
            points.innerHTML = data.whyUs.points.map(d => `
                <div class="why-point">
                    <h4><i class="bi ${d.icon}"></i> ${d.title}</h4>
                    <p>${d.description}</p>
                </div>
            `).join('');
        }
    }

    // BRANDS
    if (data.brands) {
        setText('brands-title', data.brands.title);
        const grid = document.getElementById('brands-grid');
        if (grid && data.brands.items) {
            const sorted = data.brands.items.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
            grid.innerHTML = sorted.map(b => `
                <a href="${b.link || '#'}" class="brand-item" target="_blank" rel="noopener noreferrer">
                    <img src="${b.logo}" alt="${b.name}" />
                </a>
            `).join('');
        }
    }

    // PORTFOLIO
    if (data.portfolio) {
        setText('portfolio-title', data.portfolio.title);
        setText('portfolio-subtitle', data.portfolio.subtitle);
        const grid = document.getElementById('portfolio-grid');
        if (grid && data.portfolio.items) {
            const sorted = data.portfolio.items.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
            grid.innerHTML = sorted.map(d => `
                <div class="portfolio-card reveal-up">
                    <img src="${d.image}" alt="${d.title}" />
                    <div class="portfolio-overlay">
                        <h3>${d.title}</h3>
                        <p>${d.description || ''}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // TESTIMONIALS
    if (data.testimonials) {
        setText('testimonials-title', data.testimonials.title);
        setText('testimonials-subtitle', data.testimonials.subtitle);
        const grid = document.getElementById('testimonials-grid');
        if (grid && data.testimonials.items) {
            const sorted = data.testimonials.items.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
            grid.innerHTML = sorted.map(d => `
                <div class="testimonial-card reveal-up">
                    <p>"${d.text}"</p>
                    <div class="testimonial-author">
                        <div class="testimonial-avatar"><img src="${d.photo || './assets/images/people/man.jpg'}" alt="${d.name}" /></div>
                        <div>
                            <div class="testimonial-name">${d.name}</div>
                            <div class="testimonial-role">${d.role || ''}</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // FAQ
    if (data.faq) {
        setText('faq-title', data.faq.title);
        setText('faq-subtitle', data.faq.subtitle);
        const list = document.getElementById('faq-list');
        if (list && data.faq.items) {
            list.innerHTML = data.faq.items.map(d => `
                <div class="faq-item reveal-up">
                    <button class="faq-question">
                        <span>${d.question}</span>
                        <i class="bi bi-plus"></i>
                    </button>
                    <div class="faq-answer">${d.answer}</div>
                </div>
            `).join('');
            
            // Re-bind FAQ Accordion
            list.querySelectorAll('.faq-question').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = btn.closest('.faq-item');
                    const isOpen = item.classList.contains('open');
                    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
                    if (!isOpen) item.classList.add('open');
                });
            });
        }
    }

    // CONTACT
    if (data.contact) {
        setText('contact-title', data.contact.title);
        setText('contact-subtitle', data.contact.subtitle);
        
        const form = document.getElementById('contact-form');
        if (form && data.contact.email) {
            form.action = `mailto:${data.contact.email}`;
        }
        
        const igLink = document.getElementById('contact-ig-link');
        const igHandle = document.getElementById('contact-ig-handle');
        if (igLink && data.contact.igLink) igLink.href = data.contact.igLink;
        if (igHandle) {
            igHandle.href = data.contact.igLink || '#';
            igHandle.textContent = data.contact.igHandle || '';
        }
    }

    // FOOTER
    if (data.footer) {
        setText('footer-company', data.footer.companyName);
        setText('footer-piva', data.footer.piva);
        setText('footer-location', data.footer.location);
    }
}

async function loadData() {
    try {
        const res = await fetch('./data.json');
        if (!res.ok) throw new Error('data.json not found');
        const data = await res.json();
        renderSite(data);
    } catch (err) {
        console.warn('Data load error:', err.message);
    }
}

// REAL-TIME PREVIEW FROM ADMIN
window.addEventListener('message', (event) => {
    // Only accept messages that include our structured data
    if (event.data && event.data.type === 'UPDATE_CONTENT') {
        renderSite(event.data.data);
    }
});

// Load data then init animations
loadData().then(() => {
    // Small timeout to let DOM render
    setTimeout(initAnimations, 50);
});

// ============ GSAP ANIMATIONS ============
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set('.reveal-up', { opacity: 0, y: 50 });

    const heroLogo = document.getElementById('hero-logo-wrapper');
    if (heroLogo) {
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

    ScrollTrigger.batch(".reveal-up", {
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out" }),
        start: "top 85%",
        once: true
    });
}
