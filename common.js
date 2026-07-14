document.addEventListener('DOMContentLoaded', () => {
  // Highlight current page in navigation
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      link.style.backgroundColor = '#1e3a8a';
      link.style.color = '#ffffff';
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      link.style.backgroundColor = 'transparent';
      link.style.color = 'hsl(220, 20%, 85%)';
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

  // ----------------------------------------------------
  // Dynamic Booking Status Modal Setup
  // ----------------------------------------------------
  // 1. Create and append modal HTML markup
  const modalHTML = `
    <div id="booking-status" class="a11y-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
      <div class="a11y-modal-content">
        <div class="a11y-modal-header">
          <h2 id="modal-title">ตรวจสอบสถานะการจอง</h2>
          <button type="button" class="a11y-modal-close-btn" aria-label="ปิดหน้าต่างตรวจสอบการจอง">×</button>
        </div>
        <form id="booking-search-form">
          <div class="a11y-form-group">
            <label for="booking-ref-input">รหัสการจอง / ตั๋วเดินทาง</label>
            <input type="text" id="booking-ref-input" required placeholder="ตัวอย่าง: TT-889102" aria-required="true">
          </div>
          <div class="a11y-form-group">
            <label for="booking-phone-input">เบอร์โทรศัพท์ที่ใช้จอง</label>
            <input type="tel" id="booking-phone-input" required placeholder="ตัวอย่าง: 081-234-5678" aria-required="true">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">ค้นหาข้อมูล</button>
        </form>
        <div id="booking-search-result" aria-live="polite"></div>
      </div>
    </div>
  `;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = modalHTML;
  const modalElement = tempDiv.firstElementChild;
  document.body.appendChild(modalElement);
  
  const modalCloseBtn = modalElement.querySelector('.a11y-modal-close-btn');
  const searchForm = modalElement.querySelector('#booking-search-form');
  const resultContainer = modalElement.querySelector('#booking-search-result');
  const refInput = modalElement.querySelector('#booking-ref-input');
  
  let lastFocusedElement = null;
  
  const openModal = (triggerElement) => {
    lastFocusedElement = triggerElement;
    modalElement.classList.add('active');
    modalElement.setAttribute('aria-hidden', 'false');
    refInput.focus();
  };
  
  const closeModal = () => {
    modalElement.classList.remove('active');
    modalElement.setAttribute('aria-hidden', 'true');
    resultContainer.innerHTML = '';
    searchForm.reset();
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };
  
  // 2. Configure trigger links
  const bookingLinks = document.querySelectorAll('a[href="#booking-status"]');
  bookingLinks.forEach(link => {
    link.removeAttribute('aria-disabled');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(link);
    });
  });
  
  // 3. Event listeners for modal closure
  modalCloseBtn.addEventListener('click', closeModal);
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      closeModal();
    }
  });
  
  // Escape key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalElement.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Tab trap focus inside modal
  modalElement.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusableEls = modalElement.querySelectorAll('input, button, [href], select, textarea, [tabindex="0"]');
      const firstFocusableEl = focusableEls[0];
      const lastFocusableEl = focusableEls[focusableEls.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          e.preventDefault();
        }
      }
    }
  });
  
  // 4. Booking search simulation
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    resultContainer.innerHTML = '<p style="text-align: center; color: #1e3a8a; margin-top: 15px;">กำลังตรวจสอบข้อมูลการจอง...</p>';
    
    setTimeout(() => {
      const refCode = refInput.value.trim().toUpperCase();
      const cleanRef = refCode.replace(/[^A-Z0-9]/g, '');
      
      const tripId = cleanRef.length % 2 === 0 ? '1' : '2';
      const seatNo = cleanRef.includes('1A') ? '1A' : '3B';
      const routeText = tripId === '1' ? 'กรุงเทพฯ - เชียงใหม่' : 'กรุงเทพฯ - ขอนแก่น';
      const timeText = tripId === '1' ? '20:30 น. (VIP 24 ที่นั่ง)' : '08:30 น. (ปรับอากาศ ม.4พ)';
      const priceText = tripId === '1' ? '650' : '450';
      
      resultContainer.innerHTML = `
        <div class="booking-result-box">
          <p class="success-title">✓ พบข้อมูลการจองตั๋วเดินทาง</p>
          <p><strong>รหัสการจอง:</strong> ${refCode}</p>
          <p><strong>ผู้เดินทาง:</strong> นายสมชาย ใจดี</p>
          <p><strong>เส้นทาง:</strong> ${routeText}</p>
          <p><strong>เที่ยวเวลา:</strong> ${timeText}</p>
          <p><strong>ที่นั่ง:</strong> ${seatNo}</p>
          <p><strong>สถานะการจอง:</strong> <span class="badge">ชำระเงินสำเร็จแล้ว</span></p>
          <button type="button" class="btn btn-primary" id="btn-modal-go-success">ดูตั๋วเดินทางอิเล็กทรอนิกส์</button>
        </div>
      `;
      
      const goBtn = resultContainer.querySelector('#btn-modal-go-success');
      goBtn.addEventListener('click', () => {
        window.location.href = `booking-success.html?tripId=${tripId}&seats=${seatNo}&price=${priceText}`;
      });
      goBtn.focus();
    }, 1000);
  });
});
