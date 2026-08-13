/* mob5824m — portfolio behaviour. No dependencies. */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var PROJECTS = window.PROJECTS || [];
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Theme ─────────────────────────────────────────────── */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (!stored && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    stored = "light";
  }
  root.setAttribute("data-theme", stored || "dark");

  var themeBtn = $(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ── Text content from SITE ────────────────────────────── */
  $$("[data-site]").forEach(function (el) {
    var key = el.getAttribute("data-site");
    if (SITE[key]) el.textContent = SITE[key];
  });
  if (SITE.name) document.title = SITE.name + " — Projects";

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Stats / skills / timeline / links ─────────────────── */
  var statsEl = $("#stats");
  if (statsEl && SITE.stats) {
    statsEl.innerHTML = SITE.stats.map(function (s) {
      return "<li><strong>" + esc(s.value) + "</strong><span>" + esc(s.label) + "</span></li>";
    }).join("");
  }

  var skillsEl = $("#skills");
  if (skillsEl && SITE.skills) {
    skillsEl.innerHTML = SITE.skills.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
  }

  var tlEl = $("#timeline");
  if (tlEl && SITE.timeline) {
    tlEl.innerHTML = SITE.timeline.map(function (t) {
      return "<li><span class='when'>" + esc(t.when) + "</span><span class='what'>" + esc(t.what) + "</span></li>";
    }).join("");
  }

  var ctaEl = $("#cta-links");
  if (ctaEl && SITE.links) {
    ctaEl.innerHTML = SITE.links.map(function (l) {
      var ext = /^https?:/.test(l.href) ? " target='_blank' rel='noopener'" : "";
      return "<a class='btn " + (l.primary ? "btn-primary" : "btn-ghost") + "' href='" +
        esc(l.href) + "'" + ext + ">" + esc(l.label) + "</a>";
    }).join("");
  }

  /* ── Typewriter ────────────────────────────────────────── */
  var typer = $("#typer");
  var words = SITE.typewriter || [];
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typer && words.length) {
    if (reduced) {
      typer.textContent = words[0];
    } else {
      var wi = 0, ci = 0, deleting = false;
      (function tick() {
        var word = words[wi];
        ci += deleting ? -1 : 1;
        typer.textContent = word.slice(0, ci);
        var delay = deleting ? 45 : 85;
        if (!deleting && ci === word.length) { deleting = true; delay = 1900; }
        else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 320; }
        setTimeout(tick, delay);
      })();
    }
  }

  /* ── Projects ──────────────────────────────────────────── */
  var grid = $("#project-grid");
  var emptyEl = $("#empty");
  var filtersEl = $("#filters");
  var activeTag = "All";

  var tags = ["All"];
  PROJECTS.forEach(function (p) {
    (p.tags || []).forEach(function (t) { if (tags.indexOf(t) === -1) tags.push(t); });
  });

  if (filtersEl) {
    filtersEl.innerHTML = tags.map(function (t) {
      return "<button class='filter' type='button' data-tag='" + esc(t) + "' aria-pressed='" +
        (t === "All") + "'>" + esc(t) + "</button>";
    }).join("");

    filtersEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      activeTag = btn.dataset.tag;
      $$(".filter", filtersEl).forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      render();
    });
  }

  function statusClass(s) {
    if (!s) return "";
    var k = s.toLowerCase();
    if (k.indexOf("live") > -1) return "live";
    if (k.indexOf("progress") > -1) return "progress";
    return "archived";
  }

  function render() {
    if (!grid) return;
    var list = activeTag === "All"
      ? PROJECTS
      : PROJECTS.filter(function (p) { return (p.tags || []).indexOf(activeTag) > -1; });

    if (emptyEl) emptyEl.hidden = list.length > 0;

    grid.innerHTML = list.map(function (p, i) {
      var idx = PROJECTS.indexOf(p);
      var thumb = p.image
        ? "<img src='" + esc(p.image) + "' alt='' loading='lazy'>"
        : (p.emoji || "◆");
      var badge = p.status
        ? "<span class='badge " + statusClass(p.status) + "'>" + esc(p.status) + "</span>"
        : "";
      return "" +
        "<button class='card project" + (p.featured ? " featured" : "") + "' data-i='" + idx +
        "' style='animation-delay:" + (i * 45) + "ms' aria-haspopup='dialog'>" +
          "<div class='project-top'>" +
            "<div class='thumb'>" + thumb + "</div>" +
            "<div class='meta'>" + (p.year ? "<span>" + esc(p.year) + "</span>" : "") + badge + "</div>" +
          "</div>" +
          "<h3>" + esc(p.title) + "</h3>" +
          "<p>" + esc(p.blurb || "") + "</p>" +
          "<ul class='tags'>" + (p.tags || []).map(function (t) {
            return "<li class='tag'>" + esc(t) + "</li>";
          }).join("") + "</ul>" +
          "<span class='arrow'>Details <span>→</span></span>" +
        "</button>";
    }).join("");
  }

  render();

  /* Cursor spotlight on cards */
  if (grid) {
    grid.addEventListener("pointermove", function (e) {
      var card = e.target.closest(".project");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  }

  /* ── Modal ─────────────────────────────────────────────── */
  var modal = $("#modal");
  var modalBody = $("#modal-body");

  if (grid && modal && modalBody) {
    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".project");
      if (!card) return;
      var p = PROJECTS[Number(card.dataset.i)];
      if (!p) return;

      modalBody.innerHTML = "" +
        "<div class='meta' style='margin-bottom:.8rem'>" +
          (p.year ? "<span>" + esc(p.year) + "</span>" : "") +
          (p.status ? "<span class='badge " + statusClass(p.status) + "'>" + esc(p.status) + "</span>" : "") +
        "</div>" +
        "<h3 id='modal-title'>" + esc(p.title) + "</h3>" +
        "<p class='lede'>" + esc(p.description || p.blurb || "") + "</p>" +
        (p.highlights && p.highlights.length
          ? "<ul class='hl'>" + p.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>"
          : "") +
        "<ul class='tags'>" + (p.tags || []).map(function (t) {
          return "<li class='tag'>" + esc(t) + "</li>";
        }).join("") + "</ul>" +
        (p.links && p.links.length
          ? "<div class='modal-links'>" + p.links.map(function (l, i) {
              var ext = /^https?:/.test(l.href) ? " target='_blank' rel='noopener'" : "";
              return "<a class='btn " + (i === 0 ? "btn-primary" : "btn-ghost") + "' href='" +
                esc(l.href) + "'" + ext + ">" + esc(l.label) + "</a>";
            }).join("") + "</div>"
          : "");

      if (typeof modal.showModal === "function") modal.showModal();
      else modal.setAttribute("open", "");
    });

    $("#modal-close").addEventListener("click", function () { modal.close(); });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close(); // click on backdrop
    });
  }

  /* ── Mobile nav ────────────────────────────────────────── */
  var navToggle = $(".nav-toggle");
  var navLinks = $("#nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── Header shadow on scroll ───────────────────────────── */
  var header = $(".site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── Reveal on scroll ──────────────────────────────────── */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (en.isIntersecting) {
          setTimeout(function () { en.target.classList.add("in"); }, i * 70);
          io.unobserve(en.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ── Helper ────────────────────────────────────────────── */
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
})();
