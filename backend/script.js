(function () {
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');
  const indicator = document.querySelector('.sliding-indicator');
  if (!navList || !navLinks.length || !indicator) return;

  const INDICATOR_RESET_DELAY_MS = 1000;
  let indicatorResetTimeout = null;

  const sectionIds = ['hero', 'about', 'projects', 'contact'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function setActiveLink(link) {
    navLinks.forEach(l => l.classList.remove('nav-link-active'));
    link.classList.add('nav-link-active');
    moveIndicatorTo(link);
  }

  function moveIndicatorTo(link) {
    const navListRect = navList.getBoundingClientRect();
    const p = link.querySelector('p');
    const target = p || link;
    const rect = target.getBoundingClientRect();
    const left = rect.left - navListRect.left + (rect.width - indicator.offsetWidth) / 2;
    indicator.style.left = `${left}px`;
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Nav click: smooth scroll on single-page (anchor links)
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const isAnchor = href.startsWith('#');
    const sectionId = isAnchor ? href.slice(1) : null;

    link.addEventListener('click', (e) => {
      if (isAnchor && sectionId && document.getElementById(sectionId)) {
        e.preventDefault();
        setActiveLink(link);
        scrollToSection(sectionId);
        history.replaceState(null, '', href);
      }
    });

    link.addEventListener('mouseenter', () => {
      if (indicatorResetTimeout) {
        clearTimeout(indicatorResetTimeout);
        indicatorResetTimeout = null;
      }
      moveIndicatorTo(link);
    });
    link.addEventListener('mouseleave', () => {
      if (indicatorResetTimeout) clearTimeout(indicatorResetTimeout);
      indicatorResetTimeout = setTimeout(() => {
        const active = document.querySelector('.nav-link-active');
        if (active) moveIndicatorTo(active);
        indicatorResetTimeout = null;
      }, INDICATOR_RESET_DELAY_MS);
    });
  });

  // Update active nav from scroll position (single-page only)
  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const link = document.querySelector('.nav-link[data-section="' + id + '"]') || document.querySelector('.nav-link[href="#' + id + '"]');
          if (link) setActiveLink(link);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(section => observer.observe(section));
  }

  // Initial state: hash or first section; scroll to hash if present
  function setInitialActive() {
    const hash = window.location.hash.slice(1);
    if (hash && sectionIds.includes(hash) && document.getElementById(hash)) {
      const link = document.querySelector('.nav-link[data-section="' + hash + '"]') || document.querySelector('.nav-link[href="#' + hash + '"]');
      if (link) setActiveLink(link);
      setTimeout(function () { scrollToSection(hash); }, 50);
      return;
    }
    const first = document.querySelector('.nav-link[data-section="hero"]') || document.querySelector('.nav-link[href="#hero"]') || navLinks[0];
    if (first) setActiveLink(first);
  }

  window.addEventListener('load', setInitialActive);
  window.addEventListener('hashchange', setInitialActive);
})();
