(() => {
  "use strict";

  const root = document.documentElement;
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Theme: system default, user override in localStorage */
  const stored = localStorage.getItem("mkweli-theme");
  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current =
        root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("mkweli-theme", next);
    });
  }

  const header = document.querySelector(".site-header");
  const nav = document.getElementById("primary-nav");
  const toggle = document.getElementById("nav-toggle");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const isFr = document.documentElement.lang === "fr";
  const menuOpenLabel = isFr ? "Ouvrir le menu" : "Open menu";
  const menuCloseLabel = isFr ? "Fermer le menu" : "Close menu";

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
      toggle.setAttribute("aria-label", open ? menuOpenLabel : menuCloseLabel);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
        toggle.setAttribute("aria-label", menuOpenLabel);
      });
    });
  }

  /* Keep the current section when switching EN <-> FR. */
  const PAGE_TWINS = {
    "/": { en: "/", fr: "/accueil.html" },
    "/index.html": { en: "/", fr: "/accueil.html" },
    "/accueil.html": { en: "/", fr: "/accueil.html" },
    "/websites.html": { en: "/websites.html", fr: "/sites.html" },
    "/sites.html": { en: "/websites.html", fr: "/sites.html" },
    "/about.html": { en: "/about.html", fr: "/a-propos.html" },
    "/a-propos.html": { en: "/about.html", fr: "/a-propos.html" },
    "/privacy.html": { en: "/privacy.html", fr: "/confidentialite.html" },
    "/confidentialite.html": { en: "/privacy.html", fr: "/confidentialite.html" },
  };
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const twins = PAGE_TWINS[path] || PAGE_TWINS[path + ".html"];
  if (twins) {
    document.querySelectorAll(".lang-switch a[hreflang]").forEach((a) => {
      const dest = twins[a.getAttribute("hreflang")];
      if (dest) a.setAttribute("href", dest + location.hash);
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll(
    ".product-card, .pillar, .who-list li, .contact-card, .pkg, .work-card, .step-card, .web-teaser"
  );

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

  if (themeToggle) {
    const syncPressed = () => {
      const mode =
        root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      themeToggle.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
    };
    syncPressed();
    themeToggle.addEventListener("click", () => {
      window.setTimeout(syncPressed, 0);
    });
  }

  const notify = document.getElementById("tool-notify");
  if (notify) {
    const input = notify.querySelector("input[type='email']");
    const error = document.getElementById("notify-error");
    notify.addEventListener("submit", (event) => {
      const value = (input && input.value.trim()) || "";
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!ok) {
        event.preventDefault();
        if (input) input.setAttribute("aria-invalid", "true");
        if (error) {
          error.hidden = false;
          error.textContent = document.documentElement.lang === "fr"
            ? "Indiquez une adresse e-mail valide."
            : "Enter a valid email address.";
        }
        if (input) input.focus();
        return;
      }
      if (input) input.removeAttribute("aria-invalid");
      if (error) error.hidden = true;
      if (notify.action.indexOf("TODO") !== -1) {
        event.preventDefault();
        const subject = document.documentElement.lang === "fr"
          ? "Avis sur les outils Mkweli"
          : "Mkweli tool updates";
        window.location.href =
          "mailto:support@mkweli.tech?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(value);
      }
    });
  }
})();
