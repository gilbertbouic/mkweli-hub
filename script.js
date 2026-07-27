(() => {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const header = document.querySelector(".site-header");
  const nav = document.getElementById("primary-nav");
  const toggle = document.getElementById("nav-toggle");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll(".product-card, .pillar, .who-list li, .contact-card");

  if (reduceMotion) {
    targets.forEach((el) => el.classList.add("visible"));
  } else {
    targets.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => io.observe(el));
  }
})();
