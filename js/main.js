/* ═══════════════════════════════════════════════════════════════
   Shahid Modi — Site Navigation & Interactions
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';    // ── Tab Navigation ──────────────────────────────────────
    const tabs = document.querySelectorAll('.nav-tab');
    const pages = document.querySelectorAll('.page');
    const toggle = document.getElementById('mobileToggle');
    const navTabs = document.querySelector('.nav-tabs');
    const brand = document.querySelector('.nav-brand');

    function switchTab(tabId) {
        // Deactivate all
        tabs.forEach(t => t.classList.remove('active'));
        pages.forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        // Activate selected
        const targetTab = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
        const targetPage = document.getElementById(tabId);

        if (targetTab) targetTab.classList.add('active');
        if (targetPage) {
            targetPage.style.display = 'block';
            // Force reflow before adding animation class
            void targetPage.offsetWidth;
            targetPage.classList.add('active');
        }

        // Close mobile menu
        if (navTabs) navTabs.classList.remove('open');

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update URL hash without triggering scroll
        history.replaceState(null, '', '#' + tabId);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });    // Mobile menu toggle
    if (toggle) {
        toggle.addEventListener('click', () => {
            navTabs.classList.toggle('open');
        });
    }

    // Brand logo goes home
    if (brand) {
        brand.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('home');
        });
    }

    // Handle initial hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(initialHash)) {
        switchTab(initialHash);
    }

    // Handle back/forward navigation
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            switchTab(hash);
        }
    });

    // ── Intersection Observer for subtle entrance animations ──
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards for entrance animation
    function initObserver() {
        const animElements = document.querySelectorAll(
            '.agenda-card, .research-card, .timeline-item, .principle-card, .ethic-item'
        );
        animElements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';
            el.style.transition = `opacity .4s ease ${i * 0.05}s, transform .4s ease ${i * 0.05}s`;
            observer.observe(el);
        });
    }    // Watch for tab changes to re-init observer
    const mutationObserver = new MutationObserver(() => {
        initObserver();
    });

    pages.forEach(page => {
        mutationObserver.observe(page, { attributes: true, attributeFilter: ['class'] });
    });

    // Initial setup
    initObserver();

    // ── Keyboard navigation ─────────────────────────────────
    document.addEventListener('keydown', (e) => {
        const tabIds = Array.from(tabs).map(t => t.dataset.tab);
        const currentIdx = tabIds.findIndex(id =>
            document.getElementById(id)?.classList.contains('active')
        );

        if (e.key === 'ArrowRight' && currentIdx < tabIds.length - 1) {
            switchTab(tabIds[currentIdx + 1]);
        } else if (e.key === 'ArrowLeft' && currentIdx > 0) {
            switchTab(tabIds[currentIdx - 1]);
        }
    });

})();
