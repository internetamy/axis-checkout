<script>
// =========================
//  AXIS BIOSCIENCE STRIPE OVERRIDE
// =========================

async function startStripeCheckout() {
  try {
    console.log("🔥 Stripe Checkout Triggered");

    const items = [];

    // NEW: More reliable selectors for GHL cart rows
    const cartRows = document.querySelectorAll(".hl-cart-item, .cart-item-border-bottom");
    console.log("🟨 Found cart rows:", cartRows.length);

    if (cartRows.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    cartRows.forEach(row => {
      let name =
        row.querySelector(".hl-cart-product-name")?.innerText.trim() ||
        row.querySelector(".truncate-text-2-lines")?.innerText.trim() ||
        row.querySelector(".hl-image-name-container a")?.innerText.trim() ||
        null;

      const qty = parseInt(row.querySelector("input")?.value || "1");

      if (!name) {
        console.warn("⚠️ Could not find product name in row:", row);
        return;
      }

      // Variant detection
      const rowText = row.innerText.toLowerCase();
      let variant = "single";

      if (rowText.includes("3 pack") || rowText.includes("3-pack")) variant = "3-pack";
      if (rowText.includes("5 pack") || rowText.includes("5-pack")) variant = "5-pack";

      items.push({ name, qty, variant });
    });

    console.log("🟩 ITEMS SENDING →", items);

    if (!items.length) {
      alert("Cart parsing failed.");
      return;
    }

    // SEND TO STRIPE BACKEND
    const res = await fetch("https://axis-checkout.vercel.app/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });

    const data = await res.json();

    if (!data.url) {
      console.error("❌ Stripe returned an error:", data);
      alert("Checkout error.");
      return;
    }

    console.log("➡️ Redirecting to Stripe:", data.url);
    window.location.href = data.url;

  } catch (err) {
    console.error("🔥 Checkout Error:", err);
    alert("Something went wrong.");
  }
}


// =========================
//  HARD OVERRIDE — BLOCK GHL CHECKOUT
// =========================

document.addEventListener("click", function (e) {
  const target = e.target.closest("a, button");
  if (!target) return;

  const txt = (target.textContent || "").toLowerCase();
  const href = (target.getAttribute("href") || "").toLowerCase();
  const action = (target.getAttribute("data-action") || "").toLowerCase();

  if (
    txt.includes("checkout") ||
    href.includes("checkout") ||
    action.includes("checkout")
  ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    console.log("🛑 GHL checkout intercepted — launching Stripe instead");
    startStripeCheckout();
  }
}, true); 
// "true" = capture mode — this ensures we override GHL before it fires
</script>
