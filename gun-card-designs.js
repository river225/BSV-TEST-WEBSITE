(function (global) {
  var SAMPLE = {
    Name: "AK-47",
    "Image URL": "https://i.ibb.co/QqD6BSd/j-Sn2mv-Y-1-removebg-preview.png",
    Demand: "High",
    "Average Value": "$125,000",
    "Ranged Value": "$110k–$140k",
    Durability: "85/100",
    "Internal Value": "125000",
    Giveaway: "yes",
    __sheet: "Legendary"
  };

  function safe(v) {
    return v == null ? "" : String(v);
  }

  function parseInternalValue(raw) {
    var n = parseFloat(String(raw || "").replace(/[$,]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  function getGunCardFields(item) {
    item = item || SAMPLE;
    var name = safe(item.Name);
    var img = safe(item["Image URL"]);
    var demand = safe(item.Demand);
    var avg = safe(item["Average Value"]);
    var ranged = safe(item["Ranged Value"]);
    var durability = safe(item.Durability);
    var internalNum = parseInternalValue(item["Internal Value"]);
    var maxDur = durability && durability.includes("/") ? durability.split("/")[1] || "100" : "100";
    var curDur = durability && durability.includes("/") ? durability.split("/")[0] || maxDur : maxDur;
    var missing = Math.max(0, (parseInt(maxDur, 10) || 0) - (parseInt(curDur, 10) || 0));
    var pawn = Math.round(internalNum * 0.3 - missing * ((internalNum * 0.3) / (parseInt(maxDur, 10) || 100) / 1.43));
    var repair = Math.round(missing * (internalNum / (parseInt(maxDur, 10) || 100) / 1.43));
    var networth = internalNum > 0 ? "$" + Math.round(internalNum).toLocaleString("en-US") : "N/A";
    var hasGiveaway = safe(item.Giveaway).toLowerCase() === "yes";
    var tier = safe(item.__sheet) || "Weapon";

    return {
      name: name,
      img: img,
      imgTag: img ? '<div class="card-item-image-wrap"><img src="' + img + '" alt="' + name + '"></div>' : "",
      demand: demand,
      tier: tier,
      avg: avg,
      ranged: ranged,
      networth: networth,
      pawn: "$" + pawn.toLocaleString("en-US"),
      repair: "$" + repair.toLocaleString("en-US"),
      durability: durability,
      curDur: curDur,
      maxDur: maxDur,
      hasGiveaway: hasGiveaway,
      dataAttrs:
        ' data-name="' + name.replace(/"/g, "&quot;") + '"' +
        ' data-avg="' + avg.replace(/"/g, "&quot;") + '"' +
        ' data-ranged="' + ranged.replace(/"/g, "&quot;") + '"' +
        ' data-max-durability="' + maxDur + '"' +
        ' data-internal-value="' + internalNum + '"'
    };
  }

  function durControl(d) {
    return (
      '<div class="gun-card__durability durability-control">' +
        "<label>Durability:</label>" +
        '<div class="durability-input-row">' +
          '<input type="number" class="durability-input" value="' + d.curDur + '" max="' + d.maxDur + '" min="0" readonly>' +
          '<span class="durability-max">/' + d.maxDur + "</span>" +
        "</div>" +
      "</div>"
    );
  }

  function durControlInteractive(d) {
    return (
      '<div class="gun-card__durability durability-control">' +
        '<div class="durability-input-row">' +
          '<input type="number" class="durability-input" value="' + d.curDur + '" max="' + d.maxDur + '" min="0" oninput="enforceMaxDurability(this)" onchange="updateCardValues(this)">' +
          '<span class="durability-max">/' + d.maxDur + "</span>" +
          '<div class="durability-arrows">' +
            '<button type="button" onmousedown="adjustDurability(this, 1, event)" ontouchstart="adjustDurability(this, 1, event)">▲</button>' +
            '<button type="button" onmousedown="adjustDurability(this, -1, event)" ontouchstart="adjustDurability(this, -1, event)">▼</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  var SHOWCASE_ICON_VALUE =
    '<svg class="gun-card__showcase-icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M4 18l5-5 3 3 4-7 4 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";
  var SHOWCASE_ICON_CUBE =
    '<svg class="gun-card__showcase-icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 4l8 4.5v7L12 20l-8-4.5v-7L12 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M12 12l8-4.5M12 12v8M12 12L4 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
    "</svg>";
  var SHOWCASE_ICON_DUR =
    '<svg class="gun-card__showcase-icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 3l7 4v5c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V7l7-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
    "</svg>";

  function showcaseStatLine(label, valueHtml, icon) {
    return (
      '<div class="gun-card__showcase-line">' +
        '<span class="gun-card__showcase-line-label">' + (icon || "") + escapeHtml(label) + "</span>" +
        '<span class="gun-card__showcase-line-value">' + valueHtml + "</span>" +
      "</div>"
    );
  }

  function showcaseStatsList(d) {
    return (
      '<div class="gun-card__showcase-lines">' +
        showcaseStatLine("Average Value", '<strong class="avg-value">' + d.avg + "</strong>", SHOWCASE_ICON_VALUE) +
        showcaseStatLine("Ranged Value", '<strong class="ranged-value">' + d.ranged + "</strong>") +
        showcaseStatLine("Demand", "<strong>" + escapeHtml(d.demand || "—") + "</strong>", SHOWCASE_ICON_CUBE) +
        showcaseStatLine("Networth Value", '<strong class="networth-value">' + d.networth + "</strong>") +
        showcaseStatLine("Pawn Amount", '<strong class="pawn-value">' + d.pawn + "</strong>") +
        showcaseStatLine("Repair Price", '<strong class="repair-value">' + d.repair + "</strong>") +
        '<div class="gun-card__showcase-line gun-card__showcase-line--dur">' +
          '<span class="gun-card__showcase-line-label">' + SHOWCASE_ICON_DUR + "Durability</span>" +
          '<span class="gun-card__showcase-line-value gun-card__showcase-line-value--dur">' +
            durControlInteractive(d) +
          "</span>" +
        "</div>" +
      "</div>"
    );
  }

  function giveawayBtn(d) {
    if (!d.hasGiveaway) return "";
    return '<button class="card-giveaway-trigger" type="button" aria-label="Giveaway active"></button>';
  }

  function demandBadge(d) {
    return d.demand ? '<span class="badge">Demand: ' + d.demand + "</span>" : "";
  }

  function valuesClassic(d) {
    return (
      '<div class="card-avg">Average Value: <span class="avg-value">' + d.avg + "</span></div>" +
      '<div class="card-ranged">Ranged Value: <span class="ranged-value">' + d.ranged + "</span></div>" +
      '<div class="card-value-separator"></div>' +
      '<div class="card-secondary-values">' +
        '<div class="card-networth">Networth Value: <span class="networth-value">' + d.networth + "</span></div>" +
        '<div class="card-pawn">Pawn Amount: <span class="pawn-value">' + d.pawn + "</span></div>" +
        '<div class="card-repair">Repair Price: <span class="repair-value">' + d.repair + "</span></div>" +
      "</div>"
    );
  }

  function valuesGrid(d) {
    return (
      '<div class="gun-card__stat-grid">' +
        '<div class="gun-card__stat"><span>Average</span><strong class="avg-value">' + d.avg + "</strong></div>" +
        '<div class="gun-card__stat"><span>Ranged</span><strong class="ranged-value">' + d.ranged + "</strong></div>" +
        '<div class="gun-card__stat"><span>Networth</span><strong class="networth-value">' + d.networth + "</strong></div>" +
        '<div class="gun-card__stat"><span>Pawn</span><strong class="pawn-value">' + d.pawn + "</strong></div>" +
      "</div>"
    );
  }

  function valuesPills(d) {
    return (
      '<div class="gun-card__pills">' +
        '<span class="gun-card__pill gun-card__pill--avg">Avg ' + d.avg + "</span>" +
        '<span class="gun-card__pill gun-card__pill--range">Range ' + d.ranged + "</span>" +
        '<span class="gun-card__pill gun-card__pill--nw">NW ' + d.networth + "</span>" +
        '<span class="gun-card__pill gun-card__pill--pawn">Pawn ' + d.pawn + "</span>" +
      "</div>"
    );
  }

  function valuesList(d) {
    return (
      '<ul class="gun-card__value-list">' +
        "<li><span>Average</span><strong class=\"avg-value\">" + d.avg + "</strong></li>" +
        "<li><span>Ranged</span><strong class=\"ranged-value\">" + d.ranged + "</strong></li>" +
        "<li><span>Networth</span><strong class=\"networth-value\">" + d.networth + "</strong></li>" +
        "<li><span>Pawn</span><strong class=\"pawn-value\">" + d.pawn + "</strong></li>" +
        "<li><span>Repair</span><strong class=\"repair-value\">" + d.repair + "</strong></li>" +
      "</ul>"
    );
  }

  var BUILDERS = {
    "01-current": function (d) {
      return (
        '<div class="card gun-card gun-card--01-current"' + d.dataAttrs + ">" +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "02-reverse": function (d) {
      return (
        '<div class="card gun-card gun-card--02-reverse"' + d.dataAttrs + ">" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) + "</div>" +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "03-vertical": function (d) {
      return (
        '<div class="card gun-card gun-card--03-vertical"' + d.dataAttrs + ">" +
          '<div class="gun-card__hero">' + d.imgTag + "</div>" +
          "<h3>" + d.name + "</h3>" + demandBadge(d) +
          durControl(d) + valuesClassic(d) + giveawayBtn(d) +
        "</div>"
      );
    },
    "04-trading": function (d) {
      return (
        '<div class="card gun-card gun-card--04-trading"' + d.dataAttrs + ">" +
          '<div class="gun-card__frame">' + d.imgTag + "</div>" +
          '<div class="gun-card__trading-body">' +
            "<h3>" + d.name + "</h3>" + demandBadge(d) + valuesGrid(d) +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "05-ticket": function (d) {
      return (
        '<div class="card gun-card gun-card--05-ticket"' + d.dataAttrs + ">" +
          '<div class="gun-card__ticket-stub">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="gun-card__ticket-main">' +
            "<h3>" + d.name + "</h3>" + demandBadge(d) + valuesList(d) +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "06-sidebar": function (d) {
      return (
        '<div class="card gun-card gun-card--06-sidebar"' + d.dataAttrs + ">" +
          '<div class="gun-card__accent"></div>' +
          '<div class="card-left">' + d.imgTag + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) + durControl(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "07-topbar": function (d) {
      return (
        '<div class="card gun-card gun-card--07-topbar"' + d.dataAttrs + ">" +
          '<div class="gun-card__topbar"><h3>' + d.name + "</h3>" + demandBadge(d) + "</div>" +
          '<div class="gun-card__topbar-body">' +
            '<div class="gun-card__img-wrap">' + d.imgTag + durControl(d) + "</div>" +
            valuesGrid(d) +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "08-compact-row": function (d) {
      return (
        '<div class="card gun-card gun-card--08-compact-row"' + d.dataAttrs + ">" +
          '<div class="gun-card__thumb">' + d.imgTag + "</div>" +
          '<div class="gun-card__compact-main">' +
            "<h3>" + d.name + "</h3>" + valuesPills(d) +
          "</div>" +
          '<div class="gun-card__compact-side">' + demandBadge(d) + durControl(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "09-neon": function (d) {
      return (
        '<div class="card gun-card gun-card--09-neon"' + d.dataAttrs + ">" +
          '<div class="gun-card__neon-glow"></div>' +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "10-glass": function (d) {
      return (
        '<div class="card gun-card gun-card--10-glass"' + d.dataAttrs + ">" +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "11-gold": function (d) {
      return (
        '<div class="card gun-card gun-card--11-gold"' + d.dataAttrs + ">" +
          '<div class="gun-card__gold-corner"></div>' +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "12-minimal": function (d) {
      return (
        '<div class="card gun-card gun-card--12-minimal"' + d.dataAttrs + ">" +
          '<div class="gun-card__minimal-img">' + d.imgTag + "</div>" +
          "<h3>" + d.name + "</h3>" + valuesList(d) + durControl(d) + giveawayBtn(d) +
        "</div>"
      );
    },
    "13-outline": function (d) {
      return (
        '<div class="card gun-card gun-card--13-outline"' + d.dataAttrs + ">" +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "14-inventory": function (d) {
      return (
        '<div class="card gun-card gun-card--14-inventory"' + d.dataAttrs + ">" +
          '<div class="gun-card__slot">' + d.imgTag + "</div>" +
          "<h3>" + d.name + "</h3>" +
          '<p class="gun-card__slot-avg avg-value">' + d.avg + "</p>" +
          valuesPills(d) + durControl(d) + giveawayBtn(d) +
        "</div>"
      );
    },
    "15-polaroid": function (d) {
      return (
        '<div class="card gun-card gun-card--15-polaroid"' + d.dataAttrs + ">" +
          '<div class="gun-card__polaroid-photo">' + d.imgTag + "</div>" +
          '<p class="gun-card__polaroid-caption">' + d.name + "</p>" +
          demandBadge(d) + valuesGrid(d) + durControl(d) + giveawayBtn(d) +
        "</div>"
      );
    },
    "16-magazine": function (d) {
      return (
        '<div class="card gun-card gun-card--16-magazine"' + d.dataAttrs + ">" +
          '<div class="gun-card__mag-cover">' + d.imgTag + "</div>" +
          '<div class="gun-card__mag-text">' +
            '<span class="gun-card__mag-tag">FEATURED</span>' +
            "<h3>" + d.name + "</h3>" +
            '<p class="gun-card__mag-lede">Average <span class="avg-value">' + d.avg + '</span> · Ranged <span class="ranged-value">' + d.ranged + "</span></p>" +
            valuesList(d) +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "17-terminal": function (d) {
      return (
        '<div class="card gun-card gun-card--17-terminal"' + d.dataAttrs + ">" +
          '<div class="gun-card__terminal-bar"><span></span><span></span><span></span></div>' +
          '<pre class="gun-card__terminal">' +
            "&gt; item: " + d.name + "\n" +
            "&gt; demand: " + d.demand + "\n" +
            "&gt; avg: " + d.avg + "\n" +
            "&gt; ranged: " + d.ranged + "\n" +
            "&gt; networth: " + d.networth + "\n" +
            "&gt; pawn: " + d.pawn + "\n" +
            "&gt; repair: " + d.repair + "\n" +
            "&gt; durability: " + d.durability +
          "</pre>" +
          '<div class="gun-card__terminal-img">' + d.imgTag + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "18-dashboard": function (d) {
      return (
        '<div class="card gun-card gun-card--18-dashboard"' + d.dataAttrs + ">" +
          '<div class="gun-card__dash-head"><h3>' + d.name + "</h3>" + demandBadge(d) + "</div>" +
          '<div class="gun-card__dash-grid">' +
            '<div class="gun-card__dash-img">' + d.imgTag + durControl(d) + "</div>" +
            valuesGrid(d) +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "19-wide": function (d) {
      return (
        '<div class="card gun-card gun-card--19-wide"' + d.dataAttrs + ">" +
          '<div class="gun-card__wide-banner">' + d.imgTag + "</div>" +
          '<div class="gun-card__wide-content">' +
            "<h3>" + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "20-cyber": function (d) {
      return (
        '<div class="card gun-card gun-card--20-cyber"' + d.dataAttrs + ">" +
          '<div class="gun-card__cyber-cut"></div>' +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesGrid(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "21-retro": function (d) {
      return (
        '<div class="card gun-card gun-card--21-retro"' + d.dataAttrs + ">" +
          '<div class="gun-card__retro-header">' + d.name + "</div>" +
          '<div class="gun-card__retro-body">' + d.imgTag + valuesPills(d) + durControl(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "22-bsv": function (d) {
      return (
        '<div class="card gun-card gun-card--22-bsv"' + d.dataAttrs + ">" +
          '<div class="gun-card__bsv-strip">BlockSpin Values</div>' +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "23-float": function (d) {
      return (
        '<div class="card gun-card gun-card--23-float"' + d.dataAttrs + ">" +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + demandBadge(d) + valuesClassic(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "24-split": function (d) {
      return (
        '<div class="card gun-card gun-card--24-split"' + d.dataAttrs + ">" +
          '<div class="gun-card__split-img">' + d.imgTag + "</div>" +
          '<div class="gun-card__split-info">' +
            "<h3>" + d.name + "</h3>" + demandBadge(d) + valuesList(d) + durControl(d) +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "25-overlay": function (d) {
      return (
        '<div class="card gun-card gun-card--25-overlay"' + d.dataAttrs + ">" +
          '<div class="gun-card__overlay-bg">' + d.imgTag + "</div>" +
          '<div class="gun-card__overlay-panel">' +
            "<h3>" + d.name + "</h3>" + demandBadge(d) + valuesGrid(d) + durControl(d) +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "26-chips": function (d) {
      return (
        '<div class="card gun-card gun-card--26-chips"' + d.dataAttrs + ">" +
          '<div class="gun-card__chips-row">' +
            '<div class="gun-card__chips-img">' + d.imgTag + "</div>" +
            "<h3>" + d.name + "</h3>" +
          "</div>" +
          demandBadge(d) + valuesPills(d) + durControl(d) + giveawayBtn(d) +
        "</div>"
      );
    },
    "27-panel": function (d) {
      return (
        '<div class="card gun-card gun-card--27-panel"' + d.dataAttrs + ">" +
          '<div class="gun-card__panel-title"><span>WEAPON</span><h3>' + d.name + "</h3></div>" +
          '<div class="gun-card__panel-grid">' +
            '<div class="gun-card__panel-img">' + d.imgTag + "</div>" +
            '<div class="gun-card__panel-stats">' + valuesList(d) + durControl(d) + "</div>" +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "28-ribbon": function (d) {
      return (
        '<div class="card gun-card gun-card--28-ribbon"' + d.dataAttrs + ">" +
          '<div class="gun-card__ribbon">HIGH DEMAND</div>' +
          '<div class="card-left">' + d.imgTag + durControl(d) + "</div>" +
          '<div class="card-info"><h3>' + d.name + "</h3>" + valuesClassic(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    },
    "29-stack": function (d) {
      return (
        '<div class="card gun-card gun-card--29-stack"' + d.dataAttrs + ">" +
          "<h3>" + d.name + "</h3>" + demandBadge(d) +
          '<div class="gun-card__stack-img">' + d.imgTag + "</div>" +
          valuesGrid(d) + durControl(d) + giveawayBtn(d) +
        "</div>"
      );
    },
    "30-slate": function (d) {
      return (
        '<div class="card gun-card gun-card--30-slate"' + d.dataAttrs + ">" +
          '<div class="gun-card__slate-left">' + d.imgTag + "</div>" +
          '<div class="gun-card__slate-right">' +
            "<h3>" + d.name + "</h3>" +
            '<div class="gun-card__slate-meta">' + demandBadge(d) + "</div>" +
            valuesList(d) + durControl(d) +
          "</div>" + giveawayBtn(d) +
        "</div>"
      );
    },
    "31-showcase": function (d) {
      return (
        '<div class="card gun-card gun-card--31-showcase"' + d.dataAttrs + ">" +
          '<div class="gun-card__showcase-head">' +
            '<span class="gun-card__showcase-cat">' + escapeHtml(d.tier) + "</span>" +
            '<h3 class="gun-card__showcase-title">' + d.name + "</h3>" +
            (d.demand
              ? '<span class="gun-card__showcase-demand">Demand: ' + escapeHtml(d.demand) + "</span>"
              : "") +
          "</div>" +
          '<div class="gun-card__showcase-hero">' + d.imgTag + "</div>" +
          '<div class="gun-card__showcase-panel">' + showcaseStatsList(d) + "</div>" +
          giveawayBtn(d) +
        "</div>"
      );
    }
  };

  var GUN_CARD_DESIGN_CATALOG = [
    { id: "01-current", label: "01 — Current site default", group: "Baseline" },
    { id: "02-reverse", label: "02 — Image on right", group: "Horizontal" },
    { id: "03-vertical", label: "03 — Vertical stack", group: "Vertical" },
    { id: "04-trading", label: "04 — Trading card frame", group: "Vertical" },
    { id: "05-ticket", label: "05 — Ticket stub split", group: "Horizontal" },
    { id: "06-sidebar", label: "06 — Cyan sidebar accent", group: "Horizontal" },
    { id: "07-topbar", label: "07 — Top title bar", group: "Horizontal" },
    { id: "08-compact-row", label: "08 — Compact list row", group: "Compact" },
    { id: "09-neon", label: "09 — Neon glow frame", group: "Bold" },
    { id: "10-glass", label: "10 — Frosted glass", group: "Bold" },
    { id: "11-gold", label: "11 — Luxury gold trim", group: "Premium" },
    { id: "12-minimal", label: "12 — Ultra minimal", group: "Minimal" },
    { id: "13-outline", label: "13 — Outline ghost", group: "Minimal" },
    { id: "14-inventory", label: "14 — Game inventory slot", group: "Gamey" },
    { id: "15-polaroid", label: "15 — Polaroid photo", group: "Vertical" },
    { id: "16-magazine", label: "16 — Magazine cover", group: "Bold" },
    { id: "17-terminal", label: "17 — Terminal / hacker", group: "Experimental" },
    { id: "18-dashboard", label: "18 — Dashboard widgets", group: "Horizontal" },
    { id: "19-wide", label: "19 — Wide banner", group: "Horizontal" },
    { id: "20-cyber", label: "20 — Cyberpunk cut", group: "Bold" },
    { id: "21-retro", label: "21 — Retro arcade", group: "Gamey" },
    { id: "22-bsv", label: "22 — BSV branded strip", group: "Premium" },
    { id: "23-float", label: "23 — Floating elevated", group: "Premium" },
    { id: "24-split", label: "24 — Diagonal split", group: "Vertical" },
    { id: "25-overlay", label: "25 — Hero image overlay", group: "Vertical" },
    { id: "26-chips", label: "26 — Value chips row", group: "Compact" },
    { id: "27-panel", label: "27 — RPG stat panel", group: "Gamey" },
    { id: "28-ribbon", label: "28 — Corner ribbon badge", group: "Bold" },
    { id: "29-stack", label: "29 — Centered stat stack", group: "Vertical" },
    { id: "30-slate", label: "30 — Clean slate split", group: "Minimal" },
    { id: "31-showcase", label: "31 — Showcase (reference theme)", group: "Premium" }
  ];

  function buildGunCardDesign(designId, item) {
    var d = getGunCardFields(item || SAMPLE);
    var builder = BUILDERS[designId] || BUILDERS["01-current"];
    return builder(d);
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderGunDesignButtons(activeId, filter) {
    var q = String(filter || "").trim().toLowerCase();
    var groups = {};
    GUN_CARD_DESIGN_CATALOG.forEach(function (design) {
      if (q && design.label.toLowerCase().indexOf(q) === -1 && design.group.toLowerCase().indexOf(q) === -1) return;
      if (!groups[design.group]) groups[design.group] = [];
      groups[design.group].push(design);
    });

    var rows = [];
    Object.keys(groups).forEach(function (groupName) {
      if (!groups[groupName].length) return;
      rows.push('<p class="card-design-test__group-label">' + escapeHtml(groupName) + "</p>");
      rows.push('<div class="card-design-test__buttons">');
      groups[groupName].forEach(function (design) {
        var active = design.id === activeId ? " is-active" : "";
        rows.push(
          '<button type="button" class="card-design-test__btn' + active + '" data-design-id="' + design.id + '">' +
            escapeHtml(design.label) +
          "</button>"
        );
      });
      rows.push("</div>");
    });
    if (!rows.length) {
      rows.push('<p class="card-design-test__empty">No designs match your search.</p>');
    }
    return rows.join("");
  }

  function setGunCardDesignPreview(designId, filter) {
    var section = document.getElementById("test");
    if (!section) return;

    var picker = section.querySelector(".card-design-test__picker");
    var previewGrid = section.querySelector(".card-design-test__preview");
    var label = section.querySelector(".card-design-test__active-label");
    var countEl = section.querySelector(".card-design-test__count");
    if (!picker || !previewGrid || !label) return;

    if (!GUN_CARD_DESIGN_CATALOG.some(function (d) { return d.id === designId; })) {
      designId = "01-current";
    }

    var design = GUN_CARD_DESIGN_CATALOG.find(function (d) { return d.id === designId; });
    picker.innerHTML = renderGunDesignButtons(designId, filter);
    label.textContent = design ? design.label : designId;
    previewGrid.innerHTML = buildGunCardDesign(designId);

    if (countEl) {
      countEl.textContent = GUN_CARD_DESIGN_CATALOG.length + " gun card designs";
    }

    picker.querySelectorAll(".card-design-test__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var search = section.querySelector(".card-design-test__search");
        var filter = search ? search.value : "";
        setGunCardDesignPreview(btn.getAttribute("data-design-id"), filter);
        if (galleryRendered || galleryRendering) {
          renderGunCardGallery(filter, btn.getAttribute("data-design-id"));
        }
      });
    });

    try {
      localStorage.setItem("bsv-test-gun-card-design", designId);
    } catch (_) {}
  }

  function initGunCardDesignPicker() {
    var saved = "01-current";
    try {
      saved = localStorage.getItem("bsv-test-gun-card-design") || saved;
    } catch (_) {}
    setGunCardDesignPreview(saved, "");
  }

  function renderGunCardDesignTestSection() {
    var html =
      '<section class="section card-design-test-section gun-card-test-section" id="test">' +
        "<h2>Test</h2>" +
        '<p class="card-design-test__intro">Gun item cards only — <span class="card-design-test__count">' + GUN_CARD_DESIGN_CATALOG.length + ' designs</span>. Each option is a completely different layout. Click any design to preview it full size, or scroll the gallery below.</p>' +
        '<input type="search" class="card-design-test__search" placeholder="Search designs…" aria-label="Search card designs">' +
        '<div class="card-design-test__picker"></div>' +
        '<p class="card-design-test__active">Preview: <strong class="card-design-test__active-label">01 — Current site default</strong></p>' +
        '<div class="card-design-test__preview-wrap">' +
          '<div class="cards card-design-test__preview"></div>' +
        "</div>" +
        '<div class="gun-card-gallery">' +
          '<h3 class="gun-card-gallery__title">All designs — side by side</h3>' +
          '<p class="gun-card-gallery__hint">Open this section to load the full comparison grid.</p>' +
          '<div class="gun-card-gallery__grid"></div>' +
        "</div>" +
      "</section>";

    document.getElementById("sections").insertAdjacentHTML("beforeend", html);

    var section = document.getElementById("test");
    var search = section.querySelector(".card-design-test__search");
    if (search) {
      search.addEventListener("input", function () {
        var active = section.querySelector(".card-design-test__btn.is-active");
        var id = active ? active.getAttribute("data-design-id") : "01-current";
        setGunCardDesignPreview(id, search.value);
        if (galleryRendered || galleryRendering) {
          galleryRendered = false;
          renderGunCardGallery(search.value, id);
        }
      });
    }

    initGunCardDesignPicker();
  }

  var galleryRendered = false;
  var galleryRendering = false;

  function bindGunCardGalleryTiles(section) {
    if (!section) return;
    var grid = section.querySelector(".gun-card-gallery__grid");
    if (!grid) return;
    grid.querySelectorAll(".gun-card-gallery__tile").forEach(function (tile) {
      tile.addEventListener("click", function () {
        var id = tile.getAttribute("data-design-id");
        var search = section.querySelector(".card-design-test__search");
        setGunCardDesignPreview(id, search ? search.value : "");
        renderGunCardGallery(search ? search.value : "", id);
        var preview = section.querySelector(".card-design-test__preview-wrap");
        if (preview && preview.scrollIntoView) {
          preview.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function getFilteredGunDesigns(filter) {
    var q = String(filter || "").trim().toLowerCase();
    return GUN_CARD_DESIGN_CATALOG.filter(function (design) {
      if (!q) return true;
      return design.label.toLowerCase().indexOf(q) !== -1 || design.group.toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderGunCardGallery(filter, activeId) {
    var section = document.getElementById("test");
    if (!section) return;
    var grid = section.querySelector(".gun-card-gallery__grid");
    if (!grid) return;

    var designs = getFilteredGunDesigns(filter);
    if (!designs.length) {
      grid.innerHTML = '<p class="card-design-test__empty">No designs match your search.</p>';
      galleryRendered = true;
      galleryRendering = false;
      return;
    }

    if (galleryRendering) return;

    galleryRendered = false;
    galleryRendering = true;
    grid.innerHTML = '<p class="card-design-test__empty gun-card-gallery__loading">Building gallery…</p>';

    var index = 0;
    var batchSize = 3;

    function renderBatch() {
      if (!document.getElementById("test")) {
        galleryRendering = false;
        return;
      }

      if (index === 0) {
        grid.innerHTML = "";
      }

      var end = Math.min(index + batchSize, designs.length);
      var chunk = [];

      for (var i = index; i < end; i++) {
        var design = designs[i];
        var active = design.id === activeId ? " gun-card-gallery__tile--active" : "";
        chunk.push(
          '<button type="button" class="gun-card-gallery__tile' + active + '" data-design-id="' + design.id + '">' +
            '<span class="gun-card-gallery__tile-label">' + escapeHtml(design.label) + "</span>" +
            '<div class="gun-card-gallery__tile-preview">' + buildGunCardDesign(design.id) + "</div>" +
          "</button>"
        );
      }

      grid.insertAdjacentHTML("beforeend", chunk.join(""));
      index = end;

      if (index < designs.length) {
        requestAnimationFrame(renderBatch);
        return;
      }

      galleryRendered = true;
      galleryRendering = false;
      bindGunCardGalleryTiles(section);
    }

    requestAnimationFrame(renderBatch);
  }

  function ensureGunCardGalleryLoaded(activeId, filter) {
    if (galleryRendering) return;
    renderGunCardGallery(filter || "", activeId || "01-current");
  }

  global.GUN_CARD_DESIGN_CATALOG = GUN_CARD_DESIGN_CATALOG;
  global.buildGunCardDesign = buildGunCardDesign;
  global.renderGunCardDesignTestSection = renderGunCardDesignTestSection;
  global.initGunCardDesignPicker = initGunCardDesignPicker;
  global.renderGunCardGallery = renderGunCardGallery;
  global.ensureGunCardGalleryLoaded = ensureGunCardGalleryLoaded;
})(typeof window !== "undefined" ? window : globalThis);
