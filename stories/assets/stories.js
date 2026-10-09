/* Mkweli Stories: intro "Listen" buttons and click-to-load YouTube embeds (no YouTube requests until clicked). */
(() => {
  "use strict";
  document.querySelectorAll("button.listen[data-audio]").forEach((btn) => {
    let audio = null;
    btn.addEventListener("click", () => {
      if (!audio) {
        audio = new Audio(btn.dataset.audio);
        audio.addEventListener("ended", () => { btn.textContent = "🔊 Listen"; });
      }
      if (audio.paused) { audio.play(); btn.textContent = "❚❚ Pause"; }
      else { audio.pause(); btn.textContent = "🔊 Listen"; }
    });
  });
  document.querySelectorAll(".yt[data-id]").forEach((box) => {
    const b = box.querySelector("button");
    if (!b) return;
    b.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(box.dataset.id) + "?autoplay=1&rel=0";
      f.title = b.getAttribute("aria-label") || "Video";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      box.replaceChildren(f);
    });
  });
})();
