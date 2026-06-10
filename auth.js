(function () {
  var AUTH_TOKEN_KEY = "bsv-discord-auth";

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

  function parseAuthHash() {
    var hash = window.location.hash || "";
    var justLoggedIn = false;
    if (hash.indexOf("bsv_auth=") !== -1) {
      var match = hash.match(/bsv_auth=([^&]+)/);
      if (match && match[1]) {
        setAuthToken(decodeURIComponent(match[1]));
        justLoggedIn = true;
      }
    }
    if (hash.indexOf("bsv_auth") !== -1) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    return justLoggedIn;
  }

  function startDiscordLogin() {
    var returnTo = window.location.href.split("#")[0];
    window.location.href = authUrl("api/auth/discord?return_to=" + encodeURIComponent(returnTo));
  }

  function logoutDiscord() {
    setAuthToken(null);
    dismissWelcomeBanner();
    fetch(authUrl("api/auth/logout"), { method: "POST" }).catch(function () {});
    renderNavLogin(null);
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
    if (menu) menu.hidden = true;
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
      '<span class="auth-welcome-banner__text">Welcome ' + escapeHtml(displayName) + "</span>";
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

  function renderNavLogin(user) {
    var slot = document.getElementById("nav-login");
    if (!slot) return;

    if (!user) {
      slot.innerHTML =
        '<button type="button" class="nav-login-btn nav-login-btn--signin" id="nav-login-btn" title="Log in with Discord" aria-label="Log in with Discord">' +
          '<img src="https://i.ibb.co/Tq7DLCJt/dsfbvbvxcxbvn.png" alt="" width="22" height="22" class="nav-login-btn__icon" decoding="async">' +
          '<span class="nav-login-btn__label">Log In</span>' +
        "</button>";
      var loginBtn = document.getElementById("nav-login-btn");
      if (loginBtn) loginBtn.addEventListener("click", startDiscordLogin);
      return;
    }

    var name = user.displayName || user.username || "Discord user";
    var avatar = user.avatarUrl || "https://i.ibb.co/Tq7DLCJt/dsfbvbvxcxbvn.png";
    slot.innerHTML =
      '<div class="nav-login-user">' +
        '<button type="button" class="nav-login-btn nav-login-btn--signedin" id="nav-login-btn" title="' + escapeAttr(name) + '" aria-label="Account menu" aria-expanded="false">' +
          '<span class="nav-login-btn__name">' + escapeHtml(name) + "</span>" +
          '<span class="nav-login-btn__avatar-wrap">' +
            '<img src="' + escapeAttr(avatar) + '" alt="" width="44" height="44" class="nav-login-btn__avatar" decoding="async">' +
          "</span>" +
        "</button>" +
        '<div class="nav-login-menu" id="nav-login-menu" hidden>' +
          '<p class="nav-login-menu__name">' + escapeHtml(name) + "</p>" +
          '<button type="button" class="nav-login-menu__logout" id="nav-login-logout">Log out</button>' +
        "</div>" +
      "</div>";

    var btn = document.getElementById("nav-login-btn");
    var menu = document.getElementById("nav-login-menu");
    var logoutBtn = document.getElementById("nav-login-logout");

    if (btn && menu) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = !menu.hidden;
        menu.hidden = open;
        btn.setAttribute("aria-expanded", open ? "false" : "true");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        closeLoginMenu();
        logoutDiscord();
      });
    }
  }

  function mountLogoutTestButton() {
    var container = document.querySelector(".top-navbar .nav-container-full");
    if (!container || document.getElementById("nav-logout-test")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "nav-logout-test";
    btn.className = "nav-logout-test";
    btn.textContent = "Logout test";
    btn.addEventListener("click", function () {
      closeLoginMenu();
      logoutDiscord();
    });
    container.appendChild(btn);
  }

  function initDiscordAuth() {
    var justLoggedIn = parseAuthHash();
    mountLogoutTestButton();
    fetchAuthUser().then(function (user) {
      renderNavLogin(user);
      if (justLoggedIn && user) {
        showWelcomeBanner(user.displayName || user.username || "back");
      }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-login-user")) closeLoginMenu();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDiscordAuth);
  } else {
    initDiscordAuth();
  }

  window.initDiscordAuth = initDiscordAuth;
  window.startDiscordLogin = startDiscordLogin;
})();
