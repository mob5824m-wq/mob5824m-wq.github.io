/* ============================================================
   Site behaviour. No dependencies, no build step.

   Rendering rule: any section whose data is empty hides itself,
   so a half-filled data/content.js still looks intentional.
   ============================================================ */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var PROJECTS = (window.PROJECTS || []).filter(function (p) { return p && p.title; });

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var has = function (v) { return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim()); };
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function show(el, on) { if (el) el.hidden = !on; }

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

  /* ── Simple text bindings ──────────────────────────────── */
  $$("[data-site]").forEach(function (el) {
    var val = SITE[el.getAttribute("data-site")];
    if (has(val)) { el.textContent = val; show(el, true); }
    else if (!el.textContent.trim()) { show(el, false); }
  });

  var titleName = has(SITE.name) ? SITE.name : SITE.brand;
  if (has(titleName)) document.title = titleName + " — Projects";

  show($("#availability"), has(SITE.availability));

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Hero: typewriter is optional ──────────────────────── */
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var words = (SITE.typewriter || []).filter(has);
  var heroLine = $("#hero-line");

  if (heroLine && words.length) {
    heroLine.innerHTML = "<br>I build <span class='typer'></span><span class='caret' aria-hidden='true'></span>";
    var typer = $(".typer", heroLine);

    if (words.length === 1 || reduced) {
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

  /* ── Hero stats ────────────────────────────────────────── */
  var statsEl = $("#stats");
  if (statsEl && has(SITE.stats)) {
    statsEl.innerHTML = SITE.stats.map(function (s) {
      return "<li><strong>" + esc(s.value) + "</strong><span>" + esc(s.label) + "</span></li>";
    }).join("");
    show(statsEl, true);
  }

  /* ── About ─────────────────────────────────────────────── */
  var aboutCopy = $("#about-copy");
  if (aboutCopy && has(SITE.about)) {
    aboutCopy.innerHTML = SITE.about.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  }

  var skillsEl = $("#skills");
  if (skillsEl && has(SITE.skills)) {
    skillsEl.innerHTML = SITE.skills.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
  }

  var tlEl = $("#timeline");
  if (tlEl && has(SITE.timeline)) {
    tlEl.innerHTML = SITE.timeline.map(function (t) {
      return "<li><span class='when'>" + esc(t.when) + "</span>" +
             "<span class='what'>" + esc(t.what) + "</span></li>";
    }).join("");
    show($("#timeline-card"), true);
  }

  var aboutUsed = has(SITE.about) || has(SITE.skills) || has(SITE.timeline);
  show($("#about"), aboutUsed);

  /* ── Contact ───────────────────────────────────────────── */
  var ctaEl = $("#cta-links");
  if (ctaEl && has(SITE.links)) {
    ctaEl.innerHTML = SITE.links.filter(function (l) { return l && l.href; }).map(function (l) {
      var ext = /^https?:/i.test(l.href) ? " target='_blank' rel='noopener'" : "";
      return "<a class='btn " + (l.primary ? "btn-primary" : "btn-ghost") + "' href='" +
        esc(l.href) + "'" + ext + ">" + esc(l.label || l.href) + "</a>";
    }).join("");
  }
  var contactUsed = has(SITE.links) || has(SITE.ctaText);
  show($("#contact"), contactUsed);

  /* Hide nav items pointing at hidden sections */
  $$("[data-nav]").forEach(function (a) {
    var target = $("#" + a.getAttribute("data-nav"));
    if (target && target.hidden) a.remove();
  });

  /* ── Projects ──────────────────────────────────────────── */
  var grid = $("#project-grid");
  var emptyEl = $("#empty");
  var filtersEl = $("#filters");
  var activeTag = "All";

  function statusClass(s) {
    var k = String(s || "").toLowerCase();
    if (k.indexOf("live") > -1) return "live";
    if (k.indexOf("progress") > -1) return "progress";
    return "archived";
  }

  /* Filter bar — only worth showing with 2+ tags and 2+ projects */
  var tags = ["All"];
  PROJECTS.forEach(function (p) {
    (p.tags || []).forEach(function (t) { if (tags.indexOf(t) === -1) tags.push(t); });
  });

  if (filtersEl && tags.length > 2 && PROJECTS.length > 1) {
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

  /* Placeholder shown while PROJECTS is still empty */
  function placeholderCard() {
    return "" +
      "<div class='card project placeholder'>" +
        "<div class='project-top'><div class='thumb'>✳</div></div>" +
        "<h3>Your first project</h3>" +
        "<p>Open <code>data/content.js</code> and add an entry to the " +
        "<code>PROJECTS</code> array — a card will appear here automatically.</p>" +
        "<ul class='tags'><li class='tag'>tag</li><li class='tag'>tag</li></ul>" +
      "</div>";
  }

  function render() {
    if (!grid) return;

    if (!PROJECTS.length) {
      grid.innerHTML = placeholderCard();
      show(emptyEl, false);
      return;
    }

    var list = activeTag === "All"
      ? PROJECTS
      : PROJECTS.filter(function (p) { return (p.tags || []).indexOf(activeTag) > -1; });

    show(emptyEl, list.length === 0);

    grid.innerHTML = list.map(function (p, i) {
      var idx = PROJECTS.indexOf(p);
      var thumb = p.image
        ? "<img src='" + esc(p.image) + "' alt='' loading='lazy'>"
        : esc(p.emoji || "◆");
      var meta =
        (p.year ? "<span>" + esc(p.year) + "</span>" : "") +
        (p.status ? "<span class='badge " + statusClass(p.status) + "'>" + esc(p.status) + "</span>" : "");

      return "" +
        "<button class='card project" + (p.featured ? " featured" : "") + "' data-i='" + idx +
          "' style='animation-delay:" + (i * 45) + "ms' aria-haspopup='dialog'>" +
          "<div class='project-top'>" +
            "<div class='thumb'>" + thumb + "</div>" +
            (meta ? "<div class='meta'>" + meta + "</div>" : "") +
          "</div>" +
          "<h3>" + esc(p.title) + "</h3>" +
          (p.blurb ? "<p>" + esc(p.blurb) + "</p>" : "<p></p>") +
          "<ul class='tags'>" + (p.tags || []).map(function (t) {
            return "<li class='tag'>" + esc(t) + "</li>";
          }).join("") + "</ul>" +
          "<span class='arrow'>Details <span>→</span></span>" +
        "</button>";
    }).join("");
  }

  render();

  /* Cursor spotlight */
  if (grid) {
    grid.addEventListener("pointermove", function (e) {
      var card = e.target.closest(".project");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  }

  /* ── Project modal ─────────────────────────────────────── */
  var modal = $("#modal");
  var modalBody = $("#modal-body");

  if (grid && modal && modalBody) {
    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".project");
      if (!card || !card.dataset.i) return;
      var p = PROJECTS[Number(card.dataset.i)];
      if (!p) return;

      var meta =
        (p.year ? "<span>" + esc(p.year) + "</span>" : "") +
        (p.status ? "<span class='badge " + statusClass(p.status) + "'>" + esc(p.status) + "</span>" : "");

      modalBody.innerHTML = "" +
        (meta ? "<div class='meta' style='margin-bottom:.8rem'>" + meta + "</div>" : "") +
        "<h3 id='modal-title'>" + esc(p.title) + "</h3>" +
        (has(p.description) || has(p.blurb)
          ? "<p class='lede'>" + esc(p.description || p.blurb) + "</p>" : "") +
        (has(p.highlights)
          ? "<ul class='hl'>" + p.highlights.map(function (h) {
              return "<li>" + esc(h) + "</li>";
            }).join("") + "</ul>" : "") +
        (has(p.tags)
          ? "<ul class='tags'>" + p.tags.map(function (t) {
              return "<li class='tag'>" + esc(t) + "</li>";
            }).join("") + "</ul>" : "") +
        (has(p.links)
          ? "<div class='modal-links'>" + p.links.map(function (l, i) {
              var ext = /^https?:/i.test(l.href) ? " target='_blank' rel='noopener'" : "";
              return "<a class='btn " + (i === 0 ? "btn-primary" : "btn-ghost") + "' href='" +
                esc(l.href) + "'" + ext + ">" + esc(l.label || "Open") + "</a>";
            }).join("") + "</div>" : "");

      if (typeof modal.showModal === "function") modal.showModal();
      else modal.setAttribute("open", "");
    });

    $("#modal-close").addEventListener("click", function () { modal.close(); });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close(); // backdrop click
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

  /* ── Header border on scroll ───────────────────────────── */
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
})();
