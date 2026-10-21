const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.getElementById("site-nav");
if (menuToggle && siteNav) {
  const setMenu = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    siteNav.dataset.open = String(open);
  };
  menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  siteNav.addEventListener("click", (event) => { if (event.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") { setMenu(false); menuToggle.focus(); }
  });
  window.matchMedia("(min-width: 64rem)").addEventListener("change", () => setMenu(false));
}

const revealed = document.querySelectorAll("[data-reveal]");
if (revealed.length > 0) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { rootMargin: "0px 0px -10% 0px" });
    revealed.forEach((element) => observer.observe(element));
  } else {
    revealed.forEach((element) => element.classList.add("is-visible"));
  }
}

const lightbox = document.querySelector(".lightbox");
const galleryItems = [...document.querySelectorAll(".gallery-item")];
if (lightbox && galleryItems.length > 0) {
  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".lightbox-caption");
  const sourceAt = (index) => galleryItems[(index + galleryItems.length) % galleryItems.length].querySelector("svg");
  let current = 0;
  const show = (index) => {
    current = (index + galleryItems.length) % galleryItems.length;
    const svg = sourceAt(current);
    const label = svg?.getAttribute("aria-label") || "";
    const markup = svg ? svg.outerHTML : "";
    image.style.display = "none";
    let holder = lightbox.querySelector(".lightbox-svg-holder");
    if (!holder) {
      holder = document.createElement("div");
      holder.className = "lightbox-svg-holder";
      holder.style.maxHeight = "calc(100dvh - 120px)";
      holder.style.width = "min(640px, 90vw)";
      image.insertAdjacentElement("afterend", holder);
    }
    holder.innerHTML = markup;
    if (caption) caption.textContent = label;
  };
  galleryItems.forEach((item, index) => item.addEventListener("click", () => { show(index); lightbox.showModal(); }));
  lightbox.querySelector("[data-prev]")?.addEventListener("click", () => show(current - 1));
  lightbox.querySelector("[data-next]")?.addEventListener("click", () => show(current + 1));
  lightbox.querySelector("[data-close]")?.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
  lightbox.addEventListener("close", () => galleryItems[current]?.focus());
}

document.querySelectorAll("[data-form]").forEach((form) => {
  const status = form.querySelector('[role="status"]');
  const messages = { name: "Enter your name.", email: "Enter an email like name@example.com." };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll("input[required], textarea[required], select[required]").forEach((field) => {
      field.value = field.value.trim();
      const error = document.getElementById(`${field.id}-error`);
      const valid = field.checkValidity();
      field.setAttribute("aria-invalid", String(!valid));
      if (error) {
        error.hidden = valid;
        error.textContent = valid ? "" : messages[field.name] ?? "Fill in this field.";
        if (!valid) field.setAttribute("aria-describedby", error.id);
      }
      if (!valid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }
    const name = form.elements.namedItem("name")?.value.split(" ")[0];
    if (status) status.textContent = name ? `Bedankt, ${name}. We voegen je toe aan de groepschat voor de volgende meetup.` : "Bedankt. We nemen contact op voor de volgende meetup.";
    form.reset();
  });
});