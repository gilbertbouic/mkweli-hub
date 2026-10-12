/* Tiny visit counter for the footer.
   Service: Abacus (https://abacus.jasoncameron.dev), free, no account, no cookies.
   Counts one visit per browser tab session. Stays hidden if the service does not answer. */
(function () {
  "use strict";
  var el = document.getElementById("visit-counter");
  if (!el || !window.fetch) return;
  var BASE = "https://abacus.jasoncameron.dev";
  var PATH = "/mkweli-tech/visits";
  var lang = document.documentElement.lang || "en";

  function run() {
    var seen = false;
    try { seen = sessionStorage.getItem("mkweliVisitCounted") === "1"; } catch (e) {}
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 4000);
    fetch(BASE + (seen ? "/get" : "/hit") + PATH, {
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        clearTimeout(timer);
        var n = data && Number(data.value);
        if (!n || !isFinite(n) || n < 1) return;
        try { sessionStorage.setItem("mkweliVisitCounted", "1"); } catch (e) {}
        var num = el.querySelector(".visit-count");
        if (num) num.textContent = n.toLocaleString(lang.indexOf("fr") === 0 ? "fr-FR" : "en-GB");
        el.hidden = false;
      })
      .catch(function () { clearTimeout(timer); });
  }

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule);
  function schedule() {
    if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 3000 });
    else setTimeout(run, 1);
  }
})();
