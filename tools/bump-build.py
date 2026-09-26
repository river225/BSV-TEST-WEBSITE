#!/usr/bin/env python3
"""Bump BSV_BUILD and sync local CSS/JS ?v= tags so deploys show after refresh.

Usage:
  python3 tools/bump-build.py                 # timestamp build id
  python3 tools/bump-build.py 20260926-cache1 # explicit build id

Run this before every deploy. Visitors with an older bsv-build get a one-time
reload that clears Service Workers + Cache Storage (login/settings are kept).
"""
from __future__ import annotations

import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILD = sys.argv[1] if len(sys.argv) > 1 else datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")

BOOT_RE = re.compile(
    r"<script>\s*/\* (?:One-time hard client reset|Build cache gate):.*?</script>",
    re.S,
)

NEW_BOOT = f"""<script>
/* Build cache gate: on BUILD change, drop SW/Cache API and hard-reload HTML (keeps login/settings). */
(function () {{
  var BUILD = "{BUILD}";
  window.BSV_BUILD = BUILD;
  var KEY = "bsv-build";
  var FLAG = "bsv-cache-busting";
  try {{
    var clean = new URL(location.href);
    if (clean.searchParams.has("bsv_r") || clean.searchParams.has("_")) {{
      clean.searchParams.delete("bsv_r");
      clean.searchParams.delete("_");
      var qs = clean.searchParams.toString();
      history.replaceState(null, "", clean.pathname + (qs ? "?" + qs : "") + clean.hash);
    }}
    if (localStorage.getItem(KEY) === BUILD) return;
    if (sessionStorage.getItem(FLAG) === BUILD) {{
      localStorage.setItem(KEY, BUILD);
      sessionStorage.removeItem(FLAG);
      return;
    }}
    sessionStorage.setItem(FLAG, BUILD);
    var pending = 1;
    function done() {{
      if (--pending > 0) return;
      var url = new URL(location.href);
      url.searchParams.delete("_");
      url.searchParams.set("bsv_r", BUILD);
      var q = url.searchParams.toString();
      location.replace(url.pathname + (q ? "?" + q : "") + url.hash);
    }}
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {{
      pending++;
      navigator.serviceWorker.getRegistrations().then(function (regs) {{
        return Promise.all(regs.map(function (r) {{ return r.unregister(); }}));
      }}).then(done, done);
    }}
    if (window.caches && caches.keys) {{
      pending++;
      caches.keys().then(function (keys) {{
        return Promise.all(keys.map(function (k) {{ return caches.delete(k); }}));
      }}).then(done, done);
    }}
    done();
  }} catch (e) {{}}
}})();
</script>"""

CACHE_META = (
    '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n'
    '<meta http-equiv="Pragma" content="no-cache" />'
)

ASSET_RE = re.compile(
    r"""((?:href|src)=["'])([^"']+\.(?:css|js))(?:\?[^"']*)?(["'])""",
    re.I,
)

SKIP_DIRS = {".git", "node_modules", "tools"}
SKIP_FILES = {
    "assets/blockspin-values-sponsorship-kit.html",
}


def should_bust(url: str) -> bool:
    if url.startswith(("http://", "https://", "//", "data:", "blob:")):
        return False
    if "fonts.googleapis" in url or "fonts.gstatic" in url:
        return False
    return True


def ensure_cache_meta(text: str) -> str:
    if 'http-equiv="Cache-Control"' in text or "http-equiv='Cache-Control'" in text:
        return text
    # Prefer right after charset viewport block start
    m = re.search(r"<meta charset=\"UTF-8\"\s*/?>", text, re.I)
    if m:
        return text[: m.end()] + "\n" + CACHE_META + text[m.end() :]
    m = re.search(r"<meta name=\"bsv-env\"[^>]*>", text, re.I)
    if m:
        return text[: m.end()] + "\n" + CACHE_META + text[m.end() :]
    return text


def inject_boot(text: str) -> str:
    if BOOT_RE.search(text):
        return BOOT_RE.sub(NEW_BOOT, text, count=1)
    # Live Trading and any page missing the gate: insert after env meta / site-root script
    m = re.search(r"<meta name=\"bsv-env\"[^>]*>", text, re.I)
    if m:
        return text[: m.end()] + "\n" + NEW_BOOT + text[m.end() :]
    m = re.search(r"</script>\s*\n<meta name=\"robots\"", text, re.I)
    if m:
        # after first head script, before robots — uncommon
        pass
    # Fallback: after <head>
    m = re.search(r"<head[^>]*>", text, re.I)
    if m:
        return text[: m.end()] + "\n" + NEW_BOOT + text[m.end() :]
    return text


def bust_assets(text: str) -> str:
    def repl(m: re.Match[str]) -> str:
        prefix, path, quote = m.group(1), m.group(2), m.group(3)
        if not should_bust(path):
            return m.group(0)
        return f"{prefix}{path}?v={BUILD}{quote}"

    return ASSET_RE.sub(repl, text)


def process(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8")
    out = inject_boot(raw)
    out = ensure_cache_meta(out)
    out = bust_assets(out)
    if out != raw:
        path.write_text(out, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if rel in SKIP_FILES:
            continue
        if process(path):
            changed.append(rel)
    print(f"BSV_BUILD={BUILD}")
    print(f"updated {len(changed)} html files")
    for rel in changed:
        print(f"  {rel}")


if __name__ == "__main__":
    main()
