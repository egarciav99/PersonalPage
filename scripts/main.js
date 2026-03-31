/* ============================================
   MAIN.JS — Portfolio Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Dynamic Year ----
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Scroll Progress Bar ----
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: var(--accent);
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.prepend(progressBar);

  // ---- Custom Cursor (desktop only) ----
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  let cursor = null;

  if (!isTouchDevice) {
    cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: transform 0.15s var(--ease-out), opacity 0.2s, width 0.2s, height 0.2s;
      opacity: 0;
      mix-blend-mode: normal;
    `;
    document.body.appendChild(cursor);

    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    // Expand cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .card, .cv__download-card, .badge');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'transparent';
        cursor.style.border = '1.5px solid var(--accent)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursor.style.background = 'var(--accent)';
        cursor.style.border = 'none';
      });
    });
  }

  // ---- Navbar scroll behavior ----
  const nav = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const SCROLL_THRESHOLD = 50;

  function handleNavScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Update scroll progress bar
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const pct = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  // ---- Active nav link tracking ----
  function updateActiveLink() {
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Throttle scroll events
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        updateActiveLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // ---- Mobile Navigation ----
  const hamburger = document.getElementById('nav-hamburger');
  const navLinksContainer = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');

  function toggleMobileNav() {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileNav() {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileNav);
  overlay.addEventListener('click', closeMobileNav);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // ---- Intersection Observer: Scroll Reveal ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ---- Smooth scroll — offset robusto con nav.offsetHeight ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navHeight = nav ? nav.offsetHeight : 72;
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ---- Hero mouse glow effect — más reactivo (0.06) ----
  const hero = document.querySelector('.hero');
  if (hero) {
    const glow1 = hero.querySelector('.hero__glow--1');
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left - 300;
      mouseY = e.clientY - rect.top - 300;
    });

    function animateGlow() {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      if (glow1) {
        glow1.style.left = currentX + 'px';
        glow1.style.top = currentY + 'px';
      }

      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  // ---- Console easter egg ----
  console.log(
    '%c⚡ Elier Garcia — Portfolio',
    'color: #0ea5a0; font-size: 16px; font-weight: bold;'
  );
  console.log(
    '%cBuilt from scratch. No templates, no shortcuts.',
    'color: #7b7b96; font-size: 12px;'
  );
});