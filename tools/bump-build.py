#!/usr/bin/env python3
"""Bump BSV_BUILD and sync local CSS/JS ?v= tags (no auto-reload).

Usage:
  python3 tools/bump-build.py
  python3 tools/bump-build.py 20260926-cache2
"""
from __future__ import annotations

import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILD = sys.argv[1] if len(sys.argv) > 1 else datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")

BUILD_SCRIPT_RE = re.compile(
    r"<script>\s*/\* Asset build id \(no auto-reload\)\..*?</script>",
    re.S,
)

NEW_BUILD_SCRIPT = f"""<script>
/* Asset build id (no auto-reload). Bump via tools/bump-build.py */
window.BSV_BUILD = "{BUILD}";
</script>"""

# Legacy reload gates — strip if still present
LEGACY_GATE_RE = re.compile(
    r"<script>\s*/\* (?:One-time hard client reset|Build cache gate):.*?</script>\n?",
    re.S,
)

ASSET_RE = re.compile(
    r"""((?:href|src)=["'])([^"']+\.(?:css|js))(?:\?[^"']*)?(["'])""",
    re.I,
)

SKIP_DIRS = {".git", "node_modules", "tools"}
SKIP_FILES = {"assets/blockspin-values-sponsorship-kit.html"}


def should_bust(url: str) -> bool:
    if url.startswith(("http://", "https://", "//", "data:", "blob:")):
        return False
    if "fonts.googleapis" in url or "fonts.gstatic" in url:
        return False
    return True


def process(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8")
    out = LEGACY_GATE_RE.sub("", raw)
    if BUILD_SCRIPT_RE.search(out):
        out = BUILD_SCRIPT_RE.sub(NEW_BUILD_SCRIPT, out, count=1)
    elif 'window.BSV_BUILD' not in out:
        m = re.search(r"<meta name=\"bsv-env\"[^>]*>", out, re.I)
        if m:
            out = out[: m.end()] + "\n" + NEW_BUILD_SCRIPT + out[m.end() :]
        else:
            m = re.search(r"<head[^>]*>", out, re.I)
            if m:
                out = out[: m.end()] + "\n" + NEW_BUILD_SCRIPT + out[m.end() :]

    def repl(m: re.Match[str]) -> str:
        prefix, path_url, quote = m.group(1), m.group(2), m.group(3)
        if not should_bust(path_url):
            return m.group(0)
        return f"{prefix}{path_url}?v={BUILD}{quote}"

    out = ASSET_RE.sub(repl, out)
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
