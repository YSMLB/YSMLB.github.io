document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Header styling on scroll
  const header = document.getElementById('header');
  const checkScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      header.style.backgroundColor = 'rgba(250, 249, 246, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(13, 13, 13, 0.04)';
    } else {
      header.classList.remove('scrolled');
      header.style.backgroundColor = 'rgba(250, 249, 246, 0.85)';
      header.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check

  // 2. Smooth Scrolling and Active Nav Link Highlighting
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleActiveNav = () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav a[href*=${sectionId}]`)?.classList.add('active-link');
      } else {
        document.querySelector(`.nav a[href*=${sectionId}]`)?.classList.remove('active-link');
      }
    });
  };
  window.addEventListener('scroll', handleActiveNav);

  // 3. Scroll Reveal Animation for a premium feel
  const revealElements = document.querySelectorAll('.project-card, .service-card, .about-content, .about-visual, .cta-container');
  
  // Initial setup: add hide styles dynamically so that non-JS users still see content
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 4. Email Modal Window & Copy Logic
  const modalTrigger = document.getElementById('email-modal-trigger');
  const emailModal = document.getElementById('email-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const copyBtn = document.getElementById('email-copy-btn');
  const emailInput = document.getElementById('email-input');
  const copyTextLabel = document.getElementById('copy-text-label');

  if (modalTrigger && emailModal) {
    const openModal = () => {
      emailModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      emailModal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset copy button state on close
      if (copyBtn && copyTextLabel) {
        copyBtn.classList.remove('copied');
        copyTextLabel.textContent = 'Копировать';
      }
    };

    modalTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    modalClose.addEventListener('click', closeModal);

    // Close modal on click outside card
    emailModal.addEventListener('click', (e) => {
      if (e.target === emailModal) {
        closeModal();
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && emailModal.classList.contains('active')) {
        closeModal();
      }
    });

    // Copy to Clipboard logic
    if (copyBtn && emailInput) {
      copyBtn.addEventListener('click', () => {
        const textToCopy = emailInput.value;
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.classList.add('copied');
          copyTextLabel.textContent = 'Скопировано!';
          
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyTextLabel.textContent = 'Копировать';
          }, 2000);
        }).catch(err => {
          console.error('Ошибка при копировании: ', err);
        });
      });
    }
  }

});
