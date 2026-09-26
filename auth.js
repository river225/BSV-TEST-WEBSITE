(function () {
  function removeWrongSiteBanner() {
    var el = document.getElementById("auth-wrong-site-banner");
    if (el) el.remove();
  }
  removeWrongSiteBanner();
  document.addEventListener("DOMContentLoaded", removeWrongSiteBanner);
  window.addEventListener("pageshow", removeWrongSiteBanner);

  var AUTH_TOKEN_KEY = "bsv-discord-auth";
  var ROBLOX_LINK_KEY = "bsv-roblox-link";
  var ROBLOX_TOKEN_KEY = "bsv-roblox-auth";
  var OAUTH_RETURN_KEY = "bsv-oauth-return-to";
  var RESUME_LOGIN_KEY = "bsv-resume-login-modal";
  var DEFAULT_AVATAR = "https://i.ibb.co/Tq7DLCJt/dsfbvbvxcxbvn.png";
  var logoutTestObserver = null;
  var cachedDiscordUser = null;
  var cachedRobloxLink = null;
  var logoutChoicesOpen = false;

  function apiBase() {
    if (typeof window.bsvBotApiUrl === "function") return window.bsvBotApiUrl("");
    if (window.BSV_BOT_PUBLIC_BASE) return String(window.BSV_BOT_PUBLIC_BASE).replace(/\/+$/, "");
    return "https://bsv-bot-production.up.railway.app";
  }

  function authUrl(path) {
    var base = apiBase();
    var p = String(path || "").replace(/^\/+/, "");
    return p ? base + "/" + p : base;
  }

  function t(key, fallback, vars) {
    if (window.bsvI18n && typeof window.bsvI18n.t === "function") {
      var out = window.bsvI18n.t(key, vars || {});
      if (out && out !== key) return out;
    }
    var text = fallback || key;
    if (vars && vars.name != null) text = String(text).replace(/\{name\}/g, String(vars.name));
    return text;
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

  function getAuthToken() {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (_) {
      return null;
    }
  }

  function setAuthToken(token) {
    try {
      if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
      else localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (_) {}
  }

  function saveOAuthReturnTo() {
    var url = window.location.href.split("#")[0];
    try {
      sessionStorage.setItem(OAUTH_RETURN_KEY, url);
      if (!isTestSite()) {
        localStorage.setItem(OAUTH_RETURN_KEY, url);
      }
    } catch (_) {}
  }

  function clearOAuthReturnTo() {
    try {
      sessionStorage.removeItem(OAUTH_RETURN_KEY);
      localStorage.removeItem(OAUTH_RETURN_KEY);
    } catch (_) {}
  }

  function isDevSite() {
    if (document.documentElement && document.documentElement.dataset.bsvEnv === "test") return true;
    return !!document.querySelector('meta[name="bsv-env"][content="test"]');
  }

  function isTestSite() {
    if (isDevSite()) return true;
    var host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
    return /\.github\.io$/i.test(host);
  }

  var MAIN_SITE_ORIGINS = {
    "https://blockspinvalues.com": true,
    "https://www.blockspinvalues.com": true
  };

  function isMainLiveSite() {
    var host = window.location.hostname;
    return host === "blockspinvalues.com" || host === "www.blockspinvalues.com";
  }

  function purgeStaleMainReturnUrl() {
    if (!isTestSite()) return;
    try {
      var stored = localStorage.getItem(OAUTH_RETURN_KEY);
      if (!stored) return;
      if (MAIN_SITE_ORIGINS[new URL(stored).origin]) {
        localStorage.removeItem(OAUTH_RETURN_KEY);
      }
    } catch (_) {}
  }

  purgeStaleMainReturnUrl();

  function getRobloxToken() {
    try {
      return localStorage.getItem(ROBLOX_TOKEN_KEY);
    } catch (_) {
      return null;
    }
  }

  function setRobloxToken(token) {
    try {
      if (token) localStorage.setItem(ROBLOX_TOKEN_KEY, token);
      else localStorage.removeItem(ROBLOX_TOKEN_KEY);
    } catch (_) {}
  }

  function readRobloxLink() {
    try {
      var raw = localStorage.getItem(ROBLOX_LINK_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.username) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function writeRobloxLink(link) {
    try {
      if (link) localStorage.setItem(ROBLOX_LINK_KEY, JSON.stringify(link));
      else localStorage.removeItem(ROBLOX_LINK_KEY);
    } catch (_) {}
    cachedRobloxLink = link || null;
  }

  function clearRobloxLink() {
    setRobloxToken(null);
    writeRobloxLink(null);
  }

  function currentSession() {
    return {
      user: cachedDiscordUser,
      discord: cachedDiscordUser,
      roblox: cachedRobloxLink,
      ready: !!(cachedDiscordUser && cachedRobloxLink)
    };
  }

  function emitAuthChange() {
    document.dispatchEvent(new CustomEvent("bsv:authchange", { detail: currentSession() }));
  }

  function markResumeLoginModal() {
    try {
      sessionStorage.setItem(RESUME_LOGIN_KEY, "1");
    } catch (_) {}
  }

  function shouldResumeLoginModal() {
    try {
      return sessionStorage.getItem(RESUME_LOGIN_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function clearResumeLoginModal() {
    try {
      sessionStorage.removeItem(RESUME_LOGIN_KEY);
    } catch (_) {}
  }

  function parseAuthHash() {
    var hash = window.location.hash || "";
    var justLoggedIn = false;

    if (hash.indexOf("bsv_auth_error=") !== -1 || hash.indexOf("bsv_roblox_error=") !== -1) {
      clearOAuthReturnTo();
      history.replaceState(null, "", window.location.pathname + window.location.search);
      return false;
    }

    if (hash.indexOf("bsv_roblox_auth=") !== -1) {
      var robloxMatch = hash.match(/bsv_roblox_auth=([^&]+)/);
      if (robloxMatch && robloxMatch[1]) {
        setRobloxToken(decodeURIComponent(robloxMatch[1]));
        justLoggedIn = true;
      }
    }

    if (hash.indexOf("bsv_auth=") !== -1) {
      var match = hash.match(/bsv_auth=([^&]+)/);
      if (match && match[1]) {
        var token = decodeURIComponent(match[1]);
        var savedReturn = null;
        try {
          savedReturn = sessionStorage.getItem(OAUTH_RETURN_KEY);
        } catch (_) {}
        if (isMainLiveSite() && savedReturn) {
          try {
            var savedUrl = new URL(savedReturn.split("#")[0]);
            var savedHost = savedUrl.hostname;
            var isSavedTest =
              savedHost === "localhost" ||
              savedHost === "127.0.0.1" ||
              /\.github\.io$/i.test(savedHost);
            if (isSavedTest && savedUrl.origin !== window.location.origin) {
              window.location.replace(savedReturn.split("#")[0] + "#bsv_auth=" + encodeURIComponent(token));
              return false;
            }
          } catch (_) {}
        }
        setAuthToken(token);
        justLoggedIn = true;
      }
    }

    if (hash.indexOf("bsv_auth=") !== -1 || hash.indexOf("bsv_roblox_auth=") !== -1) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    if (justLoggedIn) clearOAuthReturnTo();
    return justLoggedIn;
  }

  function startDiscordLogin() {
    markResumeLoginModal();
    saveOAuthReturnTo();
    var returnTo = window.location.href.split("#")[0];
    window.location.href = authUrl("api/auth/discord?return_to=" + encodeURIComponent(returnTo));
  }

  function startRobloxLogin() {
    markResumeLoginModal();
    saveOAuthReturnTo();
    var returnTo = window.location.href.split("#")[0];
    var url = authUrl("api/auth/roblox?return_to=" + encodeURIComponent(returnTo));
    fetch(url, { method: "GET", redirect: "manual", credentials: "omit" })
      .then(function (res) {
        if (res.status === 503 || res.status === 404 || res.status === 405) {
          document.dispatchEvent(
            new CustomEvent("bsv:roblox-oauth-unavailable", { detail: { status: res.status } })
          );
          return;
        }
        window.location.href = url;
      })
      .catch(function () {
        window.location.href = url;
      });
  }

  function refreshAfterLogout() {
    dismissWelcomeBanner();
    closeLoginMenu();
    logoutChoicesOpen = false;
    renderNavLogin(currentSession());
    syncLoginModal(currentSession());
    emitAuthChange();
  }

  function logoutDiscordOnly() {
    setAuthToken(null);
    cachedDiscordUser = null;
    clearOAuthReturnTo();
    fetch(authUrl("api/auth/logout"), { method: "POST" }).catch(function () {});
    refreshAfterLogout();
  }

  function logoutRobloxOnly() {
    clearRobloxLink();
    refreshAfterLogout();
  }

  function logoutAll() {
    setAuthToken(null);
    cachedDiscordUser = null;
    clearRobloxLink();
    clearOAuthReturnTo();
    dismissWelcomeBanner();
    fetch(authUrl("api/auth/logout"), { method: "POST" }).catch(function () {});
    closeLoginMenu();
    logoutChoicesOpen = false;
    renderNavLogin(currentSession());
    syncLoginModal(currentSession());
    emitAuthChange();
  }

  // Back-compat alias used by older callers.
  function logoutDiscord() {
    logoutAll();
  }

  function fetchAuthUser() {
    var token = getAuthToken();
    if (!token) return Promise.resolve(null);
    return fetch(authUrl("api/auth/me"), {
      headers: { Authorization: "Bearer " + token }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("auth_me_failed");
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.loggedIn || !data.user) {
          setAuthToken(null);
          return null;
        }
        return data.user;
      })
      .catch(function () {
        setAuthToken(null);
        return null;
      });
  }

  function closeLoginMenu() {
    var menu = document.getElementById("nav-login-menu");
    var btn = document.getElementById("nav-login-btn");
    if (menu) menu.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
    logoutChoicesOpen = false;
    var choices = document.getElementById("nav-login-logout-choices");
    if (choices) choices.hidden = true;
  }

  function removeLogoutTestButton() {
    document.querySelectorAll("#nav-logout-test, .nav-logout-test").forEach(function (el) {
      el.remove();
    });
    document.querySelectorAll(".top-navbar .nav-container-full button").forEach(function (btn) {
      if (/^\s*logout\s+test\s*$/i.test(String(btn.textContent || ""))) btn.remove();
    });
  }

  function watchForLogoutTestButton() {
    if (logoutTestObserver || typeof MutationObserver === "undefined") return;
    var container = document.querySelector(".top-navbar .nav-container-full");
    if (!container) return;
    logoutTestObserver = new MutationObserver(removeLogoutTestButton);
    logoutTestObserver.observe(container, { childList: true, subtree: true });
  }

  function dismissWelcomeBanner() {
    var banner = document.getElementById("auth-welcome-banner");
    if (!banner) return;
    banner.classList.remove("auth-welcome-banner--visible");
    banner.classList.add("auth-welcome-banner--hide");
    setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 500);
  }

  function showWelcomeBanner(displayName) {
    dismissWelcomeBanner();
    var banner = document.createElement("div");
    banner.id = "auth-welcome-banner";
    banner.className = "auth-welcome-banner";
    banner.setAttribute("role", "status");
    banner.innerHTML =
      '<span class="auth-welcome-banner__text">' +
      escapeHtml(t("auth.welcome", "Welcome {name}", { name: displayName })) +
      "</span>";
    document.body.appendChild(banner);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add("auth-welcome-banner--visible");
      });
    });
    setTimeout(function () {
      dismissWelcomeBanner();
    }, 4000);
  }

  function ensureLoginModal() {
    var existing = document.getElementById("bsv-login-modal");
    if (existing && existing.getAttribute("data-bsv-login-v") === "3") return;
    if (existing) existing.remove();

    var wrap = document.createElement("div");
    wrap.className = "bsv-login-modal";
    wrap.id = "bsv-login-modal";
    wrap.setAttribute("data-bsv-login-v", "3");
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="bsv-login-modal__backdrop" id="bsv-login-backdrop"></div>' +
      '<div class="bsv-login-modal__box" role="dialog" aria-modal="true" aria-labelledby="bsv-login-title">' +
        '<button type="button" class="bsv-login-modal__close" id="bsv-login-close" aria-label="' +
          escapeAttr(t("auth.close", "Close")) +
        '">&times;</button>' +
        '<h2 class="bsv-login-modal__title" id="bsv-login-title">' +
          escapeHtml(t("auth.login", "Log In")) +
        "</h2>" +
        '<ol class="bsv-login-steps">' +
          '<li class="bsv-login-step" id="bsv-login-step-roblox" data-step="roblox">' +
            '<div class="bsv-login-step__body">' +
              '<h3 class="bsv-login-step__title">' + escapeHtml(t("auth.robloxTitle", "Log in with Roblox")) + "</h3>" +
              '<p class="bsv-login-step__status" id="bsv-login-roblox-status"></p>' +
              '<button type="button" class="bsv-login-step__btn bsv-login-step__btn--roblox" id="bsv-login-roblox-btn">' +
                escapeHtml(t("auth.robloxBtn", "Log in with Roblox")) +
              "</button>" +
              '<p class="bsv-login-step__error" id="bsv-login-roblox-error" hidden>' +
                escapeHtml(t("auth.robloxError", "Roblox login is not configured yet. Try again shortly.")) +
              "</p>" +
            "</div>" +
          "</li>" +
          '<li class="bsv-login-step" id="bsv-login-step-discord" data-step="discord">' +
            '<div class="bsv-login-step__body">' +
              '<h3 class="bsv-login-step__title">' + escapeHtml(t("auth.discordTitle", "Log in with Discord")) + "</h3>" +
              '<p class="bsv-login-step__status" id="bsv-login-discord-status"></p>' +
              '<button type="button" class="bsv-login-step__btn bsv-login-step__btn--discord" id="bsv-login-discord-btn">' +
                escapeHtml(t("auth.discordBtn", "Log in with Discord")) +
              "</button>" +
            "</div>" +
          "</li>" +
        "</ol>" +
      "</div>";
    document.body.appendChild(wrap);

    var closeBtn = document.getElementById("bsv-login-close");
    var backdrop = document.getElementById("bsv-login-backdrop");
    var discordBtn = document.getElementById("bsv-login-discord-btn");
    var robloxBtn = document.getElementById("bsv-login-roblox-btn");

    if (closeBtn) closeBtn.addEventListener("click", closeLoginModal);
    if (backdrop) backdrop.addEventListener("click", closeLoginModal);
    if (discordBtn) discordBtn.addEventListener("click", startDiscordLogin);
    if (robloxBtn) robloxBtn.addEventListener("click", startRobloxLogin);

    if (!window.__bsvLoginEscBound) {
      window.__bsvLoginEscBound = true;
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeLoginModal();
      });
    }
  }

  function syncLoginModal(session) {
    ensureLoginModal();
    session = session || currentSession();
    var discord = session.discord || session.user || null;
    var roblox = session.roblox || null;
    var stepDiscord = document.getElementById("bsv-login-step-discord");
    var stepRoblox = document.getElementById("bsv-login-step-roblox");
    var discordStatus = document.getElementById("bsv-login-discord-status");
    var robloxStatus = document.getElementById("bsv-login-roblox-status");
    var discordBtn = document.getElementById("bsv-login-discord-btn");
    var robloxBtn = document.getElementById("bsv-login-roblox-btn");
    var title = document.getElementById("bsv-login-title");
    var robloxError = document.getElementById("bsv-login-roblox-error");

    if (title) title.textContent = t("auth.login", "Log In");
    if (robloxError && !robloxError.dataset.forceShow) robloxError.hidden = true;
    if (stepRoblox) stepRoblox.classList.toggle("is-complete", !!roblox);
    if (stepDiscord) {
      stepDiscord.classList.toggle("is-complete", !!discord);
      stepDiscord.classList.toggle("is-locked", !roblox);
    }
    if (robloxStatus) {
      robloxStatus.textContent = roblox
        ? t("auth.robloxDone", "Connected") + (roblox.username ? " · " + roblox.username : "")
        : "";
    }
    if (discordStatus) {
      discordStatus.textContent = discord
        ? t("auth.discordDone", "Connected") +
          (discord.displayName || discord.username ? " · " + (discord.displayName || discord.username) : "")
        : !roblox
          ? t("auth.discordNeedsRoblox", "Connect Roblox first")
          : "";
    }
    if (robloxBtn) {
      robloxBtn.hidden = !!roblox;
      robloxBtn.disabled = !!roblox;
      robloxBtn.textContent = t("auth.robloxBtn", "Log in with Roblox");
    }
    if (discordBtn) {
      discordBtn.hidden = !!discord;
      discordBtn.disabled = !roblox || !!discord;
      discordBtn.textContent = t("auth.discordBtn", "Log in with Discord");
    }
    if (session.ready) closeLoginModal();
  }

  function openLoginModal() {
    ensureLoginModal();
    syncLoginModal(currentSession());
    var modal = document.getElementById("bsv-login-modal");
    if (!modal) return;
    // Keep the dialog centered in the viewport (never anchored under the header button).
    if (modal.parentNode !== document.body) document.body.appendChild(modal);
    modal.hidden = false;
    document.body.classList.add("bsv-login-open");
  }

  function closeLoginModal() {
    var modal = document.getElementById("bsv-login-modal");
    if (modal) modal.hidden = true;
    document.body.classList.remove("bsv-login-open");
    clearResumeLoginModal();
  }

  function robloxAvatar(roblox) {
    if (roblox && roblox.imageUrl) return roblox.imageUrl;
    if (roblox && roblox.userId) {
      return (
        "https://www.roblox.com/headshot-thumbnail/image?userId=" +
        encodeURIComponent(String(roblox.userId)) +
        "&width=150&height=150&format=png"
      );
    }
    return DEFAULT_AVATAR;
  }

  function bindProfileMenu(session) {
    var btn = document.getElementById("nav-login-btn");
    var menu = document.getElementById("nav-login-menu");
    var logoutBtn = document.getElementById("nav-login-logout");
    var choices = document.getElementById("nav-login-logout-choices");
    var logoutBoth = document.getElementById("nav-logout-both");
    var logoutRoblox = document.getElementById("nav-logout-roblox");
    var logoutDiscord = document.getElementById("nav-logout-discord");
    var linkRoblox = document.getElementById("nav-link-roblox");
    var linkDiscord = document.getElementById("nav-link-discord");

    if (btn && menu) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = menu.hidden;
        menu.hidden = !open;
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (!open) {
          logoutChoicesOpen = false;
          if (choices) choices.hidden = true;
        }
      });
    }

    if (logoutBtn && choices) {
      logoutBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        logoutChoicesOpen = !logoutChoicesOpen;
        choices.hidden = !logoutChoicesOpen;
      });
    }

    if (logoutBoth) logoutBoth.addEventListener("click", logoutAll);
    if (logoutRoblox) logoutRoblox.addEventListener("click", logoutRobloxOnly);
    if (logoutDiscord) logoutDiscord.addEventListener("click", logoutDiscordOnly);

    if (linkRoblox) {
      linkRoblox.addEventListener("click", function () {
        closeLoginMenu();
        startRobloxLogin();
      });
    }
    if (linkDiscord) {
      linkDiscord.addEventListener("click", function () {
        closeLoginMenu();
        if (!session.roblox) openLoginModal();
        else startDiscordLogin();
      });
    }
  }

  function statusRowHtml(avatarUrl, statusText) {
    return (
      '<div class="nav-login-menu__status-row">' +
        '<span class="nav-login-menu__pfp-wrap">' +
          '<img class="nav-login-menu__pfp" src="' +
          escapeAttr(avatarUrl || DEFAULT_AVATAR) +
          '" alt="" width="32" height="32" decoding="async">' +
        "</span>" +
        '<p class="nav-login-menu__status nav-login-menu__status--ok">' +
        escapeHtml(statusText) +
        "</p>" +
      "</div>"
    );
  }

  function renderNavLogin(session) {
    removeLogoutTestButton();
    var slot = document.getElementById("nav-login");
    if (!slot) return;

    session = session || currentSession();
    cachedDiscordUser = session.discord || session.user || null;
    cachedRobloxLink = session.roblox || null;
    emitAuthChange();
    syncLoginModal(session);

    var discord = session.discord || null;
    var roblox = session.roblox || null;
    var hasAny = !!(discord || roblox);

    if (!hasAny) {
      var loginLabel = t("auth.login", "Log In");
      var loginTitle = t("auth.loginTitle", "Log in");
      var loginAria = t("auth.loginAria", "Log in");
      slot.innerHTML =
        '<button type="button" class="nav-login-btn nav-login-btn--signin" id="nav-login-btn" title="' +
        escapeAttr(loginTitle) +
        '" aria-label="' +
        escapeAttr(loginAria) +
        '">' +
        '<span class="nav-login-btn__label">' +
        escapeHtml(loginLabel) +
        "</span>" +
        "</button>";
      var loginBtn = document.getElementById("nav-login-btn");
      if (loginBtn) loginBtn.addEventListener("click", openLoginModal);
      if (typeof initMobileHeaderToolbar === "function") initMobileHeaderToolbar();
      return;
    }

    var chipName = roblox
      ? roblox.username
      : t("auth.accountChip", "Account");
    var chipAvatar = roblox ? robloxAvatar(roblox) : DEFAULT_AVATAR;
    var accountMenuLabel = t("auth.accountMenu", "Profile menu");

    var robloxStatusHtml = roblox
      ? statusRowHtml(
          robloxAvatar(roblox),
          t("auth.statusConnected", "Logged in") + (roblox.username ? " · @" + roblox.username : "")
        )
      : '<button type="button" class="nav-login-menu__link-btn nav-login-menu__link-btn--roblox" id="nav-link-roblox">' +
        escapeHtml(t("auth.robloxBtn", "Log in with Roblox")) +
        "</button>";

    var discordName = discord ? discord.displayName || discord.username || "Discord" : "";
    var discordAvatar = discord && discord.avatarUrl ? discord.avatarUrl : DEFAULT_AVATAR;
    var discordStatusHtml = discord
      ? statusRowHtml(
          discordAvatar,
          t("auth.statusConnected", "Logged in") + (discordName ? " · " + discordName : "")
        )
      : '<button type="button" class="nav-login-menu__link-btn nav-login-menu__link-btn--discord" id="nav-link-discord">' +
        escapeHtml(t("auth.discordBtn", "Log in with Discord")) +
        "</button>";

    slot.innerHTML =
      '<div class="nav-login-user">' +
        '<button type="button" class="nav-login-btn nav-login-btn--signedin" id="nav-login-btn" title="' +
          escapeAttr(chipName) +
          '" aria-label="' +
          escapeAttr(accountMenuLabel) +
          '" aria-expanded="false" aria-haspopup="true">' +
          '<span class="nav-login-btn__name">' +
          escapeHtml(chipName) +
          "</span>" +
          '<span class="nav-login-btn__avatar-wrap">' +
            '<img src="' +
            escapeAttr(chipAvatar) +
            '" alt="" width="44" height="44" class="nav-login-btn__avatar" decoding="async">' +
          "</span>" +
        "</button>" +
        '<div class="nav-login-menu" id="nav-login-menu" hidden role="menu">' +
          '<p class="nav-login-menu__title">' +
          escapeHtml(t("auth.profileTitle", "Profile")) +
          "</p>" +
          '<section class="nav-login-menu__section" aria-label="Roblox">' +
            '<p class="nav-login-menu__section-label">' +
            escapeHtml(t("auth.robloxSection", "Roblox")) +
            "</p>" +
            robloxStatusHtml +
          "</section>" +
          '<section class="nav-login-menu__section" aria-label="Discord">' +
            '<p class="nav-login-menu__section-label">' +
            escapeHtml(t("auth.discordSection", "Discord")) +
            "</p>" +
            discordStatusHtml +
          "</section>" +
          '<div class="nav-login-menu__logout-wrap">' +
            '<button type="button" class="nav-login-menu__logout" id="nav-login-logout">' +
            escapeHtml(t("auth.logout", "Log out")) +
            "</button>" +
            '<div class="nav-login-menu__logout-choices" id="nav-login-logout-choices" hidden>' +
              '<p class="nav-login-menu__logout-hint">' +
              escapeHtml(t("auth.logoutWhere", "Where do you want to log out?")) +
              "</p>" +
              '<button type="button" class="nav-login-menu__logout-opt nav-login-menu__logout-opt--roblox" id="nav-logout-roblox">' +
              escapeHtml(t("auth.logoutRoblox", "Roblox only")) +
              "</button>" +
              '<button type="button" class="nav-login-menu__logout-opt nav-login-menu__logout-opt--discord" id="nav-logout-discord">' +
              escapeHtml(t("auth.logoutDiscord", "Discord only")) +
              "</button>" +
              '<button type="button" class="nav-login-menu__logout-opt nav-login-menu__logout-opt--both" id="nav-logout-both">' +
              escapeHtml(t("auth.logoutBoth", "Both accounts")) +
              "</button>" +
              '<p class="nav-login-menu__trading-note">' +
              escapeHtml(t("auth.liveTradingRequired", "Login is required for live trading")) +
              "</p>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>";

    bindProfileMenu(session);
    if (typeof initMobileHeaderToolbar === "function") initMobileHeaderToolbar();
  }

  function fetchRobloxSession() {
    var token = getRobloxToken();
    if (!token) {
      clearRobloxLink();
      return Promise.resolve(null);
    }
    return fetch(authUrl("api/auth/roblox/me"), {
      headers: { Authorization: "Bearer " + token }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("roblox_me_failed");
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.loggedIn || !data.user) {
          clearRobloxLink();
          return null;
        }
        var link = {
          username: data.user.username || data.user.name || "Roblox",
          userId: data.user.id || data.user.userId,
          imageUrl: data.user.avatarUrl || data.user.imageUrl || "",
          profileUrl: data.user.profileUrl || "",
          oauth: true,
          linkedAt: Date.now()
        };
        writeRobloxLink(link);
        return link;
      })
      .catch(function () {
        setRobloxToken(null);
        writeRobloxLink(null);
        return null;
      });
  }

  function getAuthSession() {
    return Promise.all([fetchAuthUser(), fetchRobloxSession()]).then(function (pair) {
      var user = pair[0];
      var roblox = pair[1];
      cachedDiscordUser = user || null;
      cachedRobloxLink = roblox || null;
      return currentSession();
    });
  }

  function initDiscordAuth() {
    removeLogoutTestButton();
    watchForLogoutTestButton();
    ensureLoginModal();
    var justLoggedIn = parseAuthHash();
    cachedRobloxLink = readRobloxLink();
    getAuthSession().then(function (session) {
      renderNavLogin(session);
      removeLogoutTestButton();
      if (shouldResumeLoginModal() && !session.ready) {
        clearResumeLoginModal();
        openLoginModal();
      } else if (session.ready) {
        clearResumeLoginModal();
      }
      if (justLoggedIn) {
        var welcomeName =
          (session.roblox && session.roblox.username) ||
          (session.user && (session.user.displayName || session.user.username)) ||
          "back";
        showWelcomeBanner(welcomeName);
        setTimeout(removeLogoutTestButton, 0);
      }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-login-user")) closeLoginMenu();
    });
    document.addEventListener("bsv:languagechange", function () {
      getAuthSession().then(function (session) {
        renderNavLogin(session);
      });
    });
    document.addEventListener("bsv:roblox-oauth-unavailable", function () {
      ensureLoginModal();
      var robloxError = document.getElementById("bsv-login-roblox-error");
      if (robloxError) {
        robloxError.dataset.forceShow = "1";
        robloxError.hidden = false;
        robloxError.textContent = t(
          "auth.robloxServerError",
          "Roblox login is not set up on the server yet. Try again shortly."
        );
      }
      openLoginModal();
    });
    window.addEventListener("pageshow", function () {
      removeLogoutTestButton();
      watchForLogoutTestButton();
    });
  }

  if (!window.__bsvAuthInited) {
    window.__bsvAuthInited = true;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initDiscordAuth);
    } else {
      initDiscordAuth();
    }
  }

  window.initDiscordAuth = initDiscordAuth;
  window.startDiscordLogin = startDiscordLogin;
  window.startRobloxLogin = startRobloxLogin;
  window.bsvGetAuthToken = getAuthToken;
  window.bsvGetAuthSession = getAuthSession;
  window.bsvClearRobloxLink = clearRobloxLink;
  window.bsvOpenLoginModal = openLoginModal;
  window.bsvCloseLoginModal = closeLoginModal;
  window.bsvLogoutAll = logoutAll;
  window.bsvLogoutDiscord = logoutDiscordOnly;
  window.bsvLogoutRoblox = logoutRobloxOnly;
})();
