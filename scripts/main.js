/* ============================================
   MAIN.JS — Portfolio Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Dynamic Year ----
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Navbar scroll behavior ----
  const nav = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  let lastScroll = 0;
  const SCROLL_THRESHOLD = 50;

  function handleNavScroll() {
    const currentScroll = window.scrollY;

    // Add shadow on scroll
    if (currentScroll > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
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

  // Close mobile nav on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on escape key
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

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ---- Hero mouse glow effect ----
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
      currentX += (mouseX - currentX) * 0.03;
      currentY += (mouseY - currentY) * 0.03;

      if (glow1) {
        glow1.style.left = currentX + 'px';
        glow1.style.top = currentY + 'px';
      }

      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  // ---- Badge hover ripple ----
  document.querySelectorAll('.badge').forEach((badge) => {
    badge.addEventListener('mouseenter', () => {
      badge.style.transform = 'scale(1.05)';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform = 'scale(1)';
    });
  });

  // ---- Console easter egg ----
  console.log(
    '%c⚡ Elier Garcia — Portfolio',
    'color: #4f8fff; font-size: 16px; font-weight: bold;'
  );
  console.log(
    '%cBuilt from scratch. No templates, no shortcuts.',
    'color: #7b7b96; font-size: 12px;'
  );
});
