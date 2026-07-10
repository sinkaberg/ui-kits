/* ============================================================
   SINKABERG DOCS KIT — shared behaviour (optional, progressive).
   Everything degrades gracefully if this file is absent: tabs read
   as stacked panels, the TOC still links, the index still lists.
   Load once at the end of <body>:
     <script src="../sinkaberg-docs.js" defer></script>
   ============================================================ */
(function () {
  "use strict";

  /* ---- 1 · TOC scrollspy — highlight the section in view ---- */
  function initScrollspy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var byId = new Map(links.map(function (a) { return [a.getAttribute("href").slice(1), a]; }));
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var a = byId.get(e.target.id);
        if (a) a.setAttribute("aria-current", "location");
      });
    }, { rootMargin: "-15% 0px -75% 0px" });
    document.querySelectorAll(".section[id], [data-spy]").forEach(function (s) {
      if (s.id) spy.observe(s);
    });
  }

  /* ---- 2 · Tabs — ARIA tab pattern with keyboard support ----
     Markup:
       <div class="tabs" data-tabs>
         <div class="tabs__list" role="tablist">
           <button class="tabs__tab" data-tab="a">A</button> …
         </div>
         <div class="tabs__panel" data-panel="a"> … </div> …
       </div>                                                     */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll(".tabs__tab"));
      var panels = Array.prototype.slice.call(root.querySelectorAll(".tabs__panel"));
      if (!tabs.length) return;

      function select(key, focus) {
        tabs.forEach(function (t) {
          var on = t.getAttribute("data-tab") === key;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.setAttribute("tabindex", on ? "0" : "-1");
          if (on && focus) t.focus();
        });
        panels.forEach(function (p) {
          p.hidden = p.getAttribute("data-panel") !== key;
        });
      }

      var list = root.querySelector(".tabs__list");
      if (list) list.setAttribute("role", "tablist");
      tabs.forEach(function (t, i) {
        t.setAttribute("role", "tab");
        var key = t.getAttribute("data-tab");
        var panel = root.querySelector('.tabs__panel[data-panel="' + key + '"]');
        if (panel) {
          panel.setAttribute("role", "tabpanel");
          if (!panel.id) panel.id = "panel-" + Math.random().toString(36).slice(2, 8);
          if (!t.id) t.id = "tab-" + panel.id;
          t.setAttribute("aria-controls", panel.id);
          panel.setAttribute("aria-labelledby", t.id);
        }
        t.addEventListener("click", function () { select(key, false); });
        t.addEventListener("keydown", function (e) {
          var idx = tabs.indexOf(t), next = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(idx + 1) % tabs.length];
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(idx - 1 + tabs.length) % tabs.length];
          else if (e.key === "Home") next = tabs[0];
          else if (e.key === "End") next = tabs[tabs.length - 1];
          if (next) { e.preventDefault(); select(next.getAttribute("data-tab"), true); }
        });
      });
      var initial = root.querySelector('.tabs__tab[aria-selected="true"]') || tabs[0];
      select(initial.getAttribute("data-tab"), false);
    });
  }

  /* ---- 3 · Index filter — live search + type/tag toggles ----
     Each entry:  <a class="idx-item" data-title="…" data-tags="a b c">
     Optional search box: <input data-idx-search>
     Optional toggles:    <button class="filter" data-filter="guide">    */
  function initIndex() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".idx-item"));
    if (!items.length) return;
    var search = document.querySelector("[data-idx-search]");
    var filters = Array.prototype.slice.call(document.querySelectorAll(".filter[data-filter]"));
    var empty = document.querySelector(".idx-empty");
    var active = new Set();

    function hay(el) {
      return ((el.getAttribute("data-title") || el.textContent) + " " +
              (el.getAttribute("data-tags") || "")).toLowerCase();
    }
    function apply() {
      var q = (search && search.value || "").trim().toLowerCase();
      var shown = 0;
      items.forEach(function (el) {
        var text = hay(el);
        var matchQ = !q || text.indexOf(q) !== -1;
        var tags = (el.getAttribute("data-tags") || "").toLowerCase().split(/\s+/);
        var matchF = !active.size || Array.from(active).some(function (f) { return tags.indexOf(f) !== -1; });
        var vis = matchQ && matchF;
        el.style.display = vis ? "" : "none";
        if (vis) shown++;
      });
      // hide now-empty groups
      document.querySelectorAll(".idx-group").forEach(function (g) {
        var any = Array.prototype.some.call(g.querySelectorAll(".idx-item"), function (el) { return el.style.display !== "none"; });
        g.style.display = any ? "" : "none";
        var c = g.querySelector(".idx-group__count");
        if (c) c.textContent = g.querySelectorAll('.idx-item:not([style*="display: none"])').length;
      });
      if (empty) empty.classList.toggle("is-visible", shown === 0);
    }
    if (search) search.addEventListener("input", apply);
    filters.forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-filter").toLowerCase();
        if (f === "all") { active.clear(); }
        else if (active.has(f)) { active.delete(f); }
        else { active.add(f); }
        filters.forEach(function (x) {
          var xf = x.getAttribute("data-filter").toLowerCase();
          x.setAttribute("aria-pressed", xf === "all" ? (active.size === 0 ? "true" : "false") : (active.has(xf) ? "true" : "false"));
        });
        apply();
      });
    });
    apply();
  }

  function boot() { initScrollspy(); initTabs(); initIndex(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
