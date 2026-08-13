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
    // A link is either a normal href, or { copy: "..." } which copies to
    // the clipboard — for handles like Discord that have no public URL.
    ctaEl.innerHTML = SITE.links.filter(function (l) {
      return l && (l.href || l.copy);
    }).map(function (l) {
      var cls = "btn " + (l.primary ? "btn-primary" : "btn-ghost");
      if (l.copy) {
        return "<button type='button' class='" + cls + " copy-btn' data-copy='" +
          esc(l.copy) + "' title='Copy " + esc(l.copy) + "'>" +
          esc(l.label || l.copy) + "</button>";
      }
      var ext = /^https?:/i.test(l.href) ? " target='_blank' rel='noopener'" : "";
      return "<a class='" + cls + "' href='" + esc(l.href) + "'" + ext + ">" +
        esc(l.label || l.href) + "</a>";
    }).join("");

    // Copy-to-clipboard with a "Copied!" confirmation
    ctaEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".copy-btn");
      if (!btn) return;
      var value = btn.dataset.copy;
      var original = btn.textContent;
      var done = function () {
        btn.textContent = "Copied \u2713";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("copied");
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {
          btn.textContent = value; // clipboard blocked — show it to copy manually
        });
      } else {
        btn.textContent = value;
      }
    });
  }
  var contactUsed = has(SITE.links) || has(SITE.ctaText);
  show($("#contact"), contactUsed);

  /* Hide nav items pointing at hidden sections */
  $$("[data-nav]").forEach(function (a) {
    var target = $("#" + a.getAttribute("data-nav"));
    if (target && target.hidden) a.remove();
  });

  /* ── Icons ─────────────────────────────────────────────────
     Inline SVG rather than emoji: emoji render as empty boxes on
     machines without an emoji font (common on Linux and older
     Windows). Set `icon:` on a project to pick one of these. */
  var ICONS = {
    book:
      "<path d='M4 4.5A1.5 1.5 0 0 1 5.5 3H19a1 1 0 0 1 1 1v13.5'/>" +
      "<path d='M4 4.5v13A1.5 1.5 0 0 0 5.5 19H20'/>" +
      "<path d='M20 17.5H5.5A1.5 1.5 0 0 0 4 19'/><path d='M9 7h7'/><path d='M9 10.5h7'/>",
    bot:
      "<rect x='4' y='8' width='16' height='11' rx='3'/><path d='M12 8V4.5'/>" +
      "<circle cx='12' cy='3.5' r='1.2'/><path d='M9 13h.01'/><path d='M15 13h.01'/>" +
      "<path d='M9.5 16.2c1.6.9 3.4.9 5 0'/><path d='M2.5 12v3'/><path d='M21.5 12v3'/>",
    antenna:
      "<path d='M12 21v-8'/><circle cx='12' cy='10.5' r='2.5'/>" +
      "<path d='M7.4 15.1a6.5 6.5 0 0 1 0-9.2'/><path d='M16.6 5.9a6.5 6.5 0 0 1 0 9.2'/>" +
      "<path d='M4.6 18a10.5 10.5 0 0 1 0-15'/><path d='M19.4 3a10.5 10.5 0 0 1 0 15'/>",
    terminal:
      "<rect x='3' y='4' width='18' height='16' rx='2.5'/><path d='M7 9.5l3 2.5-3 2.5'/><path d='M12.5 15h4'/>",
    code:
      "<path d='M8.5 8.5 4 12l4.5 3.5'/><path d='M15.5 8.5 20 12l-4.5 3.5'/><path d='M13.5 5.5l-3 13'/>",
    spark:
      "<path d='M12 3v18'/><path d='M3 12h18'/><path d='M5.6 5.6l12.8 12.8'/><path d='M18.4 5.6 5.6 18.4'/>"
  };

  function iconSvg(name) {
    var body = ICONS[name];
    if (!body) return "";
    return "<svg class='thumb-icon' viewBox='0 0 24 24' aria-hidden='true' " +
      "fill='none' stroke='currentColor' stroke-width='1.6' " +
      "stroke-linecap='round' stroke-linejoin='round'>" + body + "</svg>";
  }

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
        "<div class='project-top'><div class='thumb'>" + iconSvg("spark") + "</div></div>" +
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
        : (iconSvg(p.icon) || iconSvg("code"));
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

  /* ── Back to top ───────────────────────────────────────────
     #top sits on the sticky header, which is always in view, so
     the browser treats the anchor as already satisfied and does
     nothing. Scroll explicitly instead. */
  $$('a[href="#top"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
  });

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
