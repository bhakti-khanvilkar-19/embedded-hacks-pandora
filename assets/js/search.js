/*
  Embedded Pandora — search.js
  Lightweight client-side search for the homepage. Reads the pre-built
  /assets/search-index.json (see scripts/build-search-index.js) and does
  simple substring matching against title, domain, and tags. No backend,
  no build framework — just a JSON file fetched over static hosting.
*/
(function () {
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var empty = document.getElementById("search-empty");
  if (!input || !results) return;

  var index = [];

  function render(items) {
    if (!items.length) {
      results.innerHTML = "";
      if (empty) empty.classList.remove("search-hidden");
      return;
    }
    if (empty) empty.classList.add("search-hidden");
    results.innerHTML =
      "<ul>" +
      items
        .slice(0, 30)
        .map(function (item) {
          return (
            "<li><a href=\"" + item.url + "\">" + item.title + "</a>" +
            '<span class="path">' + item.domain + " / " + item.category + "</span></li>"
          );
        })
        .join("") +
      "</ul>";
  }

  function search(query) {
    var q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = "";
      if (empty) empty.classList.add("search-hidden");
      return;
    }
    var matches = index.filter(function (item) {
      return (
        item.title.toLowerCase().indexOf(q) !== -1 ||
        item.domain.toLowerCase().indexOf(q) !== -1 ||
        item.category.toLowerCase().indexOf(q) !== -1 ||
        (item.tags || []).join(" ").toLowerCase().indexOf(q) !== -1 ||
        (item.description || "").toLowerCase().indexOf(q) !== -1
      );
    });
    render(matches);
  }

  fetch("/assets/search-index.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      index = data;
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q) {
        input.value = q;
        search(q);
      }
    })
    .catch(function () {
      if (empty) {
        empty.textContent = "Search index unavailable — run scripts/build-search-index.js.";
        empty.classList.remove("search-hidden");
      }
    });

  input.addEventListener("input", function () { search(input.value); });
})();
