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
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.classList.add('light-theme');
        }
    }
}
initTheme();

// ============ HEADER SCROLL SHRINK ============
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) siteHeader.classList.add('header-scrolled');
    else siteHeader.classList.remove('header-scrolled');
}, { passive: true });

// ============ MOBILE MENU ============
const menuToggle = document.getElementById('menu-toggle-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    menuToggle.querySelector('i').classList.replace('bi-x', 'bi-list');
}

menuToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else {
        mobileMenu.classList.add('open');
        mobileOverlay.classList.add('open');
        menuToggle.querySelector('i').classList.replace('bi-list', 'bi-x');
    }
});
mobileOverlay.addEventListener('click', closeMenu);

// ============ DATA LOADING & RENDERING ============
async function loadClientData() {
    // Get ID from URL: ?id=XYZ
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('id');
    
    if (!clientId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const res = await fetch('./data.json');
        if (!res.ok) throw new Error('data.json not found');
        const data = await res.json();
        
        // Search in brands and portfolio
        let client = null;
        if (data.brands && data.brands.items) {
            client = data.brands.items.find(x => x.id === clientId);
        }
        if (!client && data.portfolio && data.portfolio.items) {
            client = data.portfolio.items.find(x => x.id === clientId);
        }
        
        if (!client || !client.caseStudy || !client.caseStudy.active) {
            window.location.href = 'index.html'; // No case study active
            return;
        }

        // Render Page
        const titleEl = document.getElementById('c-title');
        const logoEl = document.getElementById('c-logo');
        const contentEl = document.getElementById('c-content');
        const galleryEl = document.getElementById('c-gallery');

        titleEl.textContent = client.title || client.name;
        
        // Use logo or image
        const imgUrl = client.logo || client.image;
        if (imgUrl) {
            logoEl.src = imgUrl;
            logoEl.style.display = 'inline-block';
            if (imgUrl.endsWith('.svg') || imgUrl.toLowerCase().includes('white')) {
                logoEl.classList.add('needs-invert');
            }
        }

        if (client.caseStudy.content) {
            contentEl.innerHTML = client.caseStudy.content.replace(/\n/g, '<br>');
        }

        if (client.caseStudy.gallery && client.caseStudy.gallery.length > 0) {
            galleryEl.innerHTML = client.caseStudy.gallery.map(url => `
                <img src="${url}" alt="Gallery image" />
            `).join('');
        }

        // Footer info (if available)
        if (data.footer) {
            document.getElementById('footer-company').textContent = data.footer.companyName;
            document.getElementById('footer-piva').textContent = data.footer.piva;
            document.getElementById('footer-location').textContent = data.footer.location;
        }

    } catch (err) {
        console.error('Error loading client data', err);
        document.getElementById('c-title').textContent = 'Errore nel caricamento del progetto.';
    }
}

loadClientData().then(() => {
    setTimeout(initAnimations, 100);
});

// ============ GSAP ANIMATIONS ============
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set('.reveal-up', { opacity: 0, y: 30 });
    
    ScrollTrigger.batch(".reveal-up", {
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out" }),
        start: "top 85%",
        once: true
    });
}
