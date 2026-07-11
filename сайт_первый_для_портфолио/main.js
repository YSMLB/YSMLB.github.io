document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Header styling on scroll
  const navbar = document.getElementById('navbar');
  const checkScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check

  // 2. Add to Cart Logic
  let cartCount = 0;
  const cartBadge = document.querySelector('.cart-badge');
  const addToCartButtons = document.querySelectorAll('.add-to-cart-quick');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      cartCount++;
      if (cartBadge) {
        cartBadge.textContent = cartCount;
        
        // Micro-animation for cart badge
        cartBadge.style.transform = 'scale(1.3)';
        cartBadge.style.transition = 'transform 0.15s ease';
        setTimeout(() => {
          cartBadge.style.transform = 'scale(1)';
        }, 150);
      }
      
      // Temporary change button text to feedback
      const originalText = button.textContent;
      button.textContent = 'Добавлено!';
      button.style.backgroundColor = '#22c55e'; // Green feedback
      button.style.color = '#ffffff';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.color = '';
      }, 1000);
    });
  });

  // 3. Wishlist / Favorites Toggle
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      button.classList.toggle('active');
      
      // Micro-animation on click
      button.style.transform = 'scale(1.2)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // 4. Search Modal Toggle
  const searchTrigger = document.getElementById('search-trigger');
  const searchModal = document.getElementById('search-modal');
  const searchClose = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-input');

  if (searchTrigger && searchModal) {
    searchTrigger.addEventListener('click', () => {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Disable page scrolling
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
    });

    const closeModal = () => {
      searchModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    };

    if (searchClose) {
      searchClose.addEventListener('click', closeModal);
    }

    // Close on overlay click
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 5. Scroll Reveal Animations (Premium entrance feel)
  const revealElements = document.querySelectorAll('.category-card, .product-card, .delivery-banner, .feature-card');
  
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 6. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (menuToggle && navMenu) {
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
  }
});
