(function () {
  "use strict";

  var SPREADSHEET_ID = "1vAm9x7c5JPxpHxDHVcDgQifXsAvW9iW2wPVuQLENiYs";
  var POSTS_KEY = "bsv-live-trades-v1";
  var EMPTY_SLOT_COUNT = 8;
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
    lookingForOffers: false,
    notLookingForOffers: false
  };
  var pickerSide = "giving";
  var searchScope = "all";
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
      renderDraftGrids();
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

  function itemSlotHtml(entry, side) {
    var qty = Math.max(1, Number(entry.qty) || 1);
    return (
      '<div class="lt-slot lt-slot--item" data-id="' +
      escapeAttr(entry.id) +
      '" title="' +
      escapeAttr(entry.name) +
      '">' +
      (qty > 1
        ? '<span class="lt-slot__qty">' + escapeHtml(String(qty) + "×") + "</span>"
        : "") +
      '<button type="button" class="lt-slot__remove" data-side="' +
      side +
      '" data-id="' +
      escapeAttr(entry.id) +
      '" aria-label="Remove one">&times;</button>' +
      (entry.image
        ? '<img class="lt-slot__img" src="' +
          escapeAttr(entry.image) +
          '" alt="" width="56" height="56" loading="lazy" decoding="async">'
        : '<span class="lt-slot__ph" aria-hidden="true"></span>') +
      '<span class="lt-slot__name">' +
      escapeHtml(entry.name) +
      "</span>" +
      "</div>"
    );
  }

  function renderSideGrid(side) {
    var el = document.getElementById(
      side === "giving" ? "lt-giving-grid" : "lt-wanting-grid"
    );
    if (!el) return;
    var list = draft[side] || [];
    var html = [];
    html.push(
      '<button type="button" class="lt-slot lt-slot--add" data-add="' +
        side +
        '">' +
        '<span class="lt-slot__add-plus" aria-hidden="true">+</span>' +
        '<span class="lt-slot__add-label">Add Item</span>' +
        "</button>"
    );
    list.forEach(function (entry) {
      html.push(itemSlotHtml(entry, side));
    });
    var empties = Math.max(0, EMPTY_SLOT_COUNT - list.length);
    for (var i = 0; i < empties; i++) {
      html.push('<div class="lt-slot lt-slot--empty" aria-hidden="true"></div>');
    }
    el.innerHTML = html.join("");
  }

  function renderDraftGrids() {
    renderSideGrid("giving");
    renderSideGrid("wanting");
    var lfoBtn = document.getElementById("lt-add-lfo");
    var nlfoBtn = document.getElementById("lt-add-nlfo");
    if (lfoBtn) lfoBtn.classList.toggle("is-on", !!draft.lookingForOffers);
    if (nlfoBtn) nlfoBtn.classList.toggle("is-on", !!draft.notLookingForOffers);
  }

  function removeDraftItem(side, id) {
    var list = draft[side] || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id !== id) continue;
      var qty = Math.max(1, Number(list[i].qty) || 1);
      if (qty > 1) {
        list[i].qty = qty - 1;
      } else {
        list.splice(i, 1);
      }
      break;
    }
    draft[side] = list;
    renderDraftGrids();
  }

  function addDraftItem(side, item) {
    var list = draft[side] || [];
    var existing = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === item.id) {
        existing = list[i];
        break;
      }
    }
    if (existing) {
      existing.qty = Math.max(1, Number(existing.qty) || 1) + 1;
    } else {
      list.push({
        id: item.id,
        name: item.name,
        rarity: item.rarity,
        color: item.color,
        image: item.image || "",
        qty: 1
      });
    }
    draft[side] = list;
    renderDraftGrids();
  }

  function toggleLfo() {
    draft.lookingForOffers = !draft.lookingForOffers;
    if (draft.lookingForOffers) draft.notLookingForOffers = false;
    renderDraftGrids();
  }

  function toggleNlfo() {
    draft.notLookingForOffers = !draft.notLookingForOffers;
    if (draft.notLookingForOffers) draft.lookingForOffers = false;
    renderDraftGrids();
  }

  function resetDraft() {
    draft = {
      giving: [],
      wanting: [],
      givingCash: 0,
      wantingCash: 0,
      lookingForOffers: false,
      notLookingForOffers: false
    };
    var gc = document.getElementById("lt-giving-cash");
    var wc = document.getElementById("lt-wanting-cash");
    if (gc) gc.value = "";
    if (wc) wc.value = "";
    renderDraftGrids();
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
      title.textContent = side === "giving" ? "Add to I Have" : "Add to I Want";
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
      showComposerError("Add at least one item or cash on I Have.");
      return;
    }
    if (
      !draft.lookingForOffers &&
      !draft.notLookingForOffers &&
      !draft.wanting.length &&
      !draft.wantingCash
    ) {
      showComposerError("Add items or cash on I Want, or pick a tag.");
      return;
    }

    var post = {
      id: uid(),
      createdAt: Date.now(),
      author: authorFromSession(),
      giving: {
        items: draft.giving.map(function (e) {
          return {
            id: e.id,
            name: e.name,
            rarity: e.rarity,
            color: e.color,
            image: e.image || "",
            qty: Math.max(1, Number(e.qty) || 1)
          };
        }),
        cash: draft.givingCash
      },
      wanting: {
        items: draft.wanting.map(function (e) {
          return {
            id: e.id,
            name: e.name,
            rarity: e.rarity,
            color: e.color,
            image: e.image || "",
            qty: Math.max(1, Number(e.qty) || 1)
          };
        }),
        cash: draft.wantingCash,
        lookingForOffers: !!draft.lookingForOffers,
        notLookingForOffers: !!draft.notLookingForOffers
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

  function sideItemNames(side) {
    return ((side && side.items) || []).map(function (i) {
      return String(i.name || "");
    });
  }

  function postMatchesFilters(post) {
    var q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    var offering = sideItemNames(post.giving);
    var requesting = sideItemNames(post.wanting);
    var hay =
      searchScope === "offering"
        ? offering
        : searchScope === "requesting"
          ? requesting
          : offering.concat(requesting);
    return hay.some(function (name) {
      return name.toLowerCase().indexOf(q) !== -1;
    });
  }

  function itemPhrase(item) {
    var qty = Math.max(1, Number(item.qty) || 1);
    var name = String(item.name || "Item");
    if (qty > 1) return qty + "× " + name;
    return name;
  }

  function joinPhrases(parts) {
    var list = (parts || []).filter(Boolean);
    if (!list.length) return "";
    if (list.length === 1) return list[0];
    if (list.length === 2) return list[0] + " and " + list[1];
    return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
  }

  function sidePhrase(side, emptyLabel) {
    var parts = [];
    ((side && side.items) || []).forEach(function (item) {
      parts.push(itemPhrase(item));
    });
    if (side && side.cash) parts.push(formatCash(side.cash));
    if (side && side.lookingForOffers) parts.push("Looking for offers");
    if (side && side.notLookingForOffers) parts.push("Not looking for offers");
    return joinPhrases(parts) || emptyLabel || "nothing";
  }

  function infoSummary(post) {
    return (
      sidePhrase(post.giving, "nothing") +
      " for " +
      sidePhrase(post.wanting, "nothing")
    );
  }

  function stackHtml(side) {
    var items = (side && side.items) || [];
    var cash = side && side.cash ? Number(side.cash) : 0;
    var parts = [];
    items.forEach(function (item) {
      var qty = Math.max(1, Number(item.qty) || 1);
      parts.push(
        '<span class="lt-stack__item" title="' +
          escapeAttr(item.name) +
          '">' +
          (qty > 1
            ? '<span class="lt-stack__qty">' +
              escapeHtml(String(qty) + "×") +
              "</span>"
            : "") +
          (item.image
            ? '<img src="' +
              escapeAttr(item.image) +
              '" alt="' +
              escapeAttr(item.name) +
              '" width="44" height="44" loading="lazy" decoding="async">'
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
    if (side && side.lookingForOffers) {
      parts.push('<span class="lt-stack__tag lt-stack__tag--lfo">Looking for offers</span>');
    }
    if (side && side.notLookingForOffers) {
      parts.push(
        '<span class="lt-stack__tag lt-stack__tag--nlfo">Not looking for offers</span>'
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
      '<span class="lt-post__side-pill">I Have</span>' +
      '<div class="lt-stack lt-stack--scroll">' +
      stackHtml(post.giving) +
      "</div></div>" +
      '<div class="lt-post__side">' +
      '<span class="lt-post__side-pill">I Want</span>' +
      '<div class="lt-stack lt-stack--scroll">' +
      stackHtml(post.wanting) +
      "</div></div>" +
      "</div>" +
      '<details class="lt-post__info">' +
      "<summary>Info</summary>" +
      '<p class="lt-post__info-text">' +
      escapeHtml(infoSummary(post)) +
      "</p>" +
      "</details>" +
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
    var nlfo = document.getElementById("lt-add-nlfo");
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
    if (nlfo) nlfo.addEventListener("click", toggleNlfo);

    document.addEventListener("click", function (e) {
      var addBtn = e.target.closest && e.target.closest(".lt-slot--add");
      if (addBtn) {
        openPicker(addBtn.getAttribute("data-add") || "giving");
        return;
      }
      var remove = e.target.closest && e.target.closest(".lt-slot__remove");
      if (remove) {
        removeDraftItem(
          remove.getAttribute("data-side"),
          remove.getAttribute("data-id")
        );
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
      var scope = e.target.closest && e.target.closest(".lt-search__scope");
      if (scope) {
        searchScope = scope.getAttribute("data-scope") || "all";
        document.querySelectorAll(".lt-search__scope").forEach(function (b) {
          b.classList.toggle("is-active", b === scope);
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
