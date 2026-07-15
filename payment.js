document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------
  // 1. Load parameters & Setup summary Sidebar details
  // ----------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('tripId') || '1';
  const seatsParam = params.get('seats') || '';
  const priceParam = parseInt(params.get('price') || '0', 10);
  
  const adultVal = parseInt(params.get('adult') || '1', 10);
  const childVal = parseInt(params.get('child') || '0', 10);
  const seniorVal = parseInt(params.get('senior') || '0', 10);
  const specialVal = parseInt(params.get('special') || '0', 10);

  const seatsArray = seatsParam ? seatsParam.split(', ') : [];

  const tripsDb = {
    "1": { operator: "ไทยทริป เอ็กซ์เพรส", class: "VIP 24 ที่นั่ง", time: "20:30 น. ➔ 06:00 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" },
    "2": { operator: "ไทยทริป พรีเมียม", class: "ปรับอากาศ ม.4พ", time: "08:30 น. ➔ 15:00 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" },
    "3": { operator: "ไทยทริป โลคอล", class: "ปรับอากาศ ม.2", time: "13:00 น. ➔ 19:30 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" },
    "5": { operator: "ไทยทริป พรีเมียม", class: "ปรับอากาศ ม.4พ (ต่อรถ)", time: "22:00 น. ➔ 08:15 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" },
    "6": { operator: "ไทยทริป โลคอล", class: "รถตู้วีไอพี", time: "18:45 น. ➔ 02:30 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" }
  };

  const trip = tripsDb[tripId] || tripsDb["1"];

  // Populate Right Column Details
  document.getElementById('sum-route').textContent = trip.route;
  document.getElementById('sum-operator').textContent = `${trip.operator} (${trip.class}) ➔ 15 ก.ค. 2569`;
  document.getElementById('sum-seats').textContent = seatsParam ? seatsParam : 'ยังไม่ได้เลือกที่นั่ง';
  document.getElementById('sum-total-price-label').textContent = `${priceParam.toLocaleString()} บาท`;
  document.getElementById('modal-confirm-total-price').textContent = `${priceParam.toLocaleString()} บาท`;
  
  // Fill all price placeholders in tabs (Bank, QR)
  document.querySelectorAll('.pay-amount-placeholder').forEach(el => {
    el.textContent = `${priceParam.toLocaleString()} บาท`;
  });

  // Mock passenger names based on seats list size
  const mockNames = ["นายสมชาย ใจดี", "นางสาวสมหญิง รักดี", "เด็กชายหนูแดง แสนซน", "นางประคอง จิตสงบ"];
  const pListUl = document.getElementById('sum-passenger-names-list');
  pListUl.innerHTML = '';
  
  seatsArray.forEach((seat, idx) => {
    const li = document.createElement('li');
    const name = mockNames[idx % mockNames.length];
    li.innerHTML = `• ${name} <span style="font-weight:bold; color:var(--primary);">(${seat})</span>`;
    pListUl.appendChild(li);
  });

  // Mock contact
  document.getElementById('sum-contact-text').innerHTML = `นายสมชาย ใจดี <br>📞 089-123-4567 <br>✉️ somchaimail@mail.com`;

  // Bind parameters to Back Edit Links
  const baseQueryParams = new URLSearchParams({
    tripId: tripId,
    from: "กรุงเทพฯ (หมอชิต 2)",
    to: "เชียงใหม่ (อาเขต)",
    'dep-date': "2026-07-15",
    adult: adultVal,
    child: childVal,
    senior: seniorVal,
    special: specialVal
  });

  document.getElementById('edit-link-trip').href = `select-trip.html?${baseQueryParams.toString()}`;
  
  document.getElementById('edit-link-seats').href = `select-seat.html?${baseQueryParams.toString()}`;
  
  const passengerQueryParams = new URLSearchParams({
    tripId: tripId,
    seats: seatsParam,
    price: priceParam - 30, // subtract processing fee for calculation
    adult: adultVal,
    child: childVal,
    senior: seniorVal,
    special: specialVal
  }).toString();
  document.getElementById('edit-link-passengers').href = `passenger-info.html?${passengerQueryParams}`;


  // ----------------------------------------------------
  // 2. Tab Switching Navigation (Arrow Left/Right keys)
  // ----------------------------------------------------
  const tabButtons = document.querySelectorAll('.payment-tab-btn');
  const tabPanes = document.querySelectorAll('.payment-pane');
  let activeTabId = 'pane-card'; // default active pane

  function switchPaymentTab(targetBtn) {
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    tabPanes.forEach(pane => pane.classList.remove('active'));

    targetBtn.classList.add('active');
    targetBtn.setAttribute('aria-selected', 'true');
    const panelId = targetBtn.getAttribute('aria-controls');
    document.getElementById(panelId).classList.add('active');
    activeTabId = panelId;

    // Reset error summary when switching channels
    document.getElementById('payment-error-summary').style.display = 'none';
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => switchPaymentTab(btn));

    btn.addEventListener('keydown', (e) => {
      let targetIdx = null;
      if (e.key === 'ArrowRight') {
        targetIdx = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft') {
        targetIdx = (index - 1 + tabButtons.length) % tabButtons.length;
      }
      if (targetIdx !== null) {
        e.preventDefault();
        tabButtons[targetIdx].focus();
        // Shift focus but do not select automatically (SC 2.1.1 & 1.3.1 manual selection)
      }
    });
  });


  // ----------------------------------------------------
  // 3. QR Code Countdown Timer (3 Minutes validity)
  // ----------------------------------------------------
  let qrTimeLeft = 180;
  const qrDisplay = document.getElementById('qr-countdown-val');
  let qrInterval = setInterval(() => {
    if (activeTabId === 'pane-qr') {
      qrTimeLeft--;
      const m = Math.floor(qrTimeLeft / 60);
      const s = qrTimeLeft % 60;
      qrDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

      // Warn user at 30 seconds left using non-blocking voice & Toast
      if (qrTimeLeft === 30) {
        window.showToast('คิวอาร์โค้ดใกล้จะหมดอายุในอีก 30 วินาที (กดปุ่มขอรหัสใหม่เพื่อรีเซ็ตเวลา)', 'warning');
        announceStatus('เวลาสำหรับการสแกนคิวอาร์โค้ดเหลืออีก 30 วินาที คุณสามารถกดปุ่มขอคิวอาร์โค้ดใหม่ด้านล่างเพื่อรีเซ็ตเวลากลับเป็น 3 นาทีได้');
      }

      if (qrTimeLeft <= 0) {
        window.showToast('คิวอาร์โค้ดหมดอายุการชำระเงินแล้ว ระบบกำลังสร้างคิวอาร์โค้ดใหม่ให้คุณ', 'warning');
        announceStatus('คิวอาร์โค้ดชำระเงินใบเดิมหมดอายุการใช้งานแล้ว ระบบได้ทำการสร้างคิวอาร์โค้ดชำระเงินใบใหม่ให้คุณเรียบร้อยแล้ว');
        qrTimeLeft = 180;
      }
    }
  }, 1000);

  // Check QR status click
  document.getElementById('btn-check-qr-status').addEventListener('click', () => {
    announceStatus('กำลังตรวจสอบสถานะการชำระเงินของรหัสคิวอาร์โค้ด...');
    setTimeout(() => {
      window.showToast('ระบบได้รับการยืนยันยอดเงินผ่านคิวอาร์โค้ดเรียบร้อยแล้ว! ระบบกำลังออกตั๋วเดินทางของท่าน...', 'success');
      const successQuery = new URLSearchParams({
        tripId: tripId,
        seats: seatsParam,
        price: priceParam
      }).toString();
      setTimeout(() => {
        window.location.href = `booking-success.html?${successQuery}`;
      }, 1500);
    }, 1000);
  });

  // Refresh QR code click listener
  const btnRefreshQr = document.getElementById('btn-refresh-qr');
  if (btnRefreshQr) {
    btnRefreshQr.addEventListener('click', () => {
      qrTimeLeft = 180;
      const m = Math.floor(qrTimeLeft / 60);
      const s = qrTimeLeft % 60;
      qrDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      announceStatus('สร้างคิวอาร์โค้ดชำระเงินใบใหม่เรียบร้อยแล้ว');
      window.showToast('สร้างคิวอาร์โค้ดชำระเงินใบใหม่สำเร็จ', 'success');
    });
  }


  // ----------------------------------------------------
  // 4. Hold Reservation Timer 10:00 (WCAG 2.2.1 Timing)
  // ----------------------------------------------------
  let holdTime = 600;
  const holdDisplay = document.getElementById('payment-hold-timer');
  const btnExtendHold = document.getElementById('btn-extend-payment-timer');

  // Timer Warning modal elements (standardized with select-seat.js for SC 2.2.1)
  const timerModal = document.getElementById('hold-timer-modal');
  const timerModalSec = document.getElementById('timer-modal-sec');
  const btnModalExtend = document.getElementById('btn-timer-modal-extend');
  const btnModalCancel = document.getElementById('btn-timer-modal-cancel');
  let prevFocusEl = null;

  function openTimerModal() {
    prevFocusEl = document.activeElement;
    timerModal.style.display = 'flex';
    timerModal.classList.add('active');
    if (window.setModalA11yBackdrop) window.setModalA11yBackdrop(true);
    btnModalExtend.focus();
    announceStatus('แจ้งเตือนการจอง: เวลาชำระเงินล็อกตั๋วของคุณใกล้หมดลงแล้ว');
    window.addEventListener('keydown', handleTimerModalKeys);
  }

  function closeTimerModal() {
    timerModal.style.display = 'none';
    timerModal.classList.remove('active');
    if (window.setModalA11yBackdrop) window.setModalA11yBackdrop(false);
    if (prevFocusEl) prevFocusEl.focus();
    window.removeEventListener('keydown', handleTimerModalKeys);
  }

  btnModalExtend.addEventListener('click', () => {
    holdTime = 600;
    closeTimerModal();
    announceStatus('ขยายเวลาจองสำเร็จแล้ว ระบบตั้งเวลานับถอยหลังใหม่เป็น 10 นาที');
  });

  btnModalCancel.addEventListener('click', () => {
    clearInterval(holdInterval);
    window.showToast('ทำรายการจองตั๋วถูกยกเลิก ระบบจะนำคุณกลับไปยังหน้าหลัก', 'warning');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  });

  function handleTimerModalKeys(e) {
    if (!timerModal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeTimerModal();
    }
    if (e.key === 'Tab') {
      const btns = [btnModalCancel, btnModalExtend];
      if (e.shiftKey) {
        if (document.activeElement === btns[0]) {
          e.preventDefault();
          btns[1].focus();
        }
      } else {
        if (document.activeElement === btns[1]) {
          e.preventDefault();
          btns[0].focus();
        }
      }
    }
  }

  const holdInterval = setInterval(() => {
    holdTime--;
    const mins = Math.floor(holdTime / 60);
    const secs = holdTime % 60;
    holdDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    holdDisplay.setAttribute('aria-label', `เวลาสำรองล็อกที่นั่งที่เหลือ ${mins} นาที ${secs} วินาที`);

    // Update modal text if active
    if (timerModal.classList.contains('active')) {
      timerModalSec.textContent = holdTime;
    }

    // Pop warning dialog modal when 2 minutes left (120s)
    if (holdTime === 120) {
      openTimerModal();
    }

    if (holdTime <= 0) {
      clearInterval(holdInterval);
      if (timerModal.classList.contains('active')) {
        closeTimerModal();
      }
      window.showToast('เวลาในการสงวนที่นั่งสิ้นสุดลงแล้ว ระบบจะนำท่านกลับไปยังหน้าแรกเพื่อเริ่มจองตั๋วใหม่', 'error');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2500);
    }
  }, 1000);

  btnExtendHold.addEventListener('click', () => {
    holdTime = 600;
    announceStatus('ขยายเวลาจองสำเร็จแล้ว ระบบตั้งเวลานับถอยหลังใหม่เป็น 10 นาที');
  });


  // ----------------------------------------------------
  // 5. Payment Validation & Failure Simulation
  // ----------------------------------------------------
  const payErrorSummary = document.getElementById('payment-error-summary');
  const payErrorText = document.getElementById('payment-error-text');
  const btnSubmit = document.getElementById('btn-submit-payment');

  const creditCardForm = document.getElementById('credit-card-form');
  if (creditCardForm) {
    creditCardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      btnSubmit.click();
    });
  }

  const confirmModal = document.getElementById('confirm-payment-modal');
  const btnConfirmCancel = document.getElementById('btn-confirm-modal-cancel');
  const btnConfirmProceed = document.getElementById('btn-confirm-modal-proceed');

  btnSubmit.addEventListener('click', () => {
    payErrorSummary.style.display = 'none';

    // 1. Credit Card Validation
    if (activeTabId === 'pane-card') {
      const cName = document.getElementById('card-name');
      const cNum = document.getElementById('card-number');
      const cExp = document.getElementById('card-expiry');
      const cCvv = document.getElementById('card-cvv');

      let hasErrors = false;
      [cName, cExp, cCvv].forEach(el => {
        el.classList.remove('error');
        el.removeAttribute('aria-describedby');
      });
      cNum.classList.remove('error');
      cNum.setAttribute('aria-describedby', 'card-fail-tip');
      document.querySelectorAll('.error-message-text').forEach(el => el.style.display = 'none');

      if (!cName.value.trim()) {
        cName.classList.add('error');
        document.getElementById('card-name-error').style.display = 'block';
        cName.setAttribute('aria-describedby', 'card-name-error');
        hasErrors = true;
      }
      
      const numbersOnly = cNum.value.replace(/\s/g, '');
      if (!numbersOnly || numbersOnly.length !== 16 || isNaN(numbersOnly)) {
        cNum.classList.add('error');
        document.getElementById('card-number-error').style.display = 'block';
        cNum.setAttribute('aria-describedby', 'card-fail-tip card-number-error');
        hasErrors = true;
      }

      if (!cExp.value.trim() || !cExp.value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
        cExp.classList.add('error');
        document.getElementById('card-expiry-error').style.display = 'block';
        cExp.setAttribute('aria-describedby', 'card-expiry-error');
        hasErrors = true;
      }

      if (!cCvv.value.trim() || cCvv.value.trim().length !== 3 || isNaN(cCvv.value)) {
        cCvv.classList.add('error');
        document.getElementById('card-cvv-error').style.display = 'block';
        cCvv.setAttribute('aria-describedby', 'card-cvv-error');
        hasErrors = true;
      }

      if (hasErrors) {
        showPaymentError('ข้อมูลชำระเงินไม่ถูกต้อง กรุณาตรวจสอบช่องสีแดงและกรอกใหม่อีกครั้ง');
        return;
      }

      // 2. Failure Simulation (Starts with 9999)
      if (numbersOnly.startsWith('9999')) {
        showPaymentError('ชำระเงินไม่สำเร็จ: ยอดเงินในบัญชีของคุณไม่เพียงพอ หรือระบบปฏิเสธการทำรายการ กรุณาลองใหม่อีกครั้งหรือใช้บัตรใบอื่น');
        return;
      }
    }

    // 3. Bank Transfer Validation
    if (activeTabId === 'pane-bank') {
      const file = document.getElementById('bank-slip-file');
      file.classList.remove('error');
      file.removeAttribute('aria-describedby');
      document.getElementById('bank-slip-error').style.display = 'none';

      if (file.files.length === 0) {
        file.classList.add('error');
        document.getElementById('bank-slip-error').style.display = 'block';
        file.setAttribute('aria-describedby', 'bank-slip-error');
        showPaymentError('กรุณาแนบไฟล์สลิปหลักฐานโอนเงินเพื่อดำเนินการตรวจสอบข้อมูล');
        return;
      }
    }

    // Open Confirmation modal
    openConfirmModal();
  });

  function showPaymentError(msg) {
    payErrorText.textContent = msg;
    payErrorSummary.style.display = 'block';
    payErrorSummary.focus();
    payErrorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ----------------------------------------------------
  // 6. Confirmation modal with Focus Trap & Loading
  // ----------------------------------------------------
  let prevFocusElement = null;

  function openConfirmModal() {
    prevFocusElement = document.activeElement;
    confirmModal.style.display = 'flex';
    confirmModal.classList.add('active');
    if (window.setModalA11yBackdrop) window.setModalA11yBackdrop(true);
    document.getElementById('modal-payment-confirm-content').style.display = 'block';
    document.getElementById('modal-payment-processing-content').style.display = 'none';
    
    btnConfirmProceed.focus();
    window.addEventListener('keydown', handleConfirmModalKeys);
  }

  function closeConfirmModal() {
    confirmModal.style.display = 'none';
    confirmModal.classList.remove('active');
    if (window.setModalA11yBackdrop) window.setModalA11yBackdrop(false);
    if (prevFocusElement) prevFocusElement.focus();
    window.removeEventListener('keydown', handleConfirmModalKeys);
  }

  btnConfirmCancel.addEventListener('click', closeConfirmModal);

  btnConfirmProceed.addEventListener('click', () => {
    // 1. Enter processing state (disable buttons, show spinner)
    document.getElementById('modal-payment-confirm-content').style.display = 'none';
    document.getElementById('modal-payment-processing-content').style.display = 'block';
    
    // Announce status to screen readers
    document.getElementById('processing-status-label').focus();
    
    // 2. Wait 2 seconds (simulate gateway delay)
    setTimeout(() => {
      // Redirect to success page
      const successQuery = new URLSearchParams({
        tripId: tripId,
        seats: seatsParam,
        price: priceParam
      }).toString();
      window.location.href = `booking-success.html?${successQuery}`;
    }, 2000);
  });

  function handleConfirmModalKeys(e) {
    if (e.key === 'Escape') {
      closeConfirmModal();
    }

    if (e.key === 'Tab') {
      const btns = [btnConfirmCancel, btnConfirmProceed];
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === btns[0]) {
          e.preventDefault();
          btns[1].focus();
        }
      } else { // Tab
        if (document.activeElement === btns[1]) {
          e.preventDefault();
          btns[0].focus();
        }
      }
    }
  }


  // ----------------------------------------------------
  // 7. A11y Live Announcer status update helper
  // ----------------------------------------------------
  function announceStatus(message) {
    let liveRegion = document.getElementById('a11y-announcer');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-announcer';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = message;
  }

});
