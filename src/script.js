document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const galleryButtons = document.querySelectorAll('.category-link[data-gallery-filter]');
  const galleryPanels = document.querySelectorAll('.gallery-panel');

  if (galleryButtons.length && galleryPanels.length) {
    galleryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.galleryFilter;

        galleryButtons.forEach((item) => {
          item.classList.toggle('is-active', item === button);
        });

        galleryPanels.forEach((panel) => {
          const isVisible = filter === 'all' || panel.dataset.galleryPanel === filter;
          panel.classList.toggle('is-hidden', !isVisible);
          panel.hidden = !isVisible;
        });
      });
    });
  }

  const addButtons = document.querySelectorAll('.add-to-cart');
  const cartItems = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('grand-total');
  const deliveryFeeEl = document.getElementById('delivery-fee');
  const orderForm = document.getElementById('order-form');

  const cart = [];

  function formatGhs(value) {
    return `GHS ${value.toFixed(2)}`;
  }

  function updateCartSummary() {
    if (!cartItems || !subtotalEl || !totalEl || !deliveryFeeEl) return;

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = cart.length ? 20 : 0;
    const total = subtotal + deliveryFee;

    if (!cart.length) {
      cartItems.innerHTML = '<li class="empty-state">Your cart is empty. Add a few favorites to get started.</li>';
    } else {
      cartItems.innerHTML = cart
        .map(
          (item) => `
            <li class="cart-item">
              <div>
                <strong>${item.name}</strong>
                <span>${item.qty}x</span>
              </div>
              <span>${formatGhs(item.price)}</span>
            </li>
          `
        )
        .join('');
    }

    subtotalEl.textContent = formatGhs(subtotal);
    deliveryFeeEl.textContent = formatGhs(deliveryFee);
    totalEl.textContent = formatGhs(total);
  }

  addButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.menu-item');
      if (!item) return;

      const name = item.dataset.name;
      const price = Number(item.dataset.price || 0);

      const existingItem = cart.find((entry) => entry.name === name);

      if (existingItem) {
        existingItem.qty += 1;
        existingItem.price += price;
      } else {
        cart.push({ name, qty: 1, price });
      }

      updateCartSummary();
      button.textContent = 'Added';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = 'Add';
        button.disabled = false;
      }, 600);
    });
  });

  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameInput = document.getElementById('customer-name');
      const contactInput = document.getElementById('contact');

      if (!cart.length) {
        alert('Please add at least one item before placing your order.');
        return;
      }

      const customerName = nameInput ? nameInput.value.trim() : 'Customer';
      const contact = contactInput ? contactInput.value.trim() : 'Phone not provided';
      const orderCount = cart.reduce((sum, entry) => sum + entry.qty, 0);
      const total = cart.reduce((sum, item) => sum + item.price, 0) + (cart.length ? 20 : 0);

      alert(
        `Thanks, ${customerName}! Your ${orderCount} item(s) order has been received. We will call you at ${contact}. Total due: GHS ${total.toFixed(2)}.`
      );
      orderForm.reset();
      cart.length = 0;
      updateCartSummary();
    });
  }

  updateCartSummary();
});
