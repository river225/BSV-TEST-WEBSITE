const SPREADSHEET_ID = "1rhptMcfWB2I-x3i9TNMwePcDD9SWWwGsaLwELqxCKzo";
const SECTION_NAMES = typeof getSectionTitles === "function" ? getSectionTitles() : [];

const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
const ACCESSORIES_SECTION_NAME = "Untradable Items";
const MONEY_GUIDE_SHEETS = {
  fishingItems: "Fishing Item",
  fishingTypes: "Fishing Types of fishing ",
  farming: "Farming"
};

const FARMING_PLOT_COUNT = 6;
const FARMING_POT_OPTIONS = ["Regular Pot", "Golden Pot", "Diamond Pot"];
const FARMING_SOIL_OPTIONS = ["Regular Soil", "Premium Soil"];
const FARMING_SEED_OPTIONS = [
  "Sunflower Seeds",
  "Corn Seeds",
  "Tomato Seeds",
  "Golden Tomato Seeds"
];
const FARMING_COMBO_ROWS = [
  { pot: "Regular Pot", soil: "Regular Soil", seed: "Sunflower Seeds", time: "10 minutes", money: 720, moneyPlus: 1080 },
  { pot: "Regular Pot", soil: "Regular Soil", seed: "Corn Seeds", time: "1 hour", money: 3250, moneyPlus: 4875 },
  { pot: "Regular Pot", soil: "Regular Soil", seed: "Tomato Seeds", time: "1 day", money: 13500, moneyPlus: 20250 },
  { pot: "Regular Pot", soil: "Regular Soil", seed: "Golden Tomato Seeds", time: "7 days", money: 45000, moneyPlus: 67500 },
  { pot: "Regular Pot", soil: "Premium Soil", seed: "Sunflower Seeds", time: "10 minutes", money: 720, moneyPlus: 1080 },
  { pot: "Regular Pot", soil: "Premium Soil", seed: "Corn Seeds", time: "1 hour", money: 3250, moneyPlus: 4875 },
  { pot: "Regular Pot", soil: "Premium Soil", seed: "Tomato Seeds", time: "1 day", money: 13500, moneyPlus: 20250 },
  { pot: "Regular Pot", soil: "Premium Soil", seed: "Golden Tomato Seeds", time: "7 days", money: 45000, moneyPlus: 67500 },
  { pot: "Golden Pot", soil: "Regular Soil", seed: "Sunflower Seeds", time: "10 minutes", money: 1008, moneyPlus: 1512 },
  { pot: "Golden Pot", soil: "Regular Soil", seed: "Corn Seeds", time: "1 hour", money: 4225, moneyPlus: 6825 },
  { pot: "Golden Pot", soil: "Regular Soil", seed: "Tomato Seeds", time: "1 day", money: 18900, moneyPlus: 28350 },
  { pot: "Golden Pot", soil: "Regular Soil", seed: "Golden Tomato Seeds", time: "7 days", money: 63000, moneyPlus: 94500 },
  { pot: "Golden Pot", soil: "Premium Soil", seed: "Sunflower Seeds", time: "10 minutes", money: 1008, moneyPlus: 1512 },
  { pot: "Golden Pot", soil: "Premium Soil", seed: "Corn Seeds", time: "1 hour", money: 4225, moneyPlus: 6825 },
  { pot: "Golden Pot", soil: "Premium Soil", seed: "Tomato Seeds", time: "1 day", money: 18900, moneyPlus: 28350 },
  { pot: "Golden Pot", soil: "Premium Soil", seed: "Golden Tomato Seeds", time: "7 days", money: 63000, moneyPlus: 94500 },
  { pot: "Diamond Pot", soil: "Regular Soil", seed: "Sunflower Seeds", time: "10 minutes", money: 1224, moneyPlus: 1836 },
  { pot: "Diamond Pot", soil: "Regular Soil", seed: "Corn Seeds", time: "1 hour", money: 5525, moneyPlus: 8288 },
  { pot: "Diamond Pot", soil: "Regular Soil", seed: "Tomato Seeds", time: "1 day", money: 22950, moneyPlus: 34425 },
  { pot: "Diamond Pot", soil: "Regular Soil", seed: "Golden Tomato Seeds", time: "7 days", money: 76500, moneyPlus: 114750 },
  { pot: "Diamond Pot", soil: "Premium Soil", seed: "Sunflower Seeds", time: "10 minutes", money: 1224, moneyPlus: 1836 },
  { pot: "Diamond Pot", soil: "Premium Soil", seed: "Corn Seeds", time: "1 hour", money: 5525, moneyPlus: 8288 },
  { pot: "Diamond Pot", soil: "Premium Soil", seed: "Tomato Seeds", time: "1 day", money: 22950, moneyPlus: 34425 },
  { pot: "Diamond Pot", soil: "Premium Soil", seed: "Golden Tomato Seeds", time: "7 days", money: 76500, moneyPlus: 114750 }
];
const FARMING_COMBO_LOOKUP = Object.fromEntries(
  FARMING_COMBO_ROWS.map(function (row) {
    return [row.pot + "|" + row.soil + "|" + row.seed, row];
  })
);
const FISH_WEIGHT_MAX = 3.6;
const FISH_WEIGHT_STEP = 0.1;

const GIVEAWAY_CAROUSEL_INTERVAL_MS = 10000;
const ANACONDA_GIVEAWAY_IMAGE_URL = "https://i.ibb.co/QqD6BSd/j-Sn2mv-Y-1-removebg-preview.png";
const ANACONDA_GIVEAWAY_DISCORD_URL = "https://discord.gg/nKKkXyqCsv";
const ROBUX_GIVEAWAY_IMAGE_URL = "https://i.ibb.co/7fC16qY/Screenshot-2026-05-06-at-02-28-05-removebg-preview.png";
const ROBUX_GIVEAWAY_DISCORD_URL = "https://discord.gg/GufVWmACAh";
const BSV_DISCORD_GUILD_ID = "1402820361539817554";
const BSV_DISCORD_INVITE_URL = "https://discord.gg/QbapryYUUx";
const DISCORD_JOIN_NUDGE_DELAY_MS = 45000;
const DISCORD_JOIN_NUDGE_STORAGE_KEY = "bsv-discord-nudge-dismissed";
const ROBUX_GIVEAWAY_SECTION_TITLES = new Set(["Common / Uncommon", "Rare", "Epic", "Omega", "Misc"]);
const bannerVisibility = { anaconda: false, firework: false, humvee: true, robux: true };

function isBsvTestEnvironment() {
  if (document.documentElement && document.documentElement.dataset.bsvEnv === "test") return true;
  return !!document.querySelector('meta[name="bsv-env"][content="test"]');
}

function shouldShowGiveawayCarousel() {
  return isBsvTestEnvironment() || bannerVisibility.humvee || bannerVisibility.robux;
}

function applyStripGiveawayBannerVisibility() {
  var show = shouldShowGiveawayCarousel() ? "block" : "none";
  document.querySelectorAll(".giveaway-strip-carousel").forEach(function (el) {
    el.style.display = show;
  });
}

function initGiveawayBannerCarousels() {
  if (typeof window !== "undefined" && window.__giveawayCarouselInit) return;
  if (typeof window !== "undefined") window.__giveawayCarouselInit = true;

  document.querySelectorAll(".giveaway-strip-carousel[data-rotate='1']").forEach(function (carousel) {
    if (carousel.dataset.carouselReady === "1") return;
    carousel.dataset.carouselReady = "1";
    var slides = carousel.querySelectorAll(".giveaway-strip-carousel__slide");
    if (slides.length < 2) return;
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove("is-active");
      slides[idx].setAttribute("aria-hidden", "true");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("is-active");
      slides[idx].setAttribute("aria-hidden", "false");
    }, GIVEAWAY_CAROUSEL_INTERVAL_MS);
  });
}

function buildGiveawayEndsSoonBadgeHtml() {
  return `<span class="giveaway-ends-soon-badge">Ends Soon!</span>`;
}

function buildAnacondaStripSlideHtml() {
  var img = escapeAttr(ANACONDA_GIVEAWAY_IMAGE_URL);
  var href = escapeAttr(ANACONDA_GIVEAWAY_DISCORD_URL);
  return `
        ${buildGiveawayEndsSoonBadgeHtml()}
        <div class="anaconda-banner-figure">
          <img src="${img}" alt="Anaconda giveaway prize" class="anaconda-banner-prize-image" loading="lazy" decoding="async" />
        </div>
        <div class="anaconda-banner-body">
          <p class="legendary-banner-text humvee-banner-copy humvee-banner-copy--stack">
            <span class="humvee-banner-title">Anaconda Giveaway</span>
          </p>
          <div class="legendary-banner-right humvee-banner-actions">
            <a href="${href}" target="_blank" rel="noopener" class="legendary-banner-btn humvee-banner-btn-holo anaconda-banner-btn">Enter Giveaway</a>
          </div>
        </div>
        <div class="giveaway-strip-side-spacer" aria-hidden="true"></div>`;
}

function buildRobuxStripSlideHtml() {
  var img = escapeAttr(ROBUX_GIVEAWAY_IMAGE_URL);
  var href = escapeAttr(ROBUX_GIVEAWAY_DISCORD_URL);
  return `
        ${buildGiveawayEndsSoonBadgeHtml()}
        <div class="robux-banner-figure">
          <img src="${img}" alt="5,000 Robux giveaway prize" class="robux-banner-prize-image" loading="lazy" decoding="async" />
        </div>
        <div class="robux-banner-body">
          <p class="legendary-banner-text humvee-banner-copy humvee-banner-copy--stack">
            <span class="humvee-banner-title">5,000 Robux Giveaway!</span>
          </p>
          <div class="legendary-banner-right humvee-banner-actions">
            <a href="${href}" target="_blank" rel="noopener" class="legendary-banner-btn humvee-banner-btn-holo robux-banner-btn-holo">Enter Giveaway</a>
          </div>
        </div>
        <div class="giveaway-strip-side-spacer" aria-hidden="true"></div>`;
}

function buildRotatingGiveawayCarouselHtml(bannerId) {
  var id = escapeAttr(bannerId);
  return `
      <div class="giveaway-strip-carousel" id="${id}" data-rotate="1" style="display: none;" aria-live="polite">
        <div class="giveaway-strip-carousel__viewport">
          <article class="giveaway-strip-carousel__slide legendary-banner giveaway-banner--humvee giveaway-banner--anaconda-strip is-active" data-slide="anaconda" aria-hidden="false">
            ${buildAnacondaStripSlideHtml()}
          </article>
          <article class="giveaway-strip-carousel__slide legendary-banner giveaway-banner--robux giveaway-banner--robux-strip" data-slide="robux" aria-hidden="true">
            ${buildRobuxStripSlideHtml()}
          </article>
        </div>
      </div>`;
}

function buildHumveeGiveawayBannerHtml(bannerId) {
  return buildRotatingGiveawayCarouselHtml(bannerId);
}

function getDiscordPromoSectionCopy(sectionTitle) {
  var map = {
    "Common / Uncommon": { tags: "Values · Middleman · Giveaways" },
    "Rare": { tags: "Middleman · Values · Giveaways" },
    "Epic": { tags: "Giveaways · Values · Middleman" },
    "Legendary": { tags: "Giveaways · Middleman · Values" },
    "Omega": { tags: "Values · Giveaways · Middleman" },
    "Misc": { tags: "Middleman · Values · Giveaways" },
    "Vehicles": { tags: "Giveaways · Values · Middleman" },
    "Untradable Items": { tags: "Values · Community · Giveaways" }
  };
  return map[sectionTitle] || { tags: "Values · Middleman · Giveaways" };
}

function buildDiscordPromoCardSlotHtml(sectionTitle) {
  var copy = getDiscordPromoSectionCopy(sectionTitle);
  return (
    '<div class="home-discord-promo home-discord-promo--card-slot" role="complementary" aria-label="Join BlockSpin Discord">' +
      '<div class="home-discord-promo__card-inner">' +
        '<img src="https://i.ibb.co/Tq7DLCJt/dsfbvbvxcxbvn.png" alt="" width="48" height="48" class="home-discord-promo__card-logo">' +
        '<p class="home-discord-promo__card-title">Join Our Discord Server</p>' +
        '<p class="home-discord-promo__card-stat"><span class="discord-member-count">—</span>+ traders</p>' +
        '<p class="home-discord-promo__card-tags">' + escapeHtml(copy.tags) + '</p>' +
        '<div class="home-discord-promo__card-actions">' +
          '<a href="' + BSV_DISCORD_INVITE_URL + '" target="_blank" rel="noopener noreferrer" class="home-discord-promo__card-btn home-discord-promo__card-btn--join">Join now</a>' +
          '<a href="blockspin-discord.html" class="home-discord-promo__card-btn home-discord-promo__card-btn--more">What we offer</a>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function buildDiscordPromoBannerHtml(inCards) {
  if (inCards) return buildDiscordPromoCardSlotHtml("");
  var cardClass = "";
  return (
    '<div class="home-discord-promo' + cardClass + '" role="complementary" aria-label="Join BlockSpin Discord">' +
      '<div class="home-discord-promo__shape home-discord-promo__shape--1" aria-hidden="true"></div>' +
      '<div class="home-discord-promo__shape home-discord-promo__shape--2" aria-hidden="true"></div>' +
      '<div class="home-discord-promo__shape home-discord-promo__shape--3" aria-hidden="true"></div>' +
      '<div class="home-discord-promo__inner">' +
        '<div class="home-discord-promo__head">' +
          '<img src="https://i.ibb.co/Tq7DLCJt/dsfbvbvxcxbvn.png" alt="" width="52" height="52" class="home-discord-promo__logo">' +
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
          '<span class="home-discord-promo__perk"><span class="home-discord-promo__perk-icon" aria-hidden="true">📊</span> Values</span>' +
          '<span class="home-discord-promo__perk"><span class="home-discord-promo__perk-icon" aria-hidden="true">🛡️</span> Middleman service</span>' +
          '<span class="home-discord-promo__perk"><span class="home-discord-promo__perk-icon" aria-hidden="true">🎁</span> Giveaways</span>' +
        '</div>' +
        '<div class="home-discord-promo__actions">' +
          '<a href="https://discord.gg/QbapryYUUx" target="_blank" rel="noopener noreferrer" class="home-discord-promo__btn home-discord-promo__btn--primary">Join now</a>' +
          '<a href="blockspin-discord.html" class="home-discord-promo__btn home-discord-promo__btn--secondary">What we offer</a>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function buildCardsHtmlWithDiscordPromo(items, cardBuilder, sectionTitle, minItemsForPromo) {
  if (!items || !items.length) return "";
  if (typeof sectionTitle === "number") {
    minItemsForPromo = sectionTitle;
    sectionTitle = "";
  }
  var buildCard = cardBuilder || createCard;
  var minItems = minItemsForPromo == null ? 1 : minItemsForPromo;
  if (items.length < minItems) {
    return items.map(buildCard).join("");
  }
  var insertAt = Math.floor(items.length / 2);
  var parts = [];
  for (var i = 0; i < items.length; i++) {
    if (i === insertAt) parts.push(buildDiscordPromoCardSlotHtml(sectionTitle));
    parts.push(buildCard(items[i]));
  }
  return parts.join("");
}

function mountHomeDiscordPromo() {
  var slot = document.getElementById("home-discord-promo-slot");
  if (slot) slot.outerHTML = buildDiscordPromoBannerHtml(false);
}

function buildRobuxGiveawayBannerHtml(bannerId) {
  return buildRotatingGiveawayCarouselHtml(bannerId);
}

function initAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;
  if (typeof window.gtag === "function") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  var gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(gaScript);
}

function trackEvent(name, params) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params || {});
}

function setupDiscordClickTracking() {
  if (document.documentElement.dataset.discordTrackingInit === "1") return;
  document.documentElement.dataset.discordTrackingInit = "1";
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href*="discord.gg"], a[href*="discord.com/invite"]');
    if (!link) return;
    trackEvent("discord_click", {
      link_url: link.href,
      link_text: (link.textContent || "").trim().slice(0, 80),
      page_path: window.location.pathname
    });
  });
}

function initDiscordJoinNudge() {
  if (!window.matchMedia("(max-width: 1024px)").matches) return;
  if (sessionStorage.getItem(DISCORD_JOIN_NUDGE_STORAGE_KEY) === "1") return;
  var path = (window.location.pathname || "").toLowerCase();
  if (path.indexOf("blockspin-discord") !== -1) return;

  setTimeout(function () {
    if (!window.matchMedia("(max-width: 1024px)").matches) return;
    if (sessionStorage.getItem(DISCORD_JOIN_NUDGE_STORAGE_KEY) === "1") return;
    if (document.getElementById("discord-join-nudge")) return;

    var nudge = document.createElement("aside");
    nudge.id = "discord-join-nudge";
    nudge.className = "discord-join-nudge";
    nudge.setAttribute("role", "dialog");
    nudge.setAttribute("aria-label", "Join BlockSpin Discord");
    nudge.innerHTML =
      '<button type="button" class="discord-join-nudge__close" aria-label="Dismiss">&times;</button>' +
      '<img src="https://i.ibb.co/Tq7DLCJt/dsfbvbvxcxbvn.png" alt="" width="36" height="36" class="discord-join-nudge__icon">' +
      '<div class="discord-join-nudge__body">' +
        '<p class="discord-join-nudge__title">Join <span class="discord-member-count">—</span>+ BlockSpin traders</p>' +
        '<p class="discord-join-nudge__text">Free middleman · live values · giveaways</p>' +
      '</div>' +
      '<div class="discord-join-nudge__actions">' +
        '<a href="' + BSV_DISCORD_INVITE_URL + '" target="_blank" rel="noopener noreferrer" class="discord-join-nudge__btn discord-join-nudge__btn--join">Join now</a>' +
        '<a href="blockspin-discord.html" class="discord-join-nudge__btn discord-join-nudge__btn--more">Learn more</a>' +
      '</div>';

    document.body.appendChild(nudge);
    requestAnimationFrame(function () {
      nudge.classList.add("discord-join-nudge--visible");
    });
    fetchDiscordMemberCount();

    function dismissNudge() {
      sessionStorage.setItem(DISCORD_JOIN_NUDGE_STORAGE_KEY, "1");
      nudge.classList.remove("discord-join-nudge--visible");
      setTimeout(function () {
        if (nudge.parentNode) nudge.parentNode.removeChild(nudge);
      }, 280);
    }

    nudge.querySelector(".discord-join-nudge__close").addEventListener("click", dismissNudge);
    nudge.querySelector(".discord-join-nudge__btn--join").addEventListener("click", function () {
      trackEvent("discord_nudge_join", { page_path: window.location.pathname });
      dismissNudge();
    });
    nudge.querySelector(".discord-join-nudge__btn--more").addEventListener("click", function () {
      trackEvent("discord_nudge_learn_more", { page_path: window.location.pathname });
      dismissNudge();
    });
  }, DISCORD_JOIN_NUDGE_DELAY_MS);
}

const TAX_RECEIVE_RATIO = 29091 / 40000;
const TAX_MAX_DROP = 40000;
const TAX_RECEIVE_PER_40K = 29091;

function formatNetWorth(value) {
  const cleanValue = String(value).replace(/[$,]/g, '');
  const num = parseFloat(cleanValue);
  
  if (isNaN(num)) return '$0';
  
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`;
  }
  return `$${num.toLocaleString()}`;
}

function getRankColor(rank) {
  if (rank === 1) return '#FFD700';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  if (rank >= 4 && rank <= 25) return '#8B5CF6';
  if (rank >= 26 && rank <= 100) return '#EC4899';
  if (rank >= 101 && rank <= 500) return '#48BB78';
  return '#A0A0A0';
}

function getRankSize(rank) {
  if (rank === 1) return 'rank-1';
  if (rank === 2) return 'rank-2';
  if (rank === 3) return 'rank-3';
  if (rank >= 4 && rank <= 25) return 'rank-top25';
  return 'rank-default';
}

function createRichestPlayersSection(data) {
  if (!data || data.length === 0) {
    return '<p style="text-align: center; color: #888;">No leaderboard data available.</p>';
  }

  const intro = `
    <div class="richest-players-header">
      <h2>Top 1,000 Richest Players in BlockSpin</h2>
      <p class="richest-intro">The Official BlockSpin leaderboard showing the wealthiest players ranked by the total value of their in-game assets. Rankings go to #1000 and update hourly. To appear, verify yourself in the official BlockSpin Discord server.</p>
      <input 
        type="text" 
        class="richest-search" 
        id="richest-search-input"
        placeholder="🔍 Search players by username..."
      />
    </div>
  `;

  const cards = data.map((player, index) => {
    const rank = index + 1;
    const rankColor = getRankColor(rank);
    const formattedWorth = formatNetWorth(player['Networth'] || player['Net Worth'] || 0);
    const playerName = player['Roblox Username'] || player['Player Name'] || player.Name || 'Unknown';
    const level = player['Level'] || 'N/A';
    const rankClass = ("" + rank).length >= 3 ? "rank-long" : "";
    
    const robloxSearchUrl = `https://www.roblox.com/search/users?keyword=${encodeURIComponent(playerName)}`;

    return `
      <div class="richest-card ${getRankSize(rank)}" style="border-color: ${rankColor};" data-player-name="${playerName}">
        <div class="rank-badge ${rankClass}" style="background: ${rankColor};">
          #${rank}
        </div>
        <div class="player-info">
          <div class="player-name">${playerName}</div>
          <div class="player-level"><span style="color: #fff; font-size: 0.9em;">Level: </span><span style="color: #33cce6; font-weight: bold;">${level}</span></div>
          <div class="player-worth"><span style="color: #fff; font-size: 0.9em;">Net Worth: </span>${formattedWorth}</div>
          <a href="${robloxSearchUrl}" target="_blank" rel="noopener" class="profile-link">View Profile 🔗</a>
        </div>
      </div>
    `;
  }).join('');

  return intro + '<div class="richest-container">' + cards + '</div>';
}

function filterRichestPlayers(query) {
  const searchTerm = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.richest-card');
  
  cards.forEach(card => {
    const playerName = (card.dataset.playerName || '').toLowerCase();
    if (playerName.includes(searchTerm)) {
      card.style.setProperty('display', 'flex', 'important');
    } else {
      card.style.setProperty('display', 'none', 'important');
    }
  });
}

async function fetchSheet(sheetName) {
  try {
    const base = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;
    const url = `${base}?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&headers=1`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const cols = json.table.cols.map(c => c.label?.trim() || "");
    const rows = json.table.rows || [];
    const internalColIdx = cols.findIndex(l =>
      normalizeHeaderKey(l).includes("internalvalue")
    );

    const items = rows.map(r => {
      const obj = {};
      cols.forEach((label, i) => {
        const cell = r.c?.[i];
        obj[label] = getCellDisplayValue(cell);
      });
      if (internalColIdx >= 0) {
        obj["Internal Value"] = coerceInternalCell(r.c?.[internalColIdx]);
      }
      obj.__rowValues = (r.c || []).map(getCellDisplayValue);
      obj.__colLabels = cols.slice();
      return obj;
    });

    if (sheetName === "Website Configs") {
      return items;
    }

    return items.filter(x =>
      String(
        x["Name"] ||
        x["Header"] ||
        x["Roblox Name"] ||
        x["Player Name"] ||
        ""
      ).trim().length > 0
    );
  } catch (err) {
    console.error(`Failed to fetch sheet: ${sheetName}`, err);
    return [];
  }
}

async function fetchRichestPlayers() {
  try {
    const RICHEST_SPREADSHEET_ID = "1nfWrJcFkVCZ-Yr0mWmCCjQoQgUD3_-W2Qsy4XD4NT3k";
    const base = `https://docs.google.com/spreadsheets/d/${RICHEST_SPREADSHEET_ID}/gviz/tq`;
    const url = `${base}?tqx=out:json&headers=1`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const cols = json.table.cols.map(c => c.label?.trim() || "");
    const rows = json.table.rows || [];
    const items = rows.map(r => {
      const obj = {};
      cols.forEach((label, i) => {
        const cell = r.c?.[i];
        obj[label] = getCellDisplayValue(cell);
      });
      obj.__rowValues = (r.c || []).map(getCellDisplayValue);
      obj.__colLabels = cols.slice();
      return obj;
    });

    const validItems = items.filter(x => String(x["Roblox Username"] || "").trim().length > 0);
    return validItems;
  } catch (err) {
    console.error('Failed to fetch Richest Players', err);
    return [];
  }
}

function createCard(item) {
  const name = safe(item["Name"]);
  const img = safe(item["Image URL"]);
  const demand = safe(item["Demand"]);
  const avg = safe(item["Average Value"]);
  const ranged = safe(item["Ranged Value"]);
  const sectionName = String(item.__sheet || "").trim().toLowerCase();
  const isMiscSection = sectionName.includes("misc");
  const durability = safe(item["Durability"]);
  const internalRawDirect = String(item["Internal Value"] || "").trim();
  const internalRaw = String(getInternalValueFromItem(item) ?? "").trim();
  const internalNum = parseInternalValue(internalRaw);
  const hasInternalValue =
    Number.isFinite(internalNum) && internalNum > 0;
  const internalValueForAttr = hasInternalValue
    ? String(internalNum)
    : internalRaw;
  const networthDisplay = hasInternalValue
    ? "$" + Math.round(internalNum).toLocaleString("en-US")
    : internalRaw !== ""
      ? internalRaw
      : "N/A";
  const giveawayFlag = safe(item["Giveaway"]);

  let imgTag = "";
  if (img) {
    imgTag = `<img src="${img}" alt="${name}" onerror="this.style.display='none'">`;
  }

  let durabilityHTML = '';
  
  const durabilityInvisible = safe(item["Durability Invisible"]);
  const durabilityInvisibleNormalized = String(durabilityInvisible).trim().toLowerCase();
  const isDurabilityInvisible =
    /^(yes|true|1|ticked|checked|on|y)$/i.test(durabilityInvisibleNormalized);
  const invisibleStyle = isDurabilityInvisible ? 'style="opacity: 0;"' : '';
  const showPawn = !isMiscSection && durability && durability.includes('/') && hasInternalValue;
  const showRepair = showPawn && !isDurabilityInvisible;
  const showNetworth = !isMiscSection || (internalRawDirect !== "" && internalRawDirect !== "-");
  
  if (durability && durability.includes('/')) {
    const maxDurability = durability.split('/')[1] || "100";
    const currentDurability = durability.split('/')[0] || maxDurability;
    
    durabilityHTML = `
      <div class="durability-control" ${invisibleStyle}>
        <label>Durability:</label>
        <div class="durability-input-row">
          <input type="number" class="durability-input" 
                 value="${currentDurability}" 
                 max="${maxDurability}" 
                 min="0" 
                 oninput="enforceMaxDurability(this)"
                 onchange="updateCardValues(this)">
          <span class="durability-max">/${maxDurability}</span>
          <div class="durability-arrows">
            <button onmousedown="adjustDurability(this, 1, event)" ontouchstart="adjustDurability(this, 1, event)">▲</button>
            <button onmousedown="adjustDurability(this, -1, event)" ontouchstart="adjustDurability(this, -1, event)">▼</button>
          </div>
        </div>
      </div>
    `;
    
  }

let repairPrice = 0;
if (showPawn) {
  const [currentDurability, maxDurability] = durability.split('/').map(v => parseInt(v) || 0);
  const missingDurability = maxDurability - currentDurability;
  const internalVal = internalNum;

  const rawRepair = missingDurability * (internalVal / maxDurability / 1.43);
  repairPrice = Math.round(rawRepair);
}

let pawnAmount = 0;
if (showPawn) {
  const [currentDurability, maxDurability] = durability.split('/').map(v => parseInt(v) || 0);
  const internalVal = internalNum;

  const baseValue = internalVal * 0.3;
  const missingDurability = maxDurability - currentDurability;
  const deduction = missingDurability * ((internalVal * 0.3) / maxDurability / 1.43);
  
  const rawPawn = baseValue - deduction;
  pawnAmount = Math.round(rawPawn);

  pawnAmount = `$${pawnAmount.toLocaleString()}`;
}
  
  const hasGiveaway = giveawayFlag && giveawayFlag.toString().trim().toLowerCase() === 'yes';
  
  return `
    <div class="card" data-name="${escapeAttr(name)}" 
         data-avg="${escapeAttr(avg)}" 
         data-ranged="${escapeAttr(ranged)}" 
         data-max-durability="${durability ? durability.split('/')[1] : '100'}"
         data-internal-value="${escapeAttr(internalValueForAttr)}">
      <div class="card-left">
        ${imgTag}
        ${durabilityHTML}
      </div>
      <div class="card-info">
        <h3>${name}</h3>
        ${demand ? `<span class="badge">Demand: ${demand}</span>` : ""}
        <div class="card-avg">Average Value: <span class="avg-value">${avg}</span></div>
        <div class="card-ranged">Ranged Value: <span class="ranged-value">${ranged}</span></div>
        <div class="card-value-separator"></div>
        <div class="card-secondary-values">
          ${showNetworth ? `<div class="card-networth">Networth Value: <span class="networth-value">${escapeHtml(String(networthDisplay))}</span></div>` : ""}
          ${showPawn ? `<div class="card-pawn">Pawn Amount: <span class="pawn-value">${pawnAmount}</span></div>` : ''}
          ${showRepair ? `
            <div class="card-repair">
              Repair Price: <span class="repair-value">$${repairPrice.toLocaleString()}</span>
            </div>
          ` : ''}
        </div>
      </div>
      ${hasGiveaway ? `
        <button class="card-giveaway-trigger" type="button" aria-label="This item has an active giveaway" data-item-name="${escapeAttr(name)}"></button>
      ` : ''}
    </div>
  `;
}

function ensureGiveawayModal() {
  if (document.getElementById('giveaway-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'giveaway-modal';
  modal.className = 'giveaway-modal';
  modal.innerHTML = `
    <div class="giveaway-modal-backdrop" data-giveaway-close></div>
    <div class="giveaway-modal-content">
      <button class="giveaway-modal-close" type="button" aria-label="Close giveaway info" data-giveaway-close>&times;</button>
      <h2 class="giveaway-modal-title">Giveaway Active!</h2>
      <p class="giveaway-modal-text">
        We are currently doing a giveaway for this item in our Discord server, Join Now!
      </p>
      <a href="https://discord.gg/QbapryYUUx" target="_blank" rel="noopener" class="giveaway-modal-button">
        Enter this Giveaway
      </a>
    </div>
  `;
  document.body.appendChild(modal);
}

function createCrewLogoCard(item) {
  const name = safe(item["Name"]);
  const img = safe(item["Image"]);
  const id = safe(item["ID"]);

  const imgTag = img
    ? `<img src="${img}" alt="${name}" onerror="this.style.display='none'">`
    : "";
  return `
    <div class="card crew-logo-card" data-name="${escapeAttr(name)}">
      <div class="crew-card-content">
        <h3>${name}</h3>
        ${imgTag}
        <div class="crew-id-container">
          <div class="crew-id">ID: ${id}</div>
          <button class="copy-btn" onclick="copyToClipboard('${escapeAttr(id)}')" title="Copy ID">📋</button>
        </div>
      </div>
    </div>
  `;
}

function createScammerCard(item) {
  const robloxName = safe(item["Roblox Name"]);
  const discordUser = safe(item["Discord User"]);
  const reason = safe(item["Reason"]);
    const reasonWithLinks = reason.replace(/https?:\/\/\S+/g, match => `<a href="${match}" target="_blank" rel="noopener" class="scammer-link">User Profile</a>`);
  const evidence = safe(item["Evidence"]);
  const submittedDate = item["Date"] || item["Submitted Date"] || "";

  let robloxNameHtml;
  if (robloxName.includes('http')) {
    const urlMatch = robloxName.match(/(.*?)(https?:\/\/\S+)/);
    if (urlMatch) {
      const textPart = urlMatch[1].trim();
      const urlPart = urlMatch[2];
      robloxNameHtml = `${textPart} <a href="${urlPart}" target="_blank" rel="noopener" class="scammer-link">User Profile</a>`;
    } else {
      robloxNameHtml = robloxName;
    }
  } else {
    robloxNameHtml = robloxName;
  }

  const evidenceLinks = evidence.split(",").map(link => link.trim()).filter(link => link.length > 0);
  let evidenceHtml = "";
  if (evidenceLinks.length > 0) {
    evidenceHtml = evidenceLinks.map((link, index) => 
      `<a href="${link}" target="_blank" rel="noopener" class="scammer-link">Evidence ${index + 1}</a>`
    ).join(" | ");
  }

  return `
    <div class="card scammer-card" data-name="${escapeAttr(robloxName)}">
      <div class="card-info">
        <div class="scammer-field"><strong>Roblox Name:</strong> ${robloxNameHtml}</div>
        <div class="scammer-field"><strong>Discord:</strong> ${discordUser}</div>
                <div class="scammer-field"><strong>Reason:</strong> ${reasonWithLinks}</div>
        ${evidenceHtml ? `<div class="scammer-field"><strong>Evidence:</strong> ${evidenceHtml}</div>` : ""}
        <div>Reported: ${submittedDate}</div>
      </div>
    </div>
  `;
}

function createAccessoryCard(item) {
  const name = safe(item["Name"]);
  const img = safe(item["Image URL"] || item["Image"]);
  const rarity = safe(item["Rarity"]);
  const networthValue = safe(item["Networth Value"]);
  const crate = safe(item["Crate"]);
  const networthNum = parseInternalValue(networthValue);
  const networthDisplay = networthNum > 0
    ? "$" + Math.round(networthNum).toLocaleString("en-US")
    : "N/A";
  const pawnDisplay = networthNum > 0
    ? "$" + Math.round(networthNum * 0.3).toLocaleString("en-US")
    : "N/A";
  const rarityNorm = String(rarity || "").trim().toLowerCase();
  const rarityClass =
    rarityNorm === "omega" ? "rarity-omega" :
    rarityNorm === "legendary" ? "rarity-legendary" :
    rarityNorm === "epic" ? "rarity-epic" :
    rarityNorm === "rare" ? "rarity-rare" :
    rarityNorm === "uncommon" ? "rarity-uncommon" :
    rarityNorm === "common" ? "rarity-common" :
    "rarity-default";
  const imgTag = img
    ? `<img src="${img}" alt="${name}" onerror="this.style.display='none'">`
    : "";

  return `
    <div class="card accessory-item-card" data-name="${escapeAttr(name)}">
      <div class="card-left">
        ${imgTag}
      </div>
      <div class="card-info">
        <h3>${escapeHtml(name)}</h3>
        ${rarity ? `<span class="badge accessory-rarity-badge ${rarityClass}">${escapeHtml(rarity)}</span>` : ""}
        <div class="card-networth"><span class="accessory-label">Networth Value:</span> <span class="networth-value">${escapeHtml(networthDisplay)}</span></div>
        <div class="card-pawn"><span class="accessory-label">Pawn Value:</span> <span class="pawn-value">${escapeHtml(pawnDisplay)}</span></div>
        <div class="card-ranged"><span class="accessory-label">Crate:</span> <span>${escapeHtml(crate || "N/A")}</span></div>
      </div>
    </div>
  `;
}

function normalizeGuideHeader(label) {
  return String(label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isWeaponValueListHeaders(cols) {
  const keys = (cols || []).map(normalizeGuideHeader);
  return (
    keys.includes("name") &&
    keys.includes("imageurl") &&
    keys.includes("demand") &&
    keys.includes("averagevalue") &&
    keys.includes("durability")
  );
}

function isFishingItemsSheetHeaders(cols) {
  const keys = (cols || []).map(normalizeGuideHeader);
  if (isWeaponValueListHeaders(cols)) return false;
  const hasName = keys.some(function (k) { return k.includes("name"); });
  const hasImage = keys.some(function (k) { return k.includes("image"); });
  const hasDescription = keys.some(function (k) { return k.includes("description"); });
  const hasPrice = keys.some(function (k) { return k.includes("price"); });
  return hasName && hasImage && hasDescription && hasPrice;
}

function isFishingTypesSheetHeaders(cols) {
  const keys = (cols || []).map(normalizeGuideHeader);
  if (isWeaponValueListHeaders(cols)) return false;
  const hasName = keys.some(function (k) { return k.includes("name"); });
  const hasImage = keys.some(function (k) { return k.includes("image"); });
  const hasRarity = keys.some(function (k) { return k.includes("rarity"); });
  const hasSellAmount = keys.some(function (k) { return k.includes("sellamount"); });
  return hasName && hasImage && hasRarity && hasSellAmount;
}

function isFarmingItemsSheetHeaders(cols) {
  const keys = (cols || []).map(normalizeGuideHeader);
  if (isWeaponValueListHeaders(cols)) return false;
  const hasName = keys.some(function (k) { return k.includes("item") || k.includes("name"); });
  const hasImage = keys.some(function (k) { return k.includes("image"); });
  const hasDescription = keys.some(function (k) { return k.includes("description"); });
  const hasPrice = keys.some(function (k) { return k.includes("price"); });
  return hasName && hasImage && hasDescription && hasPrice;
}

function stripGuideCellPrefix(value) {
  return String(value || "").replace(/^\s*(Fishing|Farming)\s*/i, "").trim();
}

function rowHasGuideMarker(item, prefix) {
  const re = new RegExp("^\\s*" + prefix + "\\b", "i");
  return Object.keys(item || {}).some(function (key) {
    if (key.indexOf("__") === 0) return false;
    return re.test(String(item[key] || ""));
  });
}

function filterGuideRows(items, prefix) {
  if (!items || !items.length) return [];
  const markedRows = items.filter(function (item) { return rowHasGuideMarker(item, prefix); });
  if (markedRows.length) return markedRows;
  return items;
}

function filterFishingGuideRows(items) {
  return filterGuideRows(items, "Fishing");
}

function filterFarmingGuideRows(items) {
  return filterGuideRows(items, "Farming");
}

async function fetchGuideSheet(sheetName, kind) {
  try {
    const base = "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/gviz/tq";
    const url = base + "?tqx=out:json&sheet=" + encodeURIComponent(sheetName) + "&headers=1";
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    const cols = (json.table.cols || []).map(function (c) { return (c.label || "").trim(); });
    const headerOk = kind === "items"
      ? isFishingItemsSheetHeaders(cols)
      : kind === "types"
        ? isFishingTypesSheetHeaders(cols)
        : kind === "farming"
          ? isFarmingItemsSheetHeaders(cols)
          : false;

    if (!headerOk) {
      console.warn(
        'Sheet "' + sheetName + '" is not a valid guide ' + kind + ' tab (got unexpected columns).'
      );
      return { items: [], wrongSheet: true };
    }

    const rows = json.table.rows || [];
    const items = rows.map(function (r) {
      const obj = { __colLabels: cols.slice() };
      cols.forEach(function (label, i) {
        obj[label] = getCellDisplayValue(r.c?.[i]);
      });
      return obj;
    });

    const nameKeys = kind === "items"
      ? ["Fishing Name", "Fishing Item", "Name", "Item Name"]
      : kind === "farming"
        ? ["Farming Item", "Name", "Item Name"]
        : ["Fishing Item Name", "Item Name", "Name"];
    const rowFilter = kind === "farming" ? filterFarmingGuideRows : filterFishingGuideRows;
    const withNames = items.filter(function (item) {
      return guideField(item, nameKeys).length > 0;
    });

    return { items: rowFilter(withNames), wrongSheet: false };
  } catch (err) {
    console.error("Failed to fetch guide sheet: " + sheetName, err);
    return { items: [], wrongSheet: true };
  }
}

async function fetchGuideSheetWithAliases(primaryName, kind) {
  const names = [primaryName];
  if (primaryName.endsWith(" ")) names.push(primaryName.trim());
  if (primaryName === "Fishing Item") names.push("Fishing Items");
  if (primaryName === "Fishing Items") names.push("Fishing Item");
  if (primaryName.indexOf("Fishing Types of fishing") === 0) {
    names.push("Fishing Types of fishing");
    names.push("Fishing Types of Fishes");
  }

  const uniqueNames = Array.from(new Set(names.filter(Boolean)));
  for (let i = 0; i < uniqueNames.length; i++) {
    const result = await fetchGuideSheet(uniqueNames[i], kind);
    if (!result.wrongSheet) return result;
  }
  return { items: [], wrongSheet: true };
}

function guideField(item, keys) {
  const labels = item.__colLabels || Object.keys(item).filter(function (k) {
    return k.indexOf("__") !== 0;
  });

  for (let i = 0; i < keys.length; i++) {
    const direct = stripGuideCellPrefix(String(safe(item[keys[i]])).trim());
    if (direct) return direct;
  }

  for (let i = 0; i < keys.length; i++) {
    const want = normalizeGuideHeader(keys[i]);
    for (let j = 0; j < labels.length; j++) {
      const label = labels[j];
      const got = normalizeGuideHeader(label);
      if (got === want || got.endsWith(want) || got.includes(want)) {
        const value = stripGuideCellPrefix(String(safe(item[label])).trim());
        if (value) return value;
      }
    }
  }
  return "";
}

function parseGuideNumber(value) {
  const n = parseFloat(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  return "$" + Math.round(Number(value) || 0).toLocaleString("en-US");
}

function calculateFishSellPrice(sellAmount, weight) {
  return Math.round(parseGuideNumber(sellAmount) * parseGuideNumber(weight));
}

function calculateFishBlockSpinPrice(sellAmount, weight) {
  return Math.round(calculateFishSellPrice(sellAmount, weight) * 1.5);
}

function getGuideRarityClass(rarity) {
  const rarityNorm = String(rarity || "").trim().toLowerCase();
  if (rarityNorm === "omega") return "rarity-omega";
  if (rarityNorm === "legendary") return "rarity-legendary";
  if (rarityNorm === "epic") return "rarity-epic";
  if (rarityNorm === "rare") return "rarity-rare";
  if (rarityNorm === "uncommon") return "rarity-uncommon";
  if (rarityNorm === "common") return "rarity-common";
  return "rarity-default";
}

function createGuideItemCard(item, config) {
  const name = guideField(item, config.nameKeys);
  if (!name) return "";

  const imageUrl = guideField(item, config.imageKeys);
  const description = guideField(item, config.descriptionKeys);
  const price = guideField(item, config.priceKeys);
  const imageHtml = imageUrl
    ? `<img src="${escapeAttr(imageUrl)}" alt="${escapeAttr(name)}" loading="lazy" onerror="this.style.display='none'">`
    : "";

  return `
    <div class="card guide-vcard guide-item-card">
      <h3 class="guide-vcard__name">${escapeHtml(name)}</h3>
      <div class="guide-vcard__image">${imageHtml}</div>
      <div class="guide-vcard__price">
        <span class="guide-vcard__label">Price</span>
        <span class="guide-vcard__value">${escapeHtml(price || "N/A")}</span>
      </div>
      ${description ? `<p class="guide-vcard__desc">${escapeHtml(description)}</p>` : ""}
    </div>
  `;
}

function createFishingItemCard(item) {
  return createGuideItemCard(item, {
    nameKeys: ["Fishing Name", "Fishing Item", "Name", "Item Name"],
    imageKeys: ["Fishing Item image", "Fishing Image", "Item image", "Image", "Image URL"],
    descriptionKeys: ["Fishing Description", "Description"],
    priceKeys: ["Fishing Price", "Price"]
  });
}

function createFarmingItemCard(item) {
  return createGuideItemCard(item, {
    nameKeys: ["Farming Item", "Name", "Item Name"],
    imageKeys: ["Farming Image", "Item image", "Image", "Image URL"],
    descriptionKeys: ["Farming Description", "Description"],
    priceKeys: ["Farming Price", "Price"]
  });
}

function createFishingTypeCard(item) {
  const name = guideField(item, ["Fishing Item Name", "Item Name", "Name"]);
  if (!name) return "";

  const imageUrl = guideField(item, ["Fishing Image", "Image", "Item image", "Image URL"]);
  const rarity = guideField(item, ["Fishing Rarity", "Rarity"]);
  const sellAmount = parseGuideNumber(guideField(item, ["Fishing Sell Amount", "Sell Amount"]));
  const initialWeight = FISH_WEIGHT_MAX;
  const initialPrice = calculateFishSellPrice(sellAmount, initialWeight);
  const initialBlockSpinPrice = calculateFishBlockSpinPrice(sellAmount, initialWeight);
  const rarityClass = getGuideRarityClass(rarity);
  const imageHtml = imageUrl
    ? `<img src="${escapeAttr(imageUrl)}" alt="${escapeAttr(name)}" onerror="this.style.display='none'">`
    : "";

  return `
    <div class="card guide-vcard guide-fish-card fishing-fish-card" data-sell-amount="${escapeAttr(String(sellAmount))}">
      <h3 class="guide-vcard__name">${escapeHtml(name)}</h3>
      <div class="guide-vcard__image">${imageHtml}</div>
      ${rarity ? `<span class="guide-vcard__rarity ${rarityClass}">${escapeHtml(rarity)}</span>` : ""}
      <div class="guide-vcard__weight fish-weight-control">
        <label class="guide-vcard__label">Weight</label>
        <div class="fish-weight-input-row">
          <input
            type="number"
            class="fish-weight-input"
            value="${initialWeight.toFixed(1)}"
            min="0"
            max="${FISH_WEIGHT_MAX}"
            step="${FISH_WEIGHT_STEP}"
            oninput="enforceFishWeight(this)"
            onchange="updateFishCardPrice(this)"
          />
          <span class="fish-weight-max">/${FISH_WEIGHT_MAX}</span>
          <div class="fish-weight-arrows">
            <button type="button" aria-label="Increase weight" onmousedown="adjustFishWeight(this, 1, event)" ontouchstart="adjustFishWeight(this, 1, event)">▲</button>
            <button type="button" aria-label="Decrease weight" onmousedown="adjustFishWeight(this, -1, event)" ontouchstart="adjustFishWeight(this, -1, event)">▼</button>
          </div>
        </div>
      </div>
      <div class="guide-vcard__divider" aria-hidden="true"></div>
      <div class="guide-vcard__stat">
        <span class="guide-vcard__label">Sell Amount</span>
        <span class="guide-vcard__value guide-vcard__value--sell fish-sell-value">${formatMoney(initialPrice)}</span>
      </div>
      <div class="guide-vcard__stat guide-vcard__stat--blockspin">
        <span class="guide-vcard__label">Sell Amount (BlockSpin+)</span>
        <span class="guide-vcard__value guide-vcard__value--blockspin fish-blockspin-value">${formatMoney(initialBlockSpinPrice)}</span>
      </div>
    </div>
  `;
}

function buildFishingGuideHtml(fishingItems, fishingTypes) {
  const itemCards = (fishingItems || []).map(createFishingItemCard).filter(Boolean).join("");
  const typeCards = (fishingTypes || []).map(createFishingTypeCard).filter(Boolean).join("");

  return `
    <div class="fishing-guide-wrap">
      <h3 class="fishing-guide-title">Fishing</h3>
      <h4 class="fishing-mini-header">Items</h4>
      <div class="guide-vcards-grid fishing-items-cards">${itemCards || '<p class="fishing-empty">No fishing items yet.</p>'}</div>
      <h4 class="fishing-mini-header">Types of Fishes</h4>
      <div class="guide-vcards-grid fishing-types-cards">${typeCards || '<p class="fishing-empty">No fish types yet.</p>'}</div>
    </div>
  `;
}

async function loadFarmingGuidePanel() {
  const farmingPanel = document.getElementById("money-guide-farming");
  if (!farmingPanel || farmingPanel.dataset.loaded === "1") return;

  farmingPanel.innerHTML = '<p class="guide-empty">Loading farming guide...</p>';
  try {
    const result = await fetchGuideSheetWithAliases(MONEY_GUIDE_SHEETS.farming, "farming");
    let warningHtml = "";
    if (result.wrongSheet) {
      warningHtml =
        '<div class="guide-sheet-warning">Could not load <strong>' +
        escapeHtml(MONEY_GUIDE_SHEETS.farming) +
        '</strong>. Use headers: Farming Item, Farming Image, Farming Description, Farming Price.</div>';
    }
    farmingPanel.innerHTML = warningHtml + buildFarmingGuideHtml(result.items);
    initFarmingPlotPlanner(farmingPanel.querySelector(".farming-planner"));
    farmingPanel.dataset.loaded = "1";
  } catch (error) {
    console.error("Failed to load farming guide data:", error);
    farmingPanel.innerHTML = '<p class="guide-empty">Failed to load farming guide.</p>';
  }
}

function farmingComboKey(pot, soil, seed) {
  return pot + "|" + soil + "|" + seed;
}

function getFarmingCombo(pot, soil, seed) {
  if (!pot || !soil || !seed) return null;
  return FARMING_COMBO_LOOKUP[farmingComboKey(pot, soil, seed)] || null;
}

function formatFarmingMoney(amount) {
  return "$" + Number(amount).toLocaleString("en-US");
}

function farmingPotThemeClass(pot) {
  if (pot === "Diamond Pot") return "farming-plot--pot-diamond";
  if (pot === "Golden Pot") return "farming-plot--pot-golden";
  if (pot === "Regular Pot") return "farming-plot--pot-regular";
  return "";
}

function buildFarmingSelectOptions(options, placeholder) {
  var opts = '<option value="">' + escapeHtml(placeholder) + "</option>";
  options.forEach(function (opt) {
    opts += '<option value="' + escapeAttr(opt) + '">' + escapeHtml(opt) + "</option>";
  });
  return opts;
}

function buildFarmingPlotPlannerHtml() {
  var plots = [];
  for (var i = 0; i < FARMING_PLOT_COUNT; i++) {
    plots.push(`
      <article class="farming-plot" data-plot-index="${i}">
        <div class="farming-plot__shell">
          <header class="farming-plot__header">
            <span class="farming-plot__label">Pot ${i + 1}</span>
          </header>
          <div class="farming-plot__pickers">
            <label class="farming-plot__field">
              <span class="farming-plot__field-name">Pot</span>
              <select class="farming-plot__select farming-plot__pot" aria-label="Pot ${i + 1} type">
                ${buildFarmingSelectOptions(FARMING_POT_OPTIONS, "Choose pot")}
              </select>
            </label>
            <label class="farming-plot__field">
              <span class="farming-plot__field-name">Soil</span>
              <select class="farming-plot__select farming-plot__soil" aria-label="Pot ${i + 1} soil">
                ${buildFarmingSelectOptions(FARMING_SOIL_OPTIONS, "Choose soil")}
              </select>
            </label>
            <label class="farming-plot__field">
              <span class="farming-plot__field-name">Seed</span>
              <select class="farming-plot__select farming-plot__seed" aria-label="Pot ${i + 1} seed">
                ${buildFarmingSelectOptions(FARMING_SEED_OPTIONS, "Choose seed")}
              </select>
            </label>
          </div>
          <div class="farming-plot__result" hidden>
            <p class="farming-plot__time"><span class="farming-plot__result-label">Grow time:</span> <strong class="farming-plot__time-value"></strong></p>
            <p class="farming-plot__money"><span class="farming-plot__result-label">Payout:</span> <strong class="farming-plot__money-value"></strong></p>
            <p class="farming-plot__money-plus"><span class="farming-plot__result-label">BlockSpin Plus Payout:</span> <strong class="farming-plot__money-plus-value"></strong></p>
          </div>
          <p class="farming-plot__hint">Select pot, soil, and seed to see grow time and payout.</p>
        </div>
      </article>`);
  }

  return `
    <section class="farming-planner farming-planner--cartoon" aria-label="Farming plot planner">
      <h4 class="guide-mini-header farming-planner__title">Plant Planner</h4>
      <p class="farming-planner__intro">Use our Plant Planning Tool to calculate how much cash any planting setup will earn and how long it will take before you invest your money in-game.</p>
      <div class="farming-plots-grid">${plots.join("")}</div>
      <div class="farming-planner-summary" hidden>
        <h5 class="farming-planner-summary__title">All plots combined</h5>
        <p class="farming-planner-summary__row"><span>Total payout:</span> <strong class="farming-planner-summary__money"></strong></p>
        <p class="farming-planner-summary__row"><span>BlockSpin Plus total:</span> <strong class="farming-planner-summary__money-plus"></strong></p>
      </div>
    </section>`;
}

function updateFarmingPlot(plotEl) {
  if (!plotEl) return;
  var pot = plotEl.querySelector(".farming-plot__pot").value;
  var soil = plotEl.querySelector(".farming-plot__soil").value;
  var seed = plotEl.querySelector(".farming-plot__seed").value;
  var resultEl = plotEl.querySelector(".farming-plot__result");
  var hintEl = plotEl.querySelector(".farming-plot__hint");

  plotEl.classList.remove(
    "farming-plot--pot-regular",
    "farming-plot--pot-golden",
    "farming-plot--pot-diamond"
  );
  var potClass = farmingPotThemeClass(pot);
  if (potClass) plotEl.classList.add(potClass);

  var combo = getFarmingCombo(pot, soil, seed);
  if (!combo) {
    resultEl.hidden = true;
    hintEl.hidden = false;
    plotEl.dataset.money = "";
    plotEl.dataset.moneyPlus = "";
    return;
  }

  resultEl.querySelector(".farming-plot__time-value").textContent = combo.time;
  resultEl.querySelector(".farming-plot__money-value").textContent = formatFarmingMoney(combo.money);
  resultEl.querySelector(".farming-plot__money-plus-value").textContent = formatFarmingMoney(combo.moneyPlus);
  resultEl.hidden = false;
  hintEl.hidden = true;
  plotEl.dataset.money = String(combo.money);
  plotEl.dataset.moneyPlus = String(combo.moneyPlus);
}

function updateFarmingPlannerSummary(plannerRoot) {
  if (!plannerRoot) return;
  var summaryEl = plannerRoot.querySelector(".farming-planner-summary");
  if (!summaryEl) return;

  var plots = plannerRoot.querySelectorAll(".farming-plot");
  var totalMoney = 0;
  var totalPlus = 0;
  var activeCount = 0;

  plots.forEach(function (plot) {
    var money = Number(plot.dataset.money);
    var moneyPlus = Number(plot.dataset.moneyPlus);
    if (!money || !moneyPlus) return;
    totalMoney += money;
    totalPlus += moneyPlus;
    activeCount += 1;
  });

  if (activeCount < 2) {
    summaryEl.hidden = true;
    return;
  }

  summaryEl.querySelector(".farming-planner-summary__money").textContent = formatFarmingMoney(totalMoney);
  summaryEl.querySelector(".farming-planner-summary__money-plus").textContent = formatFarmingMoney(totalPlus);
  summaryEl.hidden = false;
}

function initFarmingPlotPlanner(root) {
  if (!root || root.dataset.plannerInit === "1") return;
  root.dataset.plannerInit = "1";

  var plots = root.querySelectorAll(".farming-plot");
  plots.forEach(function (plot) {
    plot.querySelectorAll(".farming-plot__select").forEach(function (select) {
      select.addEventListener("change", function () {
        updateFarmingPlot(plot);
        updateFarmingPlannerSummary(root);
      });
    });
  });
}

function buildFarmingGuideHtml(farmingItems) {
  const itemCards = (farmingItems || []).map(createFarmingItemCard).filter(Boolean).join("");
  return `
    <div class="farming-guide-wrap">
      <h3 class="farming-guide-title">Farming</h3>
      <h4 class="guide-mini-header">Items</h4>
      <div class="guide-vcards-grid farming-items-cards">${itemCards || '<p class="guide-empty">No farming items yet.</p>'}</div>
      ${buildFarmingPlotPlannerHtml()}
    </div>
  `;
}

async function loadFishingGuidePanel() {
  const fishingPanel = document.getElementById("money-guide-fishing");
  if (!fishingPanel || fishingPanel.dataset.loaded === "1") return;

  fishingPanel.innerHTML = '<p class="fishing-empty">Loading fishing guide...</p>';
  try {
    const [itemsResult, typesResult] = await Promise.all([
      fetchGuideSheetWithAliases(MONEY_GUIDE_SHEETS.fishingItems, "items"),
      fetchGuideSheetWithAliases(MONEY_GUIDE_SHEETS.fishingTypes, "types")
    ]);

    const warnings = [];
    if (itemsResult.wrongSheet) {
      warnings.push(
        'Could not load <strong>' + escapeHtml(MONEY_GUIDE_SHEETS.fishingItems) +
        '</strong>. Use headers: Fishing Name, Fishing Item image, Fishing Description, Fishing Price.'
      );
    }
    if (typesResult.wrongSheet) {
      warnings.push(
        'Could not load <strong>' + escapeHtml(MONEY_GUIDE_SHEETS.fishingTypes) +
        '</strong>. Use headers: Fishing Item Name, Fishing Image, Fishing Rarity, Fishing Sell Amount.'
      );
    }

    const warningHtml = warnings.length
      ? '<div class="fishing-sheet-warning">' + warnings.join("<br>") + "</div>"
      : "";

    fishingPanel.innerHTML = warningHtml + buildFishingGuideHtml(itemsResult.items, typesResult.items);
    fishingPanel.dataset.loaded = "1";
    fishingPanel.querySelectorAll(".fish-weight-input").forEach(updateFishCardPrice);
  } catch (error) {
    console.error("Failed to load fishing guide data:", error);
    fishingPanel.innerHTML = '<p class="fishing-empty">Failed to load fishing guide.</p>';
  }
}

let fishWeightInterval = null;
let fishWeightTimeout = null;

function stopFishWeightAdjust() {
  if (fishWeightInterval) {
    clearInterval(fishWeightInterval);
    fishWeightInterval = null;
  }
  if (fishWeightTimeout) {
    clearTimeout(fishWeightTimeout);
    fishWeightTimeout = null;
  }
}

function enforceFishWeight(input) {
  const raw = parseGuideNumber(input.value);
  const stepped = Math.round(raw / FISH_WEIGHT_STEP) * FISH_WEIGHT_STEP;
  const clamped = Math.max(0, Math.min(FISH_WEIGHT_MAX, stepped));
  input.value = clamped.toFixed(1);
  updateFishCardPrice(input);
}

function adjustFishWeight(btn, direction, evt) {
  if (evt) evt.preventDefault();
  const card = btn.closest(".fishing-fish-card");
  if (!card) return;
  const input = card.querySelector(".fish-weight-input");
  if (!input) return;

  const maxSteps = Math.round(FISH_WEIGHT_MAX / FISH_WEIGHT_STEP);
  const holdDelayMs = 160;
  const repeatEveryMs = 45;

  function adjustOnce() {
    let step = Math.round(parseGuideNumber(input.value) / FISH_WEIGHT_STEP);
    step = Math.max(0, Math.min(maxSteps, step + direction));
    input.value = (step * FISH_WEIGHT_STEP).toFixed(1);
    updateFishCardPrice(input);
  }

  adjustOnce();
  fishWeightTimeout = setTimeout(() => {
    fishWeightInterval = setInterval(adjustOnce, repeatEveryMs);
  }, holdDelayMs);
}

function updateFishCardPrice(input) {
  const card = input.closest(".fishing-fish-card");
  if (!card) return;
  const sellAmount = parseGuideNumber(card.dataset.sellAmount);
  const weight = parseGuideNumber(input.value);
  const sellTarget = card.querySelector(".fish-sell-value");
  const blockSpinTarget = card.querySelector(".fish-blockspin-value");
  if (sellTarget) {
    sellTarget.textContent = formatMoney(calculateFishSellPrice(sellAmount, weight));
  }
  if (blockSpinTarget) {
    blockSpinTarget.textContent = formatMoney(calculateFishBlockSpinPrice(sellAmount, weight));
  }
}

const QUEST_GUIDE_DATA = {
  intro: "Quests are an easy way to earn money and valuable items as you progress through the game. You can find and track your available quests in your player sidebar. In total, completing all quests rewards you with $1,000 Cash, 100 XP, 6 Bottles, 15 Bricks, and 5 Molotovs. While these rewards may not be game-changing, they can provide a useful boost for new players by helping with combat and making it easier to purchase early-game items such as vehicles when money is harder to earn.",
  wikiImage: "https://i.ibb.co/MyRfh0nf/Untitled-design-6.png",
  wikiAlt: "Quests button location in the game sidebar",
  categories: [
    {
      id: "playtime",
      title: "Playtime Quests",
      intro: "There are 3 Playtime Quests that are completed simply by playing the game. These quests start automatically as soon as you join.",
      quests: [
        { num: 1, title: "Play for 5 Minutes", reward: "100 Cash" },
        { num: 2, title: "Play for 10 Minutes", reward: "200 Cash" },
        { num: 3, title: "Join 5 days in a row", reward: "15 Bricks and 5 Molotovs" }
      ]
    },
    {
      id: "jobs",
      title: "Job Quests",
      intro: "These quests involve working at various jobs located around the map.",
      quests: [
        {
          num: 4,
          title: "Work 3 Different Jobs",
          reward: "100 XP",
          details: [
            "To complete this quest, you must work at 3 different jobs. The easiest jobs to use are Burger Place, Quick 11, and The Butcher's Cut.",
            "All job locations can be seen in the image below. To make them easier to find, each workplace has a unique icon displayed above it on the BlockSpin map."
          ],
          image: {
            src: "https://i.ibb.co/cS8HmrhB/Screenshot-2026-05-30-at-19-41-30.png",
            alt: "Burger Place, Quick 11, and The Butcher's Cut job locations"
          }
        },
        {
          num: 5,
          title: "Pro Skimmer",
          reward: "$175 Cash",
          details: [
            "To complete this quest, you must hack 5 ATMs located throughout various hotspots around the map. Before you can start hacking, you will need to purchase Hack Tools. These can be bought from Sam, who can be found behind Sam's Motel, near the Car Dealership."
          ],
          image: {
            src: "https://i.ibb.co/DDdqMXvr/Screenshot-2026-05-30-at-19-58-15.png",
            alt: "Sam behind Sam's Motel selling Basic Hack Tool"
          }
        },
        {
          num: 6,
          title: "Just Keep Mopping",
          reward: "$100 Cash",
          details: [
            "For this quest, get a job at the burger place and mop 10 puddles. The burger place can be found near the gun store."
          ]
        }
      ]
    },
    {
      id: "playthrough",
      title: "Playthrough Quests",
      intro: "These quests are naturally completed as you play the game. However, if you wish to earn the rewards sooner, you can focus on completing the required objectives to finish them faster.",
      quests: [
        {
          num: 7,
          title: "Glass Crackin'",
          reward: "$50 Cash and 5 Bottles",
          details: [
            "To complete this quest, you need to break windows around the map. The windows of all buildings regenerate approximately every minute, allowing you to continue making progress. For the fastest completion, it is recommended to walk through the neighborhood and break the windows of each house you pass until the objective is complete."
          ]
        },
        {
          num: 8,
          title: "Learner Driver",
          reward: "$100 Cash",
          details: [
            "To complete this quest, you simply need to drive any vehicle. This can be a vehicle you own or one belonging to another player. For the quickest completion if you do not own a vehicle, try entering vehicles owned by other players around the map. If the vehicles are locked, you can purchase a Lockpick from Sam, who is located behind Sam's Motel, and use it to gain access."
          ]
        },
        {
          num: 9,
          title: "Cash for Clutter",
          reward: "$100 Cash",
          details: [
            "To complete this quest, simply sell 3 items to Rick at the Pawn Shop. The Pawn Shop can be found near the Night Club, or you can locate it by following its icon displayed above the building. Once you have sold 3 items to Rick, the quest will be completed."
          ]
        },
        {
          num: 10,
          title: "Death by Distance",
          reward: "$175 Cash and 1 Bottle",
          details: [
            "To complete this quest, you must eliminate a player using a throwable item. Keep in mind that when a player is defeated, they enter a temporary paralyzed state where they can either be stomped to finish them off or carried to safety and allowed to recover. For this quest, the final blow must be dealt with a throwable while the player is in this downed state. The easiest method is to use a gun or melee weapon to damage a player until they become paralyzed, then finish them off with a throwable item. We recommend using Milkshakes from the Burger Place or Bottles from Quick 11, as they are inexpensive and easy to obtain."
          ],
          image: {
            src: "https://i.ibb.co/fdvrvmSh/Screenshot-2026-05-30-at-20-51-21.png",
            alt: "Player throwing a bottle at an opponent in a paralyzed state",
            compact: true
          }
        }
      ]
    }
  ]
};

function buildQuestGuideIntroHtml(introClass) {
  var introCls = introClass || "quest-guide-wiki";
  return `
      <div class="${introCls}">
        <div class="quest-guide-wiki__text">
          <p>${escapeHtml(QUEST_GUIDE_DATA.intro)}</p>
        </div>
        <figure class="quest-guide-wiki__figure">
          <img src="${escapeAttr(QUEST_GUIDE_DATA.wikiImage)}" alt="${escapeAttr(QUEST_GUIDE_DATA.wikiAlt)}" loading="lazy">
        </figure>
      </div>`;
}

function buildQuestGuideImageHtml(image, imageClass) {
  if (!image || !image.src) return "";
  var cls = "quest-guide-map-image" + (image.compact ? " quest-guide-map-image--compact" : "");
  if (imageClass) cls = imageClass;
  return `
            <figure class="${cls}">
              <img src="${escapeAttr(image.src)}" alt="${escapeAttr(image.alt || "")}" loading="lazy">
            </figure>`;
}

function buildQuestGuideHtml() {
  var sections = QUEST_GUIDE_DATA.categories.map(function (cat) {
    var items = cat.quests.map(function (quest) {
      var details = (quest.details || []).map(function (p) {
        return `<p class="qg-timeline__text">${escapeHtml(p)}</p>`;
      }).join("");
      return `
            <li class="qg-timeline__item qg-timeline__item--${escapeAttr(cat.id)}">
              <div class="qg-timeline__node" aria-hidden="true">${quest.num}</div>
              <article class="qg-timeline__card qg-timeline__card--${escapeAttr(cat.id)}">
                <header class="qg-timeline__head">
                  <h5 class="qg-timeline__title">Quest ${quest.num}: ${escapeHtml(quest.title)}</h5>
                  <span class="qg-timeline__reward">Reward: ${escapeHtml(quest.reward)}</span>
                </header>
                ${details ? `<div class="qg-timeline__body">${details}</div>` : ""}
                ${buildQuestGuideImageHtml(quest.image, "qg-timeline__figure quest-guide-map-image" + (quest.image && quest.image.compact ? " quest-guide-map-image--compact" : ""))}
              </article>
            </li>`;
    }).join("");

    return `
        <section class="qg-timeline__section qg-timeline__section--${escapeAttr(cat.id)}">
          <div class="qg-timeline__hero qg-timeline__hero--${escapeAttr(cat.id)}">
            <h4 class="qg-timeline__section-title">${escapeHtml(cat.title)}</h4>
            <p class="qg-timeline__section-desc">${escapeHtml(cat.intro)}</p>
          </div>
          <ol class="qg-timeline__list">${items}</ol>
        </section>`;
  }).join("");

  return `
    <div class="quest-guide-wrap">
      <h3 class="quest-guide-title">Quest Guide</h3>
      ${buildQuestGuideIntroHtml()}
      <div class="qg-timeline">${sections}</div>
    </div>`;
}


function renderMoneyGameGuideSection() {
  const html = `
    <section class="section money-game-guide-section" id="${slugify("Money & Game Guide")}">
      <h2>Money &amp; Game Guide</h2>
      <nav class="money-guide-tabs" aria-label="Money and game guides">
        <button type="button" class="money-guide-tab money-guide-tab--fishing active" data-panel="money-guide-fishing">Fishing Job</button>
        <button type="button" class="money-guide-tab money-guide-tab--farming" data-panel="money-guide-farming">Farming Job</button>
        <button type="button" class="money-guide-tab money-guide-tab--quest" data-panel="money-guide-quest">Quest Guide</button>
      </nav>
      <div id="money-guide-fishing" class="money-guide-panel money-guide-panel--fishing"></div>
      <div id="money-guide-farming" class="money-guide-panel money-guide-panel--farming" hidden></div>
      <div id="money-guide-quest" class="money-guide-panel money-guide-panel--quest" hidden>${buildQuestGuideHtml()}</div>
    </section>
  `;
  document.getElementById("sections").insertAdjacentHTML("beforeend", html);
  initMoneyGuideTabs();
}

function initMoneyGuideTabs() {
  const section = document.getElementById(slugify("Money & Game Guide"));
  if (!section || section.dataset.tabsInit === "1") return;
  section.dataset.tabsInit = "1";
  const tabs = section.querySelectorAll(".money-guide-tab");
  const panels = section.querySelectorAll(".money-guide-panel");

  function activate(panelId) {
    tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.panel === panelId));
    panels.forEach(panel => {
      panel.hidden = panel.id !== panelId;
    });
    if (panelId === "money-guide-fishing") {
      loadFishingGuidePanel();
    } else if (panelId === "money-guide-farming") {
      loadFarmingGuidePanel();
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activate(tab.dataset.panel));
  });
  activate("money-guide-fishing");
}

function renderSection(title, items) {
  if (title === "BlockSpin Map") {
    renderBlockSpinMapSection();
    return;
  }

  if (title === "Home") {
    const html = `
      <section class="section" id="${slugify(title)}">
        <h2>${title}</h2>
        <div class="home-content">
        </div>
      </section>
    `;
    document.getElementById("sections").insertAdjacentHTML("beforeend", html);
    return;
  }
  if (title === "Money & Game Guide") {
    renderMoneyGameGuideSection();
    return;
  }
  if (!items || items.length === 0) return;

  if (title === "💰 Richest Players") {
    renderRichestPlayersSection(items);
  } else if (title === "Crew Logos") {
    renderCrewLogosSection(items);
  } else if (title === ACCESSORIES_SECTION_NAME) {
    renderAccessoriesSection(items);
  } else if (title === "Legendary") {
    renderLegendarySectionWithBanner(items);
  } else if (title === "Vehicles") {
    renderVehiclesSectionWithBanner(items);
  } else if (title === "Omega") {
    const html = `
      <section class="section" id="${slugify("Omega")}">
        <h2>Omega</h2>
        <div class="cards">
          ${buildCardsHtmlWithDiscordPromo(items, createCard, "Omega")}
        </div>
        <div class="legendary-banner giveaway-banner--red" id="omega-anaconda-banner" style="display: none;">
          <p class="legendary-banner-text">Join our <strong>Anaconda giveaway</strong> in our Discord server!</p>
          <div class="legendary-banner-right">
            <a href="https://discord.gg/nKKkXyqCsv" target="_blank" rel="noopener" class="legendary-banner-btn">Join our Discord server</a>
            <p class="legendary-banner-members"><span class="discord-member-count">—</span> members</p>
          </div>
        </div>
        ${buildRobuxGiveawayBannerHtml("robux-giveaway-banner-" + slugify("Omega"))}
      </section>
    `;
    document.getElementById("sections").insertAdjacentHTML("beforeend", html);
  } else if (title === "Epic") {
    const html = `
      <section class="section" id="${slugify("Epic")}">
        <h2>Epic</h2>
        <div class="cards">
          ${buildCardsHtmlWithDiscordPromo(items, createCard, "Epic")}
        </div>
        <div class="legendary-banner giveaway-banner--purple" id="epic-firework-banner" style="display: none;">
          <p class="legendary-banner-text">Join our <strong>Firework Launcher giveaway</strong> in our Discord server!</p>
          <div class="legendary-banner-right">
            <a href="https://discord.gg/8AUjJu9jnr" target="_blank" rel="noopener" class="legendary-banner-btn">Join our Discord server</a>
            <p class="legendary-banner-members"><span class="discord-member-count">—</span> members</p>
          </div>
        </div>
        ${buildRobuxGiveawayBannerHtml("robux-giveaway-banner-" + slugify("Epic"))}
        <div class="epic-shark-promo">
          <a href="https://attackshark.com/?ref=RIVER" target="_blank" rel="noopener noreferrer sponsored" class="epic-shark-promo-link">
            <p class="epic-shark-promo-text">CLICK HERE TO GET THE BEST GAMING MICE!</p>
            <img src="https://i.ibb.co/0pM24HZ9/ph-11134207-7rasi-m9tr2cfmioxw1c.jpg" alt="Attack Shark gaming mice" class="epic-shark-promo-img" loading="lazy" />
          </a>
        </div>
      </section>
    `;
    document.getElementById("sections").insertAdjacentHTML("beforeend", html);
  } else {
    var robuxTail = ROBUX_GIVEAWAY_SECTION_TITLES.has(title)
      ? buildRobuxGiveawayBannerHtml("robux-giveaway-banner-" + slugify(title))
      : "";
    const html = `
      <section class="section" id="${slugify(title)}">
        <h2>${title}</h2>
        <div class="cards">
          ${buildCardsHtmlWithDiscordPromo(items, createCard, title)}
        </div>
        ${robuxTail}
      </section>
    `;
    document.getElementById("sections").insertAdjacentHTML("beforeend", html);
  }
}


function renderLegendarySectionWithBanner(items) {
  const html = `
    <section class="section" id="${slugify("Legendary")}">
      <h2>Legendary</h2>
      <div class="cards">
        ${buildCardsHtmlWithDiscordPromo(items, createCard, "Legendary")}
      </div>
      <div class="legendary-banner">
        <p class="legendary-banner-text">We <strong>giveaway</strong> a <strong>Legendary gun</strong> in our Discord server every day!</p>
        <div class="legendary-banner-right">
          <a href="https://discord.gg/scgqMpPAC6" target="_blank" rel="noopener" class="legendary-banner-btn">Join our Discord server</a>
          <p class="legendary-banner-members"><span class="discord-member-count">—</span> members</p>
        </div>
      </div>
    </section>
  `;
  document.getElementById("sections").insertAdjacentHTML("beforeend", html);
}

function renderVehiclesSectionWithBanner(items) {
  const html = `
    <section class="section" id="${slugify("Vehicles")}">
      <h2>Vehicles</h2>
      <div class="cards">
        ${buildCardsHtmlWithDiscordPromo(items, createCard, "Vehicles")}
      </div>
      ${buildHumveeGiveawayBannerHtml("vehicles-humvee-giveaway-banner")}
    </section>
  `;
  document.getElementById("sections").insertAdjacentHTML("beforeend", html);
}

function fetchDiscordMemberCount() {
  fetch("https://discord.com/api/v10/invites/QbapryYUUx?with_counts=true")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var n = data.approximate_member_count;
      if (typeof n === "number" && !isNaN(n)) {
        var els = document.querySelectorAll(".discord-member-count");
        els.forEach(function (el) { el.textContent = n.toLocaleString(); });
      }
    })
    .catch(function () {});
}

function renderCrewLogosSection(items) {
  const grouped = {};
  
  items.forEach(item => {
    const header = safe(item["Header"]) || "Uncategorized";
    if (!grouped[header]) {
      grouped[header] = [];
    }
    if (item["Name"]) {
      grouped[header].push(item);
    }
  });

  let html = `<section class="section" id="${slugify("Crew Logos")}"><h2>Crew Logos</h2>`;
  
  Object.keys(grouped).forEach(header => {
    if (grouped[header].length > 0) {
      html += `
        <div class="crew-header">${header}</div>
        <div class="crew-logos-scroll">
          ${grouped[header].map(createCrewLogoCard).join("")}
        </div>
      `;
    }
  });
  
  html += `</section>`;
  document.getElementById("sections").insertAdjacentHTML("beforeend", html);
}

function renderAccessoriesSection(items) {
  const miniToBig = {};

  // Pass 1: build mini-header -> big-header map from any row that defines both.
  items.forEach(item => {
    const big = safe(item["Big Header"]).trim();
    const mini = safe(item["Mini Header"]).trim();
    if (big && mini) miniToBig[mini] = big;
  });

  const structure = {};

  function ensureGroup(bigHeader, miniHeader) {
    const big = bigHeader || "Uncategorized";
    const mini = miniHeader || "General";
    if (!structure[big]) structure[big] = {};
    if (!structure[big][mini]) structure[big][mini] = [];
  }

  // Pass 2: add explicit mini-header rows to structure even without items.
  items.forEach(item => {
    const big = safe(item["Big Header"]).trim();
    const mini = safe(item["Mini Header"]).trim();
    const hasName = safe(item["Name"]).trim() !== "";
    if (big && mini && !hasName) ensureGroup(big, mini);
  });

  // Pass 3: place item cards by mini-header, then inferred big-header.
  items.forEach(item => {
    const name = safe(item["Name"]).trim();
    if (!name) return;

    const mini = safe(item["Mini Header"]).trim() || "General";
    const explicitBig = safe(item["Big Header"]).trim();
    const big = explicitBig || miniToBig[mini] || "Uncategorized";
    ensureGroup(big, mini);
    structure[big][mini].push(item);
  });

  let html = `<section class="section accessories-section" id="${slugify(ACCESSORIES_SECTION_NAME)}"><h2>${ACCESSORIES_SECTION_NAME}</h2>`;
  const navData = [];
  let bigCounter = 0;
  let miniCounter = 0;

  Object.keys(structure).forEach(bigHeader => {
    const bigAnchor = `acc-big-${bigCounter++}`;
    html += `<div class="accessories-big-header" id="${bigAnchor}">${escapeHtml(bigHeader)}</div>`;
    const miniGroups = structure[bigHeader];
    const miniEntries = [];
    Object.keys(miniGroups).forEach(miniHeader => {
      const miniAnchor = `acc-mini-${miniCounter++}`;
      html += `
        <div class="accessories-mini-header" id="${miniAnchor}">${escapeHtml(miniHeader)}</div>
        <div class="cards">
          ${buildCardsHtmlWithDiscordPromo(miniGroups[miniHeader], createAccessoryCard, ACCESSORIES_SECTION_NAME, 4)}
        </div>
      `;
      miniEntries.push({ title: miniHeader, anchor: miniAnchor });
    });
    navData.push({ title: bigHeader, anchor: bigAnchor, minis: miniEntries });
  });

  html += `</section>`;
  document.getElementById("sections").insertAdjacentHTML("beforeend", html);
  renderAccessoriesFastNav(navData);
}

function renderAccessoriesFastNav(navData) {
  const sidebar = document.getElementById("tax-sidebar-column");
  if (!sidebar) return;

  let box = document.getElementById("accessories-fast-nav");
  if (!box) {
    box = document.createElement("aside");
    box.id = "accessories-fast-nav";
    box.style.display = "none";
    box.style.background = "#141d28";
    box.style.border = "1px solid #2f3f52";
    box.style.borderRadius = "12px";
    box.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.28)";
    box.style.padding = "8px 9px";
    box.style.marginTop = "0";
    box.style.marginBottom = "10px";
    box.style.maxHeight = "none";
    box.style.overflowY = "visible";
    box.style.position = "sticky";
    box.style.top = "12px";
    sidebar.insertBefore(box, sidebar.firstChild);
  }

  const rows = [];
  rows.push('<h2 style="margin:0 0 7px 0; color:#dbeafe; font-size:0.9rem; text-align:center; font-weight:700;">Fast Navigation</h2>');

  navData.forEach(group => {
    rows.push(
      `<button type="button" data-target="${escapeAttr(group.anchor)}" style="display:block;width:100%;text-align:left;background:transparent;border:none;color:#e5efff;font-weight:700;padding:5px 4px;cursor:pointer;border-radius:0;margin-bottom:2px;font-size:0.79rem;">${escapeHtml(group.title)}</button>`
    );
    (group.minis || []).forEach(mini => {
      rows.push(
        `<button type="button" data-target="${escapeAttr(mini.anchor)}" style="display:block;width:100%;text-align:left;background:transparent;border:none;color:#9ec3dd;padding:4px 4px 4px 14px;cursor:pointer;border-radius:0;margin:0 0 1px 0;font-size:0.74rem;">${escapeHtml(mini.title)}</button>`
      );
    });
  });

  rows.push('<div style="height:6px"></div>');
  rows.push('<button type="button" id="acc-fast-nav-top" style="width:100%;padding:6px 8px;background:#203047;color:#cfe6ff;border:1px solid #355274;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.75rem;">Back to Top</button>');
  box.innerHTML = rows.join("");

  box.querySelectorAll("button[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const el = targetId ? document.getElementById(targetId) : null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const topBtn = document.getElementById("acc-fast-nav-top");
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      const sec = document.getElementById(slugify(ACCESSORIES_SECTION_NAME));
      if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}


function renderScammerSection(items) {
  let html = `
    <section class="section" id="${slugify("Scammer List")}">
      <h2>Scammer List</h2>
      <p class="scammer-warning">⚠️ WARNING: These clowns have been reported in our discord server for scamming. Please trade with extreme caution! Report scammers in our discord server to have them placed here!</p>
      <div class="cards">
        ${items.map(createScammerCard).join("")}
      </div>
    </section>
  `;
  document.getElementById("sections").insertAdjacentHTML("beforeend", html);
}


 function renderRichestPlayersSection(items) {
  const sectionId = slugify("💰 Richest Players");
  const html = `
    <section class="section richest-players-section" id="${sectionId}">
      <a href="#" class="richest-back-to-top" id="richest-back-to-top" aria-label="Back to top">
        <img src="https://i.ibb.co/N2kY994q/undo.png" alt="" class="richest-back-to-top-icon" />
        <span class="richest-back-to-top-text">Back to top</span>
      </a>
      ${createRichestPlayersSection(items)}
    </section>
  `;
  document.getElementById("sections").insertAdjacentHTML("beforeend", html);
  
  setTimeout(() => {
    const searchInput = document.getElementById('richest-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        filterRichestPlayers(e.target.value);
      });
    }
    const backToTop = document.getElementById('richest-back-to-top');
    const section = document.querySelector('.richest-players-section');
    if (backToTop && section) {
      backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, 100);
}

function initSectionsNav() {
  const nav = document.getElementById("sections-nav");
  if (!nav) return;

  let extrasHeaderShown = false;
  SECTION_NAMES.forEach((name) => {
    const cfg = typeof getSectionConfig === "function" ? getSectionConfig(name) : null;
    if (cfg && cfg.navGroup === "extras" && !extrasHeaderShown) {
      const gap = document.createElement("div");
      gap.className = "nav-gap";
      nav.appendChild(gap);

      const extrasHeader = document.createElement("div");
      extrasHeader.className = "nav-extras-header";
      extrasHeader.textContent = "Extras";
      nav.appendChild(extrasHeader);
      extrasHeaderShown = true;
    }

    const btn = document.createElement("button");
    btn.textContent = name;
    btn.addEventListener("click", () => showSection(name));
    nav.appendChild(btn);
  });
}

function getSectionElementId(title) {
  const cfg = typeof getSectionConfig === "function" ? getSectionConfig(title) : null;
  return cfg ? cfg.id : slugify(title);
}

function syncItemSectionSearchPlacement(name) {
  const sectionsEl = document.getElementById("sections");
  const searchContainer = document.querySelector(".search-container");
  if (!sectionsEl || !searchContainer) return;

  const cfg = typeof getSectionConfig === "function" ? getSectionConfig(name) : null;
  const searchHidden = !cfg || cfg.search === "hide";
  const mobileSearchInSection = Boolean(cfg && cfg.mobileSearchInSection);

  function restoreSearchBeforeHome() {
    const homeSec = document.getElementById("home");
    if (
      searchContainer.parentNode === sectionsEl &&
      homeSec &&
      searchContainer.nextElementSibling === homeSec
    ) {
      return;
    }
    if (homeSec) {
      sectionsEl.insertBefore(searchContainer, homeSec);
    } else {
      sectionsEl.prepend(searchContainer);
    }
  }

  if (!window.matchMedia("(max-width: 1024px)").matches || searchHidden || !mobileSearchInSection) {
    restoreSearchBeforeHome();
    return;
  }

  const activeSec = document.getElementById(getSectionElementId(name));
  if (!activeSec || !activeSec.classList.contains("section")) {
    restoreSearchBeforeHome();
    return;
  }

  const cards = activeSec.querySelector(".cards");
  if (cards) {
    activeSec.insertBefore(searchContainer, cards);
  } else {
    const h2 = activeSec.querySelector("h2");
    if (h2) {
      h2.insertAdjacentElement("afterend", searchContainer);
    } else {
      activeSec.prepend(searchContainer);
    }
  }
}

function showSection(name) {
  console.log(`Showing section: ${name}`);

  const cfg = typeof getSectionConfig === "function" ? getSectionConfig(name) : null;
  if (!cfg) return;

  document.querySelectorAll('.durability-input').forEach(input => {
    const card = input.closest('.card');
    const maxDurability = card.dataset.maxDurability;
    input.value = maxDurability;
    updateCardValues(input);
  });

  const taxSidebarColumn = document.getElementById('tax-sidebar-column');
  const homeValueChanges = document.getElementById('home-value-changes');
  const taxCalc = taxSidebarColumn ? taxSidebarColumn.querySelector('.tax-calculator') : null;
  const middlemanPromo = taxSidebarColumn ? taxSidebarColumn.querySelector('.discord-mm-promo--sidebar') : null;
  const accessoriesFastNav = document.getElementById('accessories-fast-nav');

  document.body.classList.toggle('is-home', cfg.id === 'home');

  if (taxSidebarColumn) {
    if (cfg.sidebarColumn === 'hide') {
      taxSidebarColumn.style.visibility = 'hidden';
      taxSidebarColumn.style.opacity = '0';
      taxSidebarColumn.style.display = 'none';
    } else {
      taxSidebarColumn.style.visibility = 'visible';
      taxSidebarColumn.style.opacity = '1';
      taxSidebarColumn.style.display = 'flex';
    }
  }

  if (typeof applyVisibilityMode === 'function') {
    applyVisibilityMode(taxCalc, cfg.taxCalc, cfg.id === 'home' ? 'none' : 'block');
    applyVisibilityMode(middlemanPromo, cfg.middlemanPromo, 'block');
  }

  if (accessoriesFastNav) {
    const showFastNav = Boolean(cfg.accessoriesFastNav);
    accessoriesFastNav.style.display = showFastNav ? 'block' : 'none';
    accessoriesFastNav.style.visibility = showFastNav ? 'visible' : 'hidden';
    accessoriesFastNav.style.opacity = showFastNav ? '1' : '0';
    accessoriesFastNav.style.pointerEvents = showFastNav ? 'auto' : 'none';
  }

  if (homeValueChanges) {
    homeValueChanges.style.visibility = cfg.homeValueChanges ? 'visible' : 'hidden';
    homeValueChanges.style.opacity = cfg.homeValueChanges ? '1' : '0';
    homeValueChanges.style.display = cfg.homeValueChanges ? 'block' : 'none';
  }

  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    if (cfg.search === 'hide') {
      searchContainer.style.cssText = 'visibility: hidden; height: 0; margin: 0; overflow: hidden;';
    } else {
      searchContainer.style.cssText = 'visibility: visible; height: auto; overflow: visible; width: 100%; display: flex; justify-content: center; align-items: center;';
    }
  }

  getSectionRegistry().forEach(function (sectionCfg) {
    const el = document.getElementById(sectionCfg.id);
    if (el) el.style.display = sectionCfg.title === name ? "block" : "none";
  });

  document.querySelectorAll("#sections-nav button").forEach(b => {
    b.classList.toggle("active", b.textContent === name);
  });

  syncItemSectionSearchPlacement(name);
  trackEvent("view_section", { section_name: name });
}

function initSearch() {
  const input = document.getElementById("search");
  if (!input) return;

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
      const name = card.dataset.name.toLowerCase();
      card.classList.toggle("hidden", !name.includes(val));
    });
  });
}

function getTaxBreakdown(amountWant) {
  const want = Math.round(Number(amountWant) || 0);
  if (want <= 0) return { totalWithdraw: 0, lines: [], singleDrop: true };
  const totalWithdraw = Math.round(want / TAX_RECEIVE_RATIO);
  if (totalWithdraw <= TAX_MAX_DROP) {
    return {
      totalWithdraw,
      lines: ['Drop $' + totalWithdraw.toLocaleString()],
      singleDrop: true
    };
  }
  const full40kCount = Math.floor(totalWithdraw / TAX_MAX_DROP);
  const receivedFromFull = full40kCount * TAX_RECEIVE_PER_40K;
  const lastReceive = want - receivedFromFull;
  const lastWithdraw = Math.round(lastReceive / TAX_RECEIVE_RATIO);
  const lines = [];

  if (full40kCount === 1 && lastWithdraw > 0) {
    lines.push('Drop $40,000 once');
    lines.push('then Drop $' + lastWithdraw.toLocaleString() + '.');
  } else if (lastWithdraw > 0) {
    lines.push('Drop $40,000 ' + full40kCount.toLocaleString() + ' times');
    lines.push('then Drop $' + lastWithdraw.toLocaleString() + '.');
  } else {
    lines.push('Drop $40,000 ' + full40kCount.toLocaleString() + ' times.');
  }
  return { totalWithdraw, lines, singleDrop: false };
}

function formatDollar(amount) {
  return '$' + (Math.round(Number(amount) || 0)).toLocaleString();
}

function buildTaxBreakdownHtml(want, breakdown) {
  return '<span class="tax-how-label">To drop ' +
    formatDollar(want) +
    ' in game you drop ' +
    formatDollar(breakdown.totalWithdraw) +
    '. Steps:</span><br>' +
    breakdown.lines.map(function(line) { return line + '<br>'; }).join('');
}

function initTaxCalculator() {
  const taxInput = document.getElementById("taxInput");
  const taxAmount = document.getElementById("tax-amount");
  const taxBreakdown = document.getElementById("tax-breakdown");

  if (!taxInput || !taxAmount) {
    console.log("Tax calculator elements not found");
    return;
  }

  function update() {
    const raw = taxInput.value.replace(/[^\d]/g, '');
    const want = parseInt(raw, 10) || 0;
    const b = getTaxBreakdown(want);
    taxAmount.innerHTML = b.totalWithdraw.toLocaleString() + ' <span class="tax-after-label">After Tax</span>';
    if (taxBreakdown) {
      if (b.totalWithdraw <= 0) {
        taxBreakdown.innerHTML = '';
        return;
      }
      taxBreakdown.innerHTML = buildTaxBreakdownHtml(want, b);
    }
  }

  taxInput.addEventListener("input", function(e) {
    const cursorPos = e.target.selectionStart;
    const oldValue = e.target.value;
    const newValue = oldValue.replace(/[^\d]/g, '');
    if (oldValue !== newValue) {
      e.target.value = newValue;
      e.target.setSelectionRange(Math.max(0, cursorPos - 1), Math.max(0, cursorPos - 1));
    }
    update();
  });

  taxInput.addEventListener('paste', function(e) {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const cleaned = (paste || '').replace(/[^\d]/g, '');
    document.execCommand('insertText', false, cleaned);
  });

  update();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓';
    btn.style.backgroundColor = '#28a745';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
    }, 1500);
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓';
    btn.style.backgroundColor = '#28a745';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
    }, 1500);
  });
}

let durabilityInterval = null;
let durabilityTimeout = null;

function enforceMaxDurability(input) {
  const card = input.closest('.card');
  const maxDurability = parseInt(card.dataset.maxDurability);
  let value = parseInt(input.value);
  
  if (value > maxDurability) {
    input.value = maxDurability;
  } else if (value < 0) {
    input.value = 0;
  }
  
  updateCardValues(input);
}

function adjustDurability(btn, direction, evt) {
  if (evt) evt.preventDefault();
  
  const card = btn.closest('.card');
  const input = card.querySelector('.durability-input');
  const maxDurability = parseInt(card.dataset.maxDurability);
  const isTouch =
    !!evt && (
      evt.type === 'touchstart' ||
      (evt.pointerType && evt.pointerType === 'touch')
    );
  const holdDelayMs = isTouch ? 120 : 200;
  const repeatEveryMs = isTouch ? 30 : 50;
  
  function adjust() {
    let newValue = (parseInt(input.value) || 0) + direction;
    newValue = Math.max(0, Math.min(newValue, maxDurability));
    input.value = newValue;
    updateCardValues(input);
  }
  
  adjust();
  
  durabilityTimeout = setTimeout(() => {
    durabilityInterval = setInterval(adjust, repeatEveryMs);
  }, holdDelayMs);
}

function stopDurabilityAdjust() {
  if (durabilityInterval) {
    clearInterval(durabilityInterval);
    durabilityInterval = null;
  }
  if (durabilityTimeout) {
    clearTimeout(durabilityTimeout);
    durabilityTimeout = null;
  }
}

function updateCardValues(input) {
  const card = input.closest('.card');
  const currentDurability = parseInt(input.value) || 0;
  const maxDurability = parseInt(card.dataset.maxDurability);
  
  const durabilityPercent = currentDurability / maxDurability;
  
  const originalAvg = card.dataset.avg;
  const originalRanged = card.dataset.ranged;
  
  card.querySelector('.avg-value').textContent = calculateDurabilityValue(originalAvg, durabilityPercent);
  card.querySelector('.ranged-value').textContent = calculateDurabilityValue(originalRanged, durabilityPercent);
  
  const internalValue = card.dataset.internalValue;
  const repairValueElement = card.querySelector('.repair-value');
  
  if (repairValueElement && internalValue) {
    const missingDurability = maxDurability - currentDurability;
    const internalVal = parseInternalValue(internalValue);
    const repairPrice = Math.round(missingDurability * (internalVal / maxDurability / 1.43));
    repairValueElement.textContent = '$' + (isNaN(repairPrice) ? 0 : repairPrice).toLocaleString();
  }
  
  const pawnValueElement = card.querySelector('.pawn-value');
  
  if (pawnValueElement && internalValue) {
    const missingDurability = maxDurability - currentDurability;
    const internalVal = parseInternalValue(internalValue);
    
    const baseValue = internalVal * 0.3;
    const deduction = missingDurability * ((internalVal * 0.3) / maxDurability / 1.43);
    const pawnPrice = Math.round(baseValue - deduction);
    
    pawnValueElement.textContent = '$' + (isNaN(pawnPrice) ? 0 : pawnPrice).toLocaleString();
  }
}

function calculateDurabilityValue(originalValue, durabilityPercent) {
  if (!originalValue || originalValue === '' || originalValue === 'N/A' || originalValue === '-') {
    return originalValue || 'N/A';
  }
  
  const valueMultiplier = 0.20 + (0.80 * durabilityPercent);
  
  if (originalValue.includes(' to ')) {
    const parts = originalValue.split(' to ');
    const low = parseValue(parts[0]) * valueMultiplier;
    const high = parseValue(parts[1]) * valueMultiplier;
    
    if (!isNaN(low) && !isNaN(high)) {
      const lowFormatted = formatLikeOriginal(low, parts[0]);
      const highFormatted = formatLikeOriginal(high, parts[1]);
      return lowFormatted + ' to ' + highFormatted;
    }
  }
  
  const value = parseValue(originalValue) * valueMultiplier;
  
  if (!isNaN(value) && value > 0) {
    return formatLikeOriginal(value, originalValue);
  }
  
  return originalValue;
}

function parseValue(str) {
  if (!str) return 0;
  
  str = str.toString().trim().toLowerCase();
  str = str.replace(/[$,]/g, '');
  
  if (/\bmillion\b/.test(str)) {
    return parseFloat(str.replace(/[^0-9.]/g, '')) * 1000000;
  }
  
  if (str.includes('k')) {
    return parseFloat(str.replace(/k/g, '')) * 1000;
  }
  
  if (str.includes('m')) {
    return parseFloat(str.replace(/m/g, '')) * 1000000;
  }
  
  return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
}



function formatLikeOriginal(num, original) {
  num = Math.round(num);
  
  const lower = original.toLowerCase();
  // "1 Million" contains "m" but must not use abbreviated $Xm styling
  const wasK = lower.includes('k') && !/\bthousand\b/.test(lower);
  const wasM = lower.includes('m') && !/\bmillion\b/.test(lower);
  const hadCommas = original.includes(',');
  
  if (wasM) {
    const m = Math.round(num / 1000000);
    return '$' + m + 'm';
  } else if (wasK) {
    const k = Math.round(num / 1000);
    return '$' + k + 'k';
  } else if (hadCommas || num >= 1000) {
    return '$' + num.toLocaleString();
  } else {
    return '$' + num;
  }
}

document.addEventListener('mouseup', stopDurabilityAdjust);
document.addEventListener('touchend', stopDurabilityAdjust);
document.addEventListener('touchcancel', stopDurabilityAdjust);
document.addEventListener('mouseup', stopFishWeightAdjust);
document.addEventListener('touchend', stopFishWeightAdjust);
document.addEventListener('touchcancel', stopFishWeightAdjust);

function safe(str) { return str ?? ""; }
function escapeAttr(str) {
  return (str + "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeHtml(str) {
  return (str + "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function parseInternalValue(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return 0;
  const numeric = raw.replace(/[^0-9.]/g, "");
  if (!numeric) return 0;
  let n = parseFloat(numeric);
  if (!isFinite(n)) return 0;
  if (/\bbillion\b/.test(raw) || raw.includes("b")) n *= 1e9;
  else if (/\bmillion\b/.test(raw) || raw.includes("m")) n *= 1e6;
  else if (/\bthousand\b/.test(raw) || raw.includes("k")) n *= 1e3;
  return n;
}
function normalizeHeaderKey(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
function getInternalValueFromItem(item) {
  if (!item || typeof item !== "object") return "";
  const direct = item["Internal Value"];
  if (direct !== undefined && direct !== null && String(direct).trim() !== "") return direct;

  const preferredKeys = ["internalvalue", "networthvalue", "internal", "networth"];
  for (const key of Object.keys(item)) {
    const norm = normalizeHeaderKey(key);
    if (!norm) continue;
    if (preferredKeys.includes(norm) || norm.includes("internalvalue") || norm.includes("networthvalue")) {
      const v = item[key];
      if (v !== undefined && v !== null && String(v).trim() !== "") return v;
    }
  }

  // Fallback: recover by sheet column position when labels are inconsistent.
  const rowValues = Array.isArray(item.__rowValues) ? item.__rowValues : [];
  const colLabels = Array.isArray(item.__colLabels) ? item.__colLabels : [];
  if (rowValues.length) {
    let internalIdx = -1;
    for (let i = 0; i < colLabels.length; i++) {
      if (normalizeHeaderKey(colLabels[i]).includes("internalvalue")) {
        internalIdx = i;
        break;
      }
    }
    if (internalIdx >= 0 && internalIdx < rowValues.length) {
      const byHeaderIndex = rowValues[internalIdx];
      if (byHeaderIndex !== undefined && byHeaderIndex !== null && String(byHeaderIndex).trim() !== "") {
        return byHeaderIndex;
      }
    }
    // Known schema fallback: Name, Image URL, Demand, Average, Ranged, Quantum, Durability, Internal, Durability Invisible
    if (rowValues.length >= 8) {
      const byKnownIndex = rowValues[7];
      if (byKnownIndex !== undefined && byKnownIndex !== null && String(byKnownIndex).trim() !== "") {
        return byKnownIndex;
      }
    }
  }
  return "";
}
/** Prefer numeric cell.v from Sheets (reliable); else formatted f; else string v. */
function coerceInternalCell(cell) {
  if (!cell) return "";
  if (typeof cell.v === "number" && Number.isFinite(cell.v)) {
    return String(cell.v);
  }
  if (cell.v !== null && cell.v !== undefined) {
    const vs = String(cell.v).trim();
    if (vs !== "") return vs;
  }
  if (cell.f !== undefined && cell.f !== null && String(cell.f).trim() !== "") {
    return String(cell.f);
  }
  return "";
}
function getCellDisplayValue(cell) {
  if (!cell) return "";
  if (cell.f !== undefined && cell.f !== null && String(cell.f).trim() !== "") {
    return cell.f;
  }
  if (cell.v !== undefined && cell.v !== null) {
    return cell.v;
  }
  return "";
}
function getSheetNameForSection(displayName) {
  if (displayName === "Common / Uncommon") return "Uncommon";
  if (displayName === ACCESSORIES_SECTION_NAME) return "Accessories";
  return displayName;
}

function slugify(str) {
  const cfg = typeof getSectionConfig === "function" ? getSectionConfig(str) : null;
  if (cfg && cfg.id) return cfg.id;
  if (str === "Common / Uncommon") return "uncommon";
  return str.toLowerCase().replace(/\s+/g, "-");
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log('DOM loaded, initializing...');
  initAnalytics();
  setupDiscordClickTracking();
  initDiscordJoinNudge();

  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
      console.warn('Loading timeout - forcing hide');
      loadingScreen.style.display = 'none';
    }
  }, 15000);
  
  const sectionsContainer = document.getElementById("sections");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  if (!sectionsContainer || !progressBar || !progressText) {
    return;
  }

  var homeHumveeWrap = document.querySelector(".home-humvee-banner-wrap");
  if (homeHumveeWrap) {
    homeHumveeWrap.innerHTML = buildHumveeGiveawayBannerHtml("home-humvee-giveaway-banner");
  }
  mountHomeDiscordPromo();

  initSectionsNav();
  initSearch();
  initTaxCalculator();

  const totalSections = SECTION_NAMES.length;
  let loadedSections = 0;

  const fetchPromises = SECTION_NAMES.map(async (sec) => {
   
    console.log(`Fetching data for: ${sec}`);
    
    let items = [];
    const cfg = typeof getSectionConfig === "function" ? getSectionConfig(sec) : null;
    try {
      if (cfg && cfg.dataSource === "richest") {
        items = await fetchRichestPlayers();
        console.log(`Got ${items.length} items for ${sec} from NEW spreadsheet`);
      } else if (cfg && cfg.dataSource === "sheet") {
        items = await fetchSheet(cfg.sheetName || getSheetNameForSection(sec));
        console.log(`Got ${items.length} items for ${sec} from OLD spreadsheet`);
      }
    } catch (error) {
      console.error(`Failed to load ${sec}:`, error);
      items = [];
    }
    
    loadedSections++;
    const progress = Math.round((loadedSections / totalSections) * 100);
    progressBar.style.width = progress + '%';
    progressText.textContent = progress + '%';
    
    return { section: sec, items };
  });

  const results = await Promise.all(fetchPromises);

  results.forEach(({ section, items }) => {
    renderSection(section, items);
  });
  applyStripGiveawayBannerVisibility();
  initGiveawayBannerCarousels();

  let initialSection = "Home";
  if (window.location.hash && window.location.hash.startsWith('#sec=')) {
    let requested = decodeURIComponent(window.location.hash.substring(5));
    if (requested === "Uncommon") requested = "Common / Uncommon";
    if (SECTION_NAMES.includes(requested)) {
      initialSection = requested;
    }
  }

  showSection(initialSection);
  loadTopDonators();
  loadValueChanges();
  fetchDiscordMemberCount();

  sectionsContainer.classList.add("loaded");
  
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
  }, 300);

});

var _searchPlacementResizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(_searchPlacementResizeTimer);
  _searchPlacementResizeTimer = setTimeout(function () {
    var active = document.querySelector("#sections-nav button.active");
    if (active && typeof syncItemSectionSearchPlacement === "function") {
      syncItemSectionSearchPlacement(active.textContent.trim());
    }
  }, 120);
});

document.addEventListener('click', function(e) {
  const trigger = e.target.closest('.card-giveaway-trigger');
  if (!trigger) return;
  ensureGiveawayModal();
  const modal = document.getElementById('giveaway-modal');
  if (!modal) return;
  modal.classList.add('visible');
});

document.addEventListener('click', function(e) {
  if (e.target.matches('[data-giveaway-close]') || e.target.closest('[data-giveaway-close]')) {
    const modal = document.getElementById('giveaway-modal');
    if (modal) modal.classList.remove('visible');
  }
});

function openRiverLinks(e) {
  e.preventDefault();
  const modal = document.createElement('div');
  modal.className = 'river-links-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>River's Contact</h2>
      <div class="links-list">
        <a href="https://www.roblox.com/users/2361072897/profile" target="_blank">
          <span class="link-icon">🎮</span>
          <span class="link-text">Roblox Profile</span>
        </a>
        <div class="copy-link" onclick="copyToClipboard('_.riverr')">
          <svg class="link-icon discord-svg" viewBox="0 0 24 24" width="20" height="20" fill="#5865F2">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.29a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span class="link-text">Discord: _.riverr</span>
          <span class="copy-icon">📋</span>
        </div>
        <div class="copy-link" onclick="copyToClipboard('riverytacc11@gmail.com')">
          <span class="link-icon">📧</span>
          <span class="link-text">Email: riverytacc11@gmail.com</span>
          <span class="copy-icon">📋</span>
        </div>
      </div>
      <button class="close-modal-btn" onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

// Fetch and display top donators
async function loadTopDonators() {
  try {
    const donators = await fetchSheet("Top Donate");
    const donatorList = document.getElementById('donator-list');
    
    if (!donators || donators.length === 0) {
      const noDonatorsHTML = '<div class="donator-loading">No donators yet</div>';
      if (donatorList) donatorList.innerHTML = noDonatorsHTML;
      return;
    }
    
    const top10 = donators.slice(0, 10);
    
    const donatorsHTML = top10.map((donator, index) => {
      const rank = index + 1;
      const name = donator.Name || 'Anonymous';
      const donation = donator.Donation || '0';
      const profile = donator['User Profile'] || '#';
      
      const formattedDonation = donation;
      
      return `
        <div class="donator-item">
          <div class="donator-rank">${rank}</div>
          <div class="donator-info">
            <div class="donator-name">${name}</div>
            <div class="donator-amount">${formattedDonation}</div>
            ${profile !== '#' ? `<a href="${profile}" target="_blank" class="donator-profile">View Profile 🔗</a>` : ''}
          </div>
        </div>
      `;
    }).join('');
    
    if (donatorList) donatorList.innerHTML = donatorsHTML;
    
  } catch (error) {
    console.error('Error loading donators:', error);
    const errorHTML = '<div class="donator-loading">Failed to load donators</div>';
    const donatorList = document.getElementById('donator-list');
    if (donatorList) donatorList.innerHTML = errorHTML;
  }
}

// Show/hide Epic/Omega giveaway banners from Website Configs.
// Your sheet: row 1 = column headers "Anaconda GW" and "Firework GW", row 2 = "Yes" under each to show that banner.
// Using "GW" avoids clashing with item names like Anaconda/Firework in other sheets.
function applyBannerConfig(rows) {
  if (!rows || !rows.length) return;
  var showAnaconda = false;
  var showFirework = false;
  var first = rows[0];
  if (first && ("Anaconda GW" in first || "Firework GW" in first)) {
    var anacondaVal = (first["Anaconda GW"] || "").toString().trim().toLowerCase();
    var fireworkVal = (first["Firework GW"] || "").toString().trim().toLowerCase();
    showAnaconda = /^(yes|1|true|on)$/.test(anacondaVal);
    showFirework = /^(yes|1|true|on)$/.test(fireworkVal);
  } else {
    rows.forEach(function (r) {
      var name = (r.Title || r.Name || '').toString().trim();
      var show = (r.Show || r.Enabled || '').toString().trim().toLowerCase();
      if (name === "Anaconda GW") showAnaconda = /^(yes|1|true|on)$/.test(show);
      if (name === "Firework GW") showFirework = /^(yes|1|true|on)$/.test(show);
    });
  }
  var anacondaEl = document.getElementById('omega-anaconda-banner');
  var fireworkEl = document.getElementById('epic-firework-banner');
  if (anacondaEl) anacondaEl.style.display = showAnaconda ? 'flex' : 'none';
  if (fireworkEl) fireworkEl.style.display = showFirework ? 'flex' : 'none';
}

// Fetch and display recent value changes from spreadsheet (sheet: "Website Configs", columns: Title, Date, Text, Color)
async function loadValueChanges() {
  var listEl = document.getElementById('value-changes-list');
  var mobileListEl = document.getElementById('mobile-value-changes-list');
  if (!listEl && !mobileListEl) return;
  function setValueChangesHtml(html) {
    if (listEl) listEl.innerHTML = html;
    if (mobileListEl) mobileListEl.innerHTML = html;
  }
  try {
    var rows = await fetchSheet("Website Configs");
    if (!rows || rows.length === 0) {
      setValueChangesHtml('<div class="value-changes-loading">No value changes yet.</div>');
      return;
    }
    applyBannerConfig(rows);
    var filtered = rows.filter(function (r) {
      var name = (r.Title || r.Name || '').toString().trim();
      if (name === "Anaconda GW" || name === "Firework GW") return false;
      var t = (r.Title || r.Date || r.Text || '').toString().trim();
      return t.length > 0;
    });
    if (filtered.length === 0) {
      setValueChangesHtml('<div class="value-changes-loading">No value changes yet.</div>');
      return;
    }
    var colorMap = { green: 'green', orange: 'orange', red: 'red', blue: 'blue' };
    var html = filtered.map(function (r) {
      var title = (r.Title || '').toString().trim();
      var date = (r.Date || '').toString().trim();
      var text = (r.Text || '').toString().trim();
      var color = (r.Color || '').toString().trim().toLowerCase();
      var colorClass = colorMap[color] ? ' value-change-item--' + colorMap[color] : '';
      var titleEsc = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      var dateEsc = date.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      var textEsc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '<br>');
      return '<div class="value-change-item' + colorClass + '">' +
        '<div class="value-change-icon' + colorClass + '"></div>' +
        (titleEsc ? '<p class="value-change-title">' + titleEsc + '</p>' : '') +
        (dateEsc ? '<p class="value-change-date">' + dateEsc + '</p>' : '') +
        (textEsc ? '<p class="value-change-text">' + textEsc + '</p>' : '') +
        '</div>';
    }).join('');
    setValueChangesHtml(html);
  } catch (err) {
    console.error('Error loading value changes:', err);
    setValueChangesHtml('<div class="value-changes-loading">Failed to load value changes.</div>');
  }
}


/* MOBILE MENU FUNCTIONALITY — index clones #sections-nav; other pages get link list */
function setupMobileHamburgerMenu() {
  if (!window.matchMedia("(max-width: 1024px)").matches) return;
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  if (!hamburgerBtn || !mobileMenu || mobileMenu.dataset.bsvMobileInit === '1') return;
  mobileMenu.dataset.bsvMobileInit = '1';

  var sectionsNav = document.getElementById('sections-nav');
  if (sectionsNav) {
    var navClone = sectionsNav.cloneNode(true);
    mobileMenu.appendChild(navClone);
    var drawerPromo = document.createElement('div');
    drawerPromo.className = 'mobile-menu-drawer-promo';
    drawerPromo.innerHTML =
      '<p class="mobile-menu-sponsored-label">Sponsored</p>' +
      '<div class="mobile-menu-shark-promo">' +
      '<a href="https://attackshark.com/?ref=RIVER" target="_blank" rel="noopener noreferrer sponsored" class="mobile-menu-shark-promo-link">' +
      '<p class="mobile-menu-shark-promo-text">CLICK HERE TO GET THE BEST GAMING MICE!</p>' +
      '<img src="https://i.ibb.co/0pM24HZ9/ph-11134207-7rasi-m9tr2cfmioxw1c.jpg" alt="Attack Shark gaming mice" class="mobile-menu-shark-promo-img" loading="lazy" />' +
      '</a></div>';
    mobileMenu.appendChild(drawerPromo);
    navClone.querySelectorAll('button').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var sectionName = (btn.textContent || '').trim();
        showSection(sectionName);
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
    hamburgerBtn.addEventListener('click', function() {
      hamburgerBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
    mobileMenu.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON') {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
      if (e.target.closest && e.target.closest('.mobile-menu-drawer-promo a')) {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
    return;
  }

  var inner = document.createElement('div');
  inner.className = 'mobile-menu-satellite-inner';
  inner.innerHTML =
    '<a href="index.html">Home</a>' +
    '<a href="x-about.html">About Us</a>' +
    '<a href="x-faq.html">FAQ</a>' +
    '<a href="z-contact.html">Contact Us</a>';
  mobileMenu.appendChild(inner);
  hamburgerBtn.addEventListener('click', function() {
    hamburgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
  mobileMenu.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      hamburgerBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}
document.addEventListener('DOMContentLoaded', setupMobileHamburgerMenu);

// MOBILE TAX CALCULATOR

document.addEventListener('DOMContentLoaded', function() {
    if (!window.matchMedia("(max-width: 1024px)").matches) return;

    const arrow = document.getElementById('mobile-calc-arrow');
    const calc = document.getElementById('mobile-tax-calc');
    const backdrop = document.getElementById('mobile-calc-backdrop');
    const closeBtn = document.getElementById('mobile-calc-close');
    const input = document.getElementById('mobile-tax-input');
    const amount = document.getElementById('mobile-tax-amount');
    const mobileTaxContent = document.getElementById('mobile-tax-content');
    const mobileRecentChanges = document.getElementById('mobile-recent-changes');
    const mobilePromo = calc.querySelector('.discord-mm-promo--mobile-panel');
    const accessoriesCfg = typeof getSectionConfig === "function" ? getSectionConfig(ACCESSORIES_SECTION_NAME) : null;
    const accessoriesSectionId = accessoriesCfg ? accessoriesCfg.id : slugify(ACCESSORIES_SECTION_NAME);
    const originalMobileTaxContentHtml = mobileTaxContent ? mobileTaxContent.innerHTML : '';
    
    if (!arrow || !calc || !closeBtn || !input || !amount) {
      return;
    }

    function openCalc() {
      calc.classList.add('active');
      document.body.classList.add('mobile-panel-open');
      if (backdrop) {
        backdrop.classList.add('active');
        backdrop.setAttribute('aria-hidden', 'false');
      }
    }

    function closeCalc() {
      calc.classList.remove('active');
      document.body.classList.remove('mobile-panel-open');
      if (backdrop) {
        backdrop.classList.remove('active');
        backdrop.setAttribute('aria-hidden', 'true');
      }
    }
    
    const calcSections = typeof getMobileTaxArrowSectionIds === "function"
      ? getMobileTaxArrowSectionIds()
      : ['home', 'uncommon', 'rare', 'epic', 'legendary', 'omega', 'vehicles', 'misc', slugify(ACCESSORIES_SECTION_NAME)];
    
    arrow.addEventListener('click', openCalc);
    closeBtn.addEventListener('click', closeCalc);
    if (backdrop) {
      backdrop.addEventListener('click', closeCalc);
    }
    
    const breakdownEl = document.getElementById('mobile-tax-breakdown');

    function updateMobileTax() {
      const want = parseInt((input.value || '').replace(/[^\d]/g, ''), 10) || 0;
      const b = getTaxBreakdown(want);
      amount.innerHTML = b.totalWithdraw.toLocaleString() + ' <span class="tax-after-label">After Tax</span>';
      if (breakdownEl) {
        if (b.totalWithdraw <= 0) {
          breakdownEl.innerHTML = '';
          return;
        }
        breakdownEl.innerHTML = buildTaxBreakdownHtml(want, b);
      }
    }
    input.addEventListener('input', updateMobileTax);
    updateMobileTax();

    function renderMobileAccessoriesFastNav() {
      if (!mobileTaxContent) return;
      const section = document.getElementById(accessoriesSectionId);
      if (!section) return;

      const bigHeaders = Array.from(section.querySelectorAll('.accessories-big-header'));
      const miniHeaders = Array.from(section.querySelectorAll('.accessories-mini-header'));

      if (bigHeaders.length === 0 && miniHeaders.length === 0) return;

      const rows = [];
      rows.push('<h2 style="margin:0 0 8px 0; color:#dbeafe; font-size:0.95rem; text-align:center; font-weight:700;">Fast Navigation</h2>');

      bigHeaders.forEach(function(el) {
        const id = el.id || '';
        const title = escapeHtml((el.textContent || '').trim());
        if (!id || !title) return;
        rows.push(`<button type="button" data-target="${escapeAttr(id)}" style="display:block;width:100%;text-align:left;background:transparent;border:none;color:#e5efff;font-weight:700;padding:6px 4px;cursor:pointer;border-radius:0;margin-bottom:2px;font-size:0.82rem;">${title}</button>`);
      });

      miniHeaders.forEach(function(el) {
        const id = el.id || '';
        const title = escapeHtml((el.textContent || '').trim());
        if (!id || !title) return;
        rows.push(`<button type="button" data-target="${escapeAttr(id)}" style="display:block;width:100%;text-align:left;background:transparent;border:none;color:#9ec3dd;padding:5px 4px 5px 14px;cursor:pointer;border-radius:0;margin:0 0 1px 0;font-size:0.76rem;">${title}</button>`);
      });

      rows.push('<div style="height:8px"></div>');
      rows.push('<button type="button" id="mobile-acc-fast-nav-top" style="width:100%;padding:7px 9px;background:#203047;color:#cfe6ff;border:1px solid #355274;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.78rem;">Back to Top</button>');

      mobileTaxContent.innerHTML = rows.join('');

      mobileTaxContent.querySelectorAll('button[data-target]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const targetId = btn.getAttribute('data-target');
          const target = targetId ? document.getElementById(targetId) : null;
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeCalc();
        });
      });

      const topBtn = document.getElementById('mobile-acc-fast-nav-top');
      if (topBtn) {
        topBtn.addEventListener('click', function() {
          const sec = document.getElementById(accessoriesSectionId);
          if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeCalc();
        });
      }
    }

    function restoreMobileTaxContent() {
      if (!mobileTaxContent) return;
      if (mobileTaxContent.dataset.navMode === 'accessories') {
        mobileTaxContent.innerHTML = originalMobileTaxContentHtml;
        mobileTaxContent.dataset.navMode = '';
      }
    }

    // Show/hide arrow based on active section
    function updateArrowVisibility() {
      const sections = document.querySelectorAll('.sections > section');
      let activeSection = null;
      
      sections.forEach(section => {
        const computedStyle = window.getComputedStyle(section);
        if (computedStyle.display === 'block') {
          activeSection = section.id;
        }
      });
      
      const isHome = activeSection === 'home';
      const isAccessories = activeSection === accessoriesSectionId;

      if (isAccessories) {
        renderMobileAccessoriesFastNav();
        if (mobileTaxContent) {
          mobileTaxContent.dataset.navMode = 'accessories';
          mobileTaxContent.style.display = 'block';
        }
        if (mobileRecentChanges) mobileRecentChanges.style.display = 'none';
        if (mobilePromo) mobilePromo.style.display = 'none';
      } else {
        restoreMobileTaxContent();
        if (mobileTaxContent) mobileTaxContent.style.display = isHome ? 'none' : 'block';
        if (mobileRecentChanges) mobileRecentChanges.style.display = isHome ? 'block' : 'none';
        if (mobilePromo) mobilePromo.style.display = isHome ? 'none' : 'block';
      }

      if (calcSections.includes(activeSection)) {
        arrow.style.display = 'flex';
      } else {
        arrow.style.display = 'none';
        closeCalc();
      }
    }
    
    updateArrowVisibility();
    
    // Check when sections change
    const observer = new MutationObserver(updateArrowVisibility);
    const sectionsContainer = document.querySelector('.sections');
    if (sectionsContainer) {
      observer.observe(sectionsContainer, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['style'] 
      });
    }
  });

/* ========== PINK WEBSITE THEME - theme switcher (remove with theme section in style.css) ========== */
var THEMES_DISABLED = true; /* Set to false to re-enable theme switcher */

function applyPinkThemeDividers() {
  if (THEMES_DISABLED) {
    document.querySelectorAll('.home-divider').forEach(function(el) {
      el.style.removeProperty('background');
    });
    return;
  }
  var theme = document.body.getAttribute('data-theme');
  var gradient = theme === 'pink'
    ? 'linear-gradient(90deg, transparent, #d0a8b8, transparent)'
    : null;
  document.querySelectorAll('.home-divider').forEach(function(el) {
    if (gradient) {
      el.style.setProperty('background', gradient, 'important');
    } else {
      el.style.removeProperty('background');
    }
  });
}
function initThemeSwitcher() {
  if (THEMES_DISABLED) {
    document.body.removeAttribute('data-theme');
    document.body.classList.add('themes-disabled');
    applyPinkThemeDividers();
    return;
  }
  document.body.classList.remove('themes-disabled');
  var saved = localStorage.getItem('bsv-theme') || 'default';
  // Apply saved theme: '' for default, or specific theme name (e.g. 'red', 'pink', 'purple')
  if (saved === 'pink' || saved === 'red' || saved === 'purple') {
    document.body.setAttribute('data-theme', saved);
  } else {
    document.body.removeAttribute('data-theme');
    saved = 'default';
  }
  applyPinkThemeDividers();
  var wrap = document.getElementById('theme-switcher');
  if (!wrap) return;
  var btns = wrap.querySelectorAll('.theme-switcher-btn');
  btns.forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === saved);
    btn.addEventListener('click', function() {
      var theme = this.getAttribute('data-theme');
      if (theme === 'default') {
        document.body.removeAttribute('data-theme');
      } else {
        document.body.setAttribute('data-theme', theme);
      }
      localStorage.setItem('bsv-theme', theme);
      btns.forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-theme') === theme); });
      applyPinkThemeDividers();
    });
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher();
    applyPinkThemeDividers();
  });
} else {
  initThemeSwitcher();
  applyPinkThemeDividers();
}