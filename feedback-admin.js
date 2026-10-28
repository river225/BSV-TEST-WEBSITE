/** Staff page: reads value feedback from the bot (needs Discord login as a BSV server admin). */
(function () {
  "use strict";
  var API = "https://bsv-bot-production.up.railway.app/api/value-feedback";
  var root = document.getElementById("fb-root");
  var data = null, tab = "open", q = "";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function token() { return typeof window.bsvGetAuthToken === "function" ? window.bsvGetAuthToken() : ""; }
  function when(t) { var d = new Date(t); return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }
  function msg(html) { root.innerHTML = '<div class="fb__msg">' + html + "</div>"; }

  function load() {
    var t = token();
    if (!t) { msg('Log in with Discord (top right) using your BSV staff account to see feedback.'); return; }
    fetch(API + "/list", { headers: { Authorization: "Bearer " + t } })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (res) {
        if (res.status === 403) { msg("This page is for BSV server admins only."); return; }
        if (!res.j || !res.j.ok) { msg("Couldn't load feedback. Try again in a minute."); return; }
        data = res.j; paint();
      })
      .catch(function () { msg("Couldn't reach the bot. Try again in a minute."); });
  }

  function paint() {
    var open = data.reports.filter(function (r) { return !r.done; }).length;
    var html = '<div class="fb__tabs">' +
      '<button class="fb__tab' + (tab === "open" ? " is-on" : "") + '" data-tab="open">Open reports (' + open + ")</button>" +
      '<button class="fb__tab' + (tab === "all" ? " is-on" : "") + '" data-tab="all">All reports (' + data.reports.length + ")</button>" +
      '<button class="fb__tab' + (tab === "items" ? " is-on" : "") + '" data-tab="items">Votes per item (' + data.items.length + ")</button></div>" +
      '<div class="fb__bar"><input type="search" id="fb-q" placeholder="Filter by item…" value="' + esc(q) + '"></div>';
    var ql = q.toLowerCase();
    if (tab === "items") {
      var rows = data.items.filter(function (i) { return !ql || i.item.toLowerCase().indexOf(ql) > -1; });
      html += '<table class="fb-table"><thead><tr><th>Item</th><th>Value</th><th>👍</th><th>👎</th><th>Agree</th><th>Last vote</th></tr></thead><tbody>' +
        rows.map(function (i) {
          var pct = i.up + i.down ? Math.round((i.up / (i.up + i.down)) * 100) : 0;
          return "<tr><td><b>" + esc(i.item) + "</b><br><small>" + esc(i.section) + "</small></td><td>" + esc(i.value) + '</td><td class="fb-up">' + i.up + '</td><td class="fb-down">' + i.down + "</td><td>" + pct + "%</td><td>" + when(i.last) + "</td></tr>";
        }).join("") + "</tbody></table>";
    } else {
      var list = data.reports.filter(function (r) { return (tab === "all" || !r.done) && (!ql || r.item.toLowerCase().indexOf(ql) > -1); });
      html += '<div class="fb__list">' + (list.length ? list.map(function (r) {
        return '<div class="fb-card' + (r.done ? " is-done" : "") + '">' +
          "<div><h3>" + (r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.item) + "</a>" : esc(r.item)) + "</h3>" +
          '<div class="fb-card__meta">' + esc(r.section) + " · " + when(r.t) + (r.site === "test" ? " · test site" : "") + "</div>" +
          '<div class="fb-card__vals">Current <b>' + esc(r.value || "N/A") + "</b>" + (r.suggested ? " · They say <i>" + esc(r.suggested) + "</i>" : "") + "</div></div>" +
          '<button class="fb-card__done" data-id="' + esc(r.id) + '" data-done="' + (r.done ? "0" : "1") + '">' + (r.done ? "Reopen" : "Mark done") + "</button>" +
          '<p class="fb-card__why">' + esc(r.reason || "No reason given") + "</p></div>";
      }).join("") : '<div class="fb__msg">Nothing here yet.</div>') + "</div>";
    }
    root.innerHTML = html;
  }

  root.addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab]");
    if (t) { tab = t.getAttribute("data-tab"); paint(); return; }
    var d = e.target.closest(".fb-card__done");
    if (!d) return;
    var id = d.getAttribute("data-id"), done = d.getAttribute("data-done") === "1";
    d.disabled = true;
    fetch(API + "/resolve", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token() }, body: JSON.stringify({ id: id, done: done }) })
      .then(function () { data.reports.forEach(function (r) { if (r.id === id) r.done = done; }); paint(); })
      .catch(function () { d.disabled = false; });
  });
  root.addEventListener("input", function (e) {
    if (e.target.id !== "fb-q") return;
    q = e.target.value; var pos = e.target.selectionStart; paint();
    var inp = document.getElementById("fb-q"); inp.focus(); inp.setSelectionRange(pos, pos);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(load, 300); });
  else setTimeout(load, 300);
})();
