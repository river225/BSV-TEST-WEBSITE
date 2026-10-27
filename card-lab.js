/**
 * TEST SITE ONLY — "Test" section: item card design lab.
 * Not part of the main site. Linked into the test site's index.html by tools/sync-test-site.mjs
 * (listed in tools/site.json "extraScripts"). Uses real items from the loaded value lists.
 */
(function () {
  "use strict";
  var TITLE = "Test";
  if (typeof window.registerSection !== "function") return;
  window.registerSection({
    title: TITLE, id: "test", navGroup: "extras", dataSource: "none",
    search: "hide", mobileSearchInSection: false, sidebarColumn: "hide", taxCalc: "hide",
    middlemanPromo: "hide", mobileTaxArrow: false, homeValueChanges: false, accessoriesFastNav: false
  });

  var RARITY = {
    "Common / Uncommon": { key: "uncommon", label: "Uncommon", color: "#9ca3af" },
    "Rare": { key: "rare", label: "Rare", color: "#3b82f6" },
    "Epic": { key: "epic", label: "Epic", color: "#a855f7" },
    "Legendary": { key: "legendary", label: "Legendary", color: "#f59e0b" },
    "Omega": { key: "omega", label: "Omega", color: "#ef4444" },
    "Gamepass / Misc": { key: "misc", label: "Misc", color: "#14b8a6" },
    "Vehicles": { key: "vehicles", label: "Vehicle", color: "#22c55e" }
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function num(raw) {
    var m = /([\d.,]+)\s*([kmb])?/i.exec(String(raw || ""));
    if (!m) return NaN;
    return parseFloat(m[1].replace(/,/g, "")) * ({ k: 1e3, m: 1e6, b: 1e9 }[String(m[2] || "").toLowerCase()] || 1);
  }
  function demandPct(d) {
    var n = parseFloat(d);
    if (isFinite(n)) return Math.max(5, Math.min(100, n <= 10 ? n * 10 : n));
    var w = String(d || "").toLowerCase();
    return w.indexOf("very high") > -1 ? 95 : w.indexOf("high") > -1 ? 78 : w.indexOf("medium") > -1 || w.indexOf("mid") > -1 ? 52 : w.indexOf("low") > -1 ? 25 : 40;
  }

  function sampleItems(results) {
    var out = [];
    ["Legendary", "Epic", "Rare", "Omega", "Common / Uncommon", "Vehicles"].forEach(function (sec) {
      var hit = (results || []).find(function (r) { return r.section === sec; });
      var items = ((hit && hit.items) || []).filter(function (it) { return String(it["Name"] || "").trim(); });
      // the most valuable item of each rarity makes a nicer showcase
      items.sort(function (a, b) { return (num(b["Average Value"]) || 0) - (num(a["Average Value"]) || 0); });
      if (items[0]) out.push(norm(items[0], sec));
    });
    return out.slice(0, 4);
  }
  function norm(it, sec) {
    var r = RARITY[sec] || { key: "misc", label: sec, color: "#64748b" };
    return {
      name: String(it["Name"]).trim(),
      img: String(it["Image URL"] || it["Image"] || "").trim(),
      avg: String(it["Average Value"] || "").trim() || "N/A",
      ranged: String(it["Ranged Value"] || "").trim(),
      demand: String(it["Demand"] || "").trim(),
      rarity: r.label, rkey: r.key, color: r.color
    };
  }
  function img(it, cls) {
    if (/^https:\/\//.test(it.img)) {
      return '<img class="' + (cls || "cl-img") + '" src="' + esc(it.img) + '" alt="' + esc(it.name) + '" loading="lazy" decoding="async" data-initial="' + esc(it.name.charAt(0)) + '" onerror="var d=document.createElement(\'div\');d.className=this.className+\' cl-img--blank\';d.textContent=this.dataset.initial;this.replaceWith(d)">';
    }
    return '<div class="' + (cls || "cl-img") + ' cl-img--blank" aria-hidden="true">' + esc(it.name.charAt(0)) + "</div>";
  }
  function bar(it) {
    return '<div class="cl-bar"><span style="width:' + demandPct(it.demand) + '%"></span></div>';
  }

  // Each design: [name, idea, render(item)]
  var DESIGNS = [
    ["Glass", "Frosted glass panel, soft glow in the rarity colour.", function (it) {
      return img(it) + '<div class="cl-body"><h4>' + esc(it.name) + '</h4><p class="cl-r">' + esc(it.rarity) + '</p><p class="cl-v">' + esc(it.avg) + '</p><p class="cl-s">' + esc(it.ranged) + "</p></div>";
    }],
    ["Neon", "Dark card with a glowing neon outline and value.", function (it) {
      return img(it) + "<h4>" + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + '</p><p class="cl-s">Demand ' + esc(it.demand || "–") + "</p>";
    }],
    ["Trading card", "Collectible card: foil rarity frame, art window, stat box.", function (it) {
      return '<div class="cl-top"><span>' + esc(it.name) + '</span><span class="cl-gem"></span></div><div class="cl-art">' + img(it) + '</div><div class="cl-type">' + esc(it.rarity) + ' item</div><div class="cl-stats"><div><b>VALUE</b>' + esc(it.avg) + "</div><div><b>DEMAND</b>" + esc(it.demand || "–") + "</div></div>";
    }],
    ["Minimal row", "One clean line — fastest to scan in long lists.", function (it) {
      return img(it, "cl-thumb") + '<span class="cl-name">' + esc(it.name) + '</span><span class="cl-pill">' + esc(it.rarity) + '</span><span class="cl-v">' + esc(it.avg) + "</span>";
    }],
    ["Big number", "The value is the hero; everything else is quiet.", function (it) {
      return '<p class="cl-v">' + esc(it.avg) + "</p><h4>" + esc(it.name) + '</h4><p class="cl-s">' + esc(it.rarity) + " · " + esc(it.ranged || "no range") + "</p>";
    }],
    ["Demand meter", "Image + value with a demand bar, so hot items stand out.", function (it) {
      return img(it) + '<div class="cl-body"><h4>' + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + '</p><p class="cl-s">Demand</p>' + bar(it) + "</div>";
    }],
    ["Ticket", "Perforated ticket stub — fun for giveaways and trades.", function (it) {
      return '<div class="cl-main"><h4>' + esc(it.name) + '</h4><p class="cl-s">' + esc(it.rarity) + '</p></div><div class="cl-stub"><p class="cl-s">VALUE</p><p class="cl-v">' + esc(it.avg) + "</p></div>";
    }],
    ["Terminal", "Monospace readout, like a trading terminal.", function (it) {
      return "<pre>&gt; item   " + esc(it.name) + "\n&gt; tier   " + esc(it.rarity) + "\n&gt; value  " + esc(it.avg) + "\n&gt; range  " + esc(it.ranged || "-") + "\n&gt; demand " + esc(it.demand || "-") + '<span class="cl-cursor">_</span></pre>';
    }],
    ["Rarity header", "Bold rarity-coloured header band with the image overlapping.", function (it) {
      return '<div class="cl-band">' + esc(it.rarity) + "</div>" + img(it) + "<h4>" + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + "</p>";
    }],
    ["Polaroid", "Photo-print look with a handwritten-style caption.", function (it) {
      return '<div class="cl-photo">' + img(it) + '</div><p class="cl-cap">' + esc(it.name) + ' — <b>' + esc(it.avg) + "</b></p>";
    }],
    ["Luxury gold", "Black and gold, serif type — for top-value items.", function (it) {
      return '<p class="cl-r">' + esc(it.rarity) + "</p><h4>" + esc(it.name) + "</h4>" + img(it) + '<p class="cl-v">' + esc(it.avg) + "</p>";
    }],
    ["Comic pop", "Thick outlines, halftone dots and a burst for the value.", function (it) {
      return img(it) + "<h4>" + esc(it.name) + '</h4><div class="cl-burst">' + esc(it.avg) + "</div>";
    }],
    ["Price tag", "Shaped like a shop price tag with a hole and string.", function (it) {
      return '<span class="cl-hole"></span><h4>' + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + '</p><p class="cl-s">' + esc(it.rarity) + "</p>";
    }],
    ["Badge stack", "Info as badges: rarity, demand, range — very scannable.", function (it) {
      return img(it) + "<h4>" + esc(it.name) + '</h4><div class="cl-badges"><span>' + esc(it.rarity) + "</span><span>Demand " + esc(it.demand || "–") + "</span><span>" + esc(it.ranged || "No range") + '</span></div><p class="cl-v">' + esc(it.avg) + "</p>";
    }],
    ["Orb", "Circular image with a rarity ring, centred layout.", function (it) {
      return '<div class="cl-orb">' + img(it) + "</div><h4>" + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + "</p>";
    }],
    ["3D tilt", "Lifts and tilts toward the cursor on hover.", function (it) {
      return img(it) + "<h4>" + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + '</p><p class="cl-s">Hover me</p>';
    }],
    ["Deck", "Looks like a stack of cards — hints there are more variants.", function (it) {
      return img(it) + "<h4>" + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + "</p>";
    }],
    ["Pixel", "Retro 8-bit border and pixel font feel, very Roblox.", function (it) {
      return img(it) + "<h4>" + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + '</p><p class="cl-s">LV ' + esc(it.rarity.toUpperCase()) + "</p>";
    }],
    ["Split value", "Left: item. Right: big value column with range beneath.", function (it) {
      return '<div class="cl-left">' + img(it) + "<h4>" + esc(it.name) + '</h4></div><div class="cl-right"><p class="cl-v">' + esc(it.avg) + '</p><p class="cl-s">' + esc(it.ranged || "–") + "</p></div>";
    }],
    ["Gradient mesh", "Colourful rarity gradient background, white text.", function (it) {
      return img(it) + "<h4>" + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + '</p><p class="cl-s">' + esc(it.rarity) + "</p>";
    }],
    ["Pawn label", "Paper pawn-shop label with a stamp — playful and readable.", function (it) {
      return '<p class="cl-s">PAWN &amp; TRADE CO.</p><h4>' + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + '</p><span class="cl-stamp">' + esc(it.rarity) + "</span>";
    }],
    ["Compact chip", "Tiny pill for dense grids or trade calculators.", function (it) {
      return img(it, "cl-thumb") + '<span class="cl-name">' + esc(it.name) + '</span><span class="cl-v">' + esc(it.avg) + "</span>";
    }],
    ["Sticker", "Die-cut sticker with a white border and slight rotation.", function (it) {
      return img(it) + "<h4>" + esc(it.name) + '</h4><p class="cl-v">' + esc(it.avg) + "</p>";
    }],
    ["Blueprint", "Technical blueprint grid with dimension-style labels.", function (it) {
      return '<p class="cl-s">SPEC SHEET / ' + esc(it.rarity.toUpperCase()) + "</p>" + img(it) + "<h4>" + esc(it.name) + '</h4><p class="cl-v">VALUE: ' + esc(it.avg) + "</p>";
    }]
  ];

  function render(ctx) {
    var items = sampleItems(ctx.results);
    var blocks = DESIGNS.map(function (d, i) {
      var key = d[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        '<div class="cl-design">' +
          '<div class="cl-design__head"><span class="cl-design__num">' + (i + 1) + '</span><div><h3>' + esc(d[0]) + "</h3><p>" + esc(d[1]) + "</p></div></div>" +
          '<div class="cl-row cl-row--' + key + '">' +
            items.map(function (it) {
              return '<div class="cl cl--' + key + '" data-rarity="' + it.rkey + '" style="--cl-c:' + it.color + '">' + d[2](it) + "</div>";
            }).join("") +
          "</div>" +
        "</div>"
      );
    }).join("");
    ctx.container.insertAdjacentHTML(
      "beforeend",
      '<section class="section card-lab" id="test"><h2>Test</h2>' +
        '<p class="cl-intro">Test site only. ' + DESIGNS.length + " item card designs using real items — tell us the numbers you like.</p>" +
        (items.length ? blocks : '<p class="cl-intro">Values are still loading…</p>') +
      "</section>"
    );
    var sec = document.getElementById("test");
    sec.querySelectorAll(".cl--3d-tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(700px) rotateY(" + x * 14 + "deg) rotateX(" + -y * 14 + "deg) translateY(-4px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  window.BSV_CUSTOM_SECTION_RENDERERS = window.BSV_CUSTOM_SECTION_RENDERERS || {};
  window.BSV_CUSTOM_SECTION_RENDERERS[TITLE] = render;
})();
