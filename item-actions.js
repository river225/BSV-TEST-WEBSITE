/**
 * TEST SITE ONLY — "Open item page" + "Share" buttons next to the save icon on item cards.
 * Linked via tools/site.json "extras" (index.html, so every generated page gets it too).
 */
(function () {
  "use strict";
  var OPEN_ICON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>';
  var SHARE_ICON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/></svg>';

  function addTo(card) {
    var link = card.querySelector("h3 a.card-item-link");
    if (!link || card.querySelector(".card-item-actions")) return;
    var box = document.createElement("div");
    box.className = "card-item-actions";
    box.innerHTML =
      '<button type="button" class="card-action-btn card-open-btn" aria-label="Open item page">' + OPEN_ICON + "<span>Open item page</span></button>" +
      '<button type="button" class="card-action-btn card-share-btn" aria-label="Share item">' + SHARE_ICON + "<span>Share</span></button>";
    card.appendChild(box);
  }
  function scan(root) { (root || document).querySelectorAll(".card").forEach(addTo); }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, fail) {
      var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? ok() : fail(); } catch (e) { fail(e); } ta.remove();
    });
  }
  function flash(btn) {
    btn.classList.add("is-copied"); btn.setAttribute("data-tip", "Link copied!");
    setTimeout(function () { btn.classList.remove("is-copied"); btn.removeAttribute("data-tip"); }, 1600);
  }

  // One listener for all cards (also works on the spotlight copy of a card).
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".card-open-btn, .card-share-btn");
    if (!btn) return;
    e.preventDefault(); e.stopPropagation();
    var card = btn.closest(".card");
    var link = card && card.querySelector("h3 a.card-item-link");
    if (!link) return;
    if (btn.classList.contains("card-open-btn")) {
      if (typeof window.bsvNavigate === "function" && link.getAttribute("data-bsv-route-section")) {
        window.bsvNavigate({ section: link.getAttribute("data-bsv-route-section"), item: link.getAttribute("data-bsv-route-item") }, "push");
      } else {
        location.href = link.href;
      }
      return;
    }
    var url = new URL(link.getAttribute("href"), location.href).href;
    var name = (card.getAttribute("data-name") || "").trim();
    if (window.matchMedia("(pointer: coarse)").matches && navigator.share) {
      navigator.share({ title: name + " value | BlockSpin Values", url: url }).catch(function () {});
      return;
    }
    copy(url).then(function () { flash(btn); }, function () { window.prompt("Copy this link:", url); });
  }, true);

  var queued = false;
  new MutationObserver(function () {
    if (queued) return; queued = true;
    requestAnimationFrame(function () { queued = false; scan(); });
  }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", function () { scan(); });
})();
