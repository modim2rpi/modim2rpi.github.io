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

    const tabIds = Array.from(tabs).map(t => t.dataset.tab);
    const tabLabels = { home: 'Home', research: 'Research', building: 'Building', experience: 'Experience', principles: 'Principles' };

    // ── Page Navigation Arrows ──────────────────────────────
    const arrowLeft = document.getElementById('navArrowLeft');
    const arrowRight = document.getElementById('navArrowRight');
    const arrowLeftLabel = document.getElementById('navArrowLeftLabel');
    const arrowRightLabel = document.getElementById('navArrowRightLabel');

    function updateArrows(tabId) {
        const idx = tabIds.indexOf(tabId);
        if (arrowLeft && arrowRight) {
            if (idx > 0) {
                arrowLeft.hidden = false;
                arrowLeftLabel.textContent = tabLabels[tabIds[idx - 1]] || tabIds[idx - 1];
            } else {
                arrowLeft.hidden = true;
            }
            if (idx < tabIds.length - 1) {
                arrowRight.hidden = false;
                arrowRightLabel.textContent = tabLabels[tabIds[idx + 1]] || tabIds[idx + 1];
            } else {
                arrowRight.hidden = true;
            }
        }
    }

    if (arrowLeft) {
        arrowLeft.addEventListener('click', () => {
            const currentIdx = tabIds.findIndex(id => document.getElementById(id)?.classList.contains('active'));
            if (currentIdx > 0) switchTab(tabIds[currentIdx - 1]);
        });
    }
    if (arrowRight) {
        arrowRight.addEventListener('click', () => {
            const currentIdx = tabIds.findIndex(id => document.getElementById(id)?.classList.contains('active'));
            if (currentIdx < tabIds.length - 1) switchTab(tabIds[currentIdx + 1]);
        });
    }

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
        window.scrollTo({ top: 0, behavior: 'smooth' });        // Update URL hash without triggering scroll
        history.replaceState(null, '', '#' + tabId);

        // Update page nav arrows
        updateArrows(tabId);

        // Show/hide research scroll nav based on active tab
        toggleResearchScrollNav(tabId);
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
            '.agenda-card, .research-card, .research-paper, .timeline-item, .principle-card, .ethic-item'
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
    });    // Initial setup
    initObserver();
    updateArrows(initialHash || 'home');
    toggleResearchScrollNav(initialHash || 'home');
    updateScrollNav();

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

    // ── Research Scroll Navigation ──────────────────────────
    const researchScrollNav = document.getElementById('researchScrollNav');
    const scrollNavUp = document.getElementById('scrollNavUp');
    const scrollNavDown = document.getElementById('scrollNavDown');
    const scrollNavCounter = document.getElementById('scrollNavCounter');
    const researchPapers = document.querySelectorAll('.research-paper');
    let currentPaperIndex = 0;

    function updateScrollNav() {
        if (!scrollNavCounter) return;
        scrollNavCounter.textContent = (currentPaperIndex + 1) + ' / ' + researchPapers.length;
        if (scrollNavUp) scrollNavUp.disabled = currentPaperIndex === 0;
        if (scrollNavDown) scrollNavDown.disabled = currentPaperIndex === researchPapers.length - 1;
    }

    function scrollToPaper(index) {
        if (index < 0 || index >= researchPapers.length) return;
        currentPaperIndex = index;
        researchPapers[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateScrollNav();
    }

    if (scrollNavUp) {
        scrollNavUp.addEventListener('click', () => {
            scrollToPaper(currentPaperIndex - 1);
        });
    }

    if (scrollNavDown) {
        scrollNavDown.addEventListener('click', () => {
            scrollToPaper(currentPaperIndex + 1);
        });
    }

    // IntersectionObserver to track which paper is in view
    if (researchPapers.length > 0) {
        const paperObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = Array.from(researchPapers).indexOf(entry.target);
                    if (idx !== -1) {
                        currentPaperIndex = idx;
                        updateScrollNav();
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 60}px 0px -30% 0px`
        });

        researchPapers.forEach(paper => paperObserver.observe(paper));
    }

    // Show/hide research scroll nav based on active tab
    function toggleResearchScrollNav(tabId) {
        if (!researchScrollNav) return;
        if (tabId === 'research') {
            researchScrollNav.classList.add('visible');
        } else {
            researchScrollNav.classList.remove('visible');
        }
    }

})();
