(() => {
  const current = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
  document.querySelectorAll('.mobile-nav-item').forEach(link => {
    if ((link.dataset.mobilePage || '').toLowerCase() === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
