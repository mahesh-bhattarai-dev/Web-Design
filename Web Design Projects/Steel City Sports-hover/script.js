/* Steel City Sports: front-end demo cart. No real payments are processed. */
(function () {
  "use strict";
  const CART_KEY = "steelCitySportsCart";
  const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (_) { return []; }
  };
  const saveCart = cart => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  };
  function updateCartCount() {
    const count = readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = count);
  }
  function addItem(item) {
    const cart = readCart();
    const existing = cart.find(entry => entry.id === item.id && entry.size === item.size);
    if (existing) existing.quantity += 1;
    else cart.push({ ...item, quantity: 1 });
    saveCart(cart);
    const notice = document.getElementById("cart-notice");
    if (notice) notice.textContent = item.name + " added to your cart.";
  }
  function parsePrice(text) {
    const match = (text || "").match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
    return match ? Number(match[1].replace(/,/g, "")) : 0;
  }
  function enhanceProductPage() {
    const heading = [...document.querySelectorAll("h3")].find(el => /product line/i.test(el.textContent));
    const list = heading && heading.parentElement.querySelector("ul");
    if (!list) return;
    const sourceItems = [...list.querySelectorAll("li")];
    const products = [];
    sourceItems.forEach(li => {
      const headings = [...li.querySelectorAll("h4")];
      if (!headings.length) return;
      headings.forEach((h4, index) => {
        let image = null, description = "", price = 0;
        let node = h4.nextElementSibling;
        while (node && node.tagName !== "H4") {
          if (node.tagName === "IMG" && !image) image = node;
          if (node.tagName === "P") {
            const text = node.textContent.trim();
            if (/price\s*:/i.test(text)) price = parsePrice(text);
            else if (/product description\s*:/i.test(text)) description = text.replace(/^Product Description\s*:\s*/i, "");
          }
          node = node.nextElementSibling;
        }
        if (!image) {
          const images = [...li.querySelectorAll("img")];
          image = images[index] || images[0] || null;
        }
        products.push({ name: h4.textContent.trim(), image: image ? image.getAttribute("src") : "", alt: image ? image.alt : h4.textContent.trim(), description, price });
      });
    });
    if (!products.length) return;
    list.className = "product-grid";
    list.innerHTML = "";
    products.forEach((product, index) => {
      const card = document.createElement("li");
      card.className = "product-card";
      const imageWrap = document.createElement("div"); imageWrap.className = "product-image-wrap";
      const img = document.createElement("img"); img.src = product.image; img.alt = product.alt; img.loading = index > 3 ? "lazy" : "eager";
      img.onerror = () => { img.style.display = "none"; imageWrap.classList.add("image-unavailable"); imageWrap.textContent = "Image unavailable"; };
      imageWrap.appendChild(img);
      const body = document.createElement("div"); body.className = "product-card-body";
      const title = document.createElement("h4"); title.textContent = product.name;
      const desc = document.createElement("p"); desc.className = "product-description"; desc.textContent = product.description || "Team gear for Pittsburgh fans.";
      const price = document.createElement("p"); price.className = "product-price"; price.textContent = product.price ? money(product.price) : "Price unavailable";
      body.append(title, desc, price);
      const controls = document.createElement("div"); controls.className = "product-controls";
      const sizeLabel = document.createElement("label"); sizeLabel.textContent = "Size ";
      const size = document.createElement("select"); size.setAttribute("aria-label", "Size for " + product.name);
      ["S", "M", "L", "XL", "2XL", "3XL", "One size"].forEach(value => { const option = document.createElement("option"); option.value = value; option.textContent = value; size.appendChild(option); });
      sizeLabel.appendChild(size);
      const button = document.createElement("button"); button.type = "button"; button.className = "button button-primary"; button.textContent = "Add to cart";
      button.disabled = !product.price;
      button.addEventListener("click", () => addItem({ id: location.pathname + "::" + product.name, name: product.name, image: product.image, price: product.price, size: size.value }));
      controls.append(sizeLabel, button);
      body.appendChild(controls); card.append(imageWrap, body); list.appendChild(card);
    });
    const notice = document.createElement("p"); notice.id = "cart-notice"; notice.className = "status-message"; notice.setAttribute("aria-live", "polite");
    list.insertAdjacentElement("afterend", notice);
  }
  function renderCart() {
    const root = document.getElementById("cart-items");
    if (!root) return;
    const cart = readCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const subtotal = document.getElementById("cart-subtotal");
    const totalEl = document.getElementById("cart-total");
    const checkout = document.getElementById("checkout-link");
    const empty = document.getElementById("cart-empty");
    root.innerHTML = "";
    if (!cart.length) {
      empty.hidden = false;
      checkout.classList.add("is-disabled"); checkout.setAttribute("aria-disabled", "true"); checkout.href = "#cart-empty";
    } else {
      empty.hidden = true;
      checkout.classList.remove("is-disabled"); checkout.removeAttribute("aria-disabled"); checkout.href = "payment.html";
      cart.forEach(item => {
        const row = document.createElement("article"); row.className = "cart-item";
        const image = document.createElement("img"); image.src = item.image || ""; image.alt = ""; image.loading = "lazy";
        image.onerror = () => image.style.visibility = "hidden";
        const info = document.createElement("div"); info.className = "cart-item-info";
        const name = document.createElement("h3"); name.textContent = item.name;
        const meta = document.createElement("p"); meta.textContent = "Size: " + item.size + " · " + money(item.price) + " each";
        info.append(name, meta);
        const qty = document.createElement("label"); qty.className = "quantity-control"; qty.textContent = "Qty ";
        const input = document.createElement("input"); input.type = "number"; input.min = "1"; input.max = "99"; input.value = item.quantity; input.setAttribute("aria-label", "Quantity for " + item.name);
        input.addEventListener("change", () => { const next = Math.max(1, Math.min(99, Number(input.value) || 1)); const latest = readCart(); const found = latest.find(x => x.id === item.id && x.size === item.size); if (found) found.quantity = next; saveCart(latest); renderCart(); });
        qty.appendChild(input);
        const lineTotal = document.createElement("strong"); lineTotal.className = "cart-line-total"; lineTotal.textContent = money(item.price * item.quantity);
        const remove = document.createElement("button"); remove.type = "button"; remove.className = "button button-subtle"; remove.textContent = "Remove";
        remove.addEventListener("click", () => { saveCart(readCart().filter(x => !(x.id === item.id && x.size === item.size))); renderCart(); });
        row.append(image, info, qty, lineTotal, remove); root.appendChild(row);
      });
    }
    if (subtotal) subtotal.textContent = money(total);
    if (totalEl) totalEl.textContent = money(total);
    updateCartCount();
  }
  function setupDemoPayment() {
    const form = document.getElementById("demo-order-form");
    if (!form) return;
    const cart = readCart();
    const summary = document.getElementById("payment-summary");
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (summary) summary.textContent = cart.length ? "Demo order total: " + money(total) + " (" + cart.reduce((sum, item) => sum + item.quantity, 0) + " item(s)). No payment will be collected." : "Your cart is empty. Return to a team page to add items.";
    const submit = form.querySelector('button[type="submit"]');
    if (!cart.length && submit) submit.disabled = true;
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!readCart().length) return;
      const message = document.getElementById("order-result");
      message.textContent = "Demo order submitted successfully. This is a portfolio demonstration only: no order was sent, no payment was processed, and your information was not transmitted.";
      message.hidden = false;
      form.reset();
      localStorage.removeItem(CART_KEY);
      updateCartCount();
      if (submit) submit.disabled = true;
      if (summary) summary.textContent = "Demo cart cleared after simulated submission.";
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    enhanceProductPage();
    renderCart();
    setupDemoPayment();
    updateCartCount();
    const toggle = document.querySelector(".dropbtn");
    if (toggle && !toggle.hasAttribute("onclick")) toggle.addEventListener("click", () => {
      const menu = document.getElementById("myDropdown");
      if (menu) menu.classList.toggle("show");
    });
    document.addEventListener("click", event => {
      const menu = document.getElementById("myDropdown");
      if (menu && !event.target.closest(".dropdown")) menu.classList.remove("show");
    });
  });
})();
