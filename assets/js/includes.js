/*
  Embedded Pandora — includes.js
  Injects the shared site header/footer, builds the breadcrumb trail from
  the URL path, and renders prev/next + related-topic links from the
  page's own <script type="application/json" id="page-meta"> block.

  Root-relative paths (starting with "/") are used throughout, which is
  correct for the deployed Vercel site. For local previewing, serve the
  repo with any static file server (see GUIDE.md) rather than opening
  files directly with file://.
*/
(function () {
  var LABELS = {
    spi: "SPI", i2c: "I2C", uart: "UART", can: "CAN",
    tcp: "TCP", ip: "IP", udp: "UDP", dns: "DNS", "u-boot": "U-Boot",
    gpio: "GPIO", cpu: "CPU", os: "OS", ai: "AI Systems", rag: "RAG"
  };

  function humanize(segment) {
    var clean = segment.replace(/\.html$/i, "");
    if (LABELS[clean.toLowerCase()]) return LABELS[clean.toLowerCase()];
    return clean
      .split("-")
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
      .join(" ");
  }

  function buildBreadcrumb() {
    var mount = document.getElementById("breadcrumb");
    if (!mount) return;

    var path = window.location.pathname;
    var parts = path.split("/").filter(Boolean); // e.g. ["protocols", "spi", "index.html"]

    var crumbs = [{ href: "/index.html", label: "Embedded Pandora" }];
    var acc = "";
    parts.forEach(function (part, i) {
      acc += "/" + part;
      var isLast = i === parts.length - 1;
      if (part.toLowerCase() === "index.html") {
        if (isLast) return; // "…/topic/index.html" — folder crumb already covers it
        return;
      }
      crumbs.push({ href: acc, label: humanize(part), current: isLast });
    });

    if (crumbs.length === 1) {
      mount.innerHTML = "";
      return;
    }

    var html = crumbs
      .map(function (c, i) {
        var sep = i > 0 ? '<span class="sep">/</span>' : "";
        if (c.current) {
          return sep + '<span class="current">' + c.label + "</span>";
        }
        return sep + '<a href="' + c.href + '">' + c.label + "</a>";
      })
      .join(" ");
    mount.innerHTML = html;
  }

  function renderPager(meta) {
    if (!meta || (!meta.prev && !meta.next)) return;
    var mount = document.getElementById("pager");
    if (!mount) return;
    var html = "";
    if (meta.prev) {
      html +=
        '<a class="pager__link pager__link--prev" href="' + meta.prev.href + '">' +
        '<span class="pager__dir">&larr; Previous</span>' + meta.prev.title + "</a>";
    } else {
      html += "<span></span>";
    }
    if (meta.next) {
      html +=
        '<a class="pager__link pager__link--next" href="' + meta.next.href + '">' +
        '<span class="pager__dir">Next &rarr;</span>' + meta.next.title + "</a>";
    } else {
      html += "<span></span>";
    }
    mount.innerHTML = html;
  }

  function renderRelated(meta) {
    if (!meta || !meta.related || !meta.related.length) return;
    var mount = document.getElementById("related");
    if (!mount) return;
    var items = meta.related
      .map(function (r) { return '<li><a href="' + r.href + '">' + r.title + "</a></li>"; })
      .join("");
    mount.innerHTML = "<h2>Related topics</h2><ul>" + items + "</ul>";
  }

  function readPageMeta() {
    var el = document.getElementById("page-meta");
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }

  function wireHeaderSearch() {
    var input = document.querySelector(".site-header__search input");
    if (!input) return;
    input.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var q = encodeURIComponent(input.value.trim());
      window.location.href = "/index.html?q=" + q + "#search";
    });
  }

  function markActiveNav() {
    var path = window.location.pathname;
    var top = "/" + (path.split("/").filter(Boolean)[0] || "");
    document.querySelectorAll(".site-header__nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href && top !== "/" && href.indexOf(top) === 0) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  function inject(id, url, after) {
    var mount = document.getElementById(id);
    if (!mount) { if (after) after(); return; }
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        mount.innerHTML = html;
        if (after) after();
      })
      .catch(function () { /* offline / file:// preview — fail quietly */ });
  }

  document.addEventListener("DOMContentLoaded", function () {
    inject("site-header", "/assets/partials/header.html", function () {
      if (window.EPTheme) window.EPTheme.initThemeToggle();
      wireHeaderSearch();
      markActiveNav();
    });
    inject("site-footer", "/assets/partials/footer.html");
    buildBreadcrumb();

    var meta = readPageMeta();
    renderPager(meta);
    renderRelated(meta);
  });
})();
