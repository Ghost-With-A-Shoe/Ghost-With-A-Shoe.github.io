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
    const linkRect = link.getBoundingClientRect();
    const left = linkRect.left - navListRect.left + (linkRect.width - indicator.offsetWidth) / 2;
    indicator.style.left = `${left}px`;
  }
}

function setInitialActive() {
  let found = false;
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    const currentPage = window.location.pathname.split('/').pop();
    if (
      linkHref === currentPage ||
      (linkHref === 'index.html' && (currentPage === '' || currentPage === 'index.html'))
    ) {
      setActiveLink(link);
      found = true;
    }
  });
  if (!found && navLinks[0]) setActiveLink(navLinks[0]);
}

navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    if (resetIndicatorTimeout) {
      clearTimeout(resetIndicatorTimeout);
      resetIndicatorTimeout = null;
    }
    moveIndicatorTo(link);
  });

  link.addEventListener('mouseleave', () => {
    if (resetIndicatorTimeout) clearTimeout(resetIndicatorTimeout);
    resetIndicatorTimeout = setTimeout(() => {
      const active = document.querySelector('.nav-link-active');
      if (active) moveIndicatorTo(active);
    }, 500);
  });

  link.addEventListener('click', () => {
    setActiveLink(link);
    window.location.href = link.getAttribute('href');
  });
});

window.addEventListener('load', setInitialActive);
window.addEventListener('hashchange', setInitialActive);

document.getElementById('logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
