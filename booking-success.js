document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------
  // 1. Read URL Parameters & Trip Info
  // ----------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('tripId') || '1';
  const seatsParam = params.get('seats') || '';
  const priceParam = parseInt(params.get('price') || '0', 10);

  const seatsArray = seatsParam ? seatsParam.split(', ') : [];

  const tripsDb = {
    "1": { operator: "ไทยทริป เอ็กซ์เพรส", class: "VIP 24 ที่นั่ง", time: "20:30 น.", duration: "9 ชม. 30 นาที", busNo: "VIP-01", gate: "12", route: "กรุงเทพฯ (หมอชิต 2) ➔ เชียงใหม่ (อาเขต)" },
    "2": { operator: "ไทยทริป พรีเมียม", class: "ปรับอากาศ ม.4พ", time: "08:30 น.", duration: "6 ชม. 30 นาที", busNo: "PRE-08", gate: "5", route: "กรุงเทพฯ (หมอชิต 2) ➔ เชียงใหม่ (อาเขต)" },
    "3": { operator: "ไทยทริป โลคอล", class: "ปรับอากาศ ม.2", time: "13:00 น.", duration: "6 ชม. 30 นาที", busNo: "LOC-24", gate: "2", route: "กรุงเทพฯ (หมอชิต 2) ➔ เชียงใหม่ (อาเขต)" },
    "5": { operator: "ไทยทริป พรีเมียม", class: "ปรับอากาศ ม.4พ (ต่อรถ)", time: "22:00 น.", duration: "10 ชม. 15 นาที", busNo: "PRE-22", gate: "15", route: "กรุงเทพฯ (หมอชิต 2) ➔ เชียงใหม่ (อาเขต)" },
    "6": { operator: "ไทยทริป โลคอล", class: "รถตู้วีไอพี", time: "18:45 น.", duration: "7 ชม. 45 นาที", busNo: "VAN-06", gate: "3", route: "กรุงเทพฯ (หมอชิต 2) ➔ เชียงใหม่ (อาเขต)" }
  };

  const trip = tripsDb[tripId] || tripsDb["1"];


  // ----------------------------------------------------
  // 2. Generate Electronic Boarding Passes (Printable Cards)
  // ----------------------------------------------------
  const ticketsContainer = document.getElementById('boarding-pass-tickets-container');
  ticketsContainer.innerHTML = '';

  const mockNames = ["นายสมชาย ใจดี", "นางสาวสมหญิง รักดี", "เด็กชายหนูแดง แสนซน", "นางประคอง จิตสงบ"];
  
  if (seatsArray.length === 0) {
    // Fallback if no seats
    seatsArray.push("1A");
  }

  seatsArray.forEach((seat, idx) => {
    const tktNum = `TKT-${889102 + idx}`;
    const name = mockNames[idx % mockNames.length];

    const card = document.createElement('article');
    card.className = 'form-container-card';
    card.style.padding = '0';
    card.style.overflow = 'hidden';
    card.style.border = '2px solid var(--primary)';

    card.innerHTML = `
      <!-- Boarding Pass Header banner -->
      <div style="background-color: var(--primary); color: #ffffff; padding: 15px 24px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; opacity:0.85;">E-Ticket Boarding Pass</span>
          <h3 style="margin:0; font-size:1.25rem; font-weight:800; color:#ffffff;">ไทยทริป (Thai Trip)</h3>
        </div>
        <div style="text-align:right;">
          <span style="font-size:0.75rem; opacity:0.85;">หมายเลขตั๋ว</span>
          <div style="font-family:monospace; font-weight:bold; font-size:1.05rem;">${tktNum}</div>
        </div>
      </div>

      <!-- Boarding Pass Content Grid -->
      <div class="ticket-details-grid" style="padding: 24px; gap:20px; background-color:#ffffff;">
        <div>
          <span class="ticket-item-label">ชื่อผู้โดยสาร / Passenger Name</span>
          <p class="ticket-item-val" style="color:var(--primary); font-size:1.1rem;">${name}</p>
        </div>
        <div>
          <span class="ticket-item-label">ตำแหน่งที่นั่ง / Seat No.</span>
          <p class="ticket-item-val" style="color:var(--accent); font-size:1.25rem;">${seat}</p>
        </div>
        <div>
          <span class="ticket-item-label">เส้นทางเดินทาง / Route</span>
          <p class="ticket-item-val">${trip.route}</p>
        </div>
        <div>
          <span class="ticket-item-label">วันออกเดินทาง / Date</span>
          <p class="ticket-item-val">15 กรกฎาคม 2569</p>
        </div>
        <div>
          <span class="ticket-item-label">เวลาออกรถ / Departure Time</span>
          <p class="ticket-item-val" style="color:var(--success);">${trip.time}</p>
        </div>
        <div>
          <span class="ticket-item-label">ชานชาลา / Platform Gate</span>
          <p class="ticket-item-val">ชานชาลาที่ ${trip.gate}</p>
        </div>
        <div>
          <span class="ticket-item-label">หมายเลขรถ / Coach No.</span>
          <p class="ticket-item-val">${trip.busNo} (${trip.class})</p>
        </div>
        
        <!-- Ticket Validation QR code (SVG markup) -->
        <div style="display:flex; justify-content:center; align-items:center;">
          <div style="padding:8px; border:1px solid var(--border); border-radius:6px; text-align:center;">
            <svg width="70" height="70" viewBox="0 0 100 100" style="display:block; fill:var(--text-dark);" aria-label="คิวอาร์โค้ดสำหรับสแกนตรวจสอบตั๋วใบนี้">
              <rect x="5" y="5" width="25" height="25" />
              <rect x="70" y="5" width="25" height="25" />
              <rect x="5" y="70" width="25" height="25" />
              <rect x="40" y="40" width="20" height="20" />
              <rect x="15" y="45" width="10" height="10" />
              <rect x="75" y="75" width="20" height="20" />
            </svg>
            <span style="font-size:0.6rem; font-family:monospace; display:block; margin-top:4px; color:var(--text-muted);">SCAN CHECK</span>
          </div>
        </div>

        <!-- Emergency / Terms footer inside Boarding pass card -->
        <div style="grid-column: span 2; border-top:1px dotted var(--border); padding-top:15px; font-size:0.8rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
          <span>📞 สายด่วนฉุกเฉินบริการ 24 ชม.: <strong>02-123-4567</strong></span>
          <span>* กรุณาแสดงตั๋วนี้บนมือถือหรือพิมพ์กระดาษเพื่อสแกนขึ้นรถ</span>
        </div>
      </div>
    `;

    ticketsContainer.appendChild(card);
  });


  // ----------------------------------------------------
  // 3. Action Buttons Bind Events
  // ----------------------------------------------------
  
  // Print trigger
  document.getElementById('btn-print-tickets').addEventListener('click', () => {
    window.print();
  });

  // Email simulation
  document.getElementById('btn-email-tickets').addEventListener('click', () => {
    alert('จำลองการจัดส่งรายละเอียดตั๋ว E-Ticket และสลิปใบเสร็จชำระเงินไปยังอีเมลติดต่อ: somchaimail@mail.com สำเร็จแล้ว!');
  });

  // Calendar simulation
  document.getElementById('btn-add-calendar').addEventListener('click', () => {
    alert('จำลองการเพิ่มรอบเดินทางรถทัวร์ไทยทริป (15 กรกฎาคม 2569 เวลา ' + trip.time + ') ลงในตารางปฏิทิน Google/Apple Calendar ของคุณเสร็จสิ้น');
  });

});
