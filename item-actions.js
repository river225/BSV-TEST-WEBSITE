/**
 * TEST SITE ONLY — Save / "Item page" / "Share" buttons along the bottom-left of item cards, and an
 * "Value accurate?" thumbs up/down at the bottom-right (feedback goes to the bot, staff read it on feedback.html).
 * Linked via tools/site.json "extras" (index.html, so every generated page gets it too).
 */
(function () {
  "use strict";
  var OPEN_ICON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>';
  var THUMB_UP = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3z"/><path d="M7 10l4-7a2 2 0 0 1 3 1.7V9h5.2a2 2 0 0 1 2 2.3l-1.3 8A2 2 0 0 1 17.9 21H7"/></svg>';
  var SHARE_ICON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/></svg>';

  function addTo(card) {
    var link = card.querySelector("h3 a.card-item-link");
    if (!link || card.querySelector(".card-item-actions")) return;
    var box = document.createElement("div");
    box.className = "card-item-actions";
    box.innerHTML =
      '<button type="button" class="card-action-btn card-open-btn" aria-label="Open item page">' + OPEN_ICON + "<span>Item page</span></button>" +
      '<button type="button" class="card-action-btn card-share-btn" aria-label="Share item">' + SHARE_ICON + "<span>Share</span></button>";
    // Save sits first, then Item page and Share, along the bottom-left.
    var save = card.querySelector(".card-save-btn");
    if (save) box.insertBefore(save, box.firstChild);
    card.appendChild(box);
    // "Is this value accurate?" at the bottom-right.
    if (!card.querySelector(".card-vote")) {
      var vote = document.createElement("div");
      vote.className = "card-vote";
      vote.innerHTML = '<span class="card-vote__q">Value accurate?</span>' +
        '<span class="card-vote__btns">' +
          '<button type="button" class="card-vote__btn" data-vote="up" aria-label="Yes, this value is accurate">' + THUMB_UP + "</button>" +
          '<button type="button" class="card-vote__btn card-vote__btn--down" data-vote="down" aria-label="No, this value is not accurate">' + THUMB_UP + "</button>" +
        "</span>";
      card.appendChild(vote);
    }
  }

  /* ---------- value feedback ---------- */
  var API = "https://bsv-bot-production.up.railway.app/api/value-feedback";
  var VOTED_KEY = "bsv-value-votes";
  function voted() { try { return JSON.parse(localStorage.getItem(VOTED_KEY) || "{}") || {}; } catch (_) { return {}; } }
  function remember(name, v) { try { var m = voted(); m[name] = { v: v, t: Date.now() }; localStorage.setItem(VOTED_KEY, JSON.stringify(m)); } catch (_) {} }
  function cardInfo(card) {
    var link = card.querySelector("h3 a.card-item-link");
    var name = (link ? link.getAttribute("data-bsv-route-item") : "") || (card.getAttribute("data-name") || "").trim() || (card.querySelector("h3") || {}).textContent || "";
    var avg = card.querySelector(".avg-value");
    return {
      item: String(name).trim(),
      section: link ? link.getAttribute("data-bsv-route-section") || "" : "",
      value: avg ? avg.textContent.trim() : "",
      url: link ? new URL(link.getAttribute("href"), location.href).href : location.href
    };
  }
  function sendVote(data) {
    data.site = document.documentElement.getAttribute("data-bsv-env") === "test" || /BSV-TEST-WEBSITE/i.test(location.pathname) ? "test" : "main";
    return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .catch(function () { return { ok: false }; });
  }
  function markVoted(card, v) {
    var box = card.querySelector(".card-vote");
    if (!box) return;
    box.classList.add("is-voted");
    box.querySelectorAll(".card-vote__btn").forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-vote") === v); b.disabled = true; });
    box.querySelector(".card-vote__q").textContent = "Thanks!";
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function openReport(card) {
    var info = cardInfo(card);
    var pop = document.createElement("div");
    pop.className = "vote-pop";
    pop.innerHTML =
      '<form class="vote-pop__box" role="dialog" aria-modal="true" aria-labelledby="vote-pop-t">' +
        '<button type="button" class="vote-pop__x" data-act="close" aria-label="Close">×</button>' +
        '<h3 id="vote-pop-t">What\'s wrong with the value of ' + esc(info.item) + "?</h3>" +
        '<p class="vote-pop__now">Current average value: <b>' + esc(info.value || "N/A") + "</b></p>" +
        '<label class="vote-pop__lbl">What do you think it\'s worth? <span>(optional)</span><input type="text" name="suggested" maxlength="40" placeholder="e.g. 1.2M" autocomplete="off"></label>' +
        '<label class="vote-pop__lbl">Why do you think the value isn\'t accurate?<textarea name="reason" maxlength="600" rows="4" required placeholder="e.g. People are only paying 900k for it in trades right now"></textarea></label>' +
        '<p class="vote-pop__err" hidden></p>' +
        '<button type="submit" class="vote-pop__send">Send feedback</button>' +
      "</form>";
    document.body.appendChild(pop);
    var form = pop.querySelector("form");
    function close() { pop.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    pop.addEventListener("click", function (e) { if (e.target === pop || (e.target.closest && e.target.closest("[data-act=close]"))) close(); });
    form.querySelector("textarea").focus();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector(".vote-pop__send"), err = form.querySelector(".vote-pop__err");
      var reason = form.reason.value.trim();
      if (reason.length < 3) { err.hidden = false; err.textContent = "Please tell us a little about why."; return; }
      btn.disabled = true; btn.textContent = "Sending…";
      info.vote = "down"; info.reason = reason; info.suggested = form.suggested.value.trim();
      sendVote(info).then(function (r) {
        if (r && (r.ok || r.error === "already")) {
          remember(info.item, "down"); markVoted(card, "down");
          form.innerHTML = '<h3>Thanks for the feedback!</h3><p class="vote-pop__now">Our value team will look at ' + esc(info.item) + '.</p><button type="button" class="vote-pop__send" data-act="close">Close</button>';
        } else {
          btn.disabled = false; btn.textContent = "Send feedback";
          err.hidden = false; err.textContent = r && r.error === "slow" ? "Too many votes — try again later." : "Couldn't send right now. Please try again.";
        }
      });
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".card-vote__btn");
    if (!b || b.disabled) return;
    e.preventDefault(); e.stopPropagation();
    var card = b.closest(".card");
    if (!card) return;
    if (b.getAttribute("data-vote") === "down") { openReport(card); return; }
    var info = cardInfo(card);
    info.vote = "up";
    markVoted(card, "up"); remember(info.item, "up");
    sendVote(info);
  }, true);
  function restoreVotes(root) {
    var m = voted(), now = Date.now();
    (root || document).querySelectorAll(".card .card-vote:not(.is-voted)").forEach(function (box) {
      var card = box.closest(".card"), info = cardInfo(card), v = m[info.item];
      if (v && now - v.t < 12 * 3600 * 1000) markVoted(card, v.v);
    });
  }
  function scan(root) { (root || document).querySelectorAll(".card").forEach(addTo); restoreVotes(root); }

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
    // Short branded share link (preview card + forwards to this item page on the test site).
    var slugMatch = /\/items\/([^/]+)\/?$/.exec(link.getAttribute("href") || "");
    var url = slugMatch ? "https://share.blockspinvalues.com/ti/" + slugMatch[1] : new URL(link.getAttribute("href"), location.href).href;
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
