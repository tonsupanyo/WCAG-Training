document.addEventListener('DOMContentLoaded', () => {
  
  // ----------------------------------------------------
  // 1. One-way vs Round-trip Toggle
  // ----------------------------------------------------
  const oneWayRadio = document.getElementById('trip-one-way');
  const roundTripRadio = document.getElementById('trip-round');
  const retDateInput = document.getElementById('ret-date');
  const retDateLabel = document.getElementById('ret-date-label');
  const retDateGroup = document.getElementById('ret-date-group');

  function updateReturnDateState() {
    if (oneWayRadio.checked) {
      retDateInput.disabled = true;
      retDateInput.removeAttribute('required');
      retDateLabel.style.opacity = '0.5';
      retDateGroup.style.opacity = '0.5';
      retDateInput.value = '';
    } else {
      retDateInput.disabled = false;
      retDateInput.setAttribute('required', '');
      retDateLabel.style.opacity = '1';
      retDateGroup.style.opacity = '1';
    }
  }

  oneWayRadio.addEventListener('change', updateReturnDateState);
  roundTripRadio.addEventListener('change', updateReturnDateState);
  
  // Set initial state
  updateReturnDateState();

  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dep-date').min = today;
  document.getElementById('dep-date').value = today;
  retDateInput.min = today;


  // ----------------------------------------------------
  // 2. Combobox Autocomplete (Origin & Destination)
  // ----------------------------------------------------
  const stations = [
    "กรุงเทพฯ (หมอชิต 2)",
    "กรุงเทพฯ (เอกมัย)",
    "กรุงเทพฯ (สายใต้ใหม่)",
    "เชียงใหม่ (อาเขต)",
    "ขอนแก่น (บขส. 3)",
    "ภูเก็ต (บขส. 2)",
    "นครราชสีมา (บขส. 2)",
    "เชียงราย (บขส.)",
    "หาดใหญ่ (บขส. 2)",
    "ชลบุรี (บขส.)",
    "พัทยา (บขส.)",
    "อุดรธานี (บขส.)"
  ];

  function setupAutocomplete(inputId, listboxId) {
    const input = document.getElementById(inputId);
    const listbox = document.getElementById(listboxId);
    let activeIndex = -1;
    let filteredList = [];

    function renderOptions(items) {
      listbox.innerHTML = '';
      if (items.length === 0) {
        listbox.style.display = 'none';
        input.setAttribute('aria-expanded', 'false');
        return;
      }

      items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'listbox-option';
        li.id = `${inputId}-opt-${index}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.textContent = item;
        
        li.addEventListener('click', () => {
          selectOption(index);
        });

        listbox.appendChild(li);
      });

      listbox.style.display = 'block';
      input.setAttribute('aria-expanded', 'true');
    }

    function selectOption(index) {
      if (index >= 0 && index < filteredList.length) {
        input.value = filteredList[index];
        closeListbox();
      }
    }

    function closeListbox() {
      listbox.style.display = 'none';
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      activeIndex = -1;
    }

    function updateHighlight() {
      const options = listbox.querySelectorAll('.listbox-option');
      options.forEach((opt, idx) => {
        if (idx === activeIndex) {
          opt.classList.add('focused');
          opt.setAttribute('aria-selected', 'true');
          opt.scrollIntoView({ block: 'nearest' });
          input.setAttribute('aria-activedescendant', opt.id);
        } else {
          opt.classList.remove('focused');
          opt.setAttribute('aria-selected', 'false');
        }
      });
    }

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        filteredList = [];
        closeListbox();
        return;
      }
      
      filteredList = stations.filter(station => station.toLowerCase().includes(query));
      activeIndex = -1;
      renderOptions(filteredList);
    });

    input.addEventListener('keydown', (e) => {
      const isOpen = listbox.style.display === 'block';

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          filteredList = stations;
          renderOptions(filteredList);
        }
        if (filteredList.length > 0) {
          activeIndex = (activeIndex + 1) % filteredList.length;
          updateHighlight();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isOpen && filteredList.length > 0) {
          activeIndex = activeIndex - 1 < 0 ? filteredList.length - 1 : activeIndex - 1;
          updateHighlight();
        }
      } else if (e.key === 'Enter') {
        if (isOpen && activeIndex >= 0) {
          e.preventDefault();
          selectOption(activeIndex);
        }
      } else if (e.key === 'Escape') {
        if (isOpen) {
          e.preventDefault();
          closeListbox();
        }
      }
    });

    // Close listbox on outside click
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !listbox.contains(e.target)) {
        closeListbox();
      }
    });

    // Support screen reader focus behavior
    input.addEventListener('focus', () => {
      // Show default list on focus if empty
      if (!input.value) {
        filteredList = stations;
        renderOptions(filteredList);
      }
    });
  }

  setupAutocomplete('origin-input', 'origin-listbox');
  setupAutocomplete('dest-input', 'dest-listbox');


  // ----------------------------------------------------
  // 3. Passenger Counters (Adult, Child, Senior, Special)
  // ----------------------------------------------------
  const counters = [
    { type: 'adult', min: 1, max: 9 },
    { type: 'child', min: 0, max: 9 },
    { type: 'senior', min: 0, max: 9 },
    { type: 'special', min: 0, max: 4 }
  ];

  counters.forEach(counter => {
    const decBtn = document.getElementById(`dec-${counter.type}`);
    const incBtn = document.getElementById(`inc-${counter.type}`);
    const valSpan = document.getElementById(`val-${counter.type}`);

    function updateButtons() {
      const val = parseInt(valSpan.textContent, 10);
      decBtn.disabled = val <= counter.min;
      incBtn.disabled = val >= counter.max;
    }

    decBtn.addEventListener('click', () => {
      let val = parseInt(valSpan.textContent, 10);
      if (val > counter.min) {
        valSpan.textContent = --val;
        updateButtons();
        announceCounterChange(counter.type, val);
      }
    });

    incBtn.addEventListener('click', () => {
      let val = parseInt(valSpan.textContent, 10);
      if (val < counter.max) {
        valSpan.textContent = ++val;
        updateButtons();
        announceCounterChange(counter.type, val);
      }
    });

    // Initial button state
    updateButtons();
  });

  function announceCounterChange(type, value) {
    let name = '';
    switch(type) {
      case 'adult': name = 'ผู้ใหญ่'; break;
      case 'child': name = 'เด็ก'; break;
      case 'senior': name = 'ผู้สูงอายุ'; break;
      case 'special': name = 'ผู้ต้องการความช่วยเหลือพิเศษ'; break;
    }
    
    // Announce value to screen readers using live region
    let liveRegion = document.getElementById('a11y-announcer');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-announcer';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = `ปรับจำนวนผู้โดยสารประเภท ${name} เป็น ${value} คน`;
  }


  // ----------------------------------------------------
  // 4. Carousel (Auto-sliding & Play/Pause Controls)
  // ----------------------------------------------------
  const carousel = document.getElementById('promo-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-item');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const playPauseBtn = document.getElementById('carousel-play-pause');
    const playPauseText = playPauseBtn.querySelector('.play-pause-text');
    const slidesContainer = document.getElementById('carousel-slides');

    let currentIndex = 0;
    let autoPlayInterval = null;
    let isPlaying = true;

    function showSlide(index) {
      slides[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');
      dots[currentIndex].setAttribute('aria-selected', 'false');

      currentIndex = (index + slides.length) % slides.length;

      slides[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
      dots[currentIndex].setAttribute('aria-selected', 'true');
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 5000);
      isPlaying = true;
      playPauseText.textContent = '⏸ หยุด';
      playPauseBtn.setAttribute('aria-label', 'หยุดเล่นสไลด์อัตโนมัติ');
      slidesContainer.setAttribute('aria-live', 'off'); // Silent when moving automatically
    }

    function pauseAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      isPlaying = false;
      playPauseText.textContent = '▶ เล่น';
      playPauseBtn.setAttribute('aria-label', 'เริ่มเล่นสไลด์อัตโนมัติ');
      slidesContainer.setAttribute('aria-live', 'polite'); // Announce manually selected slides
    }

    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseAutoPlay();
      } else {
        startAutoPlay();
      }
    });

    prevBtn.addEventListener('click', () => {
      pauseAutoPlay();
      prevSlide();
    });

    nextBtn.addEventListener('click', () => {
      pauseAutoPlay();
      nextSlide();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        pauseAutoPlay();
        showSlide(index);
      });
    });

    // Pause carousel on hover or keyboard focus to comply with WCAG
    carousel.addEventListener('mouseenter', () => {
      if (isPlaying) {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
      }
    });

    carousel.addEventListener('mouseleave', () => {
      if (isPlaying) {
        autoPlayInterval = setInterval(nextSlide, 5000);
      }
    });

    // Start auto slide initially
    startAutoPlay();
  }


  // ----------------------------------------------------
  // 5. FAQ Accordion
  // ----------------------------------------------------
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const contentId = trigger.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      
      // Close other accordion items if desired (we keep them independent for better usability)
      trigger.setAttribute('aria-expanded', !isExpanded);
      if (content) {
        content.hidden = isExpanded;
      }
    });
  });

});
