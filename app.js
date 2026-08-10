/**
 * AroFX Academy V2 — Official Landing Page Script
 * Features:
 * - Mobile hamburger nav toggle
 * - Animated Rolling Counters from 0 (CountUp + IntersectionObserver)
 * - Aave-style Word Rotator / Typing Effect
 * - Interactive Portfolio Showcase Tabs + Lightbox Zoom
 * - FAQ Institutional Accordion
 * - Brokers Modal Drawer
 * - Toast Notification System
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initAaveWordRotator();
  initCountUpObserver();
  initPortfolioTabs();
  initLightboxModal();
  initFaqAccordion();
  initBrokersModal();
  initScrollAnimations();
});

/* ==========================================
   1. MOBILE HAMBURGER NAV
   ========================================== */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when any nav link is clicked
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================
   2. AAVE-STYLE WORD ROTATOR
   ========================================== */
function initAaveWordRotator() {
  const rotatorEl = document.getElementById('heroRotator');
  if (!rotatorEl) return;

  const words = [
    "Edge.",
    "Alpha.",
    "Wealth.",
    "Discipline.",
    "Power."
  ];

  let wordIndex = 0;

  setInterval(() => {
    rotatorEl.style.opacity = '0';
    rotatorEl.style.transform = 'translateY(8px)';
    rotatorEl.style.transition = 'all 0.3s ease';

    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      rotatorEl.textContent = words[wordIndex];
      rotatorEl.style.opacity = '1';
      rotatorEl.style.transform = 'translateY(0)';
    }, 320);
  }, 3200);
}

/* ==========================================
   3. ANIMATED ROLLING COUNTERS FROM 0
   ========================================== */
function initCountUpObserver() {
  const counterElements = document.querySelectorAll('.count-up-val');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals')) || 0;

        animateCountUp(el, 0, targetVal, 2200, suffix, decimals);
        obs.unobserve(el);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

function animateCountUp(element, start, end, duration, suffix, decimals) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    const currentVal = start + (end - start) * easeProgress;

    let formattedNum;
    if (decimals > 0) {
      formattedNum = currentVal.toFixed(decimals);
    } else {
      formattedNum = Math.floor(currentVal).toLocaleString('id-ID');
    }

    element.textContent = `${formattedNum}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      // Ensure exact final value
      const finalFormatted = decimals > 0
        ? end.toFixed(decimals)
        : end.toLocaleString('id-ID');
      element.textContent = `${finalFormatted}${suffix}`;
    }
  }

  window.requestAnimationFrame(step);
}

/* ==========================================
   4. PORTFOLIO TABS FILTER
   ========================================== */
function initPortfolioTabs() {
  const tabBtns = document.querySelectorAll('#portfolioTabs .tab-btn');
  const cards = document.querySelectorAll('#portfolioGrid .portfolio-card');
  if (!tabBtns.length || !cards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'all 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================
   5. LIGHTBOX MODAL ZOOM
   ========================================== */
function initLightboxModal() {
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const imgEl = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const zoomBoxes = document.querySelectorAll('.portfolio-media-box');

  if (!modal || !closeBtn || !imgEl) return;

  function openLightbox(box) {
    const imgSrc = box.getAttribute('data-zoom-img');
    const imgTitle = box.getAttribute('data-zoom-title') || 'Preview Feature';
    if (!imgSrc) return;

    imgEl.src = imgSrc;
    if (titleEl) titleEl.textContent = imgTitle;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  zoomBoxes.forEach(box => {
    box.addEventListener('click', () => openLightbox(box));
    // Keyboard accessibility
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(box);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('active')) closeLightbox();
      if (brokersModalEl && brokersModalEl.classList.contains('active')) closeBrokersModal();
    }
  });
}

/* ==========================================
   6. BROKERS MODAL DRAWER
   ========================================== */
let brokersModalEl = null;

function initBrokersModal() {
  brokersModalEl = document.getElementById('brokersModal');
  const closeBtn = document.getElementById('brokersModalCloseBtn');
  if (!brokersModalEl || !closeBtn) return;

  function closeBrokersModalFn() {
    brokersModalEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeBrokersModalFn);

  brokersModalEl.addEventListener('click', (e) => {
    if (e.target === brokersModalEl) closeBrokersModalFn();
  });
}

function closeBrokersModal() {
  if (brokersModalEl) {
    brokersModalEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================
   7. FAQ INSTITUTIONAL ACCORDION
   ========================================== */
function initFaqAccordion() {
  const faqHeads = document.querySelectorAll('#faqContainer .faq-head');
  if (!faqHeads.length) return;

  faqHeads.forEach(head => {
    // Support keyboard
    head.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        head.click();
      }
    });

    head.addEventListener('click', () => {
      const body = head.nextElementSibling;
      const isOpen = body.style.display === 'block';

      // Close all
      document.querySelectorAll('#faqContainer .faq-body').forEach(b => {
        b.style.display = 'none';
      });
      document.querySelectorAll('#faqContainer .faq-head').forEach(h => {
        const arrow = h.querySelector('span:last-child');
        if (arrow) {
          arrow.textContent = '▼';
          arrow.style.color = 'var(--neon-green-bright)';
        }
        h.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        body.style.display = 'block';
        const arrow = head.querySelector('span:last-child');
        if (arrow) {
          arrow.textContent = '▲';
          arrow.style.color = 'var(--red-accent-bright)';
        }
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================
   8. TOAST NOTIFICATION UTILITY
   ========================================== */
function showToast(message) {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3000);
}

/* ==========================================
   7. SCROLL ANIMATIONS
   ========================================== */
function initScrollAnimations() {
  if (typeof AOS !== 'undefined') {
    
    // Hero image AOS removed to ensure it displays immediately on mobile


    // Section headers fade from left
    const animateFadeRight = document.querySelectorAll('.section-header');
    animateFadeRight.forEach(el => el.setAttribute('data-aos', 'fade-right'));
    
    // YouTube banner zooms up
    const youtubeBanner = document.querySelectorAll('.youtube-banner');
    youtubeBanner.forEach(el => el.setAttribute('data-aos', 'zoom-in-up'));
    
    // Footer CTA fades up
    const footerCta = document.querySelectorAll('.footer-cta');
    footerCta.forEach(el => el.setAttribute('data-aos', 'fade-up'));

    // Eco grid fades up (staggered)
    const ecoGrid = document.querySelectorAll('.eco-grid');
    ecoGrid.forEach(grid => {
      Array.from(grid.children).forEach((el, index) => {
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', (index * 150).toString());
      });
    });

    // Process grid fades up (staggered)
    const processGrid = document.querySelectorAll('.process-grid');
    processGrid.forEach(grid => {
      Array.from(grid.children).forEach((el, index) => {
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', (index * 150).toString());
      });
    });

    // Infra grid fades from right/left
    const infraGrid = document.querySelectorAll('.infra-grid');
    infraGrid.forEach(grid => {
      Array.from(grid.children).forEach((el, index) => {
        el.setAttribute('data-aos', 'fade-left');
        el.setAttribute('data-aos-delay', (index * 150).toString());
      });
    });

    // Stats zoom in
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((el, index) => {
      el.setAttribute('data-aos', 'zoom-in');
      el.setAttribute('data-aos-delay', (index * 150).toString());
    });

    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: false,
      offset: 120, // Animasi trigger lebih cepat saat elemen baru sedikit muncul
    });
  }
}

window.showToast = showToast;
