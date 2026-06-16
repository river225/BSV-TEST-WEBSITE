(function (global) {
  var DISCORD_LOGO = "https://i.ibb.co/Tq7DLCJt/dsfbvbvxcxbvn.png";
  var DISCORD_INVITE = typeof BSV_DISCORD_INVITE_URL !== "undefined"
    ? BSV_DISCORD_INVITE_URL
    : "https://discord.gg/QbapryYUUx";
  var MORE_URL = "blockspin-discord.html";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var DISCORD_BANNER_CATALOG = [
    { id: "01-home", label: "01 — Live home banner (classic)", group: "Live" },
    { id: "02-card-slot", label: "02 — Live in-grid card (classic)", group: "Live" },
    { id: "09-neon-cyan", label: "09 — Neon home: cyan wave", group: "Neon home concepts" },
    { id: "10-neon-purple", label: "10 — Neon home: deep purple", group: "Neon home concepts" },
    { id: "11-neon-pulse", label: "11 — Neon home: pulse glow", group: "Neon home concepts" },
    { id: "12-neon-thick", label: "12 — Neon home: thick border", group: "Neon home concepts" },
    { id: "13-neon-soft", label: "13 — Neon home: soft glow", group: "Neon home concepts" },
    { id: "14-neon-row", label: "14 — Neon home: wide row", group: "Neon home concepts" },
    { id: "03-slim-strip", label: "03 — Slim horizontal strip", group: "Other alternates" },
    { id: "04-split-hero", label: "04 — Split hero layout", group: "Other alternates" },
    { id: "05-neon-glow", label: "05 — Neon compact strip", group: "Other alternates" },
    { id: "06-minimal-dark", label: "06 — Minimal dark", group: "Other alternates" },
    { id: "07-gold-premium", label: "07 — Gold premium", group: "Other alternates" },
    { id: "08-compact-pill", label: "08 — Compact pill", group: "Other alternates" }
  ];

  function buildHomeBannerInnerHtml() {
    return (
      '<div class="home-discord-promo__inner">' +
        '<div class="home-discord-promo__head">' +
          '<img src="' + DISCORD_LOGO + '" alt="" width="52" height="52" class="home-discord-promo__logo">' +
          '<div>' +
            '<p class="home-discord-promo__title">Join Our Discord Server</p>' +
            '<p class="home-discord-promo__hook">Trade smarter. Never get scammed.</p>' +
          '</div>' +
        '</div>' +
        '<div class="home-discord-promo__stat">' +
          '<div class="home-discord-promo__stat-box">' +
            '<span class="home-discord-promo__stat-num"><span class="discord-member-count">—</span>+</span>' +
            '<span class="home-discord-promo__stat-label">Traders</span>' +
          '</div>' +
        '</div>' +
        '<div class="home-discord-promo__perks">' +
          '<span class="home-discord-promo__perk"><span class="home-discord-promo__perk-icon" aria-hidden="true">📊</span> Trading</span>' +
          '<span class="home-discord-promo__perk"><span class="home-discord-promo__perk-icon" aria-hidden="true">🛡️</span> Middleman service</span>' +
          '<span class="home-discord-promo__perk"><span class="home-discord-promo__perk-icon" aria-hidden="true">🎁</span> Giveaways</span>' +
        '</div>' +
        '<div class="home-discord-promo__actions">' +
          '<a href="' + DISCORD_INVITE + '" target="_blank" rel="noopener noreferrer" class="home-discord-promo__btn home-discord-promo__btn--primary">Join now</a>' +
          '<a href="' + MORE_URL + '" class="home-discord-promo__btn home-discord-promo__btn--secondary">What we offer</a>' +
        '</div>' +
      '</div>'
    );
  }

  function buildHomeClassicBannerHtml(testClass) {
    var testCls = testClass ? " " + testClass : "";
    return (
      '<div class="home-discord-promo' + testCls + '" role="complementary" aria-label="Join BlockSpin Discord">' +
        '<span class="home-discord-promo__shape home-discord-promo__shape--1" aria-hidden="true"></span>' +
        '<span class="home-discord-promo__shape home-discord-promo__shape--2" aria-hidden="true"></span>' +
        '<span class="home-discord-promo__shape home-discord-promo__shape--3" aria-hidden="true"></span>' +
        buildHomeBannerInnerHtml() +
      '</div>'
    );
  }

  function buildHomeNeonBannerHtml(modifierClass, testClass) {
    var mod = modifierClass ? " " + modifierClass : "";
    var testCls = testClass ? " " + testClass : "";
    return (
      '<div class="home-discord-promo home-discord-promo--neon' + mod + testCls + '" role="complementary" aria-label="Join BlockSpin Discord">' +
        '<div class="home-discord-promo__glow" aria-hidden="true"></div>' +
        buildHomeBannerInnerHtml() +
      '</div>'
    );
  }

  function buildDiscordBanner01Home() {
    return buildHomeClassicBannerHtml("discord-banner-v discord-banner-v--01");
  }

  function buildDiscordCardExplainerSlideHtml(kind) {
    var isGiveaways = kind === "giveaways";
    var modClass = isGiveaways ? "home-discord-promo__offer--giveaways" : "home-discord-promo__offer--middleman";
    var icon = isGiveaways ? "🎁" : "🛡️";
    var title = isGiveaways ? "Giveaways" : "Middleman service";
    var text = isGiveaways
      ? "Members-only giveaways for in-game items, Robux, and more. Join the server to enter prizes you won't find anywhere else."
      : "Trade with confidence using our free Middleman service. Staff hold items during trades so buyers and sellers don't get scammed.";
    var badge = isGiveaways ? "Giveaways" : "Middleman";
    var actions =
      '<div class="home-discord-promo__offer-actions">' +
        '<a href="' + DISCORD_INVITE + '" target="_blank" rel="noopener noreferrer" class="home-discord-promo__card-btn home-discord-promo__card-btn--join">Join now</a>' +
        '<a href="' + MORE_URL + '" class="home-discord-promo__card-btn home-discord-promo__card-btn--more">Learn more</a>' +
      '</div>';

    if (isGiveaways) {
      return (
        '<div class="home-discord-promo__offer ' + modClass + '">' +
          '<div class="home-discord-promo__offer-glow" aria-hidden="true"></div>' +
          '<div class="home-discord-promo__offer-header">' +
            '<span class="home-discord-promo__offer-icon" aria-hidden="true">' + icon + '</span>' +
            '<div class="home-discord-promo__offer-heading">' +
              '<span class="home-discord-promo__offer-kicker">What we offer</span>' +
              '<h4 class="home-discord-promo__offer-title">' + esc(title) + '</h4>' +
            '</div>' +
            '<span class="home-discord-promo__offer-badge">' + esc(badge) + '</span>' +
          '</div>' +
          '<p class="home-discord-promo__offer-text">' + esc(text) + '</p>' +
          '<ul class="home-discord-promo__offer-chips" aria-label="Giveaway perks">' +
            '<li>In-game items</li><li>Robux prizes</li><li>Members only</li>' +
          '</ul>' +
          actions +
        '</div>'
      );
    }

    return (
      '<div class="home-discord-promo__offer ' + modClass + '">' +
        '<div class="home-discord-promo__offer-glow" aria-hidden="true"></div>' +
        '<div class="home-discord-promo__offer-header">' +
          '<span class="home-discord-promo__offer-icon" aria-hidden="true">' + icon + '</span>' +
          '<div class="home-discord-promo__offer-heading">' +
            '<span class="home-discord-promo__offer-kicker">What we offer</span>' +
            '<h4 class="home-discord-promo__offer-title">' + esc(title) + '</h4>' +
          '</div>' +
          '<span class="home-discord-promo__offer-badge">' + esc(badge) + '</span>' +
        '</div>' +
        '<p class="home-discord-promo__offer-text">' + esc(text) + '</p>' +
        '<ul class="home-discord-promo__offer-steps" aria-label="Middleman service">' +
          '<li><span class="home-discord-promo__offer-step-num">1</span>Free middleman</li>' +
          '<li><span class="home-discord-promo__offer-step-num">2</span>Items held safely</li>' +
          '<li><span class="home-discord-promo__offer-step-num">3</span>Scam-free trades</li>' +
        '</ul>' +
        actions +
      '</div>'
    );
  }

  function buildDiscordBanner02CardSlot() {
    var joinSlide =
      '<div class="home-discord-promo__carousel-slide is-active" data-slide="join" aria-hidden="false">' +
        '<img src="' + DISCORD_LOGO + '" alt="" width="48" height="48" class="home-discord-promo__card-logo">' +
        '<p class="home-discord-promo__card-title">Join Our Discord Server</p>' +
        '<p class="home-discord-promo__card-stat"><span class="discord-member-count">—</span>+ traders</p>' +
        '<p class="home-discord-promo__card-tags">Trading · Middleman · Giveaways</p>' +
        '<div class="home-discord-promo__card-actions">' +
          '<a href="' + DISCORD_INVITE + '" target="_blank" rel="noopener noreferrer" class="home-discord-promo__card-btn home-discord-promo__card-btn--join">Join now</a>' +
          '<button type="button" class="home-discord-promo__card-btn home-discord-promo__card-btn--more home-discord-promo__card-btn--show-offers">What we offer</button>' +
        '</div>' +
      '</div>';

    return (
      '<div class="home-discord-promo home-discord-promo--card-slot discord-banner-v discord-banner-v--02" role="complementary" aria-label="Join BlockSpin Discord">' +
        '<div class="home-discord-promo__card-inner">' +
          '<div class="home-discord-promo__carousel" data-rotate="1" aria-live="polite">' +
            '<div class="home-discord-promo__carousel-viewport">' +
              joinSlide +
              '<div class="home-discord-promo__carousel-slide" data-slide="giveaways" aria-hidden="true">' +
                buildDiscordCardExplainerSlideHtml("giveaways") +
              '</div>' +
              '<div class="home-discord-promo__carousel-slide" data-slide="middleman" aria-hidden="true">' +
                buildDiscordCardExplainerSlideHtml("middleman") +
              '</div>' +
            '</div>' +
            '<div class="home-discord-promo__carousel-dots" aria-hidden="true">' +
              '<span class="home-discord-promo__carousel-dot is-active"></span>' +
              '<span class="home-discord-promo__carousel-dot"></span>' +
              '<span class="home-discord-promo__carousel-dot"></span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function buildDiscordBanner09NeonCyan() {
    return buildHomeNeonBannerHtml("home-discord-promo--neon-cyan", "discord-banner-v discord-banner-v--09");
  }

  function buildDiscordBanner10NeonPurple() {
    return buildHomeNeonBannerHtml("home-discord-promo--neon-purple", "discord-banner-v discord-banner-v--10");
  }

  function buildDiscordBanner11NeonPulse() {
    return buildHomeNeonBannerHtml("home-discord-promo--neon-pulse", "discord-banner-v discord-banner-v--11");
  }

  function buildDiscordBanner12NeonThick() {
    return buildHomeNeonBannerHtml("home-discord-promo--neon-thick", "discord-banner-v discord-banner-v--12");
  }

  function buildDiscordBanner13NeonSoft() {
    return buildHomeNeonBannerHtml("home-discord-promo--neon-soft", "discord-banner-v discord-banner-v--13");
  }

  function buildDiscordBanner14NeonRow() {
    return buildHomeNeonBannerHtml("home-discord-promo--neon-row", "discord-banner-v discord-banner-v--14");
  }

  function buildDiscordBanner03SlimStrip() {
    return (
      '<div class="discord-banner-v discord-banner-v--03 discord-banner-v--slim" role="complementary" aria-label="Join BlockSpin Discord">' +
        '<div class="discord-banner-v--03__inner">' +
          '<img src="' + DISCORD_LOGO + '" alt="" width="40" height="40" class="discord-banner-v--03__logo">' +
          '<div class="discord-banner-v--03__copy">' +
            '<p class="discord-banner-v--03__title">Join Our Discord Server</p>' +
            '<p class="discord-banner-v--03__sub"><span class="discord-member-count">—</span>+ traders · Trading · Middleman · Giveaways</p>' +
          '</div>' +
          '<div class="discord-banner-v--03__actions">' +
            '<a href="' + DISCORD_INVITE + '" target="_blank" rel="noopener noreferrer" class="discord-banner-v--03__btn discord-banner-v--03__btn--primary">Join now</a>' +
            '<a href="' + MORE_URL + '" class="discord-banner-v--03__btn discord-banner-v--03__btn--ghost">Learn more</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function buildDiscordBanner04SplitHero() {
    return (
      '<div class="discord-banner-v discord-banner-v--04 discord-banner-v--split" role="complementary" aria-label="Join BlockSpin Discord">' +
        '<div class="discord-banner-v--04__left">' +
          '<img src="' + DISCORD_LOGO + '" alt="" width="56" height="56" class="discord-banner-v--04__logo">' +
          '<div>' +
            '<p class="discord-banner-v--04__title">Join Our Discord Server</p>' +
            '<p class="discord-banner-v--04__hook">Trade smarter. Never get scammed.</p>' +
            '<div class="discord-banner-v--04__perks">' +
              '<span>📊 Trading</span><span>🛡️ Middleman</span><span>🎁 Giveaways</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="discord-banner-v--04__right">' +
          '<div class="discord-banner-v--04__stat">' +
            '<span class="discord-banner-v--04__stat-num"><span class="discord-member-count">—</span>+</span>' +
            '<span class="discord-banner-v--04__stat-label">Traders</span>' +
          '</div>' +
          '<a href="' + DISCORD_INVITE + '" target="_blank" rel="noopener noreferrer" class="discord-banner-v--04__cta">Join now</a>' +
          '<a href="' + MORE_URL + '" class="discord-banner-v--04__link">What we offer</a>' +
        '</div>' +
      '</div>'
    );
  }

  function buildDiscordBanner05NeonGlow() {
    return (
      '<div class="discord-banner-v discord-banner-v--05 discord-banner-v--neon" role="complementary" aria-label="Join BlockSpin Discord">' +
        '<div class="discord-banner-v--05__glow" aria-hidden="true"></div>' +
        '<div class="discord-banner-v--05__inner">' +
          '<img src="' + DISCORD_LOGO + '" alt="" width="48" height="48" class="discord-banner-v--05__logo">' +
          '<div class="discord-banner-v--05__body">' +
            '<p class="discord-banner-v--05__title">Join Our Discord Server</p>' +
            '<p class="discord-banner-v--05__stat"><span class="discord-member-count">—</span>+ active traders</p>' +
          '</div>' +
          '<a href="' + DISCORD_INVITE + '" target="_blank" rel="noopener noreferrer" class="discord-banner-v--05__btn">Join now</a>' +
        '</div>' +
      '</div>'
    );
  }

  function buildDiscordBanner06MinimalDark() {
    return (
      '<div class="discord-banner-v discord-banner-v--06 discord-banner-v--minimal" role="complementary" aria-label="Join BlockSpin Discord">' +
        '<div class="discord-banner-v--06__row">' +
          '<img src="' + DISCORD_LOGO + '" alt="" width="44" height="44" class="discord-banner-v--06__logo">' +
          '<div class="discord-banner-v--06__text">' +
            '<p class="discord-banner-v--06__title">Join Our Discord Server</p>' +
            '<p class="discord-banner-v--06__meta">Trading · Middleman · <span class="discord-member-count">—</span>+ members</p>' +
          '</div>' +
          '<a href="' + DISCORD_INVITE + '" target="_blank" rel="noopener noreferrer" class="discord-banner-v--06__btn">Join</a>' +
        '</div>' +
      '</div>'
    );
  }

  function buildDiscordBanner07GoldPremium() {
    return (
      '<div class="discord-banner-v discord-banner-v--07 discord-banner-v--gold" role="complementary" aria-label="Join BlockSpin Discord">' +
        '<div class="discord-banner-v--07__shine" aria-hidden="true"></div>' +
        '<div class="discord-banner-v--07__inner">' +
          '<img src="' + DISCORD_LOGO + '" alt="" width="50" height="50" class="discord-banner-v--07__logo">' +
          '<div class="discord-banner-v--07__copy">' +
            '<p class="discord-banner-v--07__eyebrow">Official community</p>' +
            '<p class="discord-banner-v--07__title">Join Our Discord Server</p>' +
            '<p class="discord-banner-v--07__stat"><span class="discord-member-count">—</span>+ traders already inside</p>' +
          '</div>' +
          '<div class="discord-banner-v--07__actions">' +
            '<a href="' + DISCORD_INVITE + '" target="_blank" rel="noopener noreferrer" class="discord-banner-v--07__btn">Join now</a>' +
            '<a href="' + MORE_URL + '" class="discord-banner-v--07__link">What we offer</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function buildDiscordBanner08CompactPill() {
    return (
      '<div class="discord-banner-v discord-banner-v--08 discord-banner-v--pill" role="complementary" aria-label="Join BlockSpin Discord">' +
        '<img src="' + DISCORD_LOGO + '" alt="" width="32" height="32" class="discord-banner-v--08__logo">' +
        '<span class="discord-banner-v--08__title">Join Our Discord Server</span>' +
        '<span class="discord-banner-v--08__dot" aria-hidden="true">·</span>' +
        '<span class="discord-banner-v--08__count"><span class="discord-member-count">—</span>+</span>' +
        '<a href="' + DISCORD_INVITE + '" target="_blank" rel="noopener noreferrer" class="discord-banner-v--08__btn">Join</a>' +
      '</div>'
    );
  }

  var BUILDERS = {
    "01-home": buildDiscordBanner01Home,
    "02-card-slot": buildDiscordBanner02CardSlot,
    "03-slim-strip": buildDiscordBanner03SlimStrip,
    "04-split-hero": buildDiscordBanner04SplitHero,
    "05-neon-glow": buildDiscordBanner05NeonGlow,
    "06-minimal-dark": buildDiscordBanner06MinimalDark,
    "07-gold-premium": buildDiscordBanner07GoldPremium,
    "08-compact-pill": buildDiscordBanner08CompactPill,
    "09-neon-cyan": buildDiscordBanner09NeonCyan,
    "10-neon-purple": buildDiscordBanner10NeonPurple,
    "11-neon-pulse": buildDiscordBanner11NeonPulse,
    "12-neon-thick": buildDiscordBanner12NeonThick,
    "13-neon-soft": buildDiscordBanner13NeonSoft,
    "14-neon-row": buildDiscordBanner14NeonRow
  };

  function buildDiscordBannerDesign(id) {
    var fn = BUILDERS[id] || BUILDERS["01-home"];
    return fn();
  }

  function renderDiscordBannerButtons(activeId) {
    var groups = {};
    DISCORD_BANNER_CATALOG.forEach(function (d) {
      if (!groups[d.group]) groups[d.group] = [];
      groups[d.group].push(d);
    });

    var html = "";
    Object.keys(groups).forEach(function (group) {
      html += '<p class="card-design-test__group-label">' + esc(group) + "</p>";
      html += '<div class="card-design-test__buttons discord-banner-test__buttons">';
      groups[group].forEach(function (d) {
        var active = d.id === activeId ? " is-active" : "";
        html += '<button type="button" class="card-design-test__btn discord-banner-test__btn' + active + '" data-banner-id="' + d.id + '">' + esc(d.label) + "</button>";
      });
      html += "</div>";
    });
    return html;
  }

  function setDiscordBannerPreview(bannerId) {
    var block = document.getElementById("discord-banner-test");
    if (!block) return;

    if (!BUILDERS[bannerId]) bannerId = "01-home";

    var design = DISCORD_BANNER_CATALOG.find(function (d) { return d.id === bannerId; });
    var picker = block.querySelector(".discord-banner-test__picker");
    var preview = block.querySelector(".discord-banner-test__preview");
    var label = block.querySelector(".discord-banner-test__active-label");
    var gallery = block.querySelector(".discord-banner-test__gallery-grid");

    if (picker) picker.innerHTML = renderDiscordBannerButtons(bannerId);
    if (preview) preview.innerHTML = buildDiscordBannerDesign(bannerId);
    if (label) label.textContent = design ? design.label : bannerId;

    if (gallery) {
      gallery.innerHTML = DISCORD_BANNER_CATALOG.map(function (d) {
        var active = d.id === bannerId ? " discord-banner-test__tile--active" : "";
        return (
          '<button type="button" class="discord-banner-test__tile' + active + '" data-banner-id="' + d.id + '">' +
            '<span class="discord-banner-test__tile-label">' + esc(d.label) + "</span>" +
            '<div class="discord-banner-test__tile-preview">' + buildDiscordBannerDesign(d.id) + "</div>" +
          "</button>"
        );
      }).join("");
    }

    picker.querySelectorAll(".discord-banner-test__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setDiscordBannerPreview(btn.getAttribute("data-banner-id"));
      });
    });

    if (gallery) {
      gallery.querySelectorAll(".discord-banner-test__tile").forEach(function (tile) {
        tile.addEventListener("click", function () {
          setDiscordBannerPreview(tile.getAttribute("data-banner-id"));
          var previewWrap = block.querySelector(".discord-banner-test__preview-wrap");
          if (previewWrap && previewWrap.scrollIntoView) {
            previewWrap.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }

    try {
      localStorage.setItem("bsv-test-discord-banner", bannerId);
    } catch (_) {}

    if (typeof initDiscordPromoCardCarousels === "function") {
      initDiscordPromoCardCarousels(block);
    }
  }

  function renderDiscordBannerTestBlock() {
    var section = document.getElementById("test");
    if (!section || document.getElementById("discord-banner-test")) return;

    var html =
      '<div class="discord-banner-test" id="discord-banner-test">' +
        '<h3 class="discord-banner-test__heading">Join Discord banner variants</h3>' +
        '<p class="discord-banner-test__intro">' +
          '<span class="discord-banner-test__count">' + DISCORD_BANNER_CATALOG.length + " designs</span> — " +
          "Compare the live neon home banner and classic in-grid card with new neon home concepts and other alternates. Click any option to preview full size." +
        "</p>" +
        '<div class="discord-banner-test__picker"></div>' +
        '<p class="card-design-test__active discord-banner-test__active">Preview: <strong class="discord-banner-test__active-label">01 — Current home banner</strong></p>' +
        '<div class="discord-banner-test__preview-wrap card-design-test__preview-wrap">' +
          '<div class="discord-banner-test__preview"></div>' +
        "</div>" +
        '<div class="discord-banner-test__gallery">' +
          '<h4 class="discord-banner-test__gallery-title">All banner designs — side by side</h4>' +
          '<div class="discord-banner-test__gallery-grid"></div>' +
        "</div>" +
      "</div>";

    section.insertAdjacentHTML("beforeend", html);

    var saved = "01-home";
    try {
      saved = localStorage.getItem("bsv-test-discord-banner") || saved;
    } catch (_) {}
    setDiscordBannerPreview(saved);
  }

  global.DISCORD_BANNER_CATALOG = DISCORD_BANNER_CATALOG;
  global.buildDiscordBannerDesign = buildDiscordBannerDesign;
  global.renderDiscordBannerTestBlock = renderDiscordBannerTestBlock;
  global.setDiscordBannerPreview = setDiscordBannerPreview;
})(typeof window !== "undefined" ? window : globalThis);
