document.addEventListener('DOMContentLoaded', () => {
  // Highlight current page in navigation
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      link.style.backgroundColor = '#e6f0fa';
      link.style.color = '#0b1e3d';
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      link.style.backgroundColor = 'transparent';
      link.style.color = '#4b5563';
    }
  });

  // Simple language switcher simulation
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      
      // Screen reader announcement for change
      let announcement = 'เปลี่ยนภาษาเป็นภาษาไทยแล้ว';
      if (selectedLang === 'en') {
        announcement = 'Language changed to English';
      }
      
      // Create or use live region to announce language change
      let liveRegion = document.getElementById('a11y-announcer');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'a11y-announcer';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveRegion);
      }
      
      liveRegion.textContent = announcement;
      
      // Simulate reload or text switch in a real site
      setTimeout(() => {
        alert(selectedLang === 'en' ? 'Language switched to English (Demo)' : 'เปลี่ยนเป็นภาษาไทย (ตัวอย่าง)');
      }, 100);
    });
  }
});
