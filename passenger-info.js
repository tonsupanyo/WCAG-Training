document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------
  // 1. Load parameters from URL & State Management
  // ----------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('tripId') || '1';
  const seatsParam = params.get('seats') || '';
  const priceParam = parseInt(params.get('price') || '0', 10);
  
  const adultVal = parseInt(params.get('adult') || '1', 10);
  const childVal = parseInt(params.get('child') || '0', 10);
  const seniorVal = parseInt(params.get('senior') || '0', 10);
  const specialVal = parseInt(params.get('special') || '0', 10);
  const totalPassengers = adultVal + childVal + seniorVal + specialVal;

  const seatsArray = seatsParam ? seatsParam.split(', ') : [];

  const tripsDb = {
    "1": { operator: "ไทยทริป เอ็กซ์เพรส", class: "VIP 24 ที่นั่ง", time: "20:30 น. ➔ 06:00 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" },
    "2": { operator: "ไทยทริป พรีเมียม", class: "ปรับอากาศ ม.4พ", time: "08:30 น. ➔ 15:00 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" },
    "3": { operator: "ไทยทริป โลคอล", class: "ปรับอากาศ ม.2", time: "13:00 น. ➔ 19:30 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" },
    "5": { operator: "ไทยทริป พรีเมียม", class: "ปรับอากาศ ม.4พ (ต่อรถ)", time: "22:00 น. ➔ 08:15 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" },
    "6": { operator: "ไทยทริป โลคอล", class: "รถตู้วีไอพี", time: "18:45 น. ➔ 02:30 น.", route: "กรุงเทพฯ ➔ เชียงใหม่" }
  };

  const trip = tripsDb[tripId] || tripsDb["1"];

  // Populate hidden fields
  document.getElementById('carry-trip-id').value = tripId;
  document.getElementById('carry-seats').value = seatsParam;
  document.getElementById('carry-price').value = priceParam;

  // Render Sidebar details
  document.getElementById('summary-route-label').textContent = trip.route;
  document.getElementById('summary-datetime-label').textContent = `15 ก.ค. 2569 (${trip.time})`;
  
  let passengerSummary = [];
  if (adultVal > 0) passengerSummary.push(`ผู้ใหญ่ ${adultVal} คน`);
  if (childVal > 0) passengerSummary.push(`เด็ก ${childVal} คน`);
  if (seniorVal > 0) passengerSummary.push(`ผู้สูงอายุ ${seniorVal} คน`);
  if (specialVal > 0) passengerSummary.push(`ผู้ช่วยเหลือพิเศษ ${specialVal} คน`);
  document.getElementById('summary-passengers-label').textContent = passengerSummary.join(', ');
  
  document.getElementById('summary-seats-label').textContent = seatsParam ? seatsParam : 'ไม่ได้เลือกที่นั่ง';
  document.getElementById('summary-base-price-label').textContent = `${priceParam.toLocaleString()} บาท`;


  // ----------------------------------------------------
  // 2. Generate Passenger Forms Dynamic Setup & Categories
  // ----------------------------------------------------
  const dynamicContainer = document.getElementById('dynamic-passenger-forms-container');
  
  // Assign ticket categories in sequence: Adults first, then Seniors, then Children, then Specials
  let passengerCategories = [];
  for (let i = 0; i < adultVal; i++) passengerCategories.push({ name: 'ผู้ใหญ่', code: 'adult' });
  for (let i = 0; i < seniorVal; i++) passengerCategories.push({ name: 'ผู้สูงอายุ (อายุ 60 ปีขึ้นไป)', code: 'senior' });
  for (let i = 0; i < childVal; i++) passengerCategories.push({ name: 'เด็ก (อายุ 2 - 11 ปี)', code: 'child' });
  for (let i = 0; i < specialVal; i++) passengerCategories.push({ name: 'ผู้ช่วยเหลือพิเศษ', code: 'special' });

  // Handle case where seats size doesn't match total count (fallback)
  while (passengerCategories.length < seatsArray.length) {
    passengerCategories.push({ name: 'ผู้ใหญ่', code: 'adult' });
  }

  // Populate dynamic form markup
  seatsArray.forEach((seat, index) => {
    const pIndex = index + 1;
    const cat = passengerCategories[index];
    
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'form-container-card';
    fieldset.id = `passenger-fieldset-${pIndex}`;
    
    fieldset.innerHTML = `
      <legend class="form-section-title">
        ผู้โดยสารคนที่ ${pIndex} - ที่นั่ง <span class="lbl-seat-num">${seat}</span> 
        <span class="bus-class-badge badge-${cat.code === 'senior' || cat.code === 'child' ? 'vip' : 'standard'}" style="margin-left:12px;">ตั๋ว${cat.name}</span>
      </legend>
      
      <div class="form-grid-2col">
        <!-- Prefix -->
        <div class="form-control">
          <label for="p${pIndex}-prefix" class="form-label">คำนำหน้านาม <span class="sr-only">ของที่นั่ง ${seat}</span></label>
          <select id="p${pIndex}-prefix" class="form-input" required>
            <option value="" disabled selected>เลือกคำนำหน้า</option>
            <option value="นาย">นาย</option>
            <option value="นาง">นาง</option>
            <option value="นางสาว">นางสาว</option>
            <option value="ด.ช.">เด็กชาย</option>
            <option value="ด.ญ.">เด็กหญิง</option>
          </select>
          <span id="p${pIndex}-prefix-error" class="error-message-text" role="status">กรุณาเลือกคำนำหน้านาม</span>
        </div>

        <!-- Name-Surname -->
        <div class="form-control">
          <label for="p${pIndex}-name" class="form-label">ชื่อ - นามสกุลจริง (ภาษาไทยหรืออังกฤษ) <span class="sr-only">ของที่นั่ง ${seat}</span></label>
          <input type="text" id="p${pIndex}-name" class="form-input" required placeholder="เช่น สมชาย ดีใจ">
          <span id="p${pIndex}-name-error" class="error-message-text" role="status">กรุณากรอกชื่อและนามสกุลจริง</span>
        </div>
      </div>

      <div class="form-grid-2col">
        <!-- Date of birth -->
        <div class="form-control">
          <label for="p${pIndex}-dob" class="form-label">วันเดือนปีเกิด (ค.ศ.) <span class="sr-only">ของที่นั่ง ${seat}</span></label>
          <input type="date" id="p${pIndex}-dob" class="form-input" required>
          <span id="p${pIndex}-dob-error" class="error-message-text" role="status">กรุณากรอกวันเดือนปีเกิด</span>
          ${cat.code === 'child' ? `<span style="font-size:0.8rem; color:var(--accent);">* เงื่อนไข: อายุเด็กต้องอยู่ระหว่าง 2-11 ปี (ค.ศ. 2014 - 2024)</span>` : ''}
          ${cat.code === 'senior' ? `<span style="font-size:0.8rem; color:var(--accent);">* เงื่อนไข: อายุผู้สูงอายุต้องมีอายุ 60 ปีขึ้นไป (เกิดก่อน ค.ศ. 1966)</span>` : ''}
        </div>

        <!-- Nationality -->
        <div class="form-control">
          <label for="p${pIndex}-nationality" class="form-label">สัญชาติ <span class="sr-only">ของที่นั่ง ${seat}</span></label>
          <select id="p${pIndex}-nationality" class="form-input p-nationality-select" data-index="${pIndex}">
            <option value="thai" selected>ไทย (Thai)</option>
            <option value="other">ต่างชาติ / อื่น ๆ (Foreigner)</option>
          </select>
        </div>
      </div>

      <div class="form-grid-2col">
        <!-- National ID / Passport (Switches dynamically based on Nationality) -->
        <div class="form-control">
          <label id="lbl-p${pIndex}-id" for="p${pIndex}-id" class="form-label">หมายเลขประจำตัวประชาชน <span class="sr-only">ของที่นั่ง ${seat}</span></label>
          <input type="text" id="p${pIndex}-id" class="form-input" required placeholder="ระบุเลขประจำตัวประชาชน 13 หลัก">
          <span id="p${pIndex}-id-error" class="error-message-text" role="status">กรุณากรอกเลขบัตรประชาชน 13 หลักให้ถูกต้อง</span>
        </div>

        <!-- Phone number -->
        <div class="form-control">
          <label for="p${pIndex}-phone" class="form-label">เบอร์โทรศัพท์ <span class="sr-only">ของที่นั่ง ${seat}</span></label>
          <input type="tel" id="p${pIndex}-phone" class="form-input" placeholder="เช่น 0891234567">
          <span id="p${pIndex}-phone-error" class="error-message-text" role="status">กรุณากรอกเบอร์โทรศัพท์มือถือ 10 หลัก</span>
        </div>
      </div>

      <!-- Special assistance notice from previous page if checked -->
      <div id="p${pIndex}-special-assistance-display" style="display:none; background-color:var(--bg-light); border-left:4px solid var(--accent); padding:10px; margin-top:15px; border-radius:4px; font-size:0.9rem;">
        <strong>♿ ร้องขอความช่วยเหลือพิเศษเพิ่มเติมแล้ว:</strong>
        <span id="p${pIndex}-special-req-text">-</span>
      </div>
    `;

    dynamicContainer.appendChild(fieldset);

    // Setup Nationality toggle listener
    const natSelect = fieldset.querySelector(`.p-nationality-select`);
    natSelect.addEventListener('change', () => {
      toggleNationalityFields(pIndex, natSelect.value);
    });
  });

  function toggleNationalityFields(pIndex, val) {
    const lblId = document.getElementById(`lbl-p${pIndex}-id`);
    const inputId = document.getElementById(`p${pIndex}-id`);
    const errorId = document.getElementById(`p${pIndex}-id-error`);
    const seat = seatsArray[pIndex - 1] || '';

    if (val === 'thai') {
      lblId.innerHTML = `หมายเลขประจำตัวประชาชน <span class="sr-only">ของที่นั่ง ${seat}</span>`;
      inputId.placeholder = "ระบุเลขประจำตัวประชาชน 13 หลัก";
      errorId.textContent = "กรุณากรอกเลขบัตรประชาชน 13 หลักให้ถูกต้อง";
    } else {
      lblId.innerHTML = `หมายเลขหนังสือเดินทาง (Passport No.) <span class="sr-only">ของที่นั่ง ${seat}</span>`;
      inputId.placeholder = "ระบุเลขหนังสือเดินทางพาสปอร์ต";
      errorId.textContent = "กรุณากรอกเลขที่หนังสือเดินทางให้ถูกต้อง";
    }
  }

  // Pre-fill Passenger 1 Special Assistance box if carried from page 3
  if (seatsArray.length > 0) {
    let reqs = [];
    if (params.get('wheelchairSpace') === 'true') reqs.push("ต้องการพื้นที่จอดรถเข็น");
    if (params.get('boardingAssist') === 'true') reqs.push("ต้องการเจ้าหน้าที่ช่วยขึ้นรถ");
    if (params.get('guideDog') === 'true') reqs.push("มีสุนัขนำทางร่วมทาง");
    if (params.get('largeEquip') === 'true') reqs.push("มีอุปกรณ์ขนาดใหญ่");
    
    const extraNotes = params.get('specialNotes');
    if (extraNotes) reqs.push(`หมายเหตุ: "${extraNotes}"`);

    if (reqs.length > 0) {
      document.getElementById('p1-special-assistance-display').style.display = 'block';
      document.getElementById('p1-special-req-text').textContent = reqs.join(', ');
      
      // Auto pre-select "ต้องการเก้าอี้วีลแชร์" for passenger 1 prefix or defaults if needed
    }
  }


  // ----------------------------------------------------
  // 3. Contact Form: Copy Passenger 1 Details
  // ----------------------------------------------------
  const chkUseP1 = document.getElementById('chk-use-p1-info');
  const cNameInput = document.getElementById('contact-name');
  const cPhoneInput = document.getElementById('contact-phone');

  chkUseP1.addEventListener('change', () => {
    if (chkUseP1.checked) {
      // Fetch passenger 1 inputs
      const p1Name = document.getElementById('p1-name').value.trim();
      const p1Phone = document.getElementById('p1-phone').value.trim();

      if (!p1Name) {
        window.showToast('กรุณากรอกชื่อ - นามสกุล ของผู้โดยสารคนที่ 1 ก่อนเลือกตัวเลือกนี้', 'warning');
        chkUseP1.checked = false;
        return;
      }

      cNameInput.value = p1Name;
      cPhoneInput.value = p1Phone;
      announceA11y('คัดลอกข้อมูลผู้โดยสารคนที่ 1 ไปยังข้อมูลผู้ติดต่อเสร็จสิ้น');
    } else {
      cNameInput.value = '';
      cPhoneInput.value = '';
    }
  });


  // ----------------------------------------------------
  // 4. Dynamic Pricing Calculation for Additional Services
  // ----------------------------------------------------
  const srvInsurance = document.getElementById('srv-insurance');
  const srvBaggage = document.getElementById('srv-baggage');
  const srvMeal = document.getElementById('srv-meal');
  const srvTransfer = document.getElementById('srv-transfer');

  const servicesPriceLabel = document.getElementById('summary-services-price-label');
  const totalPriceLabel = document.getElementById('summary-total-price-label');
  
  let additionalServicesTotal = 0;
  let discountAmount = 0;
  const fees = 30; // Processing Fee

  function calculateTotals() {
    let servicesSum = 0;

    // Apply per-person or flat calculation
    // Insurance: 50 per person
    if (srvInsurance.checked) {
      servicesSum += 50 * totalPassengers;
    }
    // Baggage: 100 flat booking rate
    if (srvBaggage.checked) {
      servicesSum += 100;
    }
    // Meal: 80 per person
    if (srvMeal.checked) {
      servicesSum += 80 * totalPassengers;
    }
    // Transfer: 120 flat booking rate
    if (srvTransfer.checked) {
      servicesSum += 120;
    }

    additionalServicesTotal = servicesSum;
    servicesPriceLabel.textContent = `${additionalServicesTotal.toLocaleString()} บาท`;

    // Net Total sum
    const netTotal = priceParam + additionalServicesTotal + fees - discountAmount;
    totalPriceLabel.textContent = `${netTotal.toLocaleString()} บาท`;
    totalPriceLabel.setAttribute('aria-label', `ยอดเงินสุทธิที่ต้องชำระ ${netTotal} บาท`);
    
    // Announce to Screen Readers
    announceA11y(`คำนวณราคาใหม่เรียบร้อย ยอดชำระเงินสุทธิทั้งหมดคือ ${netTotal} บาท`);
  }

  // Bind change listeners to checkboxes
  [srvInsurance, srvBaggage, srvMeal, srvTransfer].forEach(cb => {
    cb.addEventListener('change', calculateTotals);
  });

  // Calculate first time
  calculateTotals();


  // ----------------------------------------------------
  // 5. Promo Code Voucher Box Logic
  // ----------------------------------------------------
  const promoInput = document.getElementById('promo-code-input');
  const btnApplyPromo = document.getElementById('btn-apply-promo');
  const promoStatus = document.getElementById('promo-status');
  const discountRow = document.getElementById('summary-discount-row');
  const discountLabel = document.getElementById('summary-discount-price-label');

  btnApplyPromo.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    promoStatus.className = 'error-message-text'; // default error style
    promoStatus.style.display = 'block';

    if (!code) {
      promoStatus.textContent = 'กรุณากรอกรหัสโปรโมชัน';
      clearDiscount();
      return;
    }

    if (code === 'RAINY10') {
      promoStatus.textContent = 'ใช้รหัสส่วนลดสำเร็จ! ส่วนลดตั๋วเดินทาง 10%';
      promoStatus.classList.add('success-text'); // Success color override
      promoStatus.style.color = 'var(--success)';
      
      // Calculate 10% discount on base price
      discountAmount = Math.floor(0.1 * priceParam);
      
      discountRow.style.display = 'flex';
      discountLabel.textContent = `-${discountAmount.toLocaleString()} บาท`;
      
      calculateTotals();
    } else {
      promoStatus.textContent = 'รหัสโปรโมชันไม่ถูกต้อง หรือสิ้นสุดระยะเวลาแคมเปญแล้ว';
      promoStatus.style.color = 'var(--error)';
      clearDiscount();
    }
  });

  function clearDiscount() {
    discountAmount = 0;
    discountRow.style.display = 'none';
    discountLabel.textContent = '-0 บาท';
    calculateTotals();
  }


  // ----------------------------------------------------
  // 6. Navigation Buttons
  // ----------------------------------------------------
  const btnBack = document.getElementById('btn-back-to-seats');
  btnBack.addEventListener('click', () => {
    // Preserve URL params and redirect back to Page 3
    const backQuery = new URLSearchParams(window.location.search).toString();
    window.location.href = `select-seat.html?${backQuery}`;
  });


  // ----------------------------------------------------
  // 7. Form Submission Validation (WCAG 3.3.1 Error Handling)
  // ----------------------------------------------------
  const mainForm = document.getElementById('passenger-info-form');
  const errorSummary = document.getElementById('error-summary');
  const errorSummaryList = document.getElementById('error-summary-list');

  mainForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear all previous errors
    errorSummary.style.display = 'none';
    errorSummaryList.innerHTML = '';
    
    const errors = [];
    const fieldsWithErrors = document.querySelectorAll('.form-input.error, select.error');
    fieldsWithErrors.forEach(el => el.classList.remove('error'));
    const activeMsgErrors = document.querySelectorAll('.error-message-text');
    activeMsgErrors.forEach(el => {
      if (el.id !== 'promo-status') el.style.display = 'none';
    });

    // 1. Validate each passenger info
    seatsArray.forEach((seat, index) => {
      const pIndex = index + 1;
      const cat = passengerCategories[index];

      // Prefix check
      const prefix = document.getElementById(`p${pIndex}-prefix`);
      if (!prefix.value) {
        errors.push({
          id: `p${pIndex}-prefix`,
          msg: `ผู้โดยสารคนที่ ${pIndex} (ที่นั่ง ${seat}): กรุณาเลือกคำนำหน้านาม`
        });
      }

      // Name check
      const name = document.getElementById(`p${pIndex}-name`);
      if (!name.value.trim() || name.value.trim().split(' ').length < 2) {
        errors.push({
          id: `p${pIndex}-name`,
          msg: `ผู้โดยสารคนที่ ${pIndex} (ที่นั่ง ${seat}): กรุณากรอกชื่อและนามสกุลจริงแยกด้วยเว้นวรรค`
        });
      }

      // DOB check
      const dob = document.getElementById(`p${pIndex}-dob`);
      if (!dob.value) {
        errors.push({
          id: `p${pIndex}-dob`,
          msg: `ผู้โดยสารคนที่ ${pIndex} (ที่นั่ง ${seat}): กรุณากรอกวันเดือนปีเกิด`
        });
      } else {
        // Validate category birth age limits
        const birthDate = new Date(dob.value);
        const today = new Date(2026, 6, 14); // Mock date 14 July 2026
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (cat.code === 'child') {
          if (age < 2 || age > 11) {
            errors.push({
              id: `p${pIndex}-dob`,
              msg: `ผู้โดยสารคนที่ ${pIndex} (ที่นั่ง ${seat}): วันเกิดไม่ตรงกับประเภทตั๋วเด็ก (อายุจริงคือ ${age} ปี เงื่อนไขตั๋วเด็กต้องอยู่ระหว่าง 2-11 ปี)`
            });
          }
        } else if (cat.code === 'senior') {
          if (age < 60) {
            errors.push({
              id: `p${pIndex}-dob`,
              msg: `ผู้โดยสารคนที่ ${pIndex} (ที่นั่ง ${seat}): วันเกิดไม่ตรงกับประเภทตั๋วผู้สูงอายุ (อายุจริงคือ ${age} ปี เงื่อนไขตั๋วผู้สูงอายุต้องมีอายุ 60 ปีบริบูรณ์ขึ้นไป)`
            });
          }
        }
      }

      // Nationality ID check
      const nationality = document.getElementById(`p${pIndex}-nationality`).value;
      const idVal = document.getElementById(`p${pIndex}-id`);
      
      if (nationality === 'thai') {
        const numbers = /^[0-9]+$/;
        if (!idVal.value.trim() || idVal.value.trim().length !== 13 || !idVal.value.match(numbers)) {
          errors.push({
            id: `p${pIndex}-id`,
            msg: `ผู้โดยสารคนที่ ${pIndex} (ที่นั่ง ${seat}): กรุณากรอกหมายเลขบัตรประชาชนให้ครบ 13 หลักเป็นตัวเลข`
          });
        }
      } else {
        if (!idVal.value.trim()) {
          errors.push({
            id: `p${pIndex}-id`,
            msg: `ผู้โดยสารคนที่ ${pIndex} (ที่นั่ง ${seat}): กรุณากรอกหมายเลขหนังสือเดินทาง (Passport No.)`
          });
        }
      }

      // Phone check
      const phone = document.getElementById(`p${pIndex}-phone`);
      if (phone.value.trim() && (phone.value.trim().length !== 10 || !phone.value.match(/^[0-9]+$/))) {
        errors.push({
          id: `p${pIndex}-phone`,
          msg: `ผู้โดยสารคนที่ ${pIndex} (ที่นั่ง ${seat}): รูปแบบหมายเลขโทรศัพท์มือถือไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก เช่น 0812345678)`
        });
      }
    });

    // 2. Validate Contact person
    if (!cNameInput.value.trim()) {
      errors.push({ id: 'contact-name', msg: 'ข้อมูลผู้ติดต่อ: กรุณากรอกชื่อและนามสกุลสำหรับติดต่อรับตั๋ว' });
    }
    
    if (!cPhoneInput.value.trim() || cPhoneInput.value.trim().length !== 10 || !cPhoneInput.value.match(/^[0-9]+$/)) {
      errors.push({ id: 'contact-phone', msg: 'ข้อมูลผู้ติดต่อ: กรุณากรอกเบอร์มือถือติดต่อ 10 หลักให้ถูกต้อง' });
    }
    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const cEmailInput = document.getElementById('contact-email').value.trim();
    if (!cEmailInput || !cEmailInput.match(emailPattern)) {
      errors.push({ id: 'contact-email', msg: 'ข้อมูลผู้ติดต่อ: รูปแบบอีเมลสำหรับส่งรายละเอียดตั๋วไม่ถูกต้อง' });
    }


    // 3. Validate terms acceptance
    const acceptTerms = document.getElementById('chk-accept-terms');
    if (!acceptTerms.checked) {
      errors.push({ id: 'chk-accept-terms', msg: 'ความยินยอม: กรุณาคลิกเลือกยอมรับเงื่อนไขการใช้บริการเพื่อดำเนินการชำระเงิน' });
    }

    // Process Errors
    if (errors.length > 0) {
      errorSummary.style.display = 'block';
      errorSummary.focus(); // Shift focus to error panel
      errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });

      errors.forEach(err => {
        // Highlight field
        const el = document.getElementById(err.id);
        if (el) {
          el.classList.add('error');
          // Show message text under field
          const feedbackText = el.parentNode.querySelector('.error-message-text');
          if (feedbackText) {
            feedbackText.style.display = 'block';
            feedbackText.textContent = err.msg.split(': ')[1] || err.msg;
          }
        }

        // Add to list at the top with clickable target links
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${err.id}`;
        a.textContent = err.msg;
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          if (el) el.focus();
        });
        li.appendChild(a);
        errorSummaryList.appendChild(li);
      });
      return;
    }

    // Redirect to Payment page (Page 5)
    // Gather and submit values
    const netPayTotal = priceParam + additionalServicesTotal + fees - discountAmount;
    const paymentParams = new URLSearchParams({
      tripId: tripId,
      seats: seatsParam,
      price: netPayTotal,
      adult: adultVal,
      child: childVal,
      senior: seniorVal,
      special: specialVal
    }).toString();

    window.location.href = `payment.html?${paymentParams}`;
  });


  // ----------------------------------------------------
  // 8. Screen Reader Live Announcements Helper
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
