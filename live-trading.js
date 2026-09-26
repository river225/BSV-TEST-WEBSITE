(function () {
  "use strict";

  function t(key, fallback) {
    if (window.bsvI18n && typeof window.bsvI18n.t === "function") {
      return window.bsvI18n.t(key);
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
      if (e.key === "Escape") closeSectionsMenu();
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

  var RESUME_LOGIN_KEY = "bsv-live-trading-resume-login";

  function setModalOpen(open) {
    var modal = document.getElementById("live-trading-login-modal");
    if (!modal) return;
    modal.hidden = !open;
    document.body.classList.toggle("live-trading-login-open", open);
  }

  function markResumeLoginModal() {
    try {
      sessionStorage.setItem(RESUME_LOGIN_KEY, "1");
    } catch (_) {}
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("lt_login", "1");
      var qs = url.searchParams.toString();
      history.replaceState(null, "", url.pathname + (qs ? "?" + qs : "") + url.hash);
    } catch (_) {}
  }

  function shouldResumeLoginModal() {
    try {
      if (sessionStorage.getItem(RESUME_LOGIN_KEY) === "1") return true;
    } catch (_) {}
    try {
      return new URLSearchParams(window.location.search || "").get("lt_login") === "1";
    } catch (_) {
      return false;
    }
  }

  function clearResumeLoginModal() {
    try {
      sessionStorage.removeItem(RESUME_LOGIN_KEY);
    } catch (_) {}
    try {
      var url = new URL(window.location.href);
      if (!url.searchParams.has("lt_login")) return;
      url.searchParams.delete("lt_login");
      var qs = url.searchParams.toString();
      history.replaceState(null, "", url.pathname + (qs ? "?" + qs : "") + url.hash);
    } catch (_) {}
  }

  function startDiscordLoginAndResume() {
    markResumeLoginModal();
    if (typeof window.startDiscordLogin === "function") window.startDiscordLogin();
  }

  function startRobloxLoginAndResume() {
    markResumeLoginModal();
    var err = document.getElementById("live-trading-roblox-error");
    if (err) err.hidden = true;
    if (typeof window.startRobloxLogin === "function") window.startRobloxLogin();
  }

  function applySession(session) {
    session = session || {};
    var ready = !!session.ready;
    var discord = session.discord || session.user || null;
    var roblox = session.roblox || null;

    var gate = document.getElementById("live-trading-gate");
    var workspace = document.getElementById("live-trading-workspace");
    if (gate) gate.hidden = ready;
    if (workspace) workspace.hidden = !ready;

    var stepDiscord = document.getElementById("live-trading-step-discord");
    var stepRoblox = document.getElementById("live-trading-step-roblox");
    var discordStatus = document.getElementById("live-trading-discord-status");
    var robloxStatus = document.getElementById("live-trading-roblox-status");
    var discordBtn = document.getElementById("live-trading-discord-btn");
    var robloxBtn = document.getElementById("live-trading-roblox-btn");

    if (stepDiscord) stepDiscord.classList.toggle("is-complete", !!discord);
    if (stepRoblox) {
      stepRoblox.classList.toggle("is-complete", !!roblox);
      stepRoblox.classList.toggle("is-locked", !discord);
    }
    if (discordStatus) {
      discordStatus.textContent = discord
        ? t("liveTrading.discordDone", "Discord connected") +
          (discord.displayName || discord.username ? " · " + (discord.displayName || discord.username) : "")
        : "";
    }
    if (robloxStatus) {
      robloxStatus.textContent = roblox
        ? t("liveTrading.robloxDone", "Roblox connected") +
          (roblox.username ? " · " + roblox.username : "")
        : "";
    }
    if (discordBtn) {
      discordBtn.disabled = !!discord;
      discordBtn.hidden = !!discord;
    }
    if (robloxBtn) {
      robloxBtn.disabled = !discord || !!roblox;
      robloxBtn.hidden = !!roblox;
    }

    if (ready) setModalOpen(false);
    return {
      ready: ready,
      discord: discord,
      user: discord,
      roblox: roblox
    };
  }

  function refreshSession() {
    if (typeof window.bsvGetAuthSession === "function") {
      return window.bsvGetAuthSession().then(function (session) {
        return applySession(session || {});
      });
    }
    return Promise.resolve(applySession({ ready: false, discord: null, roblox: null }));
  }

  function resumeLoginModalIfNeeded(session) {
    if (!shouldResumeLoginModal()) return;
    clearResumeLoginModal();
    if (session && session.ready) return;
    setModalOpen(true);
  }

  function bindLoginUi() {
    var openBtn = document.getElementById("live-trading-open-login");
    var closeBtn = document.getElementById("live-trading-login-close");
    var backdrop = document.getElementById("live-trading-login-backdrop");
    var discordBtn = document.getElementById("live-trading-discord-btn");
    var robloxBtn = document.getElementById("live-trading-roblox-btn");
    var robloxError = document.getElementById("live-trading-roblox-error");

    if (openBtn) {
      openBtn.addEventListener("click", function () {
        setModalOpen(true);
        refreshSession();
      });
    }
    if (closeBtn) closeBtn.addEventListener("click", function () { setModalOpen(false); });
    if (backdrop) backdrop.addEventListener("click", function () { setModalOpen(false); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setModalOpen(false);
    });

    if (discordBtn) {
      discordBtn.addEventListener("click", startDiscordLoginAndResume);
    }

    // Header Log In on this page should also return into the login steps modal.
    document.addEventListener(
      "click",
      function (e) {
        var btn = e.target && e.target.closest ? e.target.closest("#nav-login-btn.nav-login-btn--signin") : null;
        if (!btn) return;
        markResumeLoginModal();
      },
      true
    );

    if (robloxBtn) {
      robloxBtn.addEventListener("click", startRobloxLoginAndResume);
    }

    try {
      if (new URLSearchParams(window.location.search || "").get("bsv_roblox_error") ||
          (window.location.hash || "").indexOf("bsv_roblox_error=") !== -1) {
        if (robloxError) robloxError.hidden = false;
        setModalOpen(true);
      }
    } catch (_) {}

    document.addEventListener("bsv:authchange", function (e) {
      applySession(e.detail || {});
    });
    document.addEventListener("bsv:languagechange", function () {
      buildSectionsNav();
      refreshSession();
    });
  }

  function init() {
    buildSectionsNav();
    initMobileSectionsMenu();
    bindLoginUi();
    // Same first paint for every visitor; auth only toggles visibility after load.
    // After Discord OAuth, reopen the login steps modal so Step 2 is ready.
    refreshSession().then(resumeLoginModalIfNeeded);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
