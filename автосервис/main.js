/**
 * Autodrive Service - Interactive Script
 */

const init = () => {
  
  // ==========================================================================
  // MOBILE MENU (HAMBURGER / DRAWER)
  // ==========================================================================
  const hamburgerTrigger = document.getElementById('hamburger-trigger');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const drawerBookingBtn = document.getElementById('drawer-booking-btn');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerTrigger) hamburgerTrigger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
  if (drawerBookingBtn) drawerBookingBtn.addEventListener('click', closeDrawer);

  // ==========================================================================
  // STICKY HEADER & SCROLLSPY
  // ==========================================================================
  const navBar = document.getElementById('nav-bar');
  const navLinks = document.querySelectorAll('.nav-menu__link');
  const sections = document.querySelectorAll('section, footer');
  const headerTop = document.querySelector('.header__top');
  
  const headerOffset = headerTop ? headerTop.offsetHeight : 60;

  window.addEventListener('scroll', () => {
    // Sticky logic
    if (navBar) {
      if (window.scrollY > headerOffset) {
        navBar.classList.add('sticky');
      } else {
        navBar.classList.remove('sticky');
      }
    }

    // Scrollspy logic
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 160; // Offset for active class trigger

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Special case for top
    if (window.scrollY < 100) {
      currentSectionId = 'home';
    }

    if (currentSectionId) {
      // Clean up first
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
      
      drawerLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // ==========================================================================
  // SMOOTH ANCHOR SCROLLING WITH OFFSET
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offsetPosition = targetElement.offsetTop - 80; // Align with header-collapsed padding
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // CAR BRANDS DYNAMIC MODELS SELECTOR
  // ==========================================================================
  const carModelsData = {
    'BMW': ['3-Series', '5-Series', '7-Series', 'X3', 'X5', 'X6', 'M3', 'M5'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'AMG GT'],
    'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron'],
    'Volkswagen': ['Polo', 'Golf', 'Passat', 'Jetta', 'Tiguan', 'Touareg', 'Teramont'],
    'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Land Cruiser 200', 'Land Cruiser 300', 'Hilux'],
    'Lexus': ['IS', 'ES', 'GS', 'LS', 'NX', 'RX', 'GX', 'LX'],
    'Hyundai': ['Solaris', 'Elantra', 'Sonata', 'Creta', 'Tucson', 'Santa Fe', 'Palisade'],
    'KIA': ['Picanto', 'Rio', 'Ceed', 'Cerato', 'K5', 'Sportage', 'Sorento', 'Mohave'],
    'Nissan': ['Almera', 'Sentra', 'Juke', 'Qashqai', 'X-Trail', 'Murano', 'Patrol'],
    'Ford': ['Fiesta', 'Focus', 'Mondeo', 'EcoSport', 'Kuga', 'Explorer', 'Mustang']
  };

  const carBrandSelect = document.getElementById('car-brand');
  const carModelSelect = document.getElementById('car-model');

  if (carBrandSelect && carModelSelect) {
    carBrandSelect.addEventListener('change', function() {
      const selectedBrand = this.value;
      
      // Reset model dropdown
      carModelSelect.innerHTML = '<option value="" disabled selected>Выберите модель</option>';
      
      if (selectedBrand && carModelsData[selectedBrand]) {
        carModelSelect.disabled = false;
        
        carModelsData[selectedBrand].forEach(model => {
          const option = document.createElement('option');
          option.value = model;
          option.textContent = model;
          carModelSelect.appendChild(option);
        });
      } else {
        carModelSelect.disabled = true;
      }
    });
  }

  // Pre-fill service from Service Card arrows
  const serviceArrows = document.querySelectorAll('.service-card__arrow');
  const bookingServiceSelect = document.getElementById('booking-service');

  serviceArrows.forEach(arrow => {
    arrow.addEventListener('click', function(e) {
      const requestedService = this.getAttribute('data-service');
      if (requestedService && bookingServiceSelect) {
        bookingServiceSelect.value = requestedService;
      }
    });
  });

  // Pre-fill service from footer quick links
  const footerServiceLinks = document.querySelectorAll('[data-scroll-to-service]');
  footerServiceLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const requestedService = this.getAttribute('data-scroll-to-service');
      if (requestedService && bookingServiceSelect) {
        bookingServiceSelect.value = requestedService;
      }
      
      const targetElement = document.getElementById('booking');
      if (targetElement) {
        const offsetPosition = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Set min date for datepicker to today
  const bookingDateInput = document.getElementById('booking-date');
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS SYSTEM
  // ==========================================================================
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, duration = 3000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>${message}</span>
      <button style="color: rgba(255,255,255,0.5); font-size:16px; margin-left: 10px;" class="toast-close">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  // ==========================================================================
  // MODALS CONTROL
  // ==========================================================================
  const modals = document.querySelectorAll('.modal');
  
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Attach generic close buttons
  document.querySelectorAll('[data-modal-close], .modal__close, .modal__overlay').forEach(element => {
    element.addEventListener('click', function(e) {
      // If clicking overlay, ensure it's not clicking container inside it
      if (this.classList.contains('modal__overlay') && e.target !== this) {
        return;
      }
      const modal = this.closest('.modal');
      closeModal(modal);
    });
  });

  // Modal confirm buttons (Close modal)
  const successClose = document.getElementById('success-close');
  const infoConfirm = document.getElementById('info-confirm');
  if (successClose) successClose.addEventListener('click', () => closeModal(successClose.closest('.modal')));
  if (infoConfirm) infoConfirm.addEventListener('click', () => closeModal(infoConfirm.closest('.modal')));

  // Trigger Callback Modal
  const callbackTrigger = document.getElementById('callback-trigger');
  const ctaConsultTrigger = document.getElementById('cta-consult-trigger');

  if (callbackTrigger) {
    callbackTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('callback-modal');
    });
  }

  if (ctaConsultTrigger) {
    ctaConsultTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('callback-modal');
    });
  }

  // Trigger Info Modals (Privacy & Terms)
  const privacyTrigger = document.getElementById('privacy-trigger');
  const termsTrigger = document.getElementById('terms-trigger');
  const aboutMoreTrigger = document.getElementById('about-more-trigger');
  const infoModalTitle = document.getElementById('info-modal-title');
  const infoModalBody = document.getElementById('info-modal-body');

  const textResources = {
    privacy: `
      <h3>Политика конфиденциальности</h3>
      <p>Настоящая Политика конфиденциальности регулирует порядок сбора, использования, хранения и раскрытия информации, полученной от пользователей веб-сайта Autodrive Service.</p>
      <p><strong>1. Сбор персональных данных</strong><br>Мы собираем персональные данные (такие как имя, адрес электронной почты, номер телефона и параметры автомобиля) только тогда, когда пользователи добровольно предоставляют нам эту информацию при заполнении форм записи на обслуживание, заказе обратного звонка или подписке на рассылку.</p>
      <p><strong>2. Использование персональных данных</strong><br>Предоставленная информация используется исключительно для подтверждения записи на ремонт, обработки заявок, консультирования пользователей, повышения качества обслуживания и отправки новостей об акциях и спецпредложениях (при согласии пользователя).</p>
      <p><strong>3. Защита информации</strong><br>Мы принимаем надлежащие меры безопасности для защиты ваших персональных данных от несанкционированного доступа, изменения или раскрытия. Мы никогда не продаем и не передаем ваши данные третьим лицам.</p>
    `,
    terms: `
      <h3>Пользовательское соглашение</h3>
      <p>Добро пожаловать на веб-сайт Autodrive Service. Пользуясь данным ресурсом, вы соглашаетесь с условиями настоящего Пользовательского соглашения.</p>
      <p><strong>1. Использование сайта</strong><br>Контент сайта предоставляется исключительно в ознакомительных целях. Цены, перечень услуг и условия акций носят справочный характер и не являются публичной офертой.</p>
      <p><strong>2. Запись на сервис</strong><br>Отправка онлайн-формы бронирования не гарантирует автоматическое резервирование времени. Запись считается подтвержденной только после звонка нашего менеджера.</p>
      <p><strong>3. Интеллектуальная собственность</strong><br>Все текстовые и графические материалы, товарные знаки и элементы дизайна, представленные на сайте, являются собственностью Autodrive Service. Любое копирование материалов запрещено.</p>
    `,
    about: `
      <h3>О компании Autodrive Service</h3>
      <p>Autodrive Service — это сертифицированный мультибрендовый технический центр, основанный в 2016 году. Мы специализируемся на диагностике, плановом техническом обслуживании и ремонте легковых автомобилей и легкого коммерческого транспорта зарубежного производства.</p>
      <p><strong>Наши стандарты качества:</strong></p>
      <ul>
        <li>Использование новейших диагностических сканеров и дилерского софта.</li>
        <li>Работа по регламенту заводов-изготовителей.</li>
        <li>Прозрачное ценообразование: согласование стоимости до начала ремонта.</li>
        <li>Собственный склад запчастей (оригиналы и проверенные аналоги).</li>
        <li>Гарантия на все виды слесарных работ и запчастей до 24 месяцев.</li>
      </ul>
      <p>Мы ценим каждого клиента и заботимся о безопасности вашего передвижения!</p>
    `
  };

  function showInfoModal(type) {
    if (infoModalTitle && infoModalBody && textResources[type]) {
      if (type === 'privacy') infoModalTitle.textContent = 'Политика конфиденциальности';
      if (type === 'terms') infoModalTitle.textContent = 'Пользовательское соглашение';
      if (type === 'about') infoModalTitle.textContent = 'Подробнее о нас';
      
      infoModalBody.innerHTML = textResources[type];
      openModal('info-modal');
    }
  }

  if (privacyTrigger) privacyTrigger.addEventListener('click', () => showInfoModal('privacy'));
  if (termsTrigger) termsTrigger.addEventListener('click', () => showInfoModal('terms'));
  if (aboutMoreTrigger) aboutMoreTrigger.addEventListener('click', () => showInfoModal('about'));

  // Trigger News Modals
  const newsCards = document.querySelectorAll('.news-card');
  const newsDetailData = {
    '1': {
      title: 'Как подготовить авто к летнему сезону',
      content: `
        <p>Наступление летнего зноя — серьезное испытание для систем охлаждения, кондиционирования и колес вашего автомобиля. Чтобы избежать непредвиденных поломок на трассе в жаркий день, специалисты Autodrive Service советуют выполнить следующие процедуры:</p>
        <p><strong>1. Проверка кондиционера.</strong> С течением времени фреон испаряется. Рекомендуется раз в год очищать конденсор от грязи и дозаправлять хладагент с добавлением компрессорного масла.</p>
        <p><strong>2. Контроль охлаждающей жидкости.</strong> Осмотрите патрубки на предмет микротрещин, проверьте уровень антифриза в бачке. Езда со старым антифризом грозит перегревом головки блока цилиндров.</p>
        <p><strong>3. Проверка давления в шинах.</strong> При нагревании воздуха в шине давление растет. Отрегулируйте его в соответствии с табличкой на стойке двери на холодных шинах.</p>
        <p><strong>4. Замена стеклоочистителей.</strong> После зимы резинки щеток стираются об обледенелое стекло и начинают оставлять разводы, ухудшая видимость во время летних гроз.</p>
      `
    },
    '2': {
      title: 'Почему важна регулярная диагностика',
      content: `
        <p>Современные автомобили напичканы электронными датчиками и сложными узлами. Загорание лампочки Check Engine — это уже крайняя стадия, когда блок управления зафиксировал стабильный сбой. Регулярная компьютерная диагностика позволяет распознать неисправность до того, как деталь выйдет из строя полностью.</p>
        <p><strong>Преимущества регулярной диагностики:</strong></p>
        <ul>
          <li><strong>Безопасность.</strong> Оценка состояния тормозов, рулевого управления и подушек безопасности.</li>
          <li><strong>Экономия бюджета.</strong> Заметить изношенный пыльник шруса за 500 рублей проще и дешевле, чем менять весь шрус за 15 000 рублей.</li>
          <li><strong>Стабильность работы.</strong> Выявление пропусков зажигания, засорения форсунок или износа свечей помогает вернуть двигателю заводскую тягу.</li>
        </ul>
        <p>Мы рекомендуем делать полную компьютерную диагностику автомобиля каждые 10-15 тысяч километров пробега (совмещая с заменой моторного масла).</p>
      `
    },
    '3': {
      title: 'Замена масла: как часто это нужно делать?',
      content: `
        <p>Масло в двигателе выполняет роль не только смазки, но и охлаждает детали поршневой группы, улавливает нагар и удерживает его во взвешенном состоянии. Со временем пакет присадок вырабатывается, масло окисляется и теряет свои защитные свойства.</p>
        <p><strong>Каковы реальные интервалы замены?</strong></p>
        <p>Маркетинговые лозунги дилеров про 15 000 км рассчитаны на идеальные автобаны. В реалиях городских пробок Москвы (с постоянным режимом Старт-Стоп) масло вырабатывает моторесурсы намного быстрее. <strong>Оптимальный интервал замены масла в мегаполисе — 7 500 - 8 000 км пробега или 250 моточасов.</strong></p>
        <p>Также не забывайте своевременно менять фильтры: масляный меняется строго вместе с маслом, воздушный — каждое ТО, салонный — дважды в год (перед началом лета и после зимы).</p>
      `
    },
    '4': {
      title: 'Акция: бесплатная проверка тормозов',
      content: `
        <p>Безопасность клиентов — наш главный приоритет! До конца месяца технический центр Autodrive Service проводит акцию: бесплатную комплексную ревизию элементов тормозной системы при выполнении любых слесарных работ по ходовой части автомобиля.</p>
        <p><strong>Что входит в инспекцию:</strong></p>
        <ul>
          <li>Замер толщины фрикционного слоя тормозных колодок.</li>
          <li>Измерение износа и биения тормозных дисков.</li>
          <li>Оценка целостности резиновых пыльников и направляющих суппортов.</li>
          <li>Тестирование тормозной жидкости на процент содержания влаги с помощью прибора.</li>
          <li>Визуальная проверка герметичности тормозных трубок и шлангов.</li>
        </ul>
        <p>Тормозная жидкость гигроскопична (впитывает влагу). Если прибор покажет уровень влаги более 3%, жидкость необходимо срочно заменить, так как во время экстренного торможения она может закипеть, и педаль тормоза провалится. Запишитесь на проверку уже сегодня!</p>
      `
    }
  };

  newsCards.forEach(card => {
    const link = card.querySelector('.news-card__link');
    const newsId = card.getAttribute('data-news-id');
    
    if (link && newsId && newsDetailData[newsId]) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const data = newsDetailData[newsId];
        const newsTitleElement = document.getElementById('info-modal-title');
        const newsBodyElement = document.getElementById('info-modal-body');
        
        if (newsTitleElement && newsBodyElement) {
          newsTitleElement.textContent = data.title;
          newsBodyElement.innerHTML = data.content;
          openModal('info-modal');
        }
      });
    }
  });

  // ==========================================================================
  // FORM SUBMISSIONS & VALIDATION
  // ==========================================================================
  
  // Booking Form Submission
  const bookingForm = document.getElementById('booking-service-form');
  const successModalBody = document.getElementById('success-modal-body');

  if (bookingForm) {
    let bookingData = {};

    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      bookingData.brand = document.getElementById('car-brand').value;
      bookingData.model = document.getElementById('car-model').value;
      bookingData.year = document.getElementById('car-year').value;
      bookingData.service = document.getElementById('booking-service').value;
      bookingData.date = document.getElementById('booking-date').value;
      bookingData.time = document.getElementById('booking-time').value;
      
      // Open the booking-confirm-modal to get the phone number
      openModal('booking-confirm-modal');
    });

    const bookingConfirmForm = document.getElementById('booking-confirm-form');
    if (bookingConfirmForm) {
      bookingConfirmForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('booking-phone').value;
        const formattedDate = new Date(bookingData.date).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        // Prepare confirmation text
        if (successModalBody) {
          successModalBody.innerHTML = `
            <p>Вы успешно записались на обслуживание!</p>
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin: 15px 0; text-align: left; font-size: 13px; color: var(--ink); border-left: 3px solid var(--red);">
              <strong>Автомобиль:</strong> ${bookingData.brand} ${bookingData.model} (${bookingData.year === 'before-2015' ? 'до 2015' : bookingData.year} г.в.)<br>
              <strong>Услуга:</strong> ${bookingData.service}<br>
              <strong>Дата:</strong> ${formattedDate}<br>
              <strong>Время:</strong> ${bookingData.time}<br>
              <strong>Контактный телефон:</strong> ${phone}
            </div>
            <p>Наш мастер-приемщик свяжется с вами в течение 5 минут для подтверждения бронирования подъемника.</p>
          `;
        }
        
        // Reset forms
        bookingForm.reset();
        bookingConfirmForm.reset();
        
        const modelSelect = document.getElementById('car-model');
        if (modelSelect) {
          modelSelect.disabled = true;
          modelSelect.innerHTML = '<option value="" disabled selected>Выберите модель</option>';
        }
        
        // Close confirm modal and mobile drawer
        const confirmModalEl = document.getElementById('booking-confirm-modal');
        closeModal(confirmModalEl);
        closeDrawer();
        
        // Open success modal
        openModal('success-modal');
      });
    }
  }

  // Callback Form Submission
  const callbackForm = document.getElementById('callback-form');
  if (callbackForm) {
    callbackForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('callback-name').value;
      const phone = document.getElementById('callback-phone').value;
      
      // Close callback modal
      closeModal(callbackForm.closest('.modal'));
      
      // Setup success content
      if (successModalBody) {
        successModalBody.innerHTML = `
          <p>Уважаемый <strong>${name}</strong>!</p>
          <p>Мы приняли вашу заявку на обратный звонок на номер <strong>${phone}</strong>.</p>
          <p>Наш специалист свяжется с вами в ближайшее время (обычно в течение 5 минут).</p>
        `;
      }
      
      callbackForm.reset();
      openModal('success-modal');
    });
  }

  // Footer Subscribe Form Submission
  const subscribeForm = document.getElementById('footer-subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput) {
        const email = emailInput.value;
        subscribeForm.reset();
        showToast(`E-mail ${email} успешно добавлен в список рассылки!`);
      }
    });
  }

  // Interactive Brand items
  const brandItems = document.querySelectorAll('.brand-item');
  brandItems.forEach(item => {
    item.addEventListener('click', function() {
      const selectedBrand = this.getAttribute('data-brand');
      if (selectedBrand && carBrandSelect) {
        carBrandSelect.value = selectedBrand;
        carBrandSelect.dispatchEvent(new Event('change'));
        
        // Scroll to booking form
        const targetElement = document.getElementById('booking');
        if (targetElement) {
          const offsetPosition = targetElement.offsetTop - 80;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
        showToast(`Выбрана марка автомобиля: ${selectedBrand}`);
      }
    });
  });

  // Search input mock trigger
  const searchTrigger = document.getElementById('search-trigger');
  if (searchTrigger) {
    searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Поиск временно недоступен. Воспользуйтесь записью на сервис.');
    });
  }

  // Cart click mock trigger
  const cartTrigger = document.getElementById('cart-trigger');
  if (cartTrigger) {
    cartTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Ваша корзина пуста. Добавьте услуги для оформления заказа.');
    });
  }

  // Phone input formatting/mask mock (simple check)
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    // Basic placeholder format helper
    input.addEventListener('focus', function() {
      if (!this.value) {
        this.value = '+7 (';
      }
    });
    
    input.addEventListener('blur', function() {
      if (this.value === '+7 (') {
        this.value = '';
      }
    });

    input.addEventListener('input', function(e) {
      let value = this.value;
      // Limit to numbers and special characters, very basic mask
      if (!value.startsWith('+7 (')) {
        this.value = '+7 (' + value.replace(/[^\d]/g, '');
      }
    });
  });

  // ==========================================================================
  // LIGHTBOX (PHOTO VIEWER)
  // ==========================================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let currentImageIndex = -1;
  const galleryImagesData = [];

  // Populate gallery data
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImagesData.push({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || 'Работа автосервиса'
      });
      
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    if (index >= 0 && index < galleryImagesData.length && lightbox && lightboxImg && lightboxCaption) {
      currentImageIndex = index;
      const data = galleryImagesData[index];
      
      lightboxImg.setAttribute('src', data.src);
      lightboxImg.setAttribute('alt', data.alt);
      lightboxCaption.textContent = data.alt;
      
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      
      // Accessibility focus
      lightbox.focus();
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      currentImageIndex = -1;
    }
  }

  function showNextImage() {
    if (currentImageIndex !== -1) {
      let nextIndex = currentImageIndex + 1;
      if (nextIndex >= galleryImagesData.length) {
        nextIndex = 0; // Loop back
      }
      openLightbox(nextIndex);
    }
  }

  function showPrevImage() {
    if (currentImageIndex !== -1) {
      let prevIndex = currentImageIndex - 1;
      if (prevIndex < 0) {
        prevIndex = galleryImagesData.length - 1; // Loop back
      }
      openLightbox(prevIndex);
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Close on overlay click
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === this || e.target.classList.contains('lightbox__content')) {
        closeLightbox();
      }
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      }
    });
  }

  // Mocks for header buttons and links
  const allServicesTrigger = document.getElementById('all-services-trigger');
  if (allServicesTrigger) {
    allServicesTrigger.addEventListener('click', () => {
      showToast('Показаны все 6 основных категорий услуг техцентра.');
    });
  }

  const galleryMoreTrigger = document.getElementById('gallery-more-trigger');
  if (galleryMoreTrigger) {
    galleryMoreTrigger.addEventListener('click', () => {
      showToast('Загрузка дополнительных фотографий... Все выполненные работы показаны.');
    });
  }

  const allNewsTrigger = document.getElementById('all-news-trigger');
  if (allNewsTrigger) {
    allNewsTrigger.addEventListener('click', () => {
      showToast('Показаны 4 актуальные новости и спецпредложения на текущий месяц.');
    });
  }

  // ==========================================================================
  // BACK TO TOP BUTTON
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top-btn');
  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // CURSOR MASK CAR REVEAL
  // ==========================================================================
  const carRevealStage = document.querySelector('.about__car-stage');

  if (carRevealStage) {
    const damagedCarReveal = carRevealStage.querySelector('.about__car-img--damaged');
    const fixedCarReveal = carRevealStage.querySelector('.about__car-img--fixed');
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const smallScreenQuery = window.matchMedia('(max-width: 600px)');

    const getRevealSize = () => (smallScreenQuery.matches ? 120 : 170);

    const applyRevealMask = (x = 50, y = 50, size = 0) => {
      carRevealStage.style.setProperty('--car-mask-x', x + '%');
      carRevealStage.style.setProperty('--car-mask-y', y + '%');
      carRevealStage.style.setProperty('--car-mask-size', size + 'px');

      if (fixedCarReveal) {
        const feather = Math.max(8, Math.round(size * 0.06));
        const solidEdge = Math.max(size - feather, 0);
        const clipPath = 'circle(' + size + 'px at ' + x + '% ' + y + '%)';
        const maskImage = 'radial-gradient(circle ' + size + 'px at ' + x + '% ' + y + '%, #000 0 ' + solidEdge + 'px, transparent ' + size + 'px)';

        fixedCarReveal.style.clipPath = clipPath;
        fixedCarReveal.style.webkitClipPath = clipPath;
        fixedCarReveal.style.maskImage = maskImage;
        fixedCarReveal.style.webkitMaskImage = maskImage;
      }

      if (damagedCarReveal) {
        const inverseEdge = size + 1;
        const inverseMask = size === 0
          ? 'linear-gradient(#000, #000)'
          : 'radial-gradient(circle ' + inverseEdge + 'px at ' + x + '% ' + y + '%, transparent 0 ' + size + 'px, #000 ' + inverseEdge + 'px)';

        damagedCarReveal.style.maskImage = inverseMask;
        damagedCarReveal.style.webkitMaskImage = inverseMask;
      }
    };

    const revealAtPointer = (event) => {
      const rect = carRevealStage.getBoundingClientRect();
      const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
      const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

      carRevealStage.classList.add('is-revealing');
      applyRevealMask(x, y, getRevealSize());
    };

    const hideReveal = () => {
      if (document.activeElement !== carRevealStage) {
        carRevealStage.classList.remove('is-revealing');
        applyRevealMask(50, 50, 0);
      }
    };

    applyRevealMask(50, 50, 0);

    carRevealStage.addEventListener('pointerenter', revealAtPointer);
    carRevealStage.addEventListener('pointermove', revealAtPointer);
    carRevealStage.addEventListener('pointerdown', revealAtPointer);
    carRevealStage.addEventListener('pointerleave', hideReveal);

    carRevealStage.addEventListener('focus', () => {
      carRevealStage.classList.add('is-revealing');
      applyRevealMask(54, 58, getRevealSize());
    });

    carRevealStage.addEventListener('blur', () => {
      carRevealStage.classList.remove('is-revealing');
      applyRevealMask(50, 50, 0);
    });
  }

  // ==========================================================================
  // STATS ANIMATION (COUNT-UP) ON VIEWPORT INTERSECTION
  // ==========================================================================
  const statsSection = document.querySelector('.about');
  const statNumbers = document.querySelectorAll('.stat-card__number');
  let animatedStats = false;

  function animateNumbers() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const isPercentage = target === 98;
      const isYears = target === 10;
      
      let current = 0;
      const duration = 1500; // Animation duration in ms
      const increment = target / (duration / 16); // 16ms per frame roughly (60fps)
      
      const updateNumber = () => {
        current += increment;
        if (current < target) {
          if (target > 1000) {
            // Formatting large numbers with spaces
            stat.textContent = Math.floor(current).toLocaleString('ru-RU') + '+';
          } else {
            stat.textContent = Math.floor(current) + (isPercentage ? '%' : (isYears ? '+' : '+'));
          }
          requestAnimationFrame(updateNumber);
        } else {
          if (target > 1000) {
            stat.textContent = target.toLocaleString('ru-RU') + '+';
          } else {
            stat.textContent = target + (isPercentage ? '%' : '+');
          }
        }
      };
      
      updateNumber();
    });
  }

  if (statsSection && statNumbers.length > 0) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animatedStats) {
            animatedStats = true;
            animateNumbers();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      observer.observe(statsSection);
    } else {
      // Fallback
      animateNumbers();
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
