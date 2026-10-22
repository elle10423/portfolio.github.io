// ---------- Mobile menu ----------
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && window.innerWidth <= 780) {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---------- Sticky header ----------
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ---------- Active section highlight ----------
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const setActive = (id) => {
    navLinks.forEach((link) => {
      const on = link.getAttribute('href') === `#${id}`;
      link.style.color = on ? 'var(--cyan)' : '';
    });
  };
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => spy.observe(section));
}

// ---------- Back to top ----------
const toTop = document.getElementById('toTop');
if (toTop) {
  const update = () => { toTop.hidden = window.scrollY < 500; };
  update();
  window.addEventListener('scroll', update, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---------- Footer year ----------
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// ---------- Scroll reveal ----------
const revealTargets = document.querySelectorAll('.skill, .entry, .fact-panel, .resume-box');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  revealTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach((el) => observer.observe(el));
}

// ---------- Resume download check ----------
// Only runs on a real web server (http/https). When you open index.html
// directly from your computer (file://), browsers block fetch(), so the
// check is skipped and the download link works normally.
const resumeBtn = document.querySelector('.resume-btn');
if (resumeBtn && location.protocol.startsWith('http')) {
  resumeBtn.addEventListener('click', async (event) => {
    try {
      const response = await fetch(resumeBtn.href, { method: 'HEAD' });
      if (!response.ok) throw new Error('missing');
    } catch (error) {
      event.preventDefault();
      alert(
        'Resume not found at assets/resume.pdf.\n\n' +
        'Put your PDF in an "assets" folder next to index.html and ' +
        'keep the file name exactly resume.pdf (all lowercase).'
      );
    }
  });
}