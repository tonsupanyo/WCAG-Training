document.addEventListener('DOMContentLoaded', () => {
  
  // ----------------------------------------------------
  // 1. Load URL Parameters & Setup Summary Details
  // ----------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('tripId') || '1';
  const fromParam = params.get('from') || 'กรุงเทพฯ (หมอชิต 2)';
  const toParam = params.get('to') || 'เชียงใหม่ (อาเขต)';
  const dateParam = params.get('dep-date') || '2026-07-15';

  const adultVal = parseInt(params.get('adult') || '1', 10);
  const childVal = parseInt(params.get('child') || '0', 10);
  const seniorVal = parseInt(params.get('senior') || '0', 10);
  const specialVal = parseInt(params.get('special') || '0', 10);
  
  const totalPassengers = adultVal + childVal + seniorVal + specialVal;

  // Trips Mock data matching Page 2
  const tripsDb = {
    "1": { operator: "ไทยทริป เอ็กซ์เพรส", class: "VIP 24 ที่นั่ง", price: 650, time: "20:30 น. ➔ 06:00 น.", duration: "9 ชม. 30 นาที", busNo: "VIP-01", stops: ["กรุงเทพฯ (หมอชิต 2)", "จุดบริการ นครสวรรค์", "จุดบริการ ตาก", "เชียงใหม่ (อาเขต)"], amenities: ["เครื่องปรับอากาศปรับอุณหภูมิอัตโนมัติ", "สุขาและอ่างล้างมือสะอาดบนรถทัวร์", "ฟรี Wi-Fi ความเร็วสูงประจำตัวรถ", "จุดเสียบชาร์จแบตเตอรี่ USB ทุกที่นั่ง"] },
    "2": { operator: "ไทยทริป พรีเมียม", class: "ปรับอากาศ ม.4พ", price: 450, time: "08:30 น. ➔ 15:00 น.", duration: "6 ชม. 30 นาที", busNo: "PRE-08", stops: ["กรุงเทพฯ (หมอชิต 2)", "จุดบริการ นครสวรรค์", "เชียงใหม่ (อาเขต)"], amenities: ["เครื่องปรับอากาศเย็นสบาย", "สุขาสะอาดส่วนตัวบนรถบัส", "จุดเสียบชาร์จ USB 5V ประจำที่นั่ง"] },
    "3": { operator: "ไทยทริป โลคอล", class: "ปรับอากาศ ม.2", price: 380, time: "13:00 น. ➔ 19:30 น.", duration: "6 ชม. 30 นาที", busNo: "LOC-24", stops: ["กรุงเทพฯ (หมอชิต 2)", "จุดจอด นครสวรรค์", "เชียงใหม่ (อาเขต)"], amenities: ["เครื่องปรับอากาศเย็นสบาย", "เครื่องกรองอากาศบริสุทธิ์บนรถ"] },
    "5": { operator: "ไทยทริป พรีเมียม", class: "ปรับอากาศ ม.4พ (ต่อรถ)", price: 700, time: "22:00 น. ➔ 08:15 น.", duration: "10 ชม. 15 นาที", busNo: "PRE-22", stops: ["กรุงเทพฯ (หมอชิต 2)", "บขส. ตาก (จุดรอเปลี่ยนถ่ายรถ 45 นาที)", "เชียงใหม่ (อาเขต)"], amenities: ["เครื่องปรับอากาศเย็นสบาย", "สุขาและอ่างล้างมือบนรถบัส", "ฟรี Wi-Fi ตลอดทาง", "ช่องชาร์จไฟ USB 5V ทุกที่นั่ง"], transit: "บขส. ตาก" },
    "6": { operator: "ไทยทริป โลคอล", class: "รถตู้วีไอพี", price: 490, time: "18:45 น. ➔ 02:30 น.", duration: "7 ชม. 45 นาที", busNo: "VAN-06", stops: ["กรุงเทพฯ (หมอชิต 2)", "จุดบริการ นครสวรรค์", "เชียงใหม่ (อาเขต)"], amenities: ["เครื่องปรับอากาศรอบทิศทาง", "ช่องชาร์จไฟ USB ประจำเบาะนั่ง"] }
  };

  const selectedTrip = tripsDb[tripId] || tripsDb["1"];

  // Populate HTML summary texts
  document.getElementById('summary-route-text').textContent = `${fromParam} ➔ ${toParam}`;
  document.getElementById('summary-operator-text').textContent = `${selectedTrip.operator} (${selectedTrip.class})`;
  
  // Format Date Th
  const monthsTh = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const d = new Date(dateParam);
  let displayDate = dateParam;
  if (!isNaN(d.getTime())) {
    displayDate = `${d.getDate()} ${monthsTh[d.getMonth()]} ${d.getFullYear() + 543}`;
  }
  document.getElementById('summary-date-text').textContent = displayDate;
  document.getElementById('summary-time-text').textContent = selectedTrip.time;
  document.getElementById('summary-duration-busno-text').textContent = `${selectedTrip.duration} (รอบรถ ${selectedTrip.busNo})`;

  if (selectedTrip.transit) {
    document.getElementById('summary-transit-point-text').textContent = `ต่อรถ ณ ${selectedTrip.transit}`;
  }

  // Populate Sidebar Summary
  document.getElementById('sidebar-trip-name').textContent = selectedTrip.operator;
  
  let passengerSummary = [];
  if (adultVal > 0) passengerSummary.push(`ผู้ใหญ่ ${adultVal} คน`);
  if (childVal > 0) passengerSummary.push(`เด็ก ${childVal} คน`);
  if (seniorVal > 0) passengerSummary.push(`ผู้สูงอายุ ${seniorVal} คน`);
  if (specialVal > 0) passengerSummary.push(`ผู้ช่วยเหลือพิเศษ ${specialVal} คน`);
  document.getElementById('sidebar-passenger-count').textContent = passengerSummary.join(', ');


  // ----------------------------------------------------
  // 2. Tabs Controls Logic (WCAG WAI-ARIA Tab list)
  // ----------------------------------------------------
  const tabButtons = document.querySelectorAll('.payment-tab-btn');
  const tabPanes = document.querySelectorAll('.payment-pane');

  function switchTab(targetBtn) {
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    tabPanes.forEach(pane => pane.classList.remove('active'));

    targetBtn.classList.add('active');
    targetBtn.setAttribute('aria-selected', 'true');
    const panelId = targetBtn.getAttribute('aria-controls');
    document.getElementById(panelId).classList.add('active');
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => switchTab(btn));

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
        switchTab(tabButtons[targetIdx]);
      }
    });
  });

  // Dynamic content loading into Tab panels
  // Tab 1: Timeline
  const stopsTimeline = document.getElementById('route-stops-timeline');
  stopsTimeline.innerHTML = `<div style="font-weight:bold; color:var(--primary); font-size:1.05rem; margin-bottom:12px;">จุดบริการเดินรถตามตารางเวลา:</div>`;
  selectedTrip.stops.forEach((stop, idx) => {
    const isLast = idx === selectedTrip.stops.length - 1;
    const isTransit = selectedTrip.transit && stop.includes(selectedTrip.transit);
    
    const item = document.createElement('div');
    item.className = 'transit-leg-item';
    if (isLast) item.style.borderLeft = 'none';
    if (isTransit) item.style.borderLeftColor = 'var(--focus-outline)';

    item.innerHTML = `
      <strong>${stop}</strong>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">
        ${idx === 0 ? 'จุดออกเดินทางเวลาเริ่มต้น' : isLast ? 'จุดหมายปลายทางสิ้นสุด' : 'จุดจอดบริการพักผ่อน/ตรวจตั๋ว'}
      </p>
    `;
    stopsTimeline.appendChild(item);
    
    if (isTransit) {
      const waitDiv = document.createElement('div');
      waitDiv.className = 'transit-wait-time';
      waitDiv.textContent = `🛑 จุดจอดเปลี่ยนต่อรถบัสคันใหม่ (พักเวลานาน 45 นาที)`;
      stopsTimeline.appendChild(waitDiv);
    }
  });

  // Tab 2: Amenities details
  const amenitiesList = document.getElementById('amenities-list-details');
  amenitiesList.innerHTML = '';
  selectedTrip.amenities.forEach(am => {
    const li = document.createElement('li');
    li.textContent = am;
    amenitiesList.appendChild(li);
  });


  // ----------------------------------------------------
  // 3. Seating Map Layout & Selection (Normal, Senior, Wheelchair, Extra Charge)
  // ----------------------------------------------------
  const busSeatGrid = document.getElementById('bus-seat-grid-p3');
  const sumSeatsVal = document.getElementById('sidebar-selected-seats');
  const sumBaseVal = document.getElementById('sidebar-price-base');
  const sumExtraVal = document.getElementById('sidebar-price-extra');
  const sumTotalVal = document.getElementById('sidebar-price-total');
  const errorAlert = document.getElementById('seat-error-alert');
  const errorText = document.getElementById('seat-error-text');

  // Seats Capacity Mocks (from database)
  const seatingCapacity = {
    "1": { seatCount: 24, occupied: ["1A", "2B", "3C", "4D", "6B", "6C"] },
    "2": { seatCount: 32, occupied: ["1B", "2A", "3B", "3C", "5D", "6A", "7B", "8D"] },
    "3": { seatCount: 40, occupied: ["1A", "1D", "2C", "3A", "4B", "5C", "6D", "7A", "8B", "9C"] },
    "5": { seatCount: 24, occupied: ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D", "3A", "3B", "4A", "4B", "5A", "5B", "5C", "5D"] },
    "6": { seatCount: 12, occupied: ["1A", "2C", "3B", "3C"] }
  };

  const capacity = seatingCapacity[tripId] || seatingCapacity["1"];
  let selectedSeats = [];

  function generateSeatsGrid() {
    busSeatGrid.innerHTML = '';
    const seatLetters = ['A', 'B', 'C', 'D'];
    const rows = Math.ceil(capacity.seatCount / 4);

    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < 4; c++) {
        const seatName = `${r}${seatLetters[c]}`;
        const isOccupied = capacity.occupied.includes(seatName);
        
        // Define seat types
        // Rows 1-2 (+50 THB extra charge)
        const isExtra = r <= 2;
        // Row 5 (Wheelchair Space)
        const isWheelchair = r === 5;
        // Row 6 (Senior Priority Seating)
        const isSenior = r === 6;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'seat';
        btn.setAttribute('data-seat-id', seatName);

        // Customize styles based on categories
        if (isExtra) {
          btn.style.borderStyle = 'dashed';
          btn.style.borderColor = 'var(--accent)';
        }
        if (isWheelchair) {
          btn.style.borderColor = 'var(--primary)';
        }
        if (isSenior) {
          btn.style.borderColor = 'var(--focus-outline)';
        }

        if (isOccupied) {
          btn.classList.add('occupied');
          btn.setAttribute('aria-label', `ที่นั่ง ${seatName} จองแล้ว`);
          btn.setAttribute('disabled', 'true');
          btn.innerHTML = '✕';
        } else {
          btn.classList.add('available');
          
          // Generate accessible name labels
          let labelText = `ที่นั่ง ${seatName}`;
          let iconText = seatName;
          
          if (isExtra) {
            labelText = `ที่นั่งพิเศษ ${seatName} มีค่าบริการเพิ่ม 50 บาท`;
            iconText = '💎';
          } else if (isWheelchair) {
            labelText = `ที่นั่งรถเข็นวีลแชร์ ${seatName} สำหรับผู้ต้องการความช่วยเหลือพิเศษ`;
            iconText = '♿';
          } else if (isSenior) {
            labelText = `ที่นั่งบุริมสิทธิ์ผู้สูงอายุ ${seatName}`;
            iconText = '👵';
          }
          
          btn.setAttribute('aria-label', `${labelText} ว่าง ราคา ${selectedTrip.price + (isExtra ? 50 : 0)} บาท`);
          btn.innerHTML = iconText;

          btn.addEventListener('click', () => {
            toggleSeat(seatName, btn, isExtra, labelText);
          });
        }

        busSeatGrid.appendChild(btn);
      }
    }
  }

  function toggleSeat(seatId, buttonEl, isExtra, baseLabel) {
    // Hide error banner on selection click
    errorAlert.style.display = 'none';

    const idx = selectedSeats.indexOf(seatId);

    if (idx === -1) {
      // Check if trying to select more than passengers allowed
      if (selectedSeats.length >= totalPassengers) {
        showError(`คุณระบุจำนวนผู้โดยสารไว้ ${totalPassengers} คน ไม่สามารถเลือกที่นั่งมากกว่านี้ได้ (หากต้องการเปลี่ยนจำนวนผู้โดยสาร กรุณากดปุ่มแก้ไขการค้นหาด้านบน)`);
        return;
      }

      // Select seat
      selectedSeats.push(seatId);
      buttonEl.classList.remove('available');
      buttonEl.classList.add('selected');
      buttonEl.setAttribute('aria-selected', 'true');
      buttonEl.setAttribute('aria-label', `${baseLabel} เลือกแล้ว`);
      buttonEl.innerHTML = '✓';
      announceA11y(`เลือกที่นั่งหมายเลข ${seatId} สำเร็จ`);
    } else {
      // Unselect seat
      selectedSeats.splice(idx, 1);
      buttonEl.classList.remove('selected');
      buttonEl.classList.add('available');
      buttonEl.removeAttribute('aria-selected');
      
      let icon = seatId;
      if (seatId.startsWith('1') || seatId.startsWith('2')) icon = '💎';
      else if (seatId.startsWith('5')) icon = '♿';
      else if (seatId.startsWith('6')) icon = '👵';
      
      buttonEl.innerHTML = icon;
      buttonEl.setAttribute('aria-label', `${baseLabel} ว่าง ราคา ${selectedTrip.price + (isExtra ? 50 : 0)} บาท`);
      announceA11y(`ยกเลิกการเลือกที่นั่งหมายเลข ${seatId} สำเร็จ`);
    }

    updatePriceSummary();
  }

  function updatePriceSummary() {
    if (selectedSeats.length > 0) {
      selectedSeats.sort();
      sumSeatsVal.textContent = selectedSeats.join(', ');
      
      const count = selectedSeats.length;
      
      // Calculate extra seats count (Row 1 and 2 start with 1 or 2)
      const extraSeatsCount = selectedSeats.filter(s => s.startsWith('1') || s.startsWith('2')).length;
      
      const baseSum = count * selectedTrip.price;
      const extraSum = extraSeatsCount * 50;
      const total = baseSum + extraSum;

      sumBaseVal.textContent = `${baseSum.toLocaleString()} บาท`;
      sumExtraVal.textContent = `${extraSum.toLocaleString()} บาท`;
      sumTotalVal.textContent = `${total.toLocaleString()} บาท`;

      // Fill hidden inputs
      document.getElementById('final-seats').value = selectedSeats.join(', ');
      document.getElementById('final-price').value = total;
    } else {
      sumSeatsVal.textContent = 'ยังไม่ได้เลือกที่นั่ง';
      sumBaseVal.textContent = '0 บาท';
      sumExtraVal.textContent = '0 บาท';
      sumTotalVal.textContent = '0 บาท';

      document.getElementById('final-seats').value = '';
      document.getElementById('final-price').value = 0;
    }
  }

  // Generate grid initially
  generateSeatsGrid();


  // ----------------------------------------------------
  // 4. Special Assistance Checkboxes Trigger Actions
  // ----------------------------------------------------
  const chkWheelchair = document.getElementById('chk-wheelchair-space');
  const detailsTextarea = document.getElementById('txt-special-details');

  chkWheelchair.addEventListener('change', () => {
    if (chkWheelchair.checked) {
      // Suggest wheelchair seats if checked (Wheelchair priority is row 5: 5A, 5B, 5C, 5D)
      announceA11y('คุณเลือกตัวต้องการพื้นที่สำหรับวีลแชร์ แนะนำให้เลือกตำแหน่งที่นั่งในแถวที่ 5 (มีสัญลักษณ์ ♿)');
      detailsTextarea.placeholder = 'กรุณาระบุขนาดของวีลแชร์ (กว้าง x ยาว) เพื่อความสะดวกในการจัดสรรพื้นที่';
    }
  });


  // ----------------------------------------------------
  // 5. Reservation countdown timer 10:00 (WCAG 2.2.1)
  // ----------------------------------------------------
  let timeLeft = 600; // 10 minutes in seconds
  let timerInterval = null;
  const holdTimerDisplay = document.getElementById('seat-hold-timer');
  const btnExtendHold = document.getElementById('btn-extend-hold-timer');
  
  // Timer Warning modal elements
  const timerModal = document.getElementById('hold-timer-modal');
  const timerModalSec = document.getElementById('timer-modal-sec');
  const btnModalExtend = document.getElementById('btn-timer-modal-extend');
  const btnModalCancel = document.getElementById('btn-timer-modal-cancel');
  let prevFocusEl = null;

  function formatDisplayTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function startHoldTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      timeLeft--;
      holdTimerDisplay.textContent = formatDisplayTime(timeLeft);
      holdTimerDisplay.setAttribute('aria-label', `เวลาสำรองล็อกที่นั่งที่เหลือ ${Math.floor(timeLeft / 60)} นาที ${timeLeft % 60} วินาที`);

      // Update modal text if active
      if (timerModal.classList.contains('active')) {
        timerModalSec.textContent = timeLeft;
      }

      // Pop warning dialog modal when 2 minutes left
      if (timeLeft === 120) {
        openTimerModal();
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        window.showToast('หมดเวลาจองสำรองที่นั่งชั่วคราว ระบบจะนำท่านกลับไปยังหน้าแรกเพื่อค้นหาเที่ยวรถใหม่', 'error');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2500);
      }
    }, 1000);
  }

  // Start the hold timer
  startHoldTimer();

  // Extend button on the main banner
  btnExtendHold.addEventListener('click', extendTime);

  function extendTime() {
    timeLeft = 600; // reset
    announceA11y('ขยายเวลาจองสำเร็จแล้ว ระบบตั้งเวลานับถอยหลังใหม่เป็น 10 นาที');
  }

  // Warning Modal management (Focus Trap & Accessibility)
  function openTimerModal() {
    prevFocusEl = document.activeElement;
    timerModal.style.display = 'flex';
    timerModal.classList.add('active');
    btnModalExtend.focus(); // focus on confirmation
    announceA11y('แจ้งเตือนการจอง: เวลาล็อกจองที่นั่งของคุณใกล้หมดลงแล้ว');
    window.addEventListener('keydown', handleModalKeys);
  }

  function closeTimerModal() {
    timerModal.style.display = 'none';
    timerModal.classList.remove('active');
    if (prevFocusEl) prevFocusEl.focus();
    window.removeEventListener('keydown', handleModalKeys);
  }

  btnModalExtend.addEventListener('click', () => {
    timeLeft = 600;
    closeTimerModal();
    announceA11y('ขยายเวลาจองที่นั่งสำเร็จ ระบบเพิ่มเวลาล็อกอีก 10 นาที');
  });

  btnModalCancel.addEventListener('click', () => {
    clearInterval(timerInterval);
    window.showToast('ทำรายการจองตั๋วถูกยกเลิก ระบบจะนำคุณกลับไปยังหน้าหลัก', 'warning');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  });

  function handleModalKeys(e) {
    if (!timerModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeTimerModal();
    }

    if (e.key === 'Tab') {
      const btns = [btnModalCancel, btnModalExtend];
      if (e.shiftKey) { // Backward Shift+Tab
        if (document.activeElement === btns[0]) {
          e.preventDefault();
          btns[1].focus();
        }
      } else { // Forward Tab
        if (document.activeElement === btns[1]) {
          e.preventDefault();
          btns[0].focus();
        }
      }
    }
  }


  // ----------------------------------------------------
  // 6. Form Submission Validation (WCAG 3.3.1)
  // ----------------------------------------------------
  const proceedForm = document.getElementById('proceed-to-passenger-form');
  document.getElementById('final-trip-id').value = tripId;

  proceedForm.addEventListener('submit', (e) => {
    e.preventDefault();
    errorAlert.style.display = 'none';

    // Validate that number of selected seats matches passenger count
    if (selectedSeats.length < totalPassengers) {
      showError(`คุณเลือกที่นั่งไม่ครบตามจำนวนผู้โดยสาร (ระบุผู้เดินทางทั้งหมด ${totalPassengers} คน แต่เลือกไว้เพียง ${selectedSeats.length} ที่นั่ง)`);
      return;
    }

    // Submit form: navigate to next page passing parameters
    // Preserve passengers and append selected seats and price
    const finalFormQuery = new URLSearchParams({
      tripId: tripId,
      seats: selectedSeats.join(', '),
      price: document.getElementById('final-price').value,
      adult: adultVal,
      child: childVal,
      senior: seniorVal,
      special: specialVal,
      // Pass special assistance data to next page if checked
      wheelchairSpace: chkWheelchair.checked ? 'true' : 'false',
      boardingAssist: document.getElementById('chk-boarding-assist').checked ? 'true' : 'false',
      guideDog: document.getElementById('chk-guide-dog').checked ? 'true' : 'false',
      largeEquip: document.getElementById('chk-large-equipment').checked ? 'true' : 'false',
      specialNotes: detailsTextarea.value
    }).toString();

    window.location.href = `passenger-info.html?${finalFormQuery}`;
  });

  function showError(msg) {
    errorText.textContent = msg;
    errorAlert.style.display = 'block';
    errorAlert.focus(); // Move keyboard focus to error alert for WCAG AA
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }


  // ----------------------------------------------------
  // 7. Screen Reader Announcements Live Region Helper
  // ----------------------------------------------------
  function announceA11y(msg) {
    let liveRegion = document.getElementById('a11y-announcer');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-announcer';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = msg;
  }

});
