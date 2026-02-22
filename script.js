(function () {
  'use strict';

  // Current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Message sent!';
      btn.disabled = true;
      form.reset();
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 3000);
    });
  }

  // --- Cart ---
  var CART_KEY = 'roastedbean_cart';
  var cart = [];

  function loadCart() {
    try {
      var saved = localStorage.getItem(CART_KEY);
      if (saved) cart = JSON.parse(saved);
    } catch (e) {}
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  function addToCart(id, name, price) {
    var numId = Number(id);
    var numPrice = Number(price);
    var item = cart.find(function (i) { return i.id === numId; });
    if (item) {
      item.qty += 1;
    } else {
      cart.push({ id: numId, name: name, price: numPrice, qty: 1 });
    }
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(function (i) { return i.id !== id; });
    saveCart();
    renderCart();
  }

  function updateQty(id, delta) {
    var item = cart.find(function (i) { return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart();
    renderCart();
  }

  function getCartTotal() {
    var total = 0;
    var count = 0;
    cart.forEach(function (i) {
      total += i.price * i.qty;
      count += i.qty;
    });
    return { total: total, count: count };
  }

  function renderCart() {
    var listEl = document.getElementById('cart-list');
    var emptyEl = document.getElementById('cart-empty');
    var totalEl = document.getElementById('cart-total');
    var countEl = document.getElementById('cart-count');
    if (!listEl || !emptyEl || !totalEl || !countEl) return;

    var t = getCartTotal();
    countEl.textContent = t.count;
    totalEl.textContent = t.total.toFixed(2);

    if (cart.length === 0) {
      emptyEl.style.display = 'block';
      listEl.innerHTML = '';
      return;
    }
    emptyEl.style.display = 'none';
    listEl.innerHTML = cart.map(function (item) {
      var lineTotal = (item.price * item.qty).toFixed(2);
      return (
        '<li data-cart-id="' + item.id + '">' +
          '<span class="cart-item-name">' + escapeHtml(item.name) + '</span>' +
          '<div class="cart-item-qty">' +
            '<button type="button" data-cart-minus aria-label="Decrease">−</button>' +
            '<span>' + item.qty + '</span>' +
            '<button type="button" data-cart-plus aria-label="Increase">+</button>' +
          '</div>' +
          '<span class="cart-item-price">$' + lineTotal + '</span>' +
          '<button type="button" class="cart-item-remove" data-cart-remove aria-label="Remove">×</button>' +
        '</li>'
      );
    }).join('');

    listEl.querySelectorAll('[data-cart-minus]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = Number(btn.closest('li').getAttribute('data-cart-id'));
        updateQty(id, -1);
      });
    });
    listEl.querySelectorAll('[data-cart-plus]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = Number(btn.closest('li').getAttribute('data-cart-id'));
        updateQty(id, 1);
      });
    });
    listEl.querySelectorAll('[data-cart-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = Number(btn.closest('li').getAttribute('data-cart-id'));
        removeFromCart(id);
      });
    });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function openCart() {
    document.getElementById('cart-overlay').classList.add('is-open');
    document.getElementById('cart-drawer').classList.add('is-open');
    document.getElementById('cart-overlay').setAttribute('aria-hidden', 'false');
  }

  function closeCart() {
    document.getElementById('cart-overlay').classList.remove('is-open');
    document.getElementById('cart-drawer').classList.remove('is-open');
    document.getElementById('cart-overlay').setAttribute('aria-hidden', 'true');
  }

  loadCart();
  renderCart();

  var cartTrigger = document.getElementById('cart-trigger');
  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  var cartClose = document.getElementById('cart-close');
  if (cartClose) cartClose.addEventListener('click', closeCart);
  var cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  document.querySelectorAll('[data-add-cart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.order-item');
      if (!item) return;
      var id = item.getAttribute('data-id');
      var name = item.getAttribute('data-name');
      var price = item.getAttribute('data-price');
      if (id && name && price) {
        addToCart(id, name, price);
        openCart();
      }
    });
  });

  var placeOrderBtn = document.getElementById('cart-place-order');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function () {
      if (cart.length === 0) {
        alert('Your cart is empty. Add some items first!');
        return;
      }
      var lines = cart.map(function (i) {
        return i.qty + '× ' + i.name + ' — $' + (i.price * i.qty).toFixed(2);
      });
      var t = getCartTotal();
      var body = 'Order:\n\n' + lines.join('\n') + '\n\nTotal: $' + t.total.toFixed(2);
      var mailto = 'mailto:hello@theroastedbean.com?subject=Order%20Request&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }
})();
