/*
  Embedded Pandora — theme.js
  Dark/light toggle. The initial theme (before this file loads) is applied
  by a tiny inline snippet in <head> of every page, so there is no flash.
  This file only wires up the toggle button once the header is injected.
*/
(function () {
  var KEY = "ep-theme";

  function currentTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "☀ Light" : "🌙 Dark";
  }

  function initThemeToggle() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.textContent = currentTheme() === "dark" ? "☀ Light" : "🌙 Dark";
    btn.addEventListener("click", function () {
      apply(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  window.EPTheme = { initThemeToggle: initThemeToggle };
})();
