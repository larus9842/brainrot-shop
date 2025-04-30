/* ==================================================
   Carrello Brainrot – versione stabile 1.0
   ================================================== */

(() => {
    /* ---------- costanti utili ---------- */
    const CART_KEY = 'brainrot_cart_v1';
    const cartButton = document.getElementById('cart-button');
    const badge = document.getElementById('cart-count');
    const dropdown = document.getElementById('cart-dropdown');
    const productButtons = document.querySelectorAll('.product button');

    /* ---------- helper storage ---------- */
    const readCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const writeCart = cart => localStorage.setItem(CART_KEY, JSON.stringify(cart));

    /* ---------- badge ---------- */
    const refreshBadge = () => {
        const cart = readCart();
        const total = cart.reduce((s, it) => s + it.quantity, 0);
        badge.textContent = total;
    };

    /* ---------- aggiunta prodotto ---------- */
    productButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product');
            const title = card.querySelector('h2').innerText.trim();
            const color = card.querySelector('select').value.trim();
            const img = card.querySelector('img').src;

            if (color === 'Seleziona colore') {
                alert('Per favore seleziona un colore!');
                return;
            }

            const cart = readCart();
            const key = `${title}|${color}`;     // chiave UNICA titolo+colore
            const item = cart.find(it => it.key === key);

            if (item) {
                item.quantity += 1;
            } else {
                cart.push({ key, title, color, image: img, quantity: 1 });
            }

            writeCart(cart);
            refreshBadge();
            renderDropdown(cart);

            // 🔹 Aggiungi qui il feedback visivo!
            const cartIcon = document.querySelector('.cart');
            cartIcon.classList.add('bump');
            setTimeout(() => cartIcon.classList.remove('bump'), 400);

            const fb = document.getElementById('add-feedback');
            fb.style.display = 'block';
            setTimeout(() => { fb.style.display = 'none'; }, 1500);


        });
    });

    /* ---------- render dropdown ---------- */
    const renderDropdown = cartParam => {
        const cart = cartParam || readCart();
        dropdown.innerHTML = '';

        if (!cart.length) {
            dropdown.innerHTML = '<p>Il carrello è vuoto.</p>';
            return;
        }

        cart.forEach((it, idx) => {
            const row = document.createElement('div');
            row.innerHTML = `
      <div style="
        display:flex;
        align-items:center;
        font-size:10px;
        border-bottom:1px solid black;
        padding:6px 4px;
      ">
        <img src="${it.image}" style="
          width:40px;
          height:40px;
          object-fit:contain;
          margin-right:6px;
        ">
        
        <div style="flex-grow:1;">
          <strong>${it.title}</strong><br>
          <small>${it.color}</small>
        </div>

        <!--  CONTENITORE PULSANTI SEMPRE IN LINEA  -->
        <div style="
          display:flex;
          align-items:center;
          gap:4px;
          min-width:70px;      /* fissa lo spazio, impedendo l’andata a capo */
          justify-content:center;
        ">
          <button data-act="-" data-idx="${idx}">-</button>
          ${it.quantity}
          <button data-act="+"  data-idx="${idx}">+</button>
        </div>
      </div>`;
            dropdown.appendChild(row);
        });

        /* bottone Checkout */
        const go = document.createElement('div');
        go.style.textAlign = 'center';
        go.innerHTML =
            '<button onclick="location.href=\'checkout.html\'" style="margin:8px 0;padding:6px 14px;font-size:10px;border:2px solid black;background:white;font-family:\'Press Start 2P\',cursive;">Checkout</button>';
        dropdown.appendChild(go);
    };



    /* ---------- click + / -  (delegation) ---------- */
    dropdown.addEventListener('click', e => {
        if (!e.target.matches('button[data-act]')) return;

        const act = e.target.dataset.act;   // "+" o "-"
        const idx = Number(e.target.dataset.idx);
        const cart = readCart();

        if (act === '+') cart[idx].quantity++;
        if (act === '-') cart[idx].quantity--;

        if (cart[idx].quantity <= 0) cart.splice(idx, 1);

        writeCart(cart);
        refreshBadge();
        renderDropdown(cart);
    });

    /* ---------- hover header ---------- */
    cartButton.addEventListener('mouseenter', () => dropdown.style.display = 'block');
    cartButton.addEventListener('mouseleave', () =>
        setTimeout(() => {
            if (!dropdown.matches(':hover')) dropdown.style.display = 'none';
        }, 200)
    );
    dropdown.addEventListener('mouseleave', () => dropdown.style.display = 'none');

    /* ---------- click header ---------- */
    cartButton.addEventListener('click', () => {
        if (dropdown.style.display !== 'block') location.href = 'checkout.html';
    });

    /* ---------- prima render ---------- */
    refreshBadge();
    renderDropdown(readCart());
})();