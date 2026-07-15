document.addEventListener('DOMContentLoaded', () => {
  
  // ----------------------------------------------------
  // 1. Mock Trips Database (Comprehensive for filters)
  // ----------------------------------------------------
  const allTrips = [
    {
      id: "1",
      operator: "ไทยทริป เอ็กซ์เพรส",
      depTime: "20:30",
      arrTime: "06:00",
      duration: "09:30",
      durationMin: 570,
      from: "กรุงเทพฯ (หมอชิต 2)",
      to: "เชียงใหม่ (อาเขต)",
      vehicle: "bus-2", // รถทัวร์ 2 ชั้น
      vehicleText: "รถทัวร์ 2 ชั้น VIP",
      seatType: "VIP",
      amenities: ["air", "toilet", "wifi", "charge"],
      rating: 4.8,
      price: 650,
      availableSeats: 8,
      timeBracket: "night",
      transfers: null
    },
    {
      id: "2",
      operator: "ไทยทริป พรีเมียม",
      depTime: "08:30",
      arrTime: "15:00",
      duration: "06:30",
      durationMin: 390,
      from: "กรุงเทพฯ (หมอชิต 2)",
      to: "เชียงใหม่ (อาเขต)",
      vehicle: "bus-1", // รถทัวร์ 1 ชั้น
      vehicleText: "รถทัวร์ 1 ชั้นปรับอากาศพิเศษ",
      seatType: "Standard",
      amenities: ["air", "toilet", "charge"],
      rating: 4.5,
      price: 450,
      availableSeats: 15,
      timeBracket: "morning",
      transfers: null
    },
    {
      id: "3",
      operator: "ไทยทริป โลคอล",
      depTime: "13:00",
      arrTime: "19:30",
      duration: "06:30",
      durationMin: 390,
      from: "กรุงเทพฯ (หมอชิต 2)",
      to: "เชียงใหม่ (อาเขต)",
      vehicle: "bus-1", // รถทัวร์ 1 ชั้น
      vehicleText: "รถทัวร์ 1 ชั้นปรับอากาศ ม.2",
      seatType: "Standard",
      amenities: ["air", "toilet"],
      rating: 3.9,
      price: 380,
      availableSeats: 20,
      timeBracket: "afternoon",
      transfers: null
    },
    {
      id: "4",
      operator: "ไทยทริป เอ็กซ์เพรส",
      depTime: "10:15",
      arrTime: "20:45",
      duration: "10:30",
      durationMin: 630,
      from: "กรุงเทพฯ (หมอชิต 2)",
      to: "เชียงใหม่ (อาเขต)",
      vehicle: "bus-1",
      vehicleText: "รถทัวร์ 1 ชั้น VIP",
      seatType: "VIP",
      amenities: ["air", "toilet", "wifi"],
      rating: 4.2,
      price: 590,
      availableSeats: 0, // SOLD OUT
      timeBracket: "morning",
      transfers: null
    },
    {
      id: "5",
      operator: "ไทยทริป พรีเมียม",
      depTime: "22:00",
      arrTime: "08:15",
      duration: "10:15",
      durationMin: 615,
      from: "กรุงเทพฯ (หมอชิต 2)",
      to: "เชียงใหม่ (อาเขต)",
      vehicle: "bus-2",
      vehicleText: "รถทัวร์ 2 ชั้น พรีเมียม",
      seatType: "VIP",
      amenities: ["air", "toilet", "wifi", "charge"],
      rating: 4.7,
      price: 700,
      availableSeats: 4,
      timeBracket: "night",
      transfers: {
        point: "บขส. ตาก",
        wait: "45 นาที",
        legs: [
          { vehicle: "รถปรับอากาศพิเศษ ไทยทริป", duration: "5 ชม. 00 นาที" },
          { vehicle: "รถปรับอากาศ ม.4พ เชื่อมต่อ", duration: "4 ชม. 30 นาที" }
        ]
      }
    },
    {
      id: "6",
      operator: "ไทยทริป โลคอล",
      depTime: "18:45",
      arrTime: "02:30",
      duration: "07:45",
      durationMin: 465,
      from: "กรุงเทพฯ (หมอชิต 2)",
      to: "เชียงใหม่ (อาเขต)",
      vehicle: "van", // รถตู้วีไอพี
      vehicleText: "รถตู้วีไอพีปรับอากาศ",
      seatType: "Standard",
      amenities: ["air", "charge"],
      rating: 4.0,
      price: 490,
      availableSeats: 3,
      timeBracket: "evening",
      transfers: null
    }
  ];

  // Seating capacity configurations
  const seatingCapacity = {
    "1": { seatCount: 24, occupied: ["1A", "2B", "3C", "4D", "6B", "6C"] },
    "2": { seatCount: 32, occupied: ["1B", "2A", "3B", "3C", "5D", "6A", "7B", "8D"] },
    "3": { seatCount: 40, occupied: ["1A", "1D", "2C", "3A", "4B", "5C", "6D", "7A", "8B", "9C"] },
    "5": { seatCount: 24, occupied: ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D", "3A", "3B", "4A", "4B", "5A", "5B", "5C", "5D", "6A", "6B", "6C", "6D"] },
    "6": { seatCount: 12, occupied: ["1A", "2C", "3B", "3C"] }
  };


  // ----------------------------------------------------
  // 2. State & Initialize Page Information
  // ----------------------------------------------------
  let searchState = {
    from: "กรุงเทพฯ (หมอชิต 2)",
    to: "เชียงใหม่ (อาเขต)",
    date: new Date(2026, 6, 15), // 15 July 2026
    passengers: "ผู้ใหญ่ 1 คน",
    passengersRaw: { adult: 1, child: 0, senior: 0, special: 0 }
  };

  const monthsTh = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  function formatThaiDate(dateObj) {
    return `${dateObj.getDate()} ${monthsTh[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
  }

  // Load from URL if available
  const params = new URLSearchParams(window.location.search);
  if (params.get('from')) searchState.from = params.get('from');
  if (params.get('to')) searchState.to = params.get('to');
  if (params.get('dep-date')) {
    const d = new Date(params.get('dep-date'));
    if (!isNaN(d.getTime())) searchState.date = d;
  }
  
  const adultVal = parseInt(params.get('adult') || '1', 10);
  const childVal = parseInt(params.get('child') || '0', 10);
  const seniorVal = parseInt(params.get('senior') || '0', 10);
  const specialVal = parseInt(params.get('special') || '0', 10);
  searchState.passengersRaw = { adult: adultVal, child: childVal, senior: seniorVal, special: specialVal };
  
  let passengerSummary = [];
  if (adultVal > 0) passengerSummary.push(`ผู้ใหญ่ ${adultVal} คน`);
  if (childVal > 0) passengerSummary.push(`เด็ก ${childVal} คน`);
  if (seniorVal > 0) passengerSummary.push(`ผู้สูงอายุ ${seniorVal} คน`);
  if (specialVal > 0) passengerSummary.push(`ผู้ช่วยเหลือพิเศษ ${specialVal} คน`);
  if (passengerSummary.length > 0) searchState.passengers = passengerSummary.join(', ');

  // Update Summary cards initially
  function updateSummaryDisplay() {
    document.getElementById('summary-route').textContent = `${searchState.from} ➔ ${searchState.to}`;
    document.getElementById('summary-date').textContent = formatThaiDate(searchState.date);
    document.getElementById('summary-passengers').textContent = searchState.passengers;
    document.getElementById('nav-date-display').textContent = formatThaiDate(searchState.date);
  }

  updateSummaryDisplay();


  // ----------------------------------------------------
  // 3. Edit Search Form Toggler & Autocomplete
  // ----------------------------------------------------
  const btnToggleEdit = document.getElementById('btn-toggle-edit-search');
  const editSection = document.getElementById('edit-search-section');
  const btnCancelEdit = document.getElementById('btn-cancel-edit-search');
  const inlineSearchForm = document.getElementById('inline-search-form');

  btnToggleEdit.addEventListener('click', () => {
    const isExpanded = btnToggleEdit.getAttribute('aria-expanded') === 'true';
    btnToggleEdit.setAttribute('aria-expanded', !isExpanded);
    editSection.style.display = isExpanded ? 'none' : 'block';
    
    if (!isExpanded) {
      // Focus on the first element in the form
      document.getElementById('origin-input').focus();
      // Pre-fill form fields
      document.getElementById('origin-input').value = searchState.from;
      document.getElementById('dest-input').value = searchState.to;
      document.getElementById('dep-date').value = searchState.date.toISOString().split('T')[0];
      
      // counters values
      document.getElementById('val-adult').textContent = searchState.passengersRaw.adult;
      document.getElementById('val-child').textContent = searchState.passengersRaw.child;
      document.getElementById('val-senior').textContent = searchState.passengersRaw.senior;
      document.getElementById('val-special').textContent = searchState.passengersRaw.special;
      
      // Update counters button disabled states
      updateCounterButtons();
    }
  });

  btnCancelEdit.addEventListener('click', () => {
    btnToggleEdit.setAttribute('aria-expanded', 'false');
    editSection.style.display = 'none';
    btnToggleEdit.focus();
  });

  // Re-use counter buttons logic
  const counterConfigs = [
    { type: 'adult', min: 1 },
    { type: 'child', min: 0 },
    { type: 'senior', min: 0 },
    { type: 'special', min: 0 }
  ];

  function updateCounterButtons() {
    counterConfigs.forEach(cfg => {
      const dec = document.getElementById(`dec-${cfg.type}`);
      const valSpan = document.getElementById(`val-${cfg.type}`);
      const val = parseInt(valSpan.textContent, 10);
      dec.disabled = val <= cfg.min;
    });
  }

  counterConfigs.forEach(cfg => {
    const dec = document.getElementById(`dec-${cfg.type}`);
    const inc = document.getElementById(`inc-${cfg.type}`);
    const valSpan = document.getElementById(`val-${cfg.type}`);

    dec.addEventListener('click', () => {
      let val = parseInt(valSpan.textContent, 10);
      if (val > cfg.min) {
        valSpan.textContent = --val;
        updateCounterButtons();
      }
    });

    inc.addEventListener('click', () => {
      let val = parseInt(valSpan.textContent, 10);
      if (val < 9) {
        valSpan.textContent = ++val;
        updateCounterButtons();
      }
    });
  });

  // Re-use Autocomplete for Station Search fields
  const stationsList = [
    "กรุงเทพฯ (หมอชิต 2)", "กรุงเทพฯ (เอกมัย)", "กรุงเทพฯ (สายใต้ใหม่)",
    "เชียงใหม่ (อาเขต)", "ขอนแก่น (บขส. 3)", "ภูเก็ต (บขส. 2)",
    "นครราชสีมา (บขส. 2)", "เชียงราย (บขส.)", "หาดใหญ่ (บขส. 2)"
  ];

  function setupAutocomplete(inputId, listboxId) {
    const input = document.getElementById(inputId);
    const listbox = document.getElementById(listboxId);
    let activeIdx = -1;
    let suggestions = [];

    function renderList(items) {
      listbox.innerHTML = '';
      if (items.length === 0) {
        listbox.style.display = 'none';
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      items.forEach((item, i) => {
        const li = document.createElement('li');
        li.className = 'listbox-option';
        li.id = `${inputId}-opt-${i}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.textContent = item;
        li.addEventListener('click', () => select(i));
        listbox.appendChild(li);
      });
      listbox.style.display = 'block';
      input.setAttribute('aria-expanded', 'true');
    }

    function select(i) {
      if (i >= 0 && i < suggestions.length) {
        input.value = suggestions[i];
        close();
      }
    }

    function close() {
      listbox.style.display = 'none';
      input.setAttribute('aria-expanded', 'false');
      activeIdx = -1;
    }

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        suggestions = [];
        close();
        return;
      }
      suggestions = stationsList.filter(s => s.toLowerCase().includes(q));
      activeIdx = -1;
      renderList(suggestions);
    });

    input.addEventListener('keydown', (e) => {
      const isOpen = listbox.style.display === 'block';
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) { renderList(stationsList); suggestions = stationsList; }
        if (suggestions.length > 0) {
          activeIdx = (activeIdx + 1) % suggestions.length;
          updateHighlight();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isOpen && suggestions.length > 0) {
          activeIdx = activeIdx - 1 < 0 ? suggestions.length - 1 : activeIdx - 1;
          updateHighlight();
        }
      } else if (e.key === 'Enter') {
        if (isOpen && activeIdx >= 0) {
          e.preventDefault();
          select(activeIdx);
        }
      } else if (e.key === 'Escape') {
        if (isOpen) { e.preventDefault(); close(); }
      }
    });

    function updateHighlight() {
      const ops = listbox.querySelectorAll('.listbox-option');
      ops.forEach((op, idx) => {
        if (idx === activeIdx) {
          op.classList.add('focused');
          op.setAttribute('aria-selected', 'true');
          op.scrollIntoView({ block: 'nearest' });
          input.setAttribute('aria-activedescendant', op.id);
        } else {
          op.classList.remove('focused');
          op.setAttribute('aria-selected', 'false');
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !listbox.contains(e.target)) close();
    });
  }

  setupAutocomplete('origin-input', 'origin-listbox');
  setupAutocomplete('dest-input', 'dest-listbox');

  // Submit new search values (In-place edit)
  inlineSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Update State
    searchState.from = document.getElementById('origin-input').value;
    searchState.to = document.getElementById('dest-input').value;
    searchState.date = new Date(document.getElementById('dep-date').value);
    
    const adults = parseInt(document.getElementById('val-adult').textContent, 10);
    const children = parseInt(document.getElementById('val-child').textContent, 10);
    const seniors = parseInt(document.getElementById('val-senior').textContent, 10);
    const specials = parseInt(document.getElementById('val-special').textContent, 10);
    searchState.passengersRaw = { adult: adults, child: children, senior: seniors, special: specials };

    let summary = [];
    if (adults > 0) summary.push(`ผู้ใหญ่ ${adults} คน`);
    if (children > 0) summary.push(`เด็ก ${children} คน`);
    if (seniors > 0) summary.push(`ผู้สูงอายุ ${seniors} คน`);
    if (specials > 0) summary.push(`ผู้ช่วยเหลือพิเศษ ${specials} คน`);
    searchState.passengers = summary.join(', ');

    updateSummaryDisplay();
    
    // Hide form
    btnToggleEdit.setAttribute('aria-expanded', 'false');
    editSection.style.display = 'none';
    btnToggleEdit.focus();

    // Trigger update
    applyFiltersAndSorting();
    
    // Announce to Screen Readers
    announceStatus(`ค้นหาใหม่เสร็จสิ้น อัปเดตข้อมูลเส้นทางเป็น ${searchState.from} ไปยัง ${searchState.to}`);
  });


  // ----------------------------------------------------
  // 4. Date Navigation: Previous Day & Next Day
  // ----------------------------------------------------
  const btnPrevDay = document.getElementById('btn-prev-day');
  const btnNextDay = document.getElementById('btn-next-day');

  btnPrevDay.addEventListener('click', () => {
    // Subtract 1 day
    searchState.date.setDate(searchState.date.getDate() - 1);
    updateSummaryDisplay();
    applyFiltersAndSorting();
    announceStatus(`เปลี่ยนวันเดินทางเป็น วันก่อนหน้า: ${formatThaiDate(searchState.date)}`);
  });

  btnNextDay.addEventListener('click', () => {
    // Add 1 day
    searchState.date.setDate(searchState.date.getDate() + 1);
    updateSummaryDisplay();
    applyFiltersAndSorting();
    announceStatus(`เปลี่ยนวันเดินทางเป็น วันถัดไป: ${formatThaiDate(searchState.date)}`);
  });


  // ----------------------------------------------------
  // 5. Filters & Sorting Calculations
  // ----------------------------------------------------
  const filterTime = document.querySelectorAll('input[name="filter-time"]');
  const priceRange = document.getElementById('price-range');
  const priceValReadout = document.getElementById('price-val-readout');
  const filterVehicle = document.querySelectorAll('input[name="filter-vehicle"]');
  const filterSeat = document.querySelectorAll('input[name="filter-seat"]');
  const filterOperator = document.querySelectorAll('input[name="filter-operator"]');
  const filterAmenity = document.querySelectorAll('input[name="filter-amenity"]');
  const filterOnlyAvailable = document.getElementById('filter-only-available');
  const sortSelect = document.getElementById('sort-select');
  const tripsListContainer = document.getElementById('trips-list-container');
  const tripsCountLabel = document.getElementById('trips-count-label');

  // Slide price readout update
  priceRange.addEventListener('input', () => {
    priceValReadout.textContent = parseInt(priceRange.value, 10).toLocaleString();
    applyFiltersAndSorting();
  });

  // Bind change events to all filter elements
  const allFilterEls = [
    ...filterTime,
    ...filterVehicle,
    ...filterSeat,
    ...filterOperator,
    ...filterAmenity,
    filterOnlyAvailable,
    sortSelect
  ];

  allFilterEls.forEach(el => el.addEventListener('change', applyFiltersAndSorting));

  function applyFiltersAndSorting() {
    // 1. Gather Filter Choices
    const activeTimes = Array.from(filterTime).filter(cb => cb.checked).map(cb => cb.value);
    const maxPrice = parseInt(priceRange.value, 10);
    const activeVehicles = Array.from(filterVehicle).filter(cb => cb.checked).map(cb => cb.value);
    const activeSeats = Array.from(filterSeat).filter(cb => cb.checked).map(cb => cb.value);
    const activeOperators = Array.from(filterOperator).filter(cb => cb.checked).map(cb => cb.value);
    const activeAmenities = Array.from(filterAmenity).filter(cb => cb.checked).map(cb => cb.value);
    const onlyAvailable = filterOnlyAvailable.checked;

    // 2. Filter list
    let filtered = allTrips.filter(trip => {
      // Time Bracket check
      if (!activeTimes.includes(trip.timeBracket)) return false;
      
      // Price limit check
      if (trip.price > maxPrice) return false;
      
      // Vehicle check
      if (!activeVehicles.includes(trip.vehicle)) return false;
      
      // Seat type check
      if (!activeSeats.includes(trip.seatType)) return false;
      
      // Operator check
      if (!activeOperators.includes(trip.operator)) return false;
      
      // Amenities check (Must match ALL checked amenities)
      for (let am of activeAmenities) {
        if (!trip.amenities.includes(am)) return false;
      }

      // Available check
      if (onlyAvailable && trip.availableSeats === 0) return false;

      return true;
    });

    // 3. Sort list
    const sortVal = sortSelect.value;
    filtered.sort((a, b) => {
      if (sortVal === 'earliest') {
        return a.depTime.localeCompare(b.depTime);
      } else if (sortVal === 'shortest') {
        return a.durationMin - b.durationMin;
      } else if (sortVal === 'price-asc') {
        return a.price - b.price;
      } else if (sortVal === 'rating-desc') {
        return b.rating - a.rating;
      }
      return 0;
    });

    // 4. Render output
    renderFilteredTrips(filtered);
  }

  // ----------------------------------------------------
  // 6. Rendering results & Empty state (WCAG AA markup)
  // ----------------------------------------------------
  function renderFilteredTrips(trips) {
    tripsListContainer.innerHTML = '';
    
    // Update count display
    const foundText = `พบเที่ยวเดินทาง ${trips.length} เที่ยว`;
    tripsCountLabel.textContent = foundText;
    announceStatus(foundText); // Status message screen reader announcement

    if (trips.length === 0) {
      tripsListContainer.innerHTML = `
        <article class="empty-results-card">
          <h3 class="empty-results-title">ไม่พบรอบเที่ยวรถทัวร์ตามที่คุณค้นหา</h3>
          <p>ไม่มีรอบเดินทางตรงกับตัวกรองที่เลือกอยู่ในขณะนี้ โปรลองทำตามข้อแนะนำต่อไปนี้:</p>
          <ul class="empty-suggestions">
            <li>ลดตัวกรองต่าง ๆ (เช่น เอาเครื่องหมายถูกสิ่งอำนวยความสะดวก หรือบริษัทผู้ให้บริการออก)</li>
            <li>ขยับแถบราคาขึ้นเพื่อให้ระบบแสดงข้อมูลรอบที่ครอบคลุมขึ้น</li>
            <li>กดเปลี่ยนวันเดินทางเป็นวันก่อนหน้าหรือถัดไปเพื่อเช็กรอบรอบเดินทางวันอื่น</li>
          </ul>
        </article>
      `;
      return;
    }

    trips.forEach(trip => {
      const isSoldOut = trip.availableSeats === 0;
      
      const card = document.createElement('article');
      card.className = `trip-card ${isSoldOut ? 'sold-out' : ''}`;
      card.id = `trip-card-${trip.id}`;

      // Build amenities HTML badges
      const amenityLabels = { air: "A/C", toilet: "สุขา", wifi: "Wi-Fi", charge: "USBชาร์จ" };
      const amenitiesBadgesHtml = trip.amenities.map(am => 
        `<span class="amenity-badge">${amenityLabels[am]}</span>`
      ).join('');

      // Build rating stars
      const starCount = Math.floor(trip.rating);
      const ratingStars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

      // Build transit/transfer layout link if exist
      let transferHtml = '';
      if (trip.transfers) {
        transferHtml = `<button type="button" class="btn-transit-detail" data-trip-id="${trip.id}" aria-label="ดูรายละเอียดการต่อรถของเที่ยวเดินทางหมายเลข ${trip.id}">🔀 เปลี่ยนพาหนะต่อระหว่างเดินทาง</button>`;
      }

      card.innerHTML = `
        <div class="trip-time-info">
          <span class="trip-time">${trip.depTime} น.</span>
          <span class="trip-arrow" aria-hidden="true">➔</span>
          <span class="trip-time">${trip.arrTime} น.</span>
          <span class="trip-duration">ระยะเวลาเดินทาง ${trip.duration} ชม.</span>
          ${transferHtml}
        </div>
        <div class="trip-bus-info">
          <span class="bus-class-badge badge-${trip.seatType === 'VIP' ? 'vip' : 'standard'}">
            ${trip.seatType} (${trip.vehicleText})
          </span>
          <span class="bus-operator">${trip.operator}</span>
          <div class="trip-reviews">
            <span aria-hidden="true" style="color:#ae6500;">${ratingStars} ${trip.rating}</span>
            <span class="sr-only">คะแนนรีวิวผู้ให้บริการ ${trip.rating} จาก 5 ดาว</span>
          </div>
        </div>
        <div class="trip-price-info">
          <span class="price-amount">${trip.price} บาท</span>
          <span class="seat-available-count" style="color: ${isSoldOut ? 'var(--error)' : 'var(--success)'};">
            ${isSoldOut ? 'ที่นั่งเต็ม' : `ว่าง ${trip.availableSeats} ที่นั่ง`}
          </span>
        </div>
        <div class="trip-action-wrapper">
          ${isSoldOut ? 
            `<span class="trip-sold-out-text" aria-live="polite">ที่นั่งเต็ม</span>` :
            `<button type="button" class="btn btn-primary btn-select" data-trip-id="${trip.id}">เลือกเที่ยวนี้</button>`
          }
        </div>
      `;

      tripsListContainer.appendChild(card);
    });

    // Bind event listeners to new button elements
    setupTripDetailsButtons();
  }

  function setupTripDetailsButtons() {
    // Bind Selection button (open Seating Modal)
    const selectBtns = document.querySelectorAll('.btn-select');
    selectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-trip-id');
        
        // Redirect to select-seat.html with query parameters
        const queryParams = new URLSearchParams({
          tripId: id,
          from: searchState.from,
          to: searchState.to,
          'dep-date': searchState.date.toISOString().split('T')[0],
          adult: searchState.passengersRaw.adult,
          child: searchState.passengersRaw.child,
          senior: searchState.passengersRaw.senior,
          special: searchState.passengersRaw.special
        }).toString();
        
        window.location.href = `select-seat.html?${queryParams}`;
      });
    });


    // Bind Transit Details link button (open Transit Details Modal)
    const transitBtns = document.querySelectorAll('.btn-transit-detail');
    transitBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-trip-id');
        openTransitModal(id, btn);
      });
    });
  }

  // Initial render
  applyFiltersAndSorting();




  // ----------------------------------------------------
  // 8. Transit Details Modal Logic (WCAG AA keyboard controls)
  // ----------------------------------------------------
  const transitModal = document.getElementById('transit-modal');
  const btnCloseTransit = document.getElementById('btn-close-transit-modal');
  const transitContent = document.getElementById('transit-details-content');
  let transitTriggerBtn = null;

  function openTransitModal(tripId, triggerBtnEl) {
    transitTriggerBtn = triggerBtnEl;
    const trip = allTrips.find(t => t.id === tripId);
    const trans = trip.transfers;

    if (!trans) return;

    // Build timeline HTML
    transitContent.innerHTML = `
      <div style="font-weight:bold; color:var(--primary); font-size:1.05rem;">
        สถานีเดินทาง: ${trip.from} ➔ ${trip.to}
      </div>
      <div class="transit-legs-container">
        <div class="transit-leg-item">
          <strong>ช่วงที่ 1: เดินทางออกจาก ${trip.from}</strong>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
            ยานพาหนะ: ${trans.legs[0].vehicle} (ระยะเวลา ${trans.legs[0].duration})
          </p>
        </div>
        
        <div class="transit-wait-time" role="status">
          🛑 จุดเปลี่ยนถ่ายรถ: ${trans.point} (พักรอต่อรถนาน ${trans.wait})
        </div>
        
        <div class="transit-leg-item" style="border-left-color: var(--primary);">
          <strong>ช่วงที่ 2: เปลี่ยนต่อรถมุ่งหน้าไปยัง ${trip.to}</strong>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
            ยานพาหนะ: ${trans.legs[1].vehicle} (ระยะเวลา ${trans.legs[1].duration})
          </p>
        </div>
      </div>
    `;

    // Open Modal
    transitModal.style.display = 'flex';
    transitModal.classList.add('active');
    if (window.setModalA11yBackdrop) window.setModalA11yBackdrop(true);
    
    // Focus close button
    btnCloseTransit.focus();
    announceStatus(`เปิดกล่องรายละเอียดเส้นทางเชื่อมรถ ณ ${trans.point} เรียบร้อยแล้ว`);

    window.addEventListener('keydown', handleTransitModalKeys);
  }

  function closeTransitModal() {
    transitModal.style.display = 'none';
    transitModal.classList.remove('active');
    if (window.setModalA11yBackdrop) window.setModalA11yBackdrop(false);

    if (transitTriggerBtn) {
      transitTriggerBtn.focus();
    }
    window.removeEventListener('keydown', handleTransitModalKeys);
  }

  btnCloseTransit.addEventListener('click', closeTransitModal);

  function handleTransitModalKeys(e) {
    if (e.key === 'Escape') {
      closeTransitModal();
    }
    
    // Tab trap (only has 1 focusable button, lock it)
    if (e.key === 'Tab') {
      e.preventDefault();
      btnCloseTransit.focus();
    }
  }


  // ----------------------------------------------------
  // 9. Accessibility Announcer Helper
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
