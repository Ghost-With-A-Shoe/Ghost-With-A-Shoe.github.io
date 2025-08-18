// Vanilla JS for navigation

// --- NAVIGATION ---
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');
const indicator = document.querySelector('.sliding-indicator');

let resetIndicatorTimeout = null;

function setActiveLink(link) {
  navLinks.forEach(l => l.classList.remove('nav-link-active'));
  link.classList.add('nav-link-active');
  moveIndicatorTo(link);
}

function moveIndicatorTo(link) {
  const navListRect = navList.getBoundingClientRect();
  const p = link.querySelector('p');
  if (p) {
    const pRect = p.getBoundingClientRect();
    const left = pRect.left - navListRect.left + (pRect.width - indicator.offsetWidth) / 2;
    indicator.style.left = `${left}px`;
  } else {
    // fallback: center under link
    const linkRect = link.getBoundingClientRect();
    const left = linkRect.left - navListRect.left + (linkRect.width - indicator.offsetWidth) / 2;
    indicator.style.left = `${left}px`;
  }
}

// Set initial active link based on hash or default
function setInitialActive() {
  let found = false;
  navLinks.forEach(link => {
    if (window.location.hash === link.getAttribute('href')) {
      setActiveLink(link);
      found = true;
    }
  });
  if (!found && navLinks[0]) setActiveLink(navLinks[0]);
}

// Hover effect for indicator with timer before reset
navLinks.forEach(link => {
  link.addEventListener('mouseenter', e => {
    if (resetIndicatorTimeout) {
      clearTimeout(resetIndicatorTimeout);
      resetIndicatorTimeout = null;
    }
    moveIndicatorTo(link);
  });
  link.addEventListener('mouseleave', e => {
    if (resetIndicatorTimeout) clearTimeout(resetIndicatorTimeout);
    resetIndicatorTimeout = setTimeout(() => {
      const active = document.querySelector('.nav-link-active');
      if (active) moveIndicatorTo(active);
    }, 350); // 350ms delay
  });
  link.addEventListener('click', e => {
    setActiveLink(link);
    window.location.hash = link.getAttribute('href');
    e.preventDefault();
  });
});

window.addEventListener('load', setInitialActive);
window.addEventListener('hashchange', setInitialActive);

// --- LOGO CLICK (optional) ---
document.getElementById('logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
