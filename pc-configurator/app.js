document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. Light/Dark Theme Switcher
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  // Set theme from localStorage or system preference
  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.src = 'pc-config-assets-separate/ui/theme-sun.svg';
  } else {
    document.body.classList.remove('dark-theme');
    themeIcon.src = 'pc-config-assets-separate/ui/theme-moon.svg';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
      themeIcon.src = 'pc-config-assets-separate/ui/theme-sun.svg';
    } else {
      localStorage.setItem('theme', 'light');
      themeIcon.src = 'pc-config-assets-separate/ui/theme-moon.svg';
    }
  });

  /* ==========================================================================
     2. Mobile Menu Toggle
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ==========================================================================
     3. Scroll Animations (Intersection Observer)
     ========================================================================== */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add a slight stagger effect if multiple elements appear at the same time
        entry.target.classList.add('element-visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px' // triggers slightly before entering the screen
  });

  animatedElements.forEach((el, index) => {
    // Add dynamic inline transitions for grid items to stagger them
    if (el.parentElement.classList.contains('categories-grid') || 
        el.parentElement.classList.contains('why-us-grid') || 
        el.parentElement.classList.contains('benefits-grid')) {
      const delay = (index % 5) * 0.08;
      el.style.transitionDelay = `${delay}s`;
    }
    scrollObserver.observe(el);
  });

  /* ==========================================================================
     4. Mini-Configurator & Modal System
     ========================================================================== */
  const modal = document.getElementById('configurator-modal');
  const openConfigBtns = document.querySelectorAll('.open-config-btn');
  const openBuildBtns = document.querySelectorAll('.open-build-btn');
  const modalCloseBtn = document.getElementById('modal-close');
  
  // Select components inside Modal (All 10 categories)
  const cpuSelect = document.getElementById('cpu-select');
  const coolingSelect = document.getElementById('cooling-select');
  const mbSelect = document.getElementById('mb-select');
  const ramSelect = document.getElementById('ram-select');
  const gpuSelect = document.getElementById('gpu-select');
  const ssdSelect = document.getElementById('ssd-select');
  const caseSelect = document.getElementById('case-select');
  const psuSelect = document.getElementById('psu-select');
  const monitorSelect = document.getElementById('monitor-select');
  const peripheralsSelect = document.getElementById('peripherals-select');
  
  // Summary UI elements
  const componentsPriceEl = document.getElementById('summary-components-price');
  const totalPriceEl = document.getElementById('summary-total-price');
  const previewImgEl = document.getElementById('preview-pc-img');
  
  // Compatibility elements
  const compatSocketEl = document.getElementById('compat-socket');
  const compatRamEl = document.getElementById('compat-ram');
  const compatSizeEl = document.getElementById('compat-size');
  const compatCoolingEl = document.getElementById('compat-cooling');
  const compatPowerEl = document.getElementById('compat-power');
  const assistantTextEl = document.getElementById('assistant-text');
  const modalOrderBtn = document.getElementById('modal-order-btn');
  const successToast = document.getElementById('success-toast');

  // Pre-configured builds mapping (Including all 10 component choices)
  const buildsMapping = {
    'gaming-start': {
      cpu: 'i5-12400f',
      cooling: 'ag400',
      mb: 'b760',
      ram: '16gb-5200',
      gpu: 'rtx-4060',
      ssd: '1tb-m2',
      case: 'mistral',
      psu: '600w',
      monitor: 'none',
      peripherals: 'none'
    },
    'optimal-game': {
      cpu: 'r5-7600',
      cooling: 'ag400',
      mb: 'b650',
      ram: '32gb-6000',
      gpu: 'rtx-4070',
      ssd: '1tb-m2',
      case: 'cc560',
      psu: '750w',
      monitor: 'none',
      peripherals: 'none'
    },
    'enthusiast-pro': {
      cpu: 'i7-14700kf',
      cooling: 'lt720',
      mb: 'z790',
      ram: '32gb-6000',
      gpu: 'rtx-4080-super',
      ssd: '2tb-m2',
      case: 'nzxt-h9',
      psu: '850w',
      monitor: 'none',
      peripherals: 'none'
    },
    'esports-ultra': {
      cpu: 'i5-13600kf',
      cooling: 'ag400',
      mb: 'b760',
      ram: '32gb-6000',
      gpu: 'rtx-4060ti',
      ssd: '1tb-m2',
      case: 'cc560',
      psu: '750w',
      monitor: 'none',
      peripherals: 'none'
    },
    'white-stream': {
      cpu: 'r7-7800x3d',
      cooling: 'lt720',
      mb: 'b650',
      ram: '32gb-6000',
      gpu: 'rtx-4070super',
      ssd: '2tb-m2',
      case: 'lancool',
      psu: '750w',
      monitor: 'none',
      peripherals: 'none'
    },
    'powerful-workstation': {
      cpu: 'i9-14900kf',
      cooling: 'lt720',
      mb: 'z790',
      ram: '64gb-6000',
      gpu: 'rtx-4080-super',
      ssd: '4tb-m2',
      case: 'o11-dynamic',
      psu: '1000w',
      monitor: 'none',
      peripherals: 'none'
    },
    'budget-gaming': {
      cpu: 'i3-12100f',
      cooling: 'ag400',
      mb: 'b760',
      ram: '16gb-5200',
      gpu: 'gtx-1650',
      ssd: '512gb-nvme',
      case: 'mistral',
      psu: '500w',
      monitor: 'none',
      peripherals: 'none'
    },
    'maximum-evo': {
      cpu: 'i9-14900kf',
      cooling: 'ryujin',
      mb: 'z790',
      ram: '128gb-5600',
      gpu: 'rtx-4090',
      ssd: '4tb-m2',
      case: 'o11-dynamic',
      psu: '1200w',
      monitor: 'none',
      peripherals: 'none'
    },
    'balanced-rx': {
      cpu: 'r5-7600',
      cooling: 'ag400',
      mb: 'b650',
      ram: '32gb-6000',
      gpu: 'rx-7800xt',
      ssd: '1tb-m2',
      case: 'cc560',
      psu: '750w',
      monitor: 'none',
      peripherals: 'none'
    },
    'ultimate-amd': {
      cpu: 'r7-7800x3d',
      cooling: 'lt720',
      mb: 'x670',
      ram: '32gb-6000',
      gpu: 'rx-7900xtx',
      ssd: '2tb-m2',
      case: 'nzxt-h9',
      psu: '850w',
      monitor: 'none',
      peripherals: 'none'
    },
    'study-start': {
      cpu: 'i3-12100f',
      cooling: 'ag400',
      mb: 'b760',
      ram: '16gb-5200',
      gpu: 'none',
      ssd: '512gb-nvme',
      case: 'cc560',
      psu: '500w',
      monitor: 'none',
      peripherals: 'none'
    },
    'study-standard': {
      cpu: 'r5-5600',
      cooling: 'ag400',
      mb: 'b450',
      ram: '16gb-3200',
      gpu: 'gtx-1650',
      ssd: '512gb-nvme',
      case: 'mistral',
      psu: '500w',
      monitor: 'none',
      peripherals: 'none'
    },
    'study-pro': {
      cpu: 'i5-12400f',
      cooling: 'se-224',
      mb: 'b760',
      ram: '16gb-5200',
      gpu: 'gtx-1650',
      ssd: '512gb-nvme',
      case: 'cc560',
      psu: '600w',
      monitor: 'none',
      peripherals: 'none'
    },
    'study-plus': {
      cpu: 'r5-7600',
      cooling: 'se-224',
      mb: 'b650',
      ram: '32gb-6000',
      gpu: 'none',
      ssd: '1tb-m2',
      case: 'cc560',
      psu: '600w',
      monitor: 'none',
      peripherals: 'none'
    },
    'study-max': {
      cpu: 'i5-13600kf',
      cooling: 'se-224',
      mb: 'b760',
      ram: '32gb-6000',
      gpu: 'rtx-3060',
      ssd: '1tb-m2',
      case: 'cc560',
      psu: '700w',
      monitor: 'none',
      peripherals: 'none'
    }
  };

  // Open Modal function
  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
    calculateBuild();
  }

  // Close Modal function
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind Standard Config Buttons
  openConfigBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Reset all selects to "none" (not selected)
      cpuSelect.value = 'none';
      coolingSelect.value = 'none';
      mbSelect.value = 'none';
      ramSelect.value = 'none';
      gpuSelect.value = 'none';
      ssdSelect.value = 'none';
      caseSelect.value = 'none';
      psuSelect.value = 'none';
      monitorSelect.value = 'none';
      peripheralsSelect.value = 'none';
      
      openModal();
    });
  });

  // Bind Build-specific Config Buttons
  openBuildBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const buildId = btn.getAttribute('data-build');
      const buildPreset = buildsMapping[buildId];
      
      if (buildPreset) {
        // Load preset into selects
        cpuSelect.value = buildPreset.cpu;
        coolingSelect.value = buildPreset.cooling;
        mbSelect.value = buildPreset.mb;
        ramSelect.value = buildPreset.ram;
        gpuSelect.value = buildPreset.gpu;
        ssdSelect.value = buildPreset.ssd;
        caseSelect.value = buildPreset.case;
        psuSelect.value = buildPreset.psu;
        monitorSelect.value = buildPreset.monitor;
        peripheralsSelect.value = buildPreset.peripherals;
      }
      
      openModal();
    });
  });

  // Close Modal events
  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  let lastFocusedField = 'cpu';

  // Bind focus and changes on configurator dropdowns (All 10 select dropdowns)
  const selectsList = [
    { el: cpuSelect, key: 'cpu' },
    { el: coolingSelect, key: 'cooling' },
    { el: mbSelect, key: 'mb' },
    { el: ramSelect, key: 'ram' },
    { el: gpuSelect, key: 'gpu' },
    { el: ssdSelect, key: 'ssd' },
    { el: caseSelect, key: 'case' },
    { el: psuSelect, key: 'psu' },
    { el: monitorSelect, key: 'monitor' },
    { el: peripheralsSelect, key: 'peripherals' }
  ];

  selectsList.forEach(item => {
    if (item.el) {
      item.el.addEventListener('change', () => {
        lastFocusedField = item.key;
        calculateBuild();
      });
      item.el.addEventListener('focus', () => {
        lastFocusedField = item.key;
        calculateBuild();
      });
    }
  });

  // Main Calculation and Compatibility Verification
  function calculateBuild() {
    // 1. Get Selected Options
    const cpuOpt = cpuSelect.options[cpuSelect.selectedIndex];
    const coolingOpt = coolingSelect.options[coolingSelect.selectedIndex];
    const mbOpt = mbSelect.options[mbSelect.selectedIndex];
    const ramOpt = ramSelect.options[ramSelect.selectedIndex];
    const gpuOpt = gpuSelect.options[gpuSelect.selectedIndex];
    const ssdOpt = ssdSelect.options[ssdSelect.selectedIndex];
    const caseOpt = caseSelect.options[caseSelect.selectedIndex];
    const psuOpt = psuSelect.options[psuSelect.selectedIndex];
    const monitorOpt = monitorSelect.options[monitorSelect.selectedIndex];
    const peripheralsOpt = peripheralsSelect.options[peripheralsSelect.selectedIndex];

    // 2. Sum prices
    const cpuPrice = parseInt(cpuOpt.getAttribute('data-price')) || 0;
    const coolingPrice = parseInt(coolingOpt.getAttribute('data-price')) || 0;
    const mbPrice = parseInt(mbOpt.getAttribute('data-price')) || 0;
    const ramPrice = parseInt(ramOpt.getAttribute('data-price')) || 0;
    const gpuPrice = parseInt(gpuOpt.getAttribute('data-price')) || 0;
    const ssdPrice = parseInt(ssdOpt.getAttribute('data-price')) || 0;
    const casePrice = parseInt(caseOpt.getAttribute('data-price')) || 0;
    const psuPrice = parseInt(psuOpt.getAttribute('data-price')) || 0;
    const monitorPrice = parseInt(monitorOpt.getAttribute('data-price')) || 0;
    const peripheralsPrice = parseInt(peripheralsOpt.getAttribute('data-price')) || 0;

    const totalPrice = cpuPrice + coolingPrice + mbPrice + ramPrice + gpuPrice + ssdPrice + casePrice + psuPrice + monitorPrice + peripheralsPrice;
    
    // Format and output price
    const formattedPrice = totalPrice.toLocaleString('ru-RU') + ' ₽';
    componentsPriceEl.textContent = formattedPrice;
    totalPriceEl.textContent = formattedPrice;

    // 3. Compatibility Checks
    let compatibilityPassed = true;
    let assistantMessage = '';
    const cpuHasIntegrated = cpuOpt.getAttribute('data-has-integrated') === 'true';

    // A. Socket compatibility (CPU and Motherboard socket must match)
    const cpuSocket = cpuOpt.getAttribute('data-socket');
    const mbSocket = mbOpt.getAttribute('data-socket');
    const socketIndicator = compatSocketEl.querySelector('.status-indicator');
    const socketText = compatSocketEl.querySelector('.status-text');

    if (cpuOpt.value === 'none' || mbOpt.value === 'none') {
      socketIndicator.className = 'status-indicator neutral';
      socketText.textContent = 'Сокет процессора и платы';
    } else if (cpuSocket === mbSocket) {
      socketIndicator.className = 'status-indicator pass';
      socketText.textContent = `Сокет совпадает (Socket ${cpuSocket})`;
    } else {
      socketIndicator.className = 'status-indicator fail';
      socketText.textContent = `Несовместимость сокета! CPU: ${cpuSocket}, Плата: ${mbSocket}`;
      compatibilityPassed = false;
      assistantMessage = `<span class="error-msg">Ошибка сокета!</span> Выбранный процессор использует разъем (сокет) <strong>${cpuSocket}</strong>, а материнская плата — сокет <strong>${mbSocket}</strong>. Они не подключатся физически. Выберите плату с сокетом ${cpuSocket} или процессор с сокетом ${mbSocket}.`;
    }

    // A2. Discrete GPU check (if CPU has no integrated graphics and GPU is 'none')
    if (cpuOpt.value !== 'none' && gpuOpt.value === 'none' && !cpuHasIntegrated) {
      compatibilityPassed = false;
      if (!assistantMessage) {
        assistantMessage = `<span class="error-msg">Отсутствует видеокарта!</span> Выбранный вами процессор не имеет встроенного видеоядра (модели с суффиксом F/KF), поэтому для вывода изображения на экран обязательна дискретная видеокарта. Пожалуйста, выберите видеокарту в списке или замените процессор на модель со встроенной графикой.`;
      }
    }

    // B. RAM Type compatibility (DDR4 vs DDR5)
    const mbRamType = mbOpt.getAttribute('data-ram-type');
    const ramType = ramOpt.getAttribute('data-ram-type');
    const ramIndicator = compatRamEl.querySelector('.status-indicator');
    const ramText = compatRamEl.querySelector('.status-text');

    if (mbOpt.value === 'none' || ramOpt.value === 'none') {
      ramIndicator.className = 'status-indicator neutral';
      ramText.textContent = 'Поколение памяти (DDR4/DDR5)';
    } else if (mbRamType === ramType) {
      ramIndicator.className = 'status-indicator pass';
      ramText.textContent = `Память совместима (стандарт ${ramType})`;
    } else {
      ramIndicator.className = 'status-indicator fail';
      ramText.textContent = `Несовместимость памяти! Плата: ${mbRamType}, ОЗУ: ${ramType}`;
      compatibilityPassed = false;
      if (!assistantMessage) {
        assistantMessage = `<span class="error-msg">Ошибка стандарта памяти!</span> Выбранная материнская плата работает только с оперативной памятью <strong>${mbRamType}</strong>, а выбранная планка памяти относится к стандарту <strong>${ramType}</strong>. Пожалуйста, смените память на ${mbRamType}.`;
      }
    }

    // C. Form Factor Size compatibility (ATX vs mATX)
    const mbFormFactor = mbOpt.getAttribute('data-formfactor') || '';
    const caseSupported = caseOpt.getAttribute('data-supported-formfactors') || '';
    const sizeIndicator = compatSizeEl.querySelector('.status-indicator');
    const sizeText = compatSizeEl.querySelector('.status-text');

    if (mbOpt.value === 'none' || caseOpt.value === 'none') {
      sizeIndicator.className = 'status-indicator neutral';
      sizeText.textContent = 'Размер платы и корпуса';
    } else {
      const formFactorsList = caseSupported.split(' ');
      if (formFactorsList.includes(mbFormFactor)) {
        sizeIndicator.className = 'status-indicator pass';
        sizeText.textContent = `Форм-фактор подходит (${mbFormFactor} в корпусе ${caseOpt.value === 'mistral' || caseOpt.value === 'cylon' ? 'Mini-Tower' : 'Mid-Tower'})`;
      } else {
        sizeIndicator.className = 'status-indicator fail';
        sizeText.textContent = `Плата не влезает! Корпус не поддерживает ${mbFormFactor}`;
        compatibilityPassed = false;
        if (!assistantMessage) {
          assistantMessage = `<span class="error-msg">Ошибка размеров!</span> Материнская плата формата <strong>${mbFormFactor}</strong> физически больше, чем поддерживает выбранный вами компактный корпус (он рассчитан на платы до <strong>${caseSupported}</strong>). Выберите плату Micro-ATX (mATX) или смените корпус на Mid-Tower.`;
        }
      }
    }

    // D. Cooling TDP sufficiency check
    const cpuPower = parseInt(cpuOpt.getAttribute('data-power')) || 0;
    const coolingTdp = parseInt(coolingOpt.getAttribute('data-tdp')) || 0;
    const coolingIndicator = compatCoolingEl.querySelector('.status-indicator');
    const coolingText = compatCoolingEl.querySelector('.status-text');

    if (cpuOpt.value === 'none' || coolingOpt.value === 'none') {
      coolingIndicator.className = 'status-indicator neutral';
      coolingText.textContent = 'Достаточность охлаждения';
    } else {
      const requiredTdp = Math.ceil(cpuPower * 1.25);
      if (coolingTdp >= requiredTdp) {
        coolingIndicator.className = 'status-indicator pass';
        coolingText.textContent = `Охлаждения достаточно (TDP ${coolingTdp}W, нужно ≥${requiredTdp}W)`;
      } else {
        coolingIndicator.className = 'status-indicator warning';
        coolingText.textContent = `Слабый кулер! TDP ${coolingTdp}W, рекомендуется ≥${requiredTdp}W`;
        if (!assistantMessage) {
          assistantMessage = `<span class="warning-msg">Риск перегрева (Троттлинг)!</span> Выбранная система охлаждения рассчитана на TDP до <strong>${coolingTdp} Вт</strong>, а вашему процессору рекомендуется охлаждение мощностью не менее <strong>${requiredTdp} Вт</strong>. Выберите более мощный кулер или СЖО, чтобы процессор работал стабильно.`;
        }
      }
    }

    // E. PSU Wattage verification
    const gpuPower = parseInt(gpuOpt.getAttribute('data-power')) || 0;
    const psuWattage = parseInt(psuOpt.getAttribute('data-wattage')) || 0;
    const powerIndicator = compatPowerEl.querySelector('.status-indicator');
    const powerText = compatPowerEl.querySelector('.status-text');

    if (cpuOpt.value === 'none' || psuOpt.value === 'none' || (gpuOpt.value === 'none' && !cpuHasIntegrated)) {
      powerIndicator.className = 'status-indicator neutral';
      powerText.textContent = 'Мощность блока питания';
    } else {
      const requiredPower = Math.ceil((cpuPower + gpuPower) * 1.4);
      if (psuWattage >= requiredPower) {
        powerIndicator.className = 'status-indicator pass';
        powerText.textContent = `Мощности БП достаточно (${psuWattage}W, нужно ~${requiredPower}W)`;
      } else {
        powerIndicator.className = 'status-indicator fail';
        powerText.textContent = `Недостаточно мощности БП! Выбрано ${psuWattage}W, нужно ≥${requiredPower}W`;
        compatibilityPassed = false;
        if (!assistantMessage) {
          assistantMessage = `<span class="error-msg">Недостаточно мощности БП!</span> Энергопотребление процессора (${cpuPower} Вт) и видеокарты (${gpuPower} Вт) с учетом безопасного запаса 40% требует блока питания мощностью не менее <strong>${requiredPower} Вт</strong>. Текущий БП на ${psuWattage} Вт не справится под полной нагрузкой.`;
        }
      }
    }

    // F. Dynamic Assistant Focus Help (if no errors/warnings)
    if (!assistantMessage) {
      const fieldTips = {
        'cpu': `<strong>Процессор (CPU)</strong> — мозг компьютера. Игры любят высокую частоту ядер, а рабочие приложения (монтаж, 3D) — их количество. Для учебы берите Core i3 / Ryzen 5, для игр — Core i5 / Ryzen 5-7, для тяжелой работы — i7-i9 или Ryzen 9.`,
        'cooling': `<strong>Охлаждение процессора</strong> защищает его от перегрева. Для простых процессоров (i3/Ryzen 5) хватит недорогого воздушного кулера. Для Core i7/i9 и Ryzen 9 крайне рекомендуется система жидкостного охлаждения (СЖО) от 360мм.`,
        'mb': `<strong>Материнская плата</strong> объединяет все детали. Обратите внимание на сокет (разъем для CPU), поддерживаемое поколение памяти (DDR4 или DDR5) и форм-фактор размера (чтобы плата влезла в выбранный корпус).`,
        'ram': `<strong>Оперативная память (RAM)</strong> хранит временные файлы программ. 16 ГБ — сегодняшний стандарт для обычных ПК и простых игр. 32 ГБ — идеальный выбор под игры на ультра-настройках и стриминг. 64+ ГБ — для сложной работы.`,
        'gpu': `<strong>Видеокарта (GPU)</strong> — ключевая деталь в игровом компьютере. Для Full HD (1080p) гейминга достаточно RTX 4060, для 2K разрешения рекомендуется RTX 4070, а для бескомпромиссного 4K гейминга — RTX 4080 Super или RTX 4090.`,
        'ssd': `<strong>Быстрый NVMe SSD</strong> ускоряет загрузку Windows, игр и приложений в 10 раз по сравнению со старыми жесткими дисками. Оптимальный объем — 1 ТБ или 2 ТБ, чтобы хватило на систему и современную библиотеку игр.`,
        'case': `<strong>Корпус</strong> определяет внешний вид и охлаждение. Позаботьтесь о хорошей продуваемости (сетка спереди). Убедитесь, что размер корпуса (Mid-Tower или Mini-Tower) совпадает или больше размера выбранной материнской платы.`,
        'psu': `<strong>Блок питания (БП)</strong> питает весь ПК. Рекомендуем выбирать модели с сертификатом качества 80+ Gold и запасом мощности не менее 40% выше расчетного потребления процессора и видеокарты для тихой и стабильной работы.`,
        'monitor': `<strong>Монитор</strong>. Для бюджетных ПК берите 24 дюйма (1080p, IPS). Сбалансированный игровой или рабочий вариант — 27 дюймов (2K, IPS, 144Hz+). Для премиум сборок и работы с медиаконтентом выбирайте 32 дюйма с разрешением 4K.`,
        'peripherals': `<strong>Периферия</strong>. Мышь и клавиатура — органы управления вашим ПК. Геймерам рекомендуем механическую клавиатуру и мышь с качественным сенсором. Для работы и учебы отлично подойдут беспроводные тихие комплекты.`
      };

      assistantMessage = fieldTips[lastFocusedField] || `<strong>Привет!</strong> Я ваш умный помощник. Выберите любой компонент слева, и я подробно расскажу, как сделать лучший выбор и соберу совместимую конфигурацию.`;
    }

    // Output message to assistant panel
    if (assistantTextEl) {
      assistantTextEl.innerHTML = assistantMessage;
    }

    // C. Enable or disable order button based on compatibility & essential selections
    // Essential parts: CPU, Cooling, Motherboard, RAM, GPU, SSD, Case, PSU
    const essentialSelected = (
      cpuOpt.value !== 'none' &&
      coolingOpt.value !== 'none' &&
      mbOpt.value !== 'none' &&
      ramOpt.value !== 'none' &&
      (gpuOpt.value !== 'none' || cpuHasIntegrated) &&
      ssdOpt.value !== 'none' &&
      caseOpt.value !== 'none' &&
      psuOpt.value !== 'none'
    );

    if (compatibilityPassed && essentialSelected) {
      modalOrderBtn.disabled = false;
      modalOrderBtn.style.opacity = '1';
      modalOrderBtn.style.cursor = 'pointer';
    } else {
      modalOrderBtn.disabled = true;
      modalOrderBtn.style.opacity = '0.5';
      modalOrderBtn.style.cursor = 'not-allowed';
    }

    // 4. Update PC Visual Preview depending on Selected Parts
    // Swapping renders dynamically depending on choices to make the UI feel responsive
    if (cpuOpt.value === 'none' || (gpuOpt.value === 'none' && !cpuHasIntegrated)) {
      previewImgEl.src = 'pc-config-assets-separate/hero/hero-pc-white-rgb.png';
    } else if (gpuOpt.value === 'rtx-4080-super' || gpuOpt.value === 'rtx-4090' || cpuOpt.value === 'i9-14900kf' || caseOpt.value === 'nzxt-h9' || caseOpt.value === 'o11-dynamic') {
      previewImgEl.src = 'pc-config-assets-separate/builds/enthusiast-pro-build.png';
    } else if (gpuOpt.value === 'rtx-4070' || gpuOpt.value === 'rtx-4070super' || cpuOpt.value === 'r5-7600' || cpuOpt.value === 'r7-7800x3d') {
      previewImgEl.src = 'pc-config-assets-separate/builds/optimal-game-build.png';
    } else {
      previewImgEl.src = 'pc-config-assets-separate/builds/gaming-start-build.png';
    }
  }

  // Handle Order button click
  modalOrderBtn.addEventListener('click', () => {
    // Close modal
    closeModal();

    // Show Toast
    successToast.classList.add('active');

    // Hide Toast after 4 seconds
    setTimeout(() => {
      successToast.classList.remove('active');
    }, 4000);
  });

  // Handle Category click events (opens modal and presets parts accordingly!)
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      openModal();
      
      // Focus or highlight the select field inside the modal depending on category clicked
      let selectToFocus;
      if (category === 'cpu') selectToFocus = cpuSelect;
      if (category === 'cooling') selectToFocus = coolingSelect;
      if (category === 'motherboard') selectToFocus = mbSelect;
      if (category === 'ram') selectToFocus = ramSelect;
      if (category === 'gpu') selectToFocus = gpuSelect;
      if (category === 'ssd') selectToFocus = ssdSelect;
      if (category === 'case') selectToFocus = caseSelect;
      if (category === 'psu') selectToFocus = psuSelect;
      if (category === 'monitor') selectToFocus = monitorSelect;
      if (category === 'peripherals') selectToFocus = peripheralsSelect;
      
      if (selectToFocus) {
        setTimeout(() => {
          selectToFocus.focus();
          selectToFocus.style.outline = '2px solid var(--primary-blue)';
          
          // Remove custom outline on blur/interaction
          selectToFocus.addEventListener('blur', () => {
            selectToFocus.style.outline = '';
          }, { once: true });
        }, 100);
      }
    });
  });

  // Handle builds filtering (tabs + "Смотреть все" toggle)
  const tabButtons = document.querySelectorAll('.builds-tabs .tab-btn');
  const toggleBuildsBtn = document.getElementById('toggle-builds-btn');
  const buildCards = document.querySelectorAll('.build-card');
  let currentFilter = 'all';
  let showAllBuilds = false;

  function updateBuildsVisibility() {
    let visibleCount = 0;
    let matchingCount = 0;
    
    buildCards.forEach((card) => {
      const cardCats = card.getAttribute('data-categories') || '';
      const isExtra = card.classList.contains('extra-build');
      const matchesCategory = (currentFilter === 'all' || cardCats.split(' ').includes(currentFilter));

      // Determine if it should be shown
      let shouldShow = false;
      if (matchesCategory) {
        matchingCount++;
        
        if (currentFilter === 'all') {
          // On 'all' tab, respect the original 'extra-build' class
          if (!isExtra) {
            shouldShow = true;
          } else if (showAllBuilds) {
            shouldShow = true;
          }
        } else {
          // On a specific category tab, show the first 3 matching builds as main,
          // and treat the rest as extra (meaning they are hidden unless showAllBuilds is true)
          if (matchingCount <= 3) {
            shouldShow = true;
          } else if (showAllBuilds) {
            shouldShow = true;
          }
        }
      }

      if (shouldShow) {
        card.classList.remove('filtered-out');
        // Calculate transition delay dynamically for visible cards in grid
        const delayIndex = visibleCount % 3;
        card.style.transitionDelay = `${delayIndex * 0.08}s`;
        setTimeout(() => {
          card.classList.add('element-visible');
        }, 10);
        visibleCount++;
      } else {
        card.classList.add('filtered-out');
        card.classList.remove('element-visible');
      }
    });

    // Hide toggle button if there are no extra builds matching the selected category
    const totalMatching = Array.from(buildCards).filter(card => {
      const cardCats = card.getAttribute('data-categories') || '';
      return currentFilter === 'all' || cardCats.split(' ').includes(currentFilter);
    });
    
    const defaultShownLimit = (currentFilter === 'all') ? 
      Array.from(buildCards).filter(c => !c.classList.contains('extra-build')).length : 3;
      
    const hasExtras = totalMatching.length > defaultShownLimit;
    
    if (toggleBuildsBtn) {
      if (hasExtras) {
        toggleBuildsBtn.style.display = 'inline-block';
      } else {
        toggleBuildsBtn.style.display = 'none';
      }
    }
  }

  // Handle Tab Click
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      updateBuildsVisibility();
    });
  });

  // Handle "Смотреть все" click toggle
  if (toggleBuildsBtn) {
    toggleBuildsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showAllBuilds = !showAllBuilds;
      
      if (showAllBuilds) {
        toggleBuildsBtn.textContent = 'Скрыть';
      } else {
        toggleBuildsBtn.textContent = 'Смотреть все';
        document.getElementById('builds').scrollIntoView({ behavior: 'smooth' });
      }
      updateBuildsVisibility();
    });
  }

  // Initial call
  updateBuildsVisibility();


  /* ==========================================================================
     5. Auth Modal (Login / Registration) Logic
     ========================================================================== */
  const authModal = document.getElementById('auth-modal');
  const loginBtn = document.getElementById('login-btn');
  const authCloseBtn = document.getElementById('auth-close');
  
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Open Auth Modal
  if (loginBtn && authModal) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      authModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Default to login form
      switchToTab('login');
    });
  }

  // Close Auth Modal
  if (authCloseBtn && authModal) {
    authCloseBtn.addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        closeAuthModal();
      }
    });
  }

  function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Tab Switching
  function switchToTab(tab) {
    if (tab === 'login') {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    } else {
      tabLoginBtn.classList.remove('active');
      tabRegisterBtn.classList.add('active');
      loginForm.classList.remove('active');
      registerForm.classList.add('active');
    }
  }

  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => switchToTab('login'));
    tabRegisterBtn.addEventListener('click', () => switchToTab('register'));
  }

  // Password Visibility Toggle
  const passwordWrappers = document.querySelectorAll('.password-wrapper');
  passwordWrappers.forEach(wrapper => {
    const input = wrapper.querySelector('input');
    const toggleBtn = wrapper.querySelector('.password-toggle-btn');
    if (input && toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (input.type === 'password') {
          input.type = 'text';
          toggleBtn.textContent = 'Скрыть';
        } else {
          input.type = 'password';
          toggleBtn.textContent = 'Показать';
        }
      });
    }
  });

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAuthModal();
      
      // Update success toast texts dynamically
      const toastTitle = successToast.querySelector('h4');
      const toastText = successToast.querySelector('p');
      
      const originalTitle = toastTitle.textContent;
      const originalText = toastText.textContent;
      
      toastTitle.textContent = 'Вход выполнен!';
      toastText.textContent = 'Добро пожаловать в личный кабинет!';
      
      successToast.classList.add('active');
      
      setTimeout(() => {
        successToast.classList.remove('active');
        // Reset text back for configurator
        setTimeout(() => {
          toastTitle.textContent = originalTitle;
          toastText.textContent = originalText;
        }, 300);
      }, 4000);
    });
  }

  // Handle Registration Submit
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const password = document.getElementById('reg-password').value;
      const passwordConfirm = document.getElementById('reg-password-confirm').value;
      
      if (password !== passwordConfirm) {
        alert('Пароли не совпадают!');
        return;
      }
      
      closeAuthModal();
      
      const toastTitle = successToast.querySelector('h4');
      const toastText = successToast.querySelector('p');
      
      const originalTitle = toastTitle.textContent;
      const originalText = toastText.textContent;
      
      toastTitle.textContent = 'Регистрация успешна!';
      toastText.textContent = 'Ваш аккаунт успешно создан!';
      
      successToast.classList.add('active');
      
      setTimeout(() => {
        successToast.classList.remove('active');
        setTimeout(() => {
          toastTitle.textContent = originalTitle;
          toastText.textContent = originalText;
        }, 300);
      }, 4000);
    });
  }

  // Video explanation click trigger (simple alert or youtube/modal popup placeholder)
  const howItWorksBtn = document.getElementById('how-it-works-btn');
  if (howItWorksBtn) {
    howItWorksBtn.addEventListener('click', () => {
      alert('Видео-инструкция: "Как работает наш автоматический конфигуратор ПК" в разработке.');
    });
  }
  
});
