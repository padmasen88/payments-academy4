/* =============================================
   PAYMENTS LEARNING PLATFORM — APP JS
   ============================================= */

(function () {
  'use strict';

  /* ---- CHAPTER TAB SWITCHING ---- */
  function initTabs() {
    const tabBars = document.querySelectorAll('.chapter-tabs');
    tabBars.forEach(function (bar) {
      const tabs = bar.querySelectorAll('.chapter-tab');
      const panelId = bar.dataset.panels;
      const panelContainer = panelId
        ? document.getElementById(panelId)
        : bar.closest('.tabs-wrapper');

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          const target = tab.dataset.tab;

          tabs.forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');

          const panels = panelContainer
            ? panelContainer.querySelectorAll('.chapter-panel')
            : document.querySelectorAll('.chapter-panel[data-tab]');

          panels.forEach(function (panel) {
            if (panel.dataset.tab === target) {
              panel.classList.add('active');
            } else {
              panel.classList.remove('active');
            }
          });
        });
      });
    });
  }

  /* ---- SIDEBAR ACTIVE STATE (scroll-based) ---- */
  function initScrollSpy() {
    const sections = document.querySelectorAll('[data-section-id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.sectionId;
            navLinks.forEach(function (link) {
              link.classList.toggle('active', link.dataset.section === id);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---- ACTIVE NAV LINK BASED ON PAGE ---- */
  function initNavActive() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ---- PARTICLE BACKGROUND (index only) ---- */
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 40;
    const colors = ['#6366f1', '#2dd4bf', '#8b5cf6', '#f59e0b', '#38bdf8'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = p.style.height = (Math.random() * 2 + 1) + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (Math.random() * 15 + 10) + 's';
      p.style.animationDelay = (Math.random() * 15) + 's';
      p.style.opacity = (Math.random() * 0.4 + 0.1).toString();
      container.appendChild(p);
    }
  }

  /* ---- ANIMATED NUMBER COUNTER ---- */
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 1200;
          const start = performance.now();
          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = prefix + (Number.isInteger(target)
              ? Math.round(value).toLocaleString()
              : value.toFixed(1)) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) { observer.observe(c); });
  }

  /* ---- COLLAPSIBLE SECTIONS ---- */
  function initCollapsibles() {
    document.querySelectorAll('.collapsible-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const content = document.getElementById(trigger.dataset.target);
        if (!content) return;
        const isOpen = content.style.display !== 'none' && content.style.display !== '';
        content.style.display = isOpen ? 'none' : 'block';
        trigger.querySelector('.collapse-icon').textContent = isOpen ? '▶' : '▼';
      });
    });
  }

  /* ---- SMOOTH SIDEBAR SCROLL ---- */
  function initSidebarLinks() {
    var headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '64',
      10
    );

    document.querySelectorAll('.sidebar-nav a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;

        /* If the target lives inside a hidden panel, activate that panel first */
        var panel = target.closest('.chapter-panel');
        if (panel && !panel.classList.contains('active')) {
          var tabName = panel.dataset.tab;
          /* Find the matching tab button and click it */
          var tabBtn = document.querySelector('.chapter-tab[data-tab="' + tabName + '"]');
          if (tabBtn) tabBtn.click();
        }

        /* Wait one frame so the panel becomes visible before measuring position */
        requestAnimationFrame(function () {
          var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
          window.scrollTo({ top: top, behavior: 'smooth' });
        });
      });
    });
  }


  /* ---- COPY CODE BUTTON ---- */
  function initCodeCopy() {
    document.querySelectorAll('pre').forEach(function (pre) {
      const btn = document.createElement('button');
      btn.textContent = 'Copy';
      btn.style.cssText = 'position:absolute;top:8px;right:8px;padding:4px 10px;' +
        'background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.4);' +
        'border-radius:6px;color:#818cf8;cursor:pointer;font-size:11px;font-family:Inter,sans-serif';
      pre.style.position = 'relative';
      pre.appendChild(btn);
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(pre.textContent.replace('Copy', '').trim()).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
        });
      });
    });
  }

  /* ---- ACTIVATE TAB FROM HASH ---- */
  function handleInitialHash() {
    var hash = window.location.hash;
    if (!hash) return;
    var id = hash.slice(1);
    var target = document.getElementById(id);
    if (!target) return;

    var panel = target.closest('.chapter-panel');
    if (panel && !panel.classList.contains('active')) {
      var tabName = panel.dataset.tab;
      var tabBtn = document.querySelector('.chapter-tab[data-tab="' + tabName + '"]');
      if (tabBtn) {
        tabBtn.click();
        
        requestAnimationFrame(function () {
          var headerHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '64',
            10
          );
          var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
          window.scrollTo({ top: top, behavior: 'smooth' });
        });
      }
    }
  }

  /* ---- INIT ALL ---- */
  function initAll() {
    initTabs();
    initScrollSpy();
    initNavActive();
    initParticles();
    animateCounters();
    initCollapsibles();
    initSidebarLinks();
    initCodeCopy();
    handleInitialHash();

    // Activate first tab automatically
    document.querySelectorAll('.chapter-tabs').forEach(function (bar) {
      const firstTab = bar.querySelector('.chapter-tab');
      if (firstTab && !bar.querySelector('.chapter-tab.active')) {
        firstTab.click();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
