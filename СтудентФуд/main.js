/* ==========================================================================
   СтудентФуд JS Script (Revised Layout Logic)
   ========================================================================== */

// 1. Initial State & Setup
let cart = [];
let isStudentVerified = false;

// DOM Elements
const body = document.body;
const mainHeader = document.getElementById('main-header');
const navMenu = document.getElementById('nav-menu');
const hamburgerMenuBtn = document.getElementById('hamburger-menu-btn');

// Cart DOM
const btnCartToggle = document.getElementById('btn-cart-toggle');
const cartModalOverlay = document.getElementById('cart-modal-overlay');
const btnCloseCart = document.getElementById('btn-close-cart');
const cartItemsList = document.getElementById('cart-items-list');
const cartBadgeCount = document.getElementById('cart-badge-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const discountRow = document.getElementById('discount-row');
const cartDiscount = document.getElementById('cart-discount');
const cartTotal = document.getElementById('cart-total');
const checkoutForm = document.getElementById('checkout-form');

// Combo Builder DOM
const heroBtnBuildCombo = document.getElementById('hero-btn-build-combo');
const comboBuilderModal = document.getElementById('combo-builder-modal');
const btnCloseBuilder = document.getElementById('btn-close-builder');
const builderMainDish = document.getElementById('builder-main-dish');
const builderSideDish = document.getElementById('builder-side-dish');
const builderDrink = document.getElementById('builder-drink');
const builderTotalVal = document.getElementById('builder-total-val');
const btnAddBuilderToCart = document.getElementById('btn-add-builder-to-cart');

// Student ID Upload DOM
const btnGetDiscount = document.getElementById('btn-get-discount');
const stickerDiscount = document.getElementById('sticker-discount');
const studentUploadModal = document.getElementById('student-upload-modal');
const btnCloseUpload = document.getElementById('btn-close-upload');
const uploadDragZone = document.getElementById('upload-drag-zone');
const studentFileInput = document.getElementById('student-file-input');
const selectedFileName = document.getElementById('selected-file-name');
const uploadProgressContainer = document.getElementById('upload-progress-container');
const uploadProgressFill = document.getElementById('upload-progress-fill');
const uploadSuccessScreen = document.getElementById('upload-success-screen');
const btnSuccessClose = document.getElementById('btn-success-close');

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
  // Load Cart from localStorage
  const savedCart = localStorage.getItem('studentfood_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  } else {
    // Initial 3 items to match the mockup basket count '3'
    cart = [
      { id: 'combo-econom', name: 'Комбо Эконом', price: 199, img: './img/part2_img1.png', quantity: 1 },
      { id: 'item-burger', name: 'Бургер Классик', price: 290, img: './img/part3_img2.png', quantity: 1 },
      { id: 'item-pizza', name: 'Пицца Пепперони', price: 450, img: './img/part3_img1.png', quantity: 1 }
    ];
  }

  // Load verification status
  const savedVerification = localStorage.getItem('studentfood_verified');
  if (savedVerification === 'true') {
    isStudentVerified = true;
    applyVerifiedDiscountStyles();
  }

  updateCartUI();
  setupEventListeners();
});

// ==========================================================================
// 2. Event Listeners & Global Helpers
// ==========================================================================

function setupEventListeners() {
  // Header scrolled class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  // Mobile navigation hamburger toggle
  hamburgerMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburgerMenuBtn.classList.toggle('active');
  });

  // Close nav menu on link click
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburgerMenuBtn.classList.remove('active');
    });
  });

  // Shopping Cart toggle
  btnCartToggle.addEventListener('click', () => toggleModal(cartModalOverlay, true));
  btnCloseCart.addEventListener('click', () => toggleModal(cartModalOverlay, false));
  cartModalOverlay.addEventListener('click', (e) => {
    if (e.target === cartModalOverlay) toggleModal(cartModalOverlay, false);
  });

  // Combo Builder triggers
  heroBtnBuildCombo.addEventListener('click', () => {
    toggleModal(comboBuilderModal, true);
    calculateBuilderPrice();
  });
  btnCloseBuilder.addEventListener('click', () => toggleModal(comboBuilderModal, false));
  comboBuilderModal.addEventListener('click', (e) => {
    if (e.target === comboBuilderModal) toggleModal(comboBuilderModal, false);
  });

  // Listen to choices in the combo builder
  builderMainDish.addEventListener('change', calculateBuilderPrice);
  builderSideDish.addEventListener('change', calculateBuilderPrice);
  builderDrink.addEventListener('change', calculateBuilderPrice);

  // Add built combo to cart
  btnAddBuilderToCart.addEventListener('click', addBuiltComboToCart);

  // Add standard combos to cart
  document.querySelectorAll('.btn-add-combo').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card events if nested
      const target = e.currentTarget;
      const id = target.getAttribute('data-id');
      const name = target.getAttribute('data-name');
      const price = parseInt(target.getAttribute('data-price'));
      const img = target.getAttribute('data-img');
      addToCart(id, name, price, img);
      
      // Animate cart badge
      animateCartBadge();
    });
  });

  // Add popular items (when clicking anywhere on the menu-card)
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const name = card.getAttribute('data-name');
      const price = parseInt(card.getAttribute('data-price'));
      const img = card.getAttribute('data-img');
      addToCart(id, name, price, img);
      
      // Animate cart badge
      animateCartBadge();
    });
  });

  // Submit checkout order
  checkoutForm.addEventListener('submit', handleCheckout);

  // Student discount triggers
  btnGetDiscount.addEventListener('click', () => toggleModal(studentUploadModal, true));
  if (stickerDiscount) {
    stickerDiscount.addEventListener('click', () => toggleModal(studentUploadModal, true));
  }
  btnCloseUpload.addEventListener('click', () => toggleModal(studentUploadModal, false));
  studentUploadModal.addEventListener('click', (e) => {
    if (e.target === studentUploadModal) toggleModal(studentUploadModal, false);
  });

  // Drag & Drop event handlers
  uploadDragZone.addEventListener('click', () => studentFileInput.click());
  studentFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadDragZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadDragZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadDragZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadDragZone.classList.remove('dragover');
    }, false);
  });

  uploadDragZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  });

  btnSuccessClose.addEventListener('click', () => {
    toggleModal(studentUploadModal, false);
    // Reset uploader state
    setTimeout(() => {
      uploadSuccessScreen.style.display = 'none';
      uploadDragZone.style.display = 'block';
      selectedFileName.textContent = '';
      uploadProgressContainer.style.display = 'none';
      uploadProgressFill.style.width = '0%';
    }, 400);
  });
}

function toggleModal(modal, show) {
  if (show) {
    modal.classList.add('active');
    body.style.overflow = 'hidden';
  } else {
    modal.classList.remove('active');
    body.style.overflow = '';
  }
}

function animateCartBadge() {
  btnCartToggle.style.transform = 'scale(1.15)';
  setTimeout(() => { btnCartToggle.style.transform = 'none'; }, 200);
}

// ==========================================================================
// 3. Shopping Cart Logic
// ==========================================================================

function addToCart(id, name, price, img) {
  const existingItemIndex = cart.findIndex(item => item.id === id);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ id, name, price, img, quantity: 1 });
  }
  saveAndUpdateCart();
  
  // Show cart sidebar immediately for feedback
  toggleModal(cartModalOverlay, true);
}

function updateCartQuantity(id, delta) {
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveAndUpdateCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveAndUpdateCart();
}

function saveAndUpdateCart() {
  localStorage.setItem('studentfood_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  // Update Badge Count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadgeCount.textContent = totalItems;
  
  if (cart.length === 0) {
    cartItemsList.innerHTML = '<div class="empty-cart-message">Ваша корзина пуста 🍕</div>';
    cartSubtotal.textContent = '0 ₽';
    discountRow.style.display = 'none';
    cartTotal.textContent = '0 ₽';
    return;
  }

  // Render items
  cartItemsList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <span class="cart-item-title">${item.name}</span>
        <span class="cart-item-price">${item.price} ₽</span>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-controls">
          <button class="btn-qty" onclick="window.updateCartQty('${item.id}', -1)">&minus;</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="btn-qty" onclick="window.updateCartQty('${item.id}', 1)">&plus;</button>
        </div>
        <button class="btn-remove-item" onclick="window.removeCartItem('${item.id}')">Удалить</button>
      </div>
    </div>
  `).join('');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartSubtotal.textContent = `${subtotal} ₽`;

  if (isStudentVerified) {
    const discountVal = Math.round(subtotal * 0.1);
    discountRow.style.display = 'flex';
    cartDiscount.textContent = `-${discountVal} ₽`;
    cartTotal.textContent = `${subtotal - discountVal} ₽`;
  } else {
    discountRow.style.display = 'none';
    cartTotal.textContent = `${subtotal} ₽`;
  }
}

// Attach cart methods to window object for inline onclick attributes
window.updateCartQty = (id, delta) => updateCartQuantity(id, delta);
window.removeCartItem = (id) => removeFromCart(id);

function handleCheckout(e) {
  e.preventDefault();
  
  const address = document.getElementById('checkout-address').value;
  const phone = document.getElementById('checkout-phone').value;
  
  alert(`🎉 Заказ успешно принят!\n\nМы доставим его по адресу: ${address}\nНомер телефона: ${phone}\n\nЖдите курьера через 20 минут! Приятного аппетита!`);
  
  // Reset cart
  cart = [];
  saveAndUpdateCart();
  checkoutForm.reset();
  toggleModal(cartModalOverlay, false);
}

// ==========================================================================
// 4. Interactive Combo Builder
// ==========================================================================

function calculateBuilderPrice() {
  const selectedMain = builderMainDish.querySelector('input:checked');
  const selectedSide = builderSideDish.querySelector('input:checked');
  const selectedDrink = builderDrink.querySelector('input:checked');

  const mainPrice = parseInt(selectedMain.getAttribute('data-price'));
  const sidePrice = parseInt(selectedSide.getAttribute('data-price'));
  const drinkPrice = parseInt(selectedDrink.getAttribute('data-price'));

  const rawSum = mainPrice + sidePrice + drinkPrice;
  // Apply a 15% combo discount and round
  const discountedPrice = Math.round(rawSum * 0.85);

  builderTotalVal.textContent = `${discountedPrice} ₽`;
}

function addBuiltComboToCart() {
  const selectedMain = builderMainDish.querySelector('input:checked');
  const selectedSide = builderSideDish.querySelector('input:checked');
  const selectedDrink = builderDrink.querySelector('input:checked');

  const mainName = selectedMain.getAttribute('data-name');
  const sideName = selectedSide.getAttribute('data-name');
  const drinkName = selectedDrink.getAttribute('data-name');

  const mainPrice = parseInt(selectedMain.getAttribute('data-price'));
  const sidePrice = parseInt(selectedSide.getAttribute('data-price'));
  const drinkPrice = parseInt(selectedDrink.getAttribute('data-price'));

  const rawSum = mainPrice + sidePrice + drinkPrice;
  const comboPrice = Math.round(rawSum * 0.85);

  const comboName = `Свой комбо: ${mainName} + ${sideName !== 'Без гарнира' ? sideName : 'без допа'} + ${drinkName}`;
  const comboId = `custom-combo-${Date.now()}`;
  // Default combo image is part2_img2
  const comboImg = './img/part2_img2.png';

  addToCart(comboId, comboName, comboPrice, comboImg);
  toggleModal(comboBuilderModal, false);
}

// ==========================================================================
// 5. Student ID Verification Logic
// ==========================================================================

function handleFileSelected(file) {
  selectedFileName.textContent = `Выбран файл: ${file.name}`;
  uploadDragZone.style.display = 'none';
  uploadProgressContainer.style.display = 'block';
  
  let progress = 0;
  uploadProgressFill.style.width = '0%';
  
  const progressInterval = setInterval(() => {
    progress += 4;
    uploadProgressFill.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      simulateVerificationSuccess();
    }
  }, 100);
}

function simulateVerificationSuccess() {
  isStudentVerified = true;
  localStorage.setItem('studentfood_verified', 'true');
  
  setTimeout(() => {
    uploadProgressContainer.style.display = 'none';
    uploadSuccessScreen.style.display = 'block';
    applyVerifiedDiscountStyles();
    updateCartUI();
  }, 500);
}

function applyVerifiedDiscountStyles() {
  const discountBtn = document.getElementById('btn-get-discount');
  if (discountBtn) {
    discountBtn.textContent = 'Скидка Активна!';
    discountBtn.disabled = true;
    discountBtn.style.backgroundColor = '#ffd600';
    discountBtn.style.color = '#1a1a1a';
    discountBtn.style.cursor = 'default';
  }
}
