(function () {
  var OAUTH_RETURN_KEY = "bsv-oauth-return-to";

  function readSavedReturnTo() {
    try {
      return sessionStorage.getItem(OAUTH_RETURN_KEY) || localStorage.getItem(OAUTH_RETURN_KEY);
    } catch (_) {
      return null;
    }
  }

  function clearSavedReturnTo() {
    try {
      sessionStorage.removeItem(OAUTH_RETURN_KEY);
      localStorage.removeItem(OAUTH_RETURN_KEY);
    } catch (_) {}
  }

  function parseHashParams(hash) {
    var out = {};
    if (!hash || hash.charAt(0) !== "#") return out;
    hash.slice(1).split("&").forEach(function (part) {
      var eq = part.indexOf("=");
      if (eq <= 0) return;
      out[decodeURIComponent(part.slice(0, eq))] = decodeURIComponent(part.slice(eq + 1));
    });
    return out;
  }

  function stripAuthHash() {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  function bounceToSavedOrigin(hash) {
    var saved = readSavedReturnTo();
    if (!saved) return false;
    try {
      var target = saved.split("#")[0];
      if (new URL(target).origin !== window.location.origin) {
        window.location.replace(target + hash);
        return true;
      }
    } catch (_) {}
    return false;
  }

  var hash = window.location.hash || "";
  var hashParams = parseHashParams(hash);
  var hasAuthToken = Object.prototype.hasOwnProperty.call(hashParams, "bsv_auth");
  var authError = hashParams.bsv_auth_error;

  if (authError) {
    if (bounceToSavedOrigin(hash)) return;
    clearSavedReturnTo();
    stripAuthHash();
    return;
  }

  if (hasAuthToken && bounceToSavedOrigin(hash)) return;

  var params = new URLSearchParams(window.location.search || "");
  if (params.get("bsv_auth_error")) {
    clearSavedReturnTo();
    params.delete("bsv_auth_error");
    var qs = params.toString();
    history.replaceState(null, "", qs ? window.location.pathname + "?" + qs : window.location.pathname);
  }
})();
