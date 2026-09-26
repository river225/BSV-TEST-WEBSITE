(function () {
  "use strict";

  var SPREADSHEET_ID = "1vAm9x7c5JPxpHxDHVcDgQifXsAvW9iW2wPVuQLENiYs";
  var POSTS_KEY = "bsv-live-trades-v1";
  var LFO_ID = "__looking_for_offers__";
  var TRADE_SHEETS = [
    { sheet: "Uncommon", rarity: "Common / Uncommon", color: "#4caf50" },
    { sheet: "Rare", rarity: "Rare", color: "#4a90e2" },
    { sheet: "Epic", rarity: "Epic", color: "#8e63ce" },
    { sheet: "Legendary", rarity: "Legendary", color: "#f39c12" },
    { sheet: "Omega", rarity: "Omega", color: "#e74c3c" },
    { sheet: "Misc", rarity: "Misc", color: "#ec407a" },
    { sheet: "Vehicles", rarity: "Vehicles", color: "#718096" }
  ];

  var catalog = [];
  var catalogReady = false;
  var catalogPromise = null;
  var draft = {
    giving: [],
    wanting: [],
    givingCash: 0,
    wantingCash: 0,
    lookingForOffers: false
  };
  var pickerSide = "giving";
  var activeFilter = "all";
  var searchQuery = "";
  var pickerRarity = "all";
  var currentSession = { ready: false, discord: null, roblox: null };

  function t(key, fallback) {
    if (window.bsvI18n && typeof window.bsvI18n.t === "function") {
      var out = window.bsvI18n.t(key);
      if (out && out !== key) return out;
    }
    return fallback || key;
  }

  function sitePath(path) {
    if (typeof window.bsvSitePath === "function") return window.bsvSitePath(path);
    return String(path || "").replace(/^\//, "");
  }

  function i18nSection(name) {
    if (window.bsvI18n && typeof window.bsvI18n.tSection === "function") {
      return window.bsvI18n.tSection(name);
    }
    return name;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function formatCash(n) {
    var num = Math.max(0, Math.round(Number(n) || 0));
    if (!num) return "";
    return "$" + num.toLocaleString("en-US");
  }

  function parseCash(raw) {
    var n = parseInt(String(raw || "").replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : Math.max(0, n);
  }

  function uid() {
    return "lt_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function getCellDisplayValue(cell) {
    if (!cell) return "";
    if (cell.f != null && String(cell.f).trim() !== "") return String(cell.f).trim();
    if (cell.v == null) return "";
    return String(cell.v).trim();
  }

  function fetchSheet(sheetName) {
    var base = "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/gviz/tq";
    var url = base + "?tqx=out:json&sheet=" + encodeURIComponent(sheetName) + "&headers=1";
    return fetch(url)
      .then(function (res) {
        return res.text();
      })
      .then(function (text) {
        var json = JSON.parse(text.substring(47, text.length - 2));
        var cols = (json.table.cols || []).map(function (c) {
          return (c.label || "").trim();
        });
        return (json.table.rows || [])
          .map(function (r) {
            var obj = {};
            cols.forEach(function (label, i) {
              obj[label] = getCellDisplayValue(r.c && r.c[i]);
            });
            return obj;
          })
          .filter(function (x) {
            return String(x.Name || "").trim().length > 0;
          });
      })
      .catch(function () {
        return [];
      });
  }

  function loadCatalog() {
    if (catalogPromise) return catalogPromise;
    catalogPromise = Promise.all(
      TRADE_SHEETS.map(function (meta) {
        return fetchSheet(meta.sheet).then(function (rows) {
          return rows.map(function (row) {
            var name = String(row.Name || "").trim();
            return {
              id: meta.sheet + "::" + name.toLowerCase(),
              name: name,
              image: String(row["Image URL"] || row.Image || "").trim(),
              rarity: meta.rarity,
              sheet: meta.sheet,
              color: meta.color,
              value: String(row["Average Value"] || row["Ranged Value"] || "").trim()
            };
          });
        });
      })
    ).then(function (groups) {
      catalog = [];
      groups.forEach(function (g) {
        catalog = catalog.concat(g);
      });
      catalogReady = true;
      return catalog;
    });
    return catalogPromise;
  }

  function readPosts() {
    try {
      var raw = localStorage.getItem(POSTS_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function writePosts(list) {
    try {
      localStorage.setItem(POSTS_KEY, JSON.stringify(list || []));
    } catch (_) {}
  }

  function authorFromSession() {
    var roblox = currentSession.roblox || null;
    var discord = currentSession.discord || currentSession.user || null;
    return {
      robloxUsername: roblox && roblox.username ? roblox.username : "Trader",
      robloxUserId: roblox && roblox.userId ? String(roblox.userId) : "",
      robloxAvatar: (roblox && (roblox.imageUrl || roblox.avatarUrl)) || "",
      discordName: discord
        ? discord.displayName || discord.username || ""
        : "",
      discordId: discord && discord.id ? String(discord.id) : ""
    };
  }

  function isOwnPost(post) {
    var a = authorFromSession();
    if (!post || !post.author) return false;
    if (a.robloxUserId && post.author.robloxUserId) {
      return String(a.robloxUserId) === String(post.author.robloxUserId);
    }
    return (
      a.robloxUsername &&
      post.author.robloxUsername &&
      a.robloxUsername.toLowerCase() === String(post.author.robloxUsername).toLowerCase()
    );
  }

  function timeAgo(ts) {
    var sec = Math.max(0, Math.floor((Date.now() - Number(ts || 0)) / 1000));
    if (sec < 60) return "just now";
    if (sec < 3600) return Math.floor(sec / 60) + "m ago";
    if (sec < 86400) return Math.floor(sec / 3600) + "h ago";
    return Math.floor(sec / 86400) + "d ago";
  }

  /* —— Sections nav (unchanged behavior) —— */
  function closeSectionsMenu() {
    document.body.classList.remove("sections-menu-open");
    var toggle = document.getElementById("sections-menu-toggle");
    var overlay = document.getElementById("sections-menu-overlay");
    if (toggle) {
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open sections menu");
    }
    if (overlay) {
      overlay.classList.remove("active");
      overlay.hidden = true;
    }
    document.body.style.overflow = "";
  }

  function openSectionsMenu() {
    document.body.classList.add("sections-menu-open");
    var toggle = document.getElementById("sections-menu-toggle");
    var overlay = document.getElementById("sections-menu-overlay");
    if (toggle) {
      toggle.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close sections menu");
    }
    if (overlay) {
      overlay.hidden = false;
      overlay.classList.add("active");
    }
    document.body.style.overflow = "hidden";
  }

  function initMobileSectionsMenu() {
    var toggle = document.getElementById("sections-menu-toggle");
    var overlay = document.getElementById("sections-menu-overlay");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      if (document.body.classList.contains("sections-menu-open")) closeSectionsMenu();
      else openSectionsMenu();
    });
    if (overlay) overlay.addEventListener("click", closeSectionsMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeSectionsMenu();
        closePicker();
        setComposerOpen(false);
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeSectionsMenu();
    });
  }

  function buildSectionsNav() {
    var nav = document.getElementById("sections-nav");
    if (!nav || typeof getSectionRegistry !== "function") return;
    nav.innerHTML = "";
    var extrasHeaderShown = false;
    getSectionRegistry().forEach(function (cfg) {
      if (cfg.navGroup === "extras" && !extrasHeaderShown) {
        var gap = document.createElement("div");
        gap.className = "nav-gap";
        nav.appendChild(gap);
        var extrasHeader = document.createElement("div");
        extrasHeader.className = "nav-extras-header";
        extrasHeader.setAttribute("data-i18n", "nav.extras");
        extrasHeader.textContent = t("nav.extras", "Extras");
        nav.appendChild(extrasHeader);
        extrasHeaderShown = true;
      }

      var btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.section = cfg.title;
      btn.textContent = i18nSection(cfg.title);
      if (cfg.id === "live-trading") {
        btn.classList.add("nav-live-trading", "active");
      }
      btn.addEventListener("click", function () {
        closeSectionsMenu();
        if (cfg.id === "live-trading") return;
        if (cfg.pageHref) {
          window.location.href = sitePath(cfg.pageHref);
          return;
        }
        var hash = "#sec=" + encodeURIComponent(cfg.title);
        window.location.href = sitePath("") + hash;
      });
      nav.appendChild(btn);
    });
  }

  function openSharedLogin() {
    if (typeof window.bsvOpenLoginModal === "function") {
      window.bsvOpenLoginModal();
      return;
    }
    setTimeout(function () {
      if (typeof window.bsvOpenLoginModal === "function") window.bsvOpenLoginModal();
    }, 50);
  }

  function applySession(session) {
    session = session || {};
    currentSession = {
      ready: !!session.ready,
      discord: session.discord || session.user || null,
      user: session.discord || session.user || null,
      roblox: session.roblox || null
    };
    var gate = document.getElementById("live-trading-gate");
    var workspace = document.getElementById("live-trading-workspace");
    if (gate) gate.hidden = currentSession.ready;
    if (workspace) workspace.hidden = !currentSession.ready;
    if (currentSession.ready) {
      loadCatalog();
      renderFeed();
    }
    return currentSession;
  }

  function refreshSession() {
    if (typeof window.bsvGetAuthSession === "function") {
      return window.bsvGetAuthSession().then(function (session) {
        return applySession(session || {});
      });
    }
    return Promise.resolve(applySession({ ready: false }));
  }

  function bindLoginUi() {
    var openBtn = document.getElementById("live-trading-open-login");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        openSharedLogin();
        refreshSession();
      });
    }
    document.addEventListener("bsv:authchange", function (e) {
      applySession(e.detail || {});
    });
    document.addEventListener("bsv:languagechange", function () {
      buildSectionsNav();
      refreshSession();
    });
  }

  /* —— Composer / picker / feed —— */
  function setComposerOpen(open) {
    var composer = document.getElementById("lt-composer");
    if (!composer) return;
    composer.hidden = !open;
    if (open) {
      renderDraftChips();
      clearComposerError();
    }
  }

  function clearComposerError() {
    var err = document.getElementById("lt-composer-error");
    if (!err) return;
    err.hidden = true;
    err.textContent = "";
  }

  function showComposerError(msg) {
    var err = document.getElementById("lt-composer-error");
    if (!err) return;
    err.hidden = false;
    err.textContent = msg;
  }

  function chipHtml(entry, side) {
    if (entry.id === LFO_ID) {
      return (
        '<div class="lt-chip lt-chip--lfo" data-id="' +
        LFO_ID +
        '">' +
        '<span class="lt-chip__lfo-icon" aria-hidden="true">💬</span>' +
        '<span class="lt-chip__name">Looking for offers</span>' +
        '<button type="button" class="lt-chip__remove" data-side="' +
        side +
        '" data-id="' +
        LFO_ID +
        '" aria-label="Remove">&times;</button>' +
        "</div>"
      );
    }
    return (
      '<div class="lt-chip" data-id="' +
      escapeAttr(entry.id) +
      '">' +
      (entry.image
        ? '<img class="lt-chip__img" src="' +
          escapeAttr(entry.image) +
          '" alt="" width="36" height="36" loading="lazy" decoding="async">'
        : '<span class="lt-chip__ph" aria-hidden="true"></span>') +
      '<span class="lt-chip__meta">' +
      '<span class="lt-chip__name">' +
      escapeHtml(entry.name) +
      "</span>" +
      '<span class="lt-chip__rarity" style="color:' +
      escapeAttr(entry.color || "#94a3b8") +
      '">' +
      escapeHtml(entry.rarity || "") +
      "</span>" +
      "</span>" +
      '<button type="button" class="lt-chip__remove" data-side="' +
      side +
      '" data-id="' +
      escapeAttr(entry.id) +
      '" aria-label="Remove">&times;</button>' +
      "</div>"
    );
  }

  function renderDraftChips() {
    var givingEl = document.getElementById("lt-giving-chips");
    var wantingEl = document.getElementById("lt-wanting-chips");
    if (givingEl) {
      givingEl.innerHTML = draft.giving.length
        ? draft.giving.map(function (e) {
            return chipHtml(e, "giving");
          }).join("")
        : '<p class="lt-side__hint">Add items from the value list</p>';
    }
    if (wantingEl) {
      if (draft.lookingForOffers) {
        wantingEl.innerHTML = chipHtml(
          { id: LFO_ID, name: "Looking for offers" },
          "wanting"
        );
      } else if (draft.wanting.length) {
        wantingEl.innerHTML = draft.wanting
          .map(function (e) {
            return chipHtml(e, "wanting");
          })
          .join("");
      } else {
        wantingEl.innerHTML =
          '<p class="lt-side__hint">Add items, or Looking for offers</p>';
      }
    }
    var lfoBtn = document.getElementById("lt-add-lfo");
    if (lfoBtn) lfoBtn.classList.toggle("is-on", draft.lookingForOffers);
    var wantAdd = document.querySelector('.lt-side__add[data-add="wanting"]');
    if (wantAdd) wantAdd.disabled = draft.lookingForOffers;
  }

  function removeDraftItem(side, id) {
    if (id === LFO_ID) {
      draft.lookingForOffers = false;
      renderDraftChips();
      return;
    }
    draft[side] = (draft[side] || []).filter(function (e) {
      return e.id !== id;
    });
    renderDraftChips();
  }

  function addDraftItem(side, item) {
    if (side === "wanting" && draft.lookingForOffers) {
      draft.lookingForOffers = false;
    }
    var list = draft[side] || [];
    if (list.some(function (e) {
      return e.id === item.id;
    })) {
      return;
    }
    list.push(item);
    draft[side] = list;
    renderDraftChips();
  }

  function toggleLfo() {
    draft.lookingForOffers = !draft.lookingForOffers;
    if (draft.lookingForOffers) draft.wanting = [];
    renderDraftChips();
  }

  function resetDraft() {
    draft = {
      giving: [],
      wanting: [],
      givingCash: 0,
      wantingCash: 0,
      lookingForOffers: false
    };
    var gc = document.getElementById("lt-giving-cash");
    var wc = document.getElementById("lt-wanting-cash");
    if (gc) gc.value = "";
    if (wc) wc.value = "";
    renderDraftChips();
    clearComposerError();
  }

  function openPicker(side) {
    pickerSide = side;
    pickerRarity = "all";
    var picker = document.getElementById("lt-picker");
    var search = document.getElementById("lt-picker-search");
    if (search) search.value = "";
    if (picker) {
      picker.hidden = false;
      document.body.classList.add("lt-picker-open");
    }
    var title = document.getElementById("lt-picker-title");
    if (title) {
      title.textContent = side === "giving" ? "Add item you're giving" : "Add item you want";
    }
    loadCatalog().then(function () {
      renderPickerRarities();
      renderPickerGrid();
    });
  }

  function closePicker() {
    var picker = document.getElementById("lt-picker");
    if (picker) picker.hidden = true;
    document.body.classList.remove("lt-picker-open");
  }

  function renderPickerRarities() {
    var el = document.getElementById("lt-picker-rarities");
    if (!el) return;
    var labels = ["all"].concat(
      TRADE_SHEETS.map(function (s) {
        return s.rarity;
      })
    );
    el.innerHTML = labels
      .map(function (r) {
        var label = r === "all" ? "All" : r;
        return (
          '<button type="button" class="lt-picker__rarity' +
          (pickerRarity === r ? " is-active" : "") +
          '" data-rarity="' +
          escapeAttr(r) +
          '">' +
          escapeHtml(label) +
          "</button>"
        );
      })
      .join("");
  }

  function renderPickerGrid() {
    var grid = document.getElementById("lt-picker-grid");
    var status = document.getElementById("lt-picker-status");
    if (!grid) return;
    if (!catalogReady) {
      if (status) status.textContent = "Loading items…";
      grid.innerHTML = "";
      return;
    }
    var q = String(
      (document.getElementById("lt-picker-search") || {}).value || ""
    )
      .trim()
      .toLowerCase();
    var items = catalog.filter(function (item) {
      if (pickerRarity !== "all" && item.rarity !== pickerRarity) return false;
      if (!q) return true;
      return item.name.toLowerCase().indexOf(q) !== -1;
    });
    if (status) {
      status.textContent = items.length
        ? items.length + " items"
        : "No items match";
    }
    grid.innerHTML = items
      .slice(0, 180)
      .map(function (item) {
        return (
          '<button type="button" class="lt-picker__item" data-id="' +
          escapeAttr(item.id) +
          '">' +
          (item.image
            ? '<img src="' +
              escapeAttr(item.image) +
              '" alt="" width="56" height="56" loading="lazy" decoding="async">'
            : '<span class="lt-picker__ph"></span>') +
          '<span class="lt-picker__item-name">' +
          escapeHtml(item.name) +
          "</span>" +
          '<span class="lt-picker__item-rarity" style="color:' +
          escapeAttr(item.color) +
          '">' +
          escapeHtml(item.rarity) +
          "</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function findCatalogItem(id) {
    for (var i = 0; i < catalog.length; i++) {
      if (catalog[i].id === id) return catalog[i];
    }
    return null;
  }

  function submitPost() {
    clearComposerError();
    draft.givingCash = parseCash(
      (document.getElementById("lt-giving-cash") || {}).value
    );
    draft.wantingCash = parseCash(
      (document.getElementById("lt-wanting-cash") || {}).value
    );

    if (!draft.giving.length && !draft.givingCash) {
      showComposerError("Add at least one item or cash on your giving side.");
      return;
    }
    if (!draft.lookingForOffers && !draft.wanting.length && !draft.wantingCash) {
      showComposerError("Add what you want, or choose Looking for offers.");
      return;
    }

    var post = {
      id: uid(),
      createdAt: Date.now(),
      author: authorFromSession(),
      giving: {
        items: draft.giving.slice(),
        cash: draft.givingCash
      },
      wanting: {
        items: draft.lookingForOffers ? [] : draft.wanting.slice(),
        cash: draft.wantingCash,
        lookingForOffers: !!draft.lookingForOffers
      }
    };

    var posts = readPosts();
    posts.unshift(post);
    writePosts(posts);
    resetDraft();
    setComposerOpen(false);
    renderFeed();
  }

  function deletePost(id) {
    writePosts(
      readPosts().filter(function (p) {
        return p.id !== id;
      })
    );
    renderFeed();
  }

  function postMatchesFilters(post) {
    if (activeFilter === "mine" && !isOwnPost(post)) return false;
    if (activeFilter === "lfo" && !(post.wanting && post.wanting.lookingForOffers)) {
      return false;
    }
    var q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    var hay = [];
    hay.push((post.author && post.author.robloxUsername) || "");
    hay.push((post.author && post.author.discordName) || "");
    (post.giving.items || []).forEach(function (i) {
      hay.push(i.name);
    });
    (post.wanting.items || []).forEach(function (i) {
      hay.push(i.name);
    });
    if (post.wanting.lookingForOffers) hay.push("looking for offers");
    return hay.join(" ").toLowerCase().indexOf(q) !== -1;
  }

  function stackHtml(side) {
    var items = (side && side.items) || [];
    var cash = side && side.cash ? Number(side.cash) : 0;
    var lfo = !!(side && side.lookingForOffers);
    var parts = [];
    if (lfo) {
      parts.push(
        '<span class="lt-stack__lfo"><span aria-hidden="true">💬</span> Looking for offers</span>'
      );
    }
    items.forEach(function (item) {
      parts.push(
        '<span class="lt-stack__item" title="' +
          escapeAttr(item.name) +
          '">' +
          (item.image
            ? '<img src="' +
              escapeAttr(item.image) +
              '" alt="' +
              escapeAttr(item.name) +
              '" width="40" height="40" loading="lazy" decoding="async">'
            : '<span class="lt-stack__ph"></span>') +
          '<span class="lt-stack__name">' +
          escapeHtml(item.name) +
          "</span>" +
          "</span>"
      );
    });
    if (cash > 0) {
      parts.push(
        '<span class="lt-stack__cash">' + escapeHtml(formatCash(cash)) + "</span>"
      );
    }
    if (!parts.length) {
      parts.push('<span class="lt-stack__empty">—</span>');
    }
    return parts.join("");
  }

  function postCardHtml(post) {
    var author = post.author || {};
    var avatar =
      author.robloxAvatar ||
      (author.robloxUserId
        ? "https://www.roblox.com/headshot-thumbnail/image?userId=" +
          encodeURIComponent(author.robloxUserId) +
          "&width=150&height=150&format=png"
        : "");
    var own = isOwnPost(post);
    return (
      '<article class="lt-post" data-id="' +
      escapeAttr(post.id) +
      '" role="article">' +
      '<header class="lt-post__head">' +
      '<div class="lt-post__author">' +
      (avatar
        ? '<img class="lt-post__avatar" src="' +
          escapeAttr(avatar) +
          '" alt="" width="40" height="40" loading="lazy" decoding="async">'
        : '<span class="lt-post__avatar lt-post__avatar--ph"></span>') +
      '<div class="lt-post__who">' +
      '<p class="lt-post__name">' +
      escapeHtml(author.robloxUsername || "Trader") +
      "</p>" +
      '<p class="lt-post__time">' +
      escapeHtml(timeAgo(post.createdAt)) +
      "</p>" +
      "</div></div>" +
      (own
        ? '<button type="button" class="lt-post__delete" data-delete="' +
          escapeAttr(post.id) +
          '">Delete</button>'
        : "") +
      "</header>" +
      '<div class="lt-post__trade">' +
      '<div class="lt-post__side">' +
      '<p class="lt-post__side-label">Giving</p>' +
      '<div class="lt-stack">' +
      stackHtml(post.giving) +
      "</div></div>" +
      '<div class="lt-post__arrow" aria-hidden="true">→</div>' +
      '<div class="lt-post__side">' +
      '<p class="lt-post__side-label">Wanting</p>' +
      '<div class="lt-stack">' +
      stackHtml(post.wanting) +
      "</div></div>" +
      "</div>" +
      "</article>"
    );
  }

  function renderFeed() {
    var feed = document.getElementById("lt-feed");
    var empty = document.getElementById("lt-feed-empty");
    if (!feed) return;
    var posts = readPosts().filter(postMatchesFilters);
    feed.setAttribute("aria-busy", "false");
    if (!posts.length) {
      feed.innerHTML =
        '<p class="lt-feed__empty" id="lt-feed-empty">' +
        (readPosts().length
          ? "No trades match your filters."
          : "No trade posts yet. Create the first one.") +
        "</p>";
      return;
    }
    feed.innerHTML = posts.map(postCardHtml).join("");
  }

  function bindBoardUi() {
    var openCreate = document.getElementById("lt-open-create");
    var closeCreate = document.getElementById("lt-close-create");
    var submit = document.getElementById("lt-submit-post");
    var lfo = document.getElementById("lt-add-lfo");
    var search = document.getElementById("lt-search");
    var pickerClose = document.getElementById("lt-picker-close");
    var pickerBackdrop = document.getElementById("lt-picker-backdrop");
    var pickerSearch = document.getElementById("lt-picker-search");

    if (openCreate) {
      openCreate.addEventListener("click", function () {
        setComposerOpen(true);
        loadCatalog();
      });
    }
    if (closeCreate) {
      closeCreate.addEventListener("click", function () {
        setComposerOpen(false);
      });
    }
    if (submit) submit.addEventListener("click", submitPost);
    if (lfo) lfo.addEventListener("click", toggleLfo);

    document.querySelectorAll(".lt-side__add").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openPicker(btn.getAttribute("data-add") || "giving");
      });
    });

    document.addEventListener("click", function (e) {
      var remove = e.target.closest && e.target.closest(".lt-chip__remove");
      if (remove) {
        removeDraftItem(remove.getAttribute("data-side"), remove.getAttribute("data-id"));
        return;
      }
      var del = e.target.closest && e.target.closest("[data-delete]");
      if (del) {
        deletePost(del.getAttribute("data-delete"));
        return;
      }
      var pick = e.target.closest && e.target.closest(".lt-picker__item");
      if (pick) {
        var item = findCatalogItem(pick.getAttribute("data-id"));
        if (item) addDraftItem(pickerSide, item);
        closePicker();
        return;
      }
      var rarity = e.target.closest && e.target.closest(".lt-picker__rarity");
      if (rarity) {
        pickerRarity = rarity.getAttribute("data-rarity") || "all";
        renderPickerRarities();
        renderPickerGrid();
        return;
      }
      var filter = e.target.closest && e.target.closest(".lt-filter");
      if (filter) {
        activeFilter = filter.getAttribute("data-filter") || "all";
        document.querySelectorAll(".lt-filter").forEach(function (b) {
          b.classList.toggle("is-active", b === filter);
        });
        renderFeed();
      }
    });

    if (pickerClose) pickerClose.addEventListener("click", closePicker);
    if (pickerBackdrop) pickerBackdrop.addEventListener("click", closePicker);
    if (pickerSearch) {
      pickerSearch.addEventListener("input", function () {
        renderPickerGrid();
      });
    }
    if (search) {
      search.addEventListener("input", function () {
        searchQuery = search.value || "";
        renderFeed();
      });
    }

    window.addEventListener("storage", function (e) {
      if (e.key === POSTS_KEY) renderFeed();
    });
  }

  function init() {
    buildSectionsNav();
    initMobileSectionsMenu();
    bindLoginUi();
    bindBoardUi();
    refreshSession();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
